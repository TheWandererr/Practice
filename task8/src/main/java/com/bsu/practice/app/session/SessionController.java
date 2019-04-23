package com.bsu.practice.app.session;

import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.servlets.PhotoPostServlet;
import com.bsu.practice.app.user.User;
import com.google.gson.Gson;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class SessionController {

    private static Gson gson = new Gson();
    private static final String SUCCESS = "success";
    private static final String FALSE = "false";
    private static final String TRUE = "true";
    private static final String REASON = "reason";
    private static final int MIN_INPUT_LENGTH = 0;

    public static void sendLastErrorMess(HttpServletResponse response, int status) throws IOException {
        ServletOutputStream out = response.getOutputStream();
        switch (status) {
            case HttpServletResponse.SC_METHOD_NOT_ALLOWED: {
                out.print(getPermissionDeniedAnswer(status));
                break;
            }
            case HttpServletResponse.SC_BAD_REQUEST: {
                out.print(getPostValidationErrorAnswer(status));
                break;
            }
            case PhotoPostServlet
                    .SINGLE_PART_REQUEST: {
                out.print(getSinglePartErrorAnswer(status));
                break;
            }
            case HttpServletResponse.SC_INTERNAL_SERVER_ERROR: {
                out.print(getServerErrorAnswer(status));
                break;
            }
            case HttpServletResponse.SC_UNAUTHORIZED: {
                out.print(getUnauthorizedAnswer(status));
                break;
            }
            case HttpServletResponse.SC_PRECONDITION_FAILED: {
                out.print(getParamsReqErrorAnswer(status));
                break;
            }
        }
        response.setStatus(status);
    }

    public static void sendSuccessMess(HttpServletResponse response) throws IOException {
        response.getOutputStream().print(gson.toJson(String.format("%s: %s", SUCCESS, TRUE)));
    }

    public static boolean hasWritePermission(User user) {
        return user.isLogged();
    }

    public static boolean isOperationAllowed(PhotoPost target, User user, HttpServletResponse resp) throws IOException {
        if (!SessionController.hasWritePermission(target, user)) {
            resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            SessionController.sendLastErrorMess(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            return false;
        }
        return true;
    }

    public static boolean isValidUserData(String username, String pass) {
        return username.trim().length() != MIN_INPUT_LENGTH && pass.trim().length() != MIN_INPUT_LENGTH;
    }

    private static boolean hasWritePermission(PhotoPost reqPost, User user) {
        return reqPost != null && user.getUsername().equals(reqPost.getAuthor()) && user.isLogged();
    }

    private static String getUnauthorizedAnswer(int status) {
        return gson.toJson(String.format("%s:%s, %s: not unauthorized, status: %d", SUCCESS, FALSE, REASON, status));
    }

    private static String getPermissionDeniedAnswer(int status) {
        return gson.toJson(String.format("%s:%s, %s: post doesnt exist or invalid owner, status: %d", SUCCESS, FALSE, REASON, status));
    }

    private static String getPostValidationErrorAnswer(int status) {
        return gson.toJson(String.format("%s:%s, %s: invalid post, status: %d", SUCCESS, FALSE, REASON, status));
    }

    private static String getSinglePartErrorAnswer(int status) {
        return gson.toJson(String.format("%s:%s, %s: request should be multipart, status: %d", SUCCESS, FALSE, REASON, status));
    }

    private static String getParamsReqErrorAnswer(int status) {
        return gson.toJson(String.format("%s:%s, %s: {set, get} - all params are required, status: %d", SUCCESS, FALSE, REASON, status));
    }

    private static String getServerErrorAnswer(int status) {
        return gson.toJson(String.format("%s:%s, %s: error while working with files, status: %d", SUCCESS, FALSE, REASON, status));
    }

}
