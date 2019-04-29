package com.bsu.practice.app.session;

import com.bsu.practice.app.collection.PhotoPost;
import com.bsu.practice.app.servlets.PhotoPostServlet;
import com.bsu.practice.app.user.User;
import com.google.gson.Gson;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public class SessionController {

    private static Gson gson = new Gson();
    private static final String SUCCESS = "success";
    private static final String FALSE = "false";
    private static final String TRUE = "true";
    private static final String REASON = "reason";
    private static final String STATUS = "status";
    private static final String AUTHORIZED = "already authorized";
    private static final String SINGLE_PART = "request should be multipart";
    private static final String NOT_AUTHORIZED = "not unauthorized";
    private static final String PERMISSION_DENIED = "post doesnt exist or invalid owner";
    private static final String PARAMS_REQUIRED = "{set, get} - all params are required";
    private static final String FILES_ERROR = "error while working with files";
    private static final String INVALID_POST = "invalid post";
    private static final int MIN_INPUT_LENGTH = 0;
    private static Map<String, String> response = new HashMap<>();

    public static void sendLastErrorMess(HttpServletResponse response, int status) throws IOException {
        ServletOutputStream out = response.getOutputStream();
        SessionController.response.clear();
        switch (status) {
            case HttpServletResponse.SC_METHOD_NOT_ALLOWED: {
                out.print(createErrorResponse(PERMISSION_DENIED, status));
                break;
            }
            case HttpServletResponse.SC_BAD_REQUEST: {
                out.print(createErrorResponse(INVALID_POST, status));
                break;
            }
            case PhotoPostServlet.SINGLE_PART_REQUEST: {
                out.print(createErrorResponse(SINGLE_PART, status));
                break;
            }
            case HttpServletResponse.SC_INTERNAL_SERVER_ERROR: {
                out.print(createErrorResponse(FILES_ERROR, status));
                break;
            }
            case HttpServletResponse.SC_UNAUTHORIZED: {
                out.print(createErrorResponse(NOT_AUTHORIZED, status));
                break;
            }
            case HttpServletResponse.SC_PRECONDITION_FAILED: {
                out.print(createErrorResponse(PARAMS_REQUIRED, status));
                break;
            }
            case HttpServletResponse.SC_SERVICE_UNAVAILABLE: {
                out.print(createErrorResponse(AUTHORIZED, status));
                break;
            }
        }
        response.setStatus(status);
    }

    public static void sendSuccessMess(HttpServletResponse response) throws IOException {
        SessionController.response.clear();
        response.getOutputStream().print(createSuccessResponse(HttpServletResponse.SC_OK));
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

    private static String createErrorResponse(String reason, int status) {
        response.put(SUCCESS, FALSE);
        response.put(REASON, reason);
        response.put(STATUS, Integer.toString(status));
        return gson.toJson(response);
    }

    private static String createSuccessResponse(int status) {
        response.put(SUCCESS, TRUE);
        response.put(STATUS, Integer.toString(status));
        return gson.toJson(response);
    }

}
