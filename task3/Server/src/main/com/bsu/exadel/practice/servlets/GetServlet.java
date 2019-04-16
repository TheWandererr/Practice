package main.com.bsu.exadel.practice.servlets;

import org.json.simple.JSONObject;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class GetServlet extends HttpServlet {
    private static final int MAX_LENGTH = 100;
    private static final int MIN_LENGTH = 0;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");
        JSONObject response = new JSONObject();
        if (name == null) {
            response.put("success", false);
            response.put("params", null);
            resp.getOutputStream().println(response.toString());
            return;
        }
        if (name.length() > MAX_LENGTH || name.length() <= MIN_LENGTH) {
            response.put("success", false);
            response.put("nameLength", "wrong");
            resp.getOutputStream().println(response.toString());
            return;
        }
        String rs = String.format("Name is %s", name);
        resp.getOutputStream().println(rs);
    }
}