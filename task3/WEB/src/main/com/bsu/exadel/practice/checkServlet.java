package main.com.bsu.exadel.practice;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.json.simple.*;


public class checkServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        JSONObject response = new JSONObject();
        response.put("success", true);
        response.put("appName", "MakeAMoment");
        resp.getOutputStream().println(response.toString());
    }

}
