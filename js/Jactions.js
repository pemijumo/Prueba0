var CodArt = []; var NomArt = [];
//var urlDOM = ""; var Publi = 0;
//var urlDOM = "http://192.168.2.204:90/"; var Publi = 1;
var urlDOM = "http://187.237.98.114:80/"; var Publi = 1;


$(document).bind("pageinit", function () {

    /* //Codigo para efecto nieve
    $.fn.snow({
    minSize: 10, //Tamaño mínimo del copo de nieve, 10 por defecto
    maxSize: 20, //Tamaño máximo del copo de nieve, 10 por defecto
    newOn: 1250, //Frecuencia (en milisegundos) con la que aparecen los copos de nieve, 500 por defecto
    flakeColor: '#FFFFFF' //Color del copo de nieve, #FFFFFF por defecto
    });
    */

    //$("#Radio1").attr('checked', false);


    $("#btnBusqArt").bind("click", function (event, ui) {
        var Codigo = $("#txtItemCode").val();
        if (Publi == 1) {
            $.mobile.loading('show', {
                text: 'Consultando...',
                textVisible: true,
                theme: 'a',
                html: ""
            });
        }
        VerificaDescripcionArticulo(Codigo);


    });


    $("#btnLimpArt").bind("click", function (event, ui) {
        $("#txtItemCode").val('');
        $("#txtPrecio").val('');
        $("#txtUtilidad").val('');
        $("#sDescripcionArticulo").text('');

        //--------------------------------------
        var htmlTable = '';
        $("#tblLista").html('');
        $("#tblLista").html(htmlTable);

        $("#tblListaStock").html('');
        $("#tblListaStock").html(htmlTable);
        $('#idInformacion').css('display', 'none');

        if (Publi == 1) {
            $.mobile.loading('hide');
        }
    });


    $("#btnAplicPrecio").bind("click", function (event, ui) {
        var CodORNom = "";
        CodORNom = $("#txtItemCode").val();
        if (CodORNom == "")
            CodORNom = $("#txtItemName").val();

        if (CodORNom != "") {
            var mon = $("#txtPrecio").val();
            if (mon != "") {
                var code = CodORNom;
                var TipoMoneda = -1;
                var TipoConsulta = -1;
                if ($('#rbtPesos').is(':checked')) {
                    TipoMoneda = 1;
                    TipoConsulta = 1;
                }
                if ($('#rbtDolares').is(':checked')) {
                    TipoMoneda = 2;
                    TipoConsulta = 2;
                }

                if (mon != "") {
                    if (Publi == 1) {
                        $.mobile.loading('show', {
                            text: 'Calculando...',
                            textVisible: true,
                            theme: 'a',
                            html: ""
                        });
                    }
                    //Se llena la tabla de precios
                    $.ajax({
                        url: urlDOM + "CS.aspx/CalculaUtilidadPrecio",
                        data: "{ TipoConsulta: " + TipoConsulta + ", CodArticulo: '" + code + "'" + ", TipoMoneda: " + TipoMoneda + ", Monto: '" + mon + "'}",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            $("#txtUtilidad").val(data.d);
                            if (Publi == 1) {
                                $.mobile.loading('hide');
                            }
                        }
                    });
                }
            }
            else {
                Mensaje("Debe especificar un monto", "HalcoNET", "Aceptar");
            }

        }
        else {
            Mensaje("Debe consultar un articulo por código", "HalcoNET", "Aceptar");
        }
    });

    //----------------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------

    $("#btnAplicUtilidad").bind("click", function (event, ui) {
        var CodORNom = "";
        CodORNom = $("#txtItemCode").val();
        if (CodORNom == "")
            CodORNom = $("#txtItemName").val();
        if (CodORNom != "") {
            var mon = $("#txtUtilidad").val();
            if (mon != "") {
                var code = $("#txtItemCode").val();
                var TipoMoneda = -1;
                var TipoConsulta = -1;
                if ($('#rbtPesos').is(':checked')) {
                    TipoMoneda = 1;
                    TipoConsulta = 1;
                }
                if ($('#rbtDolares').is(':checked')) {
                    TipoMoneda = 2;
                    TipoConsulta = 2;
                }
                if (mon != "") {
                    if (Publi == 1) {
                        $.mobile.loading('show', {
                            text: 'Calculando...',
                            textVisible: true,
                            theme: 'a',
                            html: ""
                        });
                    }
                    //Se llena la tabla de precios
                    $.ajax({
                        url: urlDOM + "CS.aspx/CalculaUtilidadPorciento",
                        data: "{ TipoConsulta: " + TipoConsulta + ", DescripArticulo: '" + code + "'" + ", TipoMoneda: " + TipoMoneda + ", Monto: '" + mon + "'" + ", BDescripcion:" + 0 + "}",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            $("#txtPrecio").val(data.d);
                            if (Publi == 1) {
                                $.mobile.loading('hide');
                            }
                        }
                    });
                }
            }
            else {
                Mensaje("Debe especificar un monto para la utilidad", "HalcoNET", "Aceptar");
            }
        }
        else {
            Mensaje("Debe consultar un articulo por código", "HalcoNET", "Aceptar");
        }
    });
});                       //cierre de página



function Llena() {
    var str = "";
    var sugList = $('[data-role=listview]');

    $.ajax({
        url: urlDOM + "CS.aspx/AutoCompleteAll",
        data: "{CodArticulo: '" + 1 + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != null && $.isArray(data.d)) {
                $.each(data.d, function (index, value) {
                    CodArt.push(value.ItemCode);
                    NomArt.push(value.Dscription);
                    str += "<li class=ui-screen-hidden><a href='#'>" + value.ItemCode + "</a></li>";
                    sugList.html(str);
                    sugList.listview("refresh");
                });
            }
        }
    });
}

function Llena2() {
    var str = "";
    var sugList = $("#sugges1");
    $.ajax({
        url: urlDOM + "CS.aspx/AutoCompleteAll",
        data: "{CodArticulo: '" + 1 + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var str = "";
            if (data != null && $.isArray(data.d)) {
                $.each(data.d, function (index, value) {
                    str += "<li><a href='#'>" + value.ItemCode + "</a></li>";
                    sugList.html(str);
                    sugList.listview("refresh");
                    
//                    CodArt.push(value.ItemCode);
//                    NomArt.push(value.Dscription);
                });
            
            }
        }
    });
}



function Llena3() {
    var str = "";
    var sugList = $("#sugges1");
    if (CodArt != null && $.isArray(CodArt)) {
        $.each(CodArt, function (index, value) {
            str += "<li class=ui-screen-hidden><a href='#'>" + value + "</a></li>";
            sugList.html(str);
            sugList.listview("refresh");
        });
    }        
}



function ConsultaListaPrecios(Articulo, TipoConsulta, BDescripcion) {
    //Se llena la tabla de precios
    $.ajax({
        url: urlDOM + "CS.aspx/ConsultaPrecios", /* Llamamos a tu archivo */
        data: "{ 'DescripArticulo': '" + Articulo + "', TipoConsulta:" + TipoConsulta + ", BDescripcion:" + BDescripcion + "}", /* Ponemos los parametros de ser necesarios */
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",  /* Esto es lo que indica que la respuesta será un objeto JSon */
        success: function (data) {
            /* Supongamos que #contenido es el tbody de tu tabla */
            /* Inicializamos tu tabla */
            var htmlTable = '';
            $("#tblLista").html('');
            /* Vemos que la respuesta no este vacía y sea una arreglo */
            if (data != null && $.isArray(data.d)) {
                /* Recorremos tu respuesta con each */
                htmlTable += '<table class="phone-compare ui-shadow table-stroke">';
                $.each(data.d, function (index, value) {
                    /* Vamos agregando a nuestra tabla las filas necesarias */
                    htmlTable += '<tr>';
                    htmlTable += '<td class="col-stock-Izq">' + value.ListName + '</td>';
                    htmlTable += '<td class="col-stock-Der">' + value.MXP + '</td>';
                    htmlTable += '<td class="col-stock-Der">' + value.USD + '</td>';
                    htmlTable += '</tr>';
                    //$("#tblLista").append("<tr><td>" + value.ListName + "</td></tr>");
                    //i++;
                });

                htmlTable += '</table>';
                $("#tblLista").html(htmlTable);
            }
        }
    });
}

function ConsultaStock(Articulo, TipoConsulta, BDescripcion) {
    //Se llena la tabla de precios
    $.ajax({
        url: urlDOM + "CS.aspx/ConsultaStocks", /* Llamamos a tu archivo */
        data: "{ 'DescripArticulo': '" + Articulo + "', TipoConsulta:" + TipoConsulta + ", BDescripcion:" + BDescripcion + "}", /* Ponemos los parametros de ser necesarios */
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",  /* Esto es lo que indica que la respuesta será un objeto JSon */
        success: function (data) {
            /* Supongamos que #contenido es el tbody de tu tabla */
            /* Inicializamos tu tabla */
            var htmlTable = '';
            $("#tblListaStock").html('');
            /* Vemos que la respuesta no este vacía y sea una arreglo */
            if (data != null && $.isArray(data.d)) {
                /* Recorremos tu respuesta con each */
                htmlTable += '<table>';
                $.each(data.d, function (index, value) {
                    /* Vamos agregando a nuestra tabla las filas necesarias */
                    htmlTable += '<tr>';
                    htmlTable += '<td class="col-stock">' + value.Almacen + '</td>';
                    htmlTable += '<td class="col-stock">' + value.Stock + '</td>';
                    htmlTable += '<td class="col-stock">' + value.Solicitado + '</td>';
                    htmlTable += '</tr>';
                    //$("#tblLista").append("<tr><td>" + value.ListName + "</td></tr>");
                    //i++;
                });

                htmlTable += '</table>';
                $("#tblListaStock").html(htmlTable);
            }
        }
    });
}


function VerificaDescripcionArticulo(Codigo) {
    var result = "";
    if (Codigo != "") {
        $.ajax({
            url: urlDOM + "CS.aspx/ObtenerDescripcionArticulo",
            data: "{ TipoConsulta: " + 9 + ", CodArticulo:'" + Codigo + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                result = response.d;
                if (result != "") {                    
                    $('#idInformacion').css('display', 'block');
                    $("#sDescripcionArticulo").text(result);
                    ConsultaListaPrecios(Codigo, 3, 0);
                    ConsultaStock(Codigo, 5, 0);
                    if (Publi == 1) {
                        $.mobile.loading("hide");
                    }
                }
                else {
                    Mensaje("No existe ningun articulo con el código especificado", "HalcoNET", "Aceptar");
                    LimpiaCodArtNoExistente();
                    $('#idInformacion').css('display', 'none');
                    
                }
            }
        });
    }
    else {
        Mensaje("Debe especificar un código de articulo", "HalcoNET", "Aceptar");        
    }   
}


function LimpiaCodArtNoExistente() {
    //Se llena la tabla de precios
    $("#txtPrecio").val('');
    $("#txtUtilidad").val('');
    $("#sDescripcionArticulo").text('');

    //--------------------------------------
    var htmlTable = '';
    $("#tblLista").html('');
    $("#tblLista").html(htmlTable);

    $("#tblListaStock").html('');
    $("#tblListaStock").html(htmlTable);
    $('#idInformacion').css('display', 'none');
}


function Mensaje(TextMensaje, Titulo, Boton) {
    if (Publi == 1) {
        navigator.notification.alert(TextMensaje, null, Titulo, Boton);
        $.mobile.loading("hide");
    }
    else {
        alert(TextMensaje);
    }
}