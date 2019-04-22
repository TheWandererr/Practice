package com.bsu.practice.app.servlets;

import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.collection.PostList;
import com.bsu.practice.app.user.User;
import com.google.gson.Gson;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public class LoginServlet extends HttpServlet {

    private final int MIN_INPUT_LENGTH = 0;
    private final int DEFAULT_SKIP = 0;
    private final int DEFAULT_GET = 10;
    private final int EXIT = 0;
    private final int ENTER = 1;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = User.getInstance();
        int operation = user.hasWritePermission() ? EXIT : ENTER;
        if(operation == ENTER) {
            String username = req.getParameter("username");
            String pass = req.getParameter("pass");
            if (username == null || pass == null) {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            if (username.length() == MIN_INPUT_LENGTH || pass.length() == MIN_INPUT_LENGTH) {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            } else {
                List<PhotoPost> posts = PostList.getInstance().getPage(DEFAULT_SKIP, DEFAULT_GET, new HashMap<>());
                Gson gson = new Gson();
                user.setUsername(username);
                user.setLogged(true);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.setContentType("text/json;charset=UTF-8");
                resp.getOutputStream().print(gson.toJson(posts));
            }
        } else {
            user.setLogged(false);
            user.setUsername("");
        }
    }
}