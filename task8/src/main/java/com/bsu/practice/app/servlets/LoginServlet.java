package com.bsu.practice.app.servlets;

import com.bsu.practice.app.session.SessionController;
import com.bsu.practice.app.user.User;
import com.google.gson.Gson;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class LoginServlet extends HttpServlet {

    private static final int LOGOUT = 0;
    private static final int LOGIN = 1;
    private static final String USERNAME = "username";
    private static final String PASSWORD = "pass";
    private static final Gson gson = new Gson();

    private Map<String, String> getUserInfo(HttpServletRequest req) throws IOException {
        BufferedReader br = new BufferedReader(req.getReader());
        StringBuilder sb = new StringBuilder();
        String line;
        line = br.readLine();
        while (line != null) {
            sb.append(line);
            line = br.readLine();
        }
        Map<String, String> map = new HashMap<>();
        map = gson.fromJson(sb.toString(), map.getClass());
        return map;
    }

    private void initUser(User user, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<String, String> info = getUserInfo(req);
        if (SessionController.isValidUserData(info.get(USERNAME), info.get(PASSWORD))) {
            user.setLogged(true);
            user.setUsername(info.get(USERNAME));
        } else {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = User.getInstance();
        int operation = user.isLogged() ? LOGOUT : LOGIN;
        try {
            if (operation == LOGIN) {
                initUser(user, req, resp);
            } else {
                user.setUsername("");
                user.setLogged(false);
            }
            SessionController.sendSuccessMess(resp);
        } catch (Exception e) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
        }

    }
}