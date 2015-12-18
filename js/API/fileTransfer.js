//Transferir archivos
var ft = {
    win: function (r) {
        if (r.response) {
            navigator.notification.alert("Registrado Correctamente", function () {
                navigator.vibrate(2000);
                navigator.notification.beep(1);
                window.localStorage.setItem('user', $('#regNom').val());
                window.localStorage.setItem("uuid", dispositivo.uuid);
                window.location.href = "#home";
                $.mobile.loading("hide");
            }, "Bienvenido", "Finalizar");
        } else {
            alert("Error al subir la foto");
        }
    },
    fail: function (error) {
        alert("An error has occurred: Code = " + error.code);
    },
    start: function (path) {
        var options = new FileUploadOptions();
        options.fileKey = "foto";
        options.fileName = "Carlos";
        options.mimeType = "image/jpeg";

        var ft2 = new FileTransfer();
        ft2.upload(path, "http://carlos.igitsoft.com/apps/test.php", ft.win, ft.fail, options);
    }
};