package com.bsu.practice.app.servlets;

import com.bsu.practice.app.exception.NullConnectionException;
import com.bsu.practice.app.user.LoginService;
import com.bsu.practice.app.session.SessionController;
import com.google.gson.Gson;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.bind.DatatypeConverter;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;


public class LoginServlet extends HttpServlet {

    private static final String USERNAME = "username";
    private static final String PASSWORD = "pass";
    private static final String JSESSIONID = "sID";
    private static final int DOESNT_EXIST = -1;
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

    @Override
    public void init() {
        LoginService loginService = new LoginService();;
        loginService.initService();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<String, String> userParams = getUserInfo(req);
        try {
            String pass = userParams.get(PASSWORD);
            String username = userParams.get(USERNAME);
            if (pass == null || username == null) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            login(username, new String(DatatypeConverter.parseBase64Binary(pass)), resp, req);
        } catch (NullConnectionException nce) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
        } catch (SQLException sqlE) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
        }
    }

    private void login(String username, String pass, HttpServletResponse resp, HttpServletRequest req) throws SQLException, IOException, NullConnectionException {
        int id = LoginService.isExist(username);
        if (id == DOESNT_EXIST) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        if (!LoginService.isValid(username, pass)) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
        }
        initSession(username, id, resp, req);
    }

    private void initSession(String username, int id, HttpServletResponse resp, HttpServletRequest req) throws IOException {
        HttpSession session = req.getSession(true);
        session.setAttribute(USERNAME, username);
        session.setAttribute(JSESSIONID, id);
        SessionController.sendSuccessLoginMess(resp, username, String.valueOf(id));
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}