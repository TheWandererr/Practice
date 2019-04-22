package com.bsu.practice.app.servlets;

import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.collection.PostList;
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
import java.util.*;


@MultipartConfig
public class PhotoPostServlet extends HttpServlet {

    private PostList postsCollection;
    private User user;
    private final int INCORRECT_REQUEST = -1;
    private final int SINGLE_PART_REQUEST = 0;
    private final int ADD_REQUEST = 1;
    private final int EDIT_REQUEST = 2;
    private final int LIKE_REQUEST = 3;
    private final int MAX_SIZE = 1024 * 1024 * 10;
    private Map<String, String> rawPost;

    @Override
    public void init() throws ServletException {
        super.init();
        postsCollection = PostList.getInstance();
        user = User.getInstance();
        rawPost = new HashMap<>();
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) {
        PhotoPost target = postsCollection.get(req.getParameter("id"));
        if (!user.hasWritePermission(target)) {
            resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            return;
        }
        postsCollection.remove(target);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String photoLink = req.getParameter("photoLink");
        if (photoLink != null) {
            String path = getServletContext().getRealPath("/WEB-INF/uploads/");
            resp.setContentType("image/jpeg");
            try (FileInputStream fin = new FileInputStream(path + photoLink);
                 BufferedInputStream bin = new BufferedInputStream(fin);
                 BufferedOutputStream bout = new BufferedOutputStream(resp.getOutputStream())) {
                int ch;
                final int NOT_READABLE = -1;
                while ((ch = bin.read()) != NOT_READABLE) {
                    bout.write(ch);
                }
            } catch (Exception e) {
                resp.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
                return;
            }
        }
        PhotoPost reqPost = postsCollection.get(req.getParameter("id"));
        if (!user.hasWritePermission(reqPost)) {
            resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            return;
        }
        Gson gson = new Gson();
        String answer = gson.toJson(reqPost);
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getOutputStream().println(answer);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        rawPost.clear();
        int status = processForm(req, resp);
        int reqType = getReqType(resp);
        PhotoPost reqPost = new PhotoPost();
        String id = rawPost.get("id");
        switch (reqType) {
            case INCORRECT_REQUEST: {
                return;
            }
            case LIKE_REQUEST: {
                if (status == SINGLE_PART_REQUEST) {
                    if (user.hasWritePermission() && postsCollection.like(id, user.getUsername())) {
                        resp.setStatus(HttpServletResponse.SC_OK);
                    } else {
                        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    }
                    return;
                }
            }
            case ADD_REQUEST: {
                if (status == HttpServletResponse.SC_OK && user.hasWritePermission()) {
                    reqPost = new PhotoPost(
                            user.getUsername(),
                            rawPost.get("description"),
                            rawPost.get("photoLink"),
                            PhotoPost.fixTags(rawPost.get("hashTags")));
                    if (!postsCollection.add(reqPost)) {
                        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        return;
                    }
                }
                break;
            }
            case EDIT_REQUEST: {
                if (status == HttpServletResponse.SC_OK && user.hasWritePermission()) {
                    if (!postsCollection.edit(id, rawPost)) {
                        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        return;
                    } else {
                        reqPost = postsCollection.get(id);
                    }
                }
                break;
            }
        }
        resp.setStatus(HttpServletResponse.SC_OK);
        Gson gson = new Gson();
        String answer = gson.toJson(reqPost);
        resp.getOutputStream().println(answer);
    }

    @Override
    public void destroy() {
        super.destroy();
    }

    private int getReqType(HttpServletResponse resp) {
        String id = rawPost.get("id");
        if (rawPost.get("like") != null) {
            if (id != null) {
                return LIKE_REQUEST;
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return INCORRECT_REQUEST;
            }
        }
        if (id == null) {
            return ADD_REQUEST;
        }
        PhotoPost post = postsCollection.get(id);
        if (post == null || !post.getAuthor().equals(user.getUsername())) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return INCORRECT_REQUEST;
        }
        return EDIT_REQUEST;
    }

    private static boolean isMultipart(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        boolean isMultipart = ServletFileUpload.isMultipartContent(req);
        if (!isMultipart) {
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return false;
        }
        return true;
    }

    private int processForm(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!PhotoPostServlet.isMultipart(req, resp)) {
            return SINGLE_PART_REQUEST;
        }
        DiskFileItemFactory factory = new DiskFileItemFactory();
        //factory.setSizeThreshold(1024 * 1024);
        File tempDir = new File("/WEB-INF/uploads/");//(File)getServletContext().getAttribute("javax.servlet.context.tempdir");
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
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return INCORRECT_REQUEST;
        }
        return HttpServletResponse.SC_OK;
    }

    private void processFormField(FileItem item) {
        String name = item.getFieldName();
        rawPost.put(name, item.getString());
    }

    //Уникальный filename содержится в поле поста photoLink
    private void processUploadedFile(FileItem item) throws Exception {
        Random random = new Random();
        File uploadFile;
        int rand;
        do {
            rand = random.nextInt();
            String path = getServletContext().getRealPath("/WEB-INF/uploads/" + rand);
            uploadFile = new File(path);
        } while (uploadFile.exists());
        rawPost.put("photoLink", String.valueOf(rand));
        if (uploadFile.createNewFile()) {
            item.write(uploadFile);
        }
    }
}
