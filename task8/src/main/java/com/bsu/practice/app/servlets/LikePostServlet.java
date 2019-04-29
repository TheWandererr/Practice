package com.bsu.practice.app.servlets;

import com.bsu.practice.app.collection.PostList;
import com.bsu.practice.app.session.SessionController;
import com.bsu.practice.app.user.User;

import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class LikePostServlet extends HttpServlet {

    private User user;
    private PostList postList;

    @Override
    public void init(ServletConfig config) {
        user = User.getInstance();
        postList = PostList.getInstance();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!SessionController.hasWritePermission(user)) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            String url = req.getRequestURL().toString();
            int charLen = 1;
            String id = url.substring(url.lastIndexOf("/") + charLen);
            if (postList.like(id, user.getUsername())) {
                SessionController.sendSuccessMess(resp);
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            }
        }
    }
}
