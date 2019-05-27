package com.bsu.practice.app.filter;


import com.bsu.practice.app.session.SessionController;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class AuthFilter implements Filter {

    private static final String JSESSIONID = "sID";
    private static final String GET = "GET";

    @Override
    public void init(FilterConfig filterConfig) {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse resp = (HttpServletResponse) servletResponse;
        HttpSession session = req.getSession();
        if(!req.getMethod().equals(GET)) {
            if (session == null || session.getAttribute(JSESSIONID) == null) {
                SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_UNAUTHORIZED);
            }
        }
        filterChain.doFilter(req, resp);
    }

    @Override
    public void destroy() {

    }
}
