package com.bsu.practice.app.servlets;

import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.collection.PostList;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PostListServlet extends HttpServlet {

    private PostList postsCollection;
    //private static final int GMT_LENGTH = 3;
    //private static final int CHAR_LENGTH = 1;

    @Override
    public void init() throws ServletException {
        super.init();
        postsCollection = PostList.getInstance();
    }

    /*private static String fixDateConversion(String wrongDate) {
        StringBuilder sb = new StringBuilder(wrongDate);
        int index = sb.lastIndexOf("GMT") + GMT_LENGTH;
        if (sb.charAt(index + CHAR_LENGTH) != '+') {
            sb.replace(index, index + CHAR_LENGTH, "+");
        }
        return sb.toString();
    }*/

    private Map<String, String> createFilterConf(HttpServletRequest req) {
        Map<String, String> params = new HashMap<>();
        String author = req.getParameter("author");
        String dateTo = req.getParameter("dateTo");
        String dateFrom = req.getParameter("dateFrom");
        String hashTags = req.getParameter("hashTags");
        if (author != null) {
            params.put("author", author);
        }
        if (dateTo != null) {
            params.put("dateTo", dateTo);//fixDateConversion(dateTo));
        }
        if (dateFrom != null) {
            params.put("dateFrom", dateFrom);//fixDateConversion(dateFrom));
        }
        if (hashTags != null) {
            params.put("hashTags", hashTags);
        }
        return params;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Gson gson = new Gson();
        String answer;
        Map<String, String> filter = createFilterConf(req);
        try {
            int skip = Integer.parseInt(req.getParameter("skip"));
            int get = Integer.parseInt(req.getParameter("get"));
            List<PhotoPost> posts = postsCollection.getPage(skip, get, filter);
            answer = gson.toJson(posts);
        } catch (Exception pe) {
            resp.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
            return;
        }
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType("text/json;charset=UTF-8");
        resp.getOutputStream().print(answer);
    }
}
