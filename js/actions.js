var fn = {
    init: function () {
        /*if (!fn.estadoRegistro())
            window.location.href = "#reg";
        else
            window.location.href = "#home";
            */
        //$('#btnBusqArt').bind('click', fn.getUtilidad);
//        $('#txtUtilidad').on('click', fn.getUtilidad);
               //        $('#txtPrecio').on('click', fn.getPrice);

    },

    deviceready: function () {
        document.addEventListener("deviceready", fn.init, false);
        //        document.addEventListener("load", fn.init, false);
        //window.addEventListener("deviceready", fn.init, false);
        //        window.addEventListener("load", fn.init, false);
    },


    getUtilidad: function () {
        alert("Buscar");
        //$('#txtUtilidad').html('');
        //            var dPrecio = $("#txtPrecio").val();
        //            var ItemCode = $("#txtItemCode").val();

        //            if (dPrecio != "") {
        //                alert("Utilidad");
        //            }

    },

    getPrice: function () {
        alert("Buscar");     
    },

    getListaPecios: function () {
    }

    //    getStocks: function () {

    //    },

    //    CalcPrice: function (pItemCode, pUtilidad) {
    //        $.ajax({
    //            type: "POST",
    //            url: "http://192.168.2.204:90/CS.aspx/GetPrice",
    //            //data: { ItemCode: pItemCode, Utilidad: pUtilidad },
    //            data: "{ItemCode: '" + pItemCode + "', Utilidad: " + pUtilidad + "}",
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: fn.OnSuccess,
    //            error: fn.OnError
    //        });
    //    },

    //    OnSuccess: function (response) {
    //        $('#txtPrecio').val(response.d);
    //    },
    //    OnError: function (response) {
    //        alert("Error connection: " + response.d);
    //    }
}

$(fn.deviceready);


