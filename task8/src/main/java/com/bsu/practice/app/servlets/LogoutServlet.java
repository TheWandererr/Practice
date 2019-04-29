package com.bsu.practice.app.servlets;

import com.bsu.practice.app.session.SessionController;
import com.bsu.practice.app.user.User;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class LogoutServlet extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = User.getInstance();
        user.setLogged(false);
        user.setUsername("");
        SessionController.sendSuccessMess(resp);
    }
}
