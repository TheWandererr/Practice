package com.bsu.practice.app.servlets;

import com.bsu.practice.app.session.SessionController;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class LogoutServlet extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        if (session != null) {
            session.invalidate();
            SessionController.sendSuccessMess(resp);
        } else {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
