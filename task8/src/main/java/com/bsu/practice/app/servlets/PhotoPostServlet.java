package com.bsu.practice.app.servlets;

import com.bsu.practice.app.exception.NullConnectionException;
import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.collection.PostList;
import com.bsu.practice.app.session.SessionController;
import com.bsu.practice.app.user.User;
import com.google.gson.Gson;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.MultipartConfig;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.*;


@MultipartConfig
public class PhotoPostServlet extends HttpServlet {

    private static PostList postsCollection = new PostList();
    private User user;
    public static final int SINGLE_PART_REQUEST = 0;
    private static final int MAX_SIZE = 1024 * 1024 * 10;
    private static final int MAX_BUFFER = 1024 * 5;
    private static final String ID = "id";
    private static final String PHOTO_LINK = "photoLink";
    private static final String DESCRIPTION = "description";
    private static final String TAGS = "hashTags";
    private static final Gson gson = new Gson();
    private Map<String, String> rawPost;
    private int status;


    @Override
    public void init() throws ServletException {
        super.init();
        user = User.getInstance();
        rawPost = new HashMap<>();
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        rawPost.clear();
        status = processForm(req, resp);
        if (status == HttpServletResponse.SC_OK) {
            String id = rawPost.get(ID);
            try {
                PhotoPost target = postsCollection.getPostById(id);
                if (SessionController.isOperationAllowed(target, user, resp)) {
                    target = postsCollection.editPostById(id, rawPost);
                    if (target == null) {
                        SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_REQUEST);
                    } else {
                        resp.setStatus(HttpServletResponse.SC_OK);
                        resp.getOutputStream().print(gson.toJson(target));
                    }
                }
            } catch (NullConnectionException nullE) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
            } catch (SQLException sqlE) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
            }
        } else {
            SessionController.sendLastErrorMess(resp, status);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            PhotoPost target = postsCollection.getPostById(req.getParameter(ID));
            if (SessionController.isOperationAllowed(target, user, resp)) {
                target = new PhotoPost(postsCollection.deletePost(target));
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getOutputStream().println(gson.toJson(target));
            }
        } catch (NullConnectionException nullE) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
        } catch (SQLException sqlE) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String photoLink = req.getParameter(PHOTO_LINK);
        if (photoLink != null) {
            sendExistingFile(resp, photoLink);
            return;
        }
        try {
            PhotoPost target = postsCollection.getPostById(req.getParameter(ID));
            if (SessionController.hasWritePermission(user) && target != null) {
                String answer = gson.toJson(target);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getOutputStream().println(answer);
            } else {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            }
        } catch (NullConnectionException nullE) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
        } catch (SQLException sqlE) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
        }

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!SessionController.hasWritePermission(user)) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        rawPost.clear();
        status = processForm(req, resp);
        if (status == HttpServletResponse.SC_OK) {
            PhotoPost reqPost;
            reqPost = new PhotoPost(
                    ID,
                    user.getUsername(),
                    rawPost.get(DESCRIPTION),
                    rawPost.get(PHOTO_LINK),
                    PhotoPost.fixTags(rawPost.get(TAGS)),
                    new Date().getTime(),
                    new ArrayList<>());
            try {
                if (postsCollection.addPost(reqPost) == null) {
                    SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_REQUEST);
                    return;
                }
                resp.setStatus(HttpServletResponse.SC_OK);
                String answer = gson.toJson(reqPost);
                resp.getOutputStream().println(answer);
            } catch (Exception nce) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
            }
        } else {
            SessionController.sendLastErrorMess(resp, status);
        }
    }

    @Override
    public void destroy() {
        super.destroy();
    }

    private int processForm(HttpServletRequest req, HttpServletResponse resp) {
        ServletFileUpload upload = new ServletFileUpload(createRepository());
        upload.setSizeMax(MAX_SIZE);
        try {
            List<FileItem> items = upload.parseRequest(req);
            for (FileItem item : items) {
                if (item.isFormField()) {
                    processFormField(item, req, resp);
                } else {
                    processUploadedFile(item);
                }
            }
        } catch (Exception e) {
            return HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        }
        return resp.getStatus();
    }

    private DiskFileItemFactory createRepository() {
        String fullPath = getServletContext().getRealPath("/WEB-INF/temp");
        DiskFileItemFactory factory = new DiskFileItemFactory();
        File tempDir = new File(fullPath);//(File)getServletContext().getAttribute("javax.servlet.context.tempdir");
        if (!tempDir.exists()) {
            tempDir.mkdir();
        }
        factory.setRepository(tempDir);
        return factory;
    }

    private void processFormField(FileItem item, HttpServletRequest req, HttpServletResponse resp) {
        String name = item.getFieldName();
        if (req.getMethod().equals("PUT") && name.equals(PHOTO_LINK)) {
            return;
        }
        if (req.getMethod().equals("POST") && name.equals(PHOTO_LINK)) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        rawPost.put(name, item.getString());
    }

    private void processUploadedFile(FileItem item) throws Exception {
        Random random = new Random();
        File uploadFile;
        int rand;
        do {
            rand = random.nextInt();
            String path = getServletContext().getRealPath("/resources/images/" + rand);
            uploadFile = new File(path);
        } while (uploadFile.exists());
        rawPost.put(PHOTO_LINK, String.valueOf(rand));
        if (uploadFile.createNewFile()) {
            item.write(uploadFile);
        }
    }

    private void sendExistingFile(HttpServletResponse resp, String photoLink) throws IOException {
        try {
            String path = getServletContext().getRealPath("/resources/images/");
            resp.setContentType("image/jpeg");
            InputStream is = Files.newInputStream(Paths.get(path + photoLink));
            byte[] buffer = new byte[MAX_BUFFER];
            int read;
            while ((read = is.read(buffer)) > 0) {
                resp.getOutputStream().write(buffer, 0, read);
            }
        } catch (Exception e) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
