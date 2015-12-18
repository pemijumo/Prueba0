var mc = {
    captureSuccess: function (mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
            $('#fotoTomada').html('<img src="' + path + '" width="100%">');
            $('#fotoTomada').attr("rel", path);
        }
    },
    captureError: function (error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    },
    start: function () {
        navigator.device.capture.captureImage(mc.captureSuccess, mc.captureError, { limit: 1 });
    }
};