//connection.js
var conex = {
    isConnected: function () {
        if (navigator.connection.type == Connection.WIFI)
            return true;
        else
            return false;
    }
};