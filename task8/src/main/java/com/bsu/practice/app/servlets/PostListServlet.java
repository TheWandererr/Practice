package com.bsu.practice.app.servlets;

import com.bsu.practice.app.exception.NullConnectionException;
import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.collection.PostList;
import com.bsu.practice.app.session.SessionController;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Date;
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
    private static final int START = 0;

    @Override
    public void init() throws ServletException {
        super.init();
        postsCollection = new PostList();
    }

    private Map<String, String> createFilterConf(HttpServletRequest req) {
        Map<String, String> params = new HashMap<>();
        String author = req.getParameter(AUTHOR);
        String dateTo = req.getParameter(DATE_TO);
        String dateFrom = req.getParameter(DATE_FROM);
        String hashTags = req.getParameter(TAGS);
        if (author != null) {
            params.put(AUTHOR, "%" + author + "%");
        } else {
            params.put(AUTHOR, "%%");
        }
        if (dateFrom == null) {
            dateFrom = String.valueOf(START);
        }
        if (dateTo == null) {
            dateTo = String.valueOf(new Date().getTime());
        }
        params.put(DATE_TO, dateTo);
        params.put(DATE_FROM, dateFrom);
        if (hashTags != null) {
            params.put(TAGS, hashTags);
        }
        return params;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String answer;
        Map<String, String> filter = createFilterConf(req);
        int skip;
        int get;
        try {
            skip = Integer.parseInt(req.getParameter(SKIP));
            get = Integer.parseInt(req.getParameter(GET));
        } catch (NumberFormatException nfe) {
            skip = 0;
            get = Integer.MAX_VALUE;
        } catch (Exception e) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_PRECONDITION_FAILED);
            return;
        }
        try {
            List<PhotoPost> posts = postsCollection.getAll(skip, get, filter);
            answer = gson.toJson(posts);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("text/json;charset=UTF-8");
            resp.getOutputStream().print(answer);
        } catch (NullConnectionException nullE) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
        } catch (SQLException sqlE) {
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_BAD_GATEWAY);
        }
    }
}
