package com.bsu.practice.app.servlets;

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
import java.util.*;


@MultipartConfig
public class PhotoPostServlet extends HttpServlet {

    private PostList postsCollection;
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
        postsCollection = PostList.getInstance();
        user = User.getInstance();
        rawPost = new HashMap<>();
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        rawPost.clear();
        status = processForm(req);
        if (status == HttpServletResponse.SC_OK) {
            String id = rawPost.get(ID);
            if (SessionController.isOperationAllowed(postsCollection.get(id), user, resp)) {
                if (!postsCollection.edit(id, rawPost)) {
                    SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_REQUEST);
                } else {
                    PhotoPost reqPost = postsCollection.get(id);
                    resp.setStatus(HttpServletResponse.SC_OK);
                    resp.getOutputStream().print(gson.toJson(reqPost));
                }
            }
        } else {
            SessionController.sendLastErrorMess(resp, status);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        PhotoPost target = postsCollection.get(req.getParameter(ID));
        if (SessionController.isOperationAllowed(target, user, resp)) {
            postsCollection.remove(target);
            resp.setStatus(HttpServletResponse.SC_OK);
            SessionController.sendSuccessMess(resp);
        } else {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String photoLink = req.getParameter(PHOTO_LINK);
        if (photoLink != null) {
            sendExistingFile(resp, photoLink);
            return;
        }
        PhotoPost target = postsCollection.get(req.getParameter(ID));
        if (SessionController.hasWritePermission(user) && target!= null) {
            String answer = gson.toJson(target);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getOutputStream().println(answer);
        } else {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!SessionController.hasWritePermission(user)) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        rawPost.clear();
        status = processForm(req);
        if (status == HttpServletResponse.SC_OK) {
            PhotoPost reqPost;
            reqPost = new PhotoPost(
                    user.getUsername(),
                    rawPost.get(DESCRIPTION),
                    rawPost.get(PHOTO_LINK),
                    PhotoPost.fixTags(rawPost.get(TAGS)));
            if (!postsCollection.add(reqPost)) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
            resp.setStatus(HttpServletResponse.SC_OK);
            String answer = gson.toJson(reqPost);
            resp.getOutputStream().println(answer);
        } else {
            SessionController.sendLastErrorMess(resp, status);
        }
    }

    @Override
    public void destroy() {
        super.destroy();
    }
    //Не работает с PUT
    private static boolean isMultipart(HttpServletRequest req) {
        return ServletFileUpload.isMultipartContent(req);
    }

    private int processForm(HttpServletRequest req) {
        /*
        if (!PhotoPostServlet.isMultipart(req)) {
            return SINGLE_PART_REQUEST;
        }*/
        DiskFileItemFactory factory = new DiskFileItemFactory();
        File tempDir = new File("/WEB-INF/");//(File)getServletContext().getAttribute("javax.servlet.context.tempdir");
        factory.setRepository(tempDir);
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setSizeMax(MAX_SIZE);
        try {
            List<FileItem> items = upload.parseRequest(req);
            for (FileItem item : items) {
                if (item.isFormField()) {
                    processFormField(item);
                } else {
                    processUploadedFile(item);
                }
            }
        } catch (Exception e) {
            return HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        }
        return HttpServletResponse.SC_OK;
    }

    private void processFormField(FileItem item) {
        String name = item.getFieldName();
        rawPost.put(name, item.getString());
    }

    private void processUploadedFile(FileItem item) throws Exception {
        Random random = new Random();
        File uploadFile;
        int rand;
        do {
            rand = random.nextInt();
            String path = getServletContext().getRealPath("/WEB-INF/" + rand);
            uploadFile = new File(path);
        } while (uploadFile.exists());
        rawPost.put(PHOTO_LINK, String.valueOf(rand));
        if (uploadFile.createNewFile()) {
            item.write(uploadFile);
        }
    }

    private void sendExistingFile(HttpServletResponse resp, String photoLink) throws IOException {
        try{
            String path = getServletContext().getRealPath("/WEB-INF/");
            resp.setContentType("image/jpeg");
            InputStream is = Files.newInputStream(Paths.get(path+photoLink));
            byte[] buffer = new byte[MAX_BUFFER];
            int read;
            while((read = is.read(buffer)) > 0) {
                resp.getOutputStream().write(buffer,0,read);
            }
        }
        catch (Exception e) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
