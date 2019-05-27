package com.bsu.practice.app.servlets;

import com.bsu.practice.app.exception.NullConnectionException;
import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.collection.PostList;
import com.bsu.practice.app.session.SessionController;

import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

public class LikePostServlet extends HttpServlet {

    private static final String USERNAME = "username";

    private static PostList postsCollection = new PostList();


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String url = req.getRequestURL().toString();
        int charLen = 1;
        String id = url.substring(url.lastIndexOf("/") + charLen);
        try {
            PhotoPost target = postsCollection.like(id, req.getSession().getAttribute(USERNAME).toString());
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