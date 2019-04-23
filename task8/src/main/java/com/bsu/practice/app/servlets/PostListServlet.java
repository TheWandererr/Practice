package com.bsu.practice.app.servlets;

import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.collection.PostList;
import com.bsu.practice.app.session.SessionController;
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
    private static final String DATE_TO = "dateTo";
    private static final String DATE_FROM = "dateFrom";
    private static final String AUTHOR = "author";
    private static final String TAGS = "hashTags";
    private static final String SKIP = "skip";
    private static final String GET = "get";
    private static final Gson gson = new Gson();

    @Override
    public void init() throws ServletException {
        super.init();
        postsCollection = PostList.getInstance();
    }

    private Map<String, String> createFilterConf(HttpServletRequest req) {
        Map<String, String> params = new HashMap<>();
        String author = req.getParameter(AUTHOR);
        String dateTo = req.getParameter(DATE_TO);
        String dateFrom = req.getParameter(DATE_FROM);
        String hashTags = req.getParameter(TAGS);
        if (author != null) {
            params.put(AUTHOR, author);
        }
        if (dateTo != null) {
            params.put(DATE_TO, dateTo);//fixDateConversion(dateTo));
        }
        if (dateFrom != null) {
            params.put(DATE_FROM, dateFrom);//fixDateConversion(dateFrom));
        }
        if (hashTags != null) {
            params.put(TAGS, hashTags);
        }
        return params;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String answer;
        Map<String, String> filter = createFilterConf(req);
        try {
            int skip = Integer.parseInt(req.getParameter(SKIP));
            int get = Integer.parseInt(req.getParameter(GET));
            List<PhotoPost> posts = postsCollection.getPage(skip, get, filter);
            answer = gson.toJson(posts);
        } catch (Exception pe) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_PRECONDITION_FAILED);
            return;
        }
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType("text/json;charset=UTF-8");
        resp.getOutputStream().print(answer);
    }
}
