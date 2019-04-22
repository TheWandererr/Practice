package com.bsu.practice.task8.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class TimeMeasurementFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        long start = System.currentTimeMillis();
        filterChain.doFilter(servletRequest, servletResponse);
        long end = System.currentTimeMillis();
        long time = end - start;
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String method = httpServletRequest.getMethod();
        String url = httpServletRequest.getRequestURL().toString();
        String filteredURL = String.format("%s - \"%s\" - %dms", method, url, time);
        System.out.println(filteredURL);
    }

    @Override
    public void destroy() {

    }
}
