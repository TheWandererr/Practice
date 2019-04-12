package main.com.bsu.exadel.practice;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class pageServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //Как вариант
        /*String pageContent = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "  <head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Java Servlets</title>\n" +
                "  </head>\n" +
                "  <body>\n" +
                "  <span>Static Page</span>\n" +
                "  </body>\n" +
                "</html>";
        resp.getOutputStream().println(pageContent);*/
        req.getRequestDispatcher("/WEB-INF/page.jsp").forward(req, resp);
    }
}
