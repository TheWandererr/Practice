package com.bsu.practice.app.servlets;

import com.bsu.practice.app.exception.NullConnectionException;
import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.collection.PostList;
import com.bsu.practice.app.session.SessionController;
import com.bsu.practice.app.user.User;

import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

public class LikePostServlet extends HttpServlet {

    private User user;
    private static PostList postsCollection = new PostList();

    @Override
    public void init(ServletConfig config) {
        user = User.getInstance();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!SessionController.hasWritePermission(user)) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            String url = req.getRequestURL().toString();
            int charLen = 1;
            String id = url.substring(url.lastIndexOf("/") + charLen);
            try {
                PhotoPost target = postsCollection.like(id, user.getUsername());
                if (target == null) {
                    SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                    return;
                }
                SessionController.sendSuccessMess(resp);
                resp.setStatus(HttpServletResponse.SC_OK);
            } catch (NullConnectionException nullE) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
            } catch (SQLException sqlE) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
            }
        }
    }
}
