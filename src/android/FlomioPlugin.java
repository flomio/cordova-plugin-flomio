package com.flomio.plugin;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

public class FlomioPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

        if (action.equals("init")) {
            return init(data, callbackContext);
        } else {
            return false;
        }
    }

    public boolean init(JSONArray data, CallbackContext callbackContext) {
        String name = "Darien";
        String message = "FlomioPlugin, " + name;
        callbackContext.success(message);

        return true;
    }

    public boolean setReaderSettings(JSONArray data, CallbackContext callbackContext) {
        return false;
    }

    public boolean getReaderSettings(JSONArray data, CallbackContext callbackContext) {
        return false;
    }

    public boolean selectReaderType(JSONArray data, CallbackContext callbackContext) {
        return false;
    }

    public boolean startReader(JSONArray data, CallbackContext callbackContext) {
        return false;
    }

    public boolean stopReader(JSONArray data, CallbackContext callbackContext) {
        return false;
    }

    public boolean setReaderStatusChangeCallback(JSONArray data, CallbackContext callbackContext) {
        return false;
    }

    public boolean sendApdu(JSONArray data, CallbackContext callbackContext) {
        return false;
    }

    public boolean setFlobleConnectCallback(JSONArray data, CallbackContext callbackContext) {
        return false;
    }
}