package com.bsu.practice.app.exception;

import com.bsu.practice.app.session.SessionController;

public class NullConnectionException extends Exception{

    public NullConnectionException(String mess) {
        super(mess);
    }
}
