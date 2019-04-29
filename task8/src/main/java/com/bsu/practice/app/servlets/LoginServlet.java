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

    private boolean initUser(User user, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<String, String> info = getUserInfo(req);
        if (SessionController.isValidUserData(info.get(USERNAME), info.get(PASSWORD))) {
            user.setLogged(true);
            user.setUsername(info.get(USERNAME));
            return true;
        } else {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = User.getInstance();
        if (user.isLogged()) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        } else {
            try {
                if (initUser(user, req, resp)) {
                    SessionController.sendSuccessMess(resp);
                }
            } catch (Exception e) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
            }
        }
    }
}