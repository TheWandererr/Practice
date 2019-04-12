package main.com.bsu.exadel.practice;

import org.json.simple.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class getServlet extends HttpServlet {
    private static final int MAX_LENGTH = 100;
    private static final int MIN_LENGTH = 0;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");
        switch (name == null ? "null" : name.length() > MAX_LENGTH || name.length() <= MIN_LENGTH ? "info" : name) {
            case "info": {
                JSONObject response = new JSONObject();
                response.put("success", false);
                response.put("nameLength", "wrong");
                resp.getOutputStream().println(response.toString());
                break;
            }
            case "null": {
                JSONObject response = new JSONObject();
                response.put("success", false);
                response.put("params", null);
                resp.getOutputStream().println(response.toString());
                break;
            }
            default: {
                String response = String.format("Name is %s", name);
                resp.getOutputStream().println(response);
                break;
            }
        }
    }
}