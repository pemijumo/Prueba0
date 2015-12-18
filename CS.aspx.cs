using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Xml;


public partial class _Default : System.Web.UI.Page
{
    //private static string connectionStringPJ = @"Data Source=192.168.2.205;Initial Catalog=SBO-DistPJ; user id= sa; password = SAP-PJ1; TrustServerCertificate=true;";
    //private static string connectionStringPJ = @"Data Source=192.168.2.204;Initial Catalog=SBO-DistPJ; user id= sa; password = SAP-PJ1; TrustServerCertificate=true;";
    private static string connectionStringPJ = @"Data Source=192.168.2.100;Initial Catalog=SBO-DistPJ; user id= sa; password = SAP-PJ1; TrustServerCertificate=true;";

    public static decimal PrecioCompra;

    public enum TipoConsulta
    {
        Pesos = 1,
        Usd = 2,
        ListaPercios = 3,
        Articulos = 4,
        Stocks = 5,
        TC = 6
    }

    public enum Columnas
    {
        PriceList,
        MXP, USD
    }

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    [System.Web.Services.WebMethod]
    public static string GetPrice(string ItemCode, decimal Utilidad)
    {
        decimal PrecioCompra = decimal.Zero;
        decimal Porcentaje = decimal.Zero;
        try
        {
            SqlConnection connection = new SqlConnection(connectionStringPJ);

            Porcentaje = Utilidad;

            SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@TipoConsulta", 1);
            command.Parameters.AddWithValue("@Articulo", ItemCode);

            SqlParameter PrecCompra = new SqlParameter("@PrecioCompra", decimal.Zero);
            PrecCompra.Direction = ParameterDirection.Output;
            PrecCompra.DbType = DbType.Decimal;
            PrecCompra.Scale = 6;
            command.Parameters.Add(PrecCompra);

            connection.Open();
            command.ExecuteNonQuery();

            PrecioCompra = Convert.ToDecimal(command.Parameters["@PrecioCompra"].Value.ToString());
            connection.Close();

            return decimal.Round((PrecioCompra / (100 - Porcentaje)) * 100, 2).ToString("C2");
        }
        catch (Exception ex)
        {
            return decimal.Zero.ToString ("C2");
        }
    }

    [System.Web.Services.WebMethod]
    //[System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
    public static string[] AutoComplete(string CodArticulo, int Opcion)
    {
        List<string> customers = new List<string>();
        try
        {
            SqlConnection connection = new SqlConnection(connectionStringPJ);

            SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@TipoConsulta", 7);
            command.Parameters.AddWithValue("@Articulo", CodArticulo);
            command.Parameters.AddWithValue("@PrecioCompra", 0);
            command.Parameters.AddWithValue("@OpcionAutocompletado", Opcion);

            connection.Open();
            using (SqlDataReader sdr = command.ExecuteReader())
            {
                while (sdr.Read())
                {
                    if (Opcion == 1)
                        customers.Add(string.Format("{0}", sdr["ItemCode"]));
                    if (Opcion == 2)
                        customers.Add(string.Format("{0}", sdr["Dscription"]));
                }              
                
            }

            connection.Close();
            
        }
        catch (Exception ex)
        {
            //customers.Add(string.Format("{0}", ex.Message.ToString()));
            //return customers.ToArray();
        }
        return customers.ToArray();       
    }

    [System.Web.Services.WebMethod]
    //[System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
    public static List<Articulo> AutoCompleteAll(string CodArticulo)
    {
        List<Articulo> customers = new List<Articulo>();
        try
        {
            SqlConnection connection = new SqlConnection(connectionStringPJ);

            SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@TipoConsulta", 9);
            command.Parameters.AddWithValue("@Articulo", "");
            command.Parameters.AddWithValue("@PrecioCompra", 0);
            connection.Open();
            using (SqlDataReader sdr = command.ExecuteReader())
            {
                while (sdr.Read())
                {
                    Articulo obj = new Articulo();
                    obj.ItemCode = sdr["ItemCode"].ToString();
                    obj.Dscription = sdr["Dscription"].ToString();
                    customers.Add(obj);                  
                }
            }
            connection.Close();
        }
        catch (Exception ex)
        {
          
        }
        return customers;
    }

    [System.Web.Services.WebMethod]
    public static string GetCurrentTime(string name)
    {
        return "Hello " + name + Environment.NewLine + "The Current Time is: "
            + DateTime.Now.ToString();
    }

    [System.Web.Services.WebMethod]
    public static List<Precios> ConsultaPrecios(string DescripArticulo, int TipoConsulta, int BDescripcion)
    {
        Precios objPrecio = new Precios();
        List<Precios> lstPrecios = new List<Precios>();

        string CodArticulo = "--------------------";
        if (BDescripcion == 1)
            CodArticulo = ObtenerCodigo(8, DescripArticulo);
        else
            CodArticulo = DescripArticulo;

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                objPrecio = new Precios();
                objPrecio.ListName = sdr["Lista de precios"].ToString();
                objPrecio.MXP = Convert.ToDecimal(sdr["MXP"]).ToString("C2");
                objPrecio.USD = Convert.ToDecimal(sdr["USD"]).ToString("C2");
                lstPrecios.Add(objPrecio);
            }
        }
        connection.Close();
        return lstPrecios;
     
    }

    [System.Web.Services.WebMethod]
    public static List<Stocks> ConsultaStocks(string DescripArticulo, int TipoConsulta, int BDescripcion)
    {
        Stocks objStock = new Stocks();
        List<Stocks> lstStock = new List<Stocks>();

        string CodArticulo = "--------------------";
        if (BDescripcion == 1)
            CodArticulo = ObtenerCodigo(8, DescripArticulo);
        else
            CodArticulo = DescripArticulo;

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                objStock = new Stocks();
                objStock.Almacen = sdr["Almacen"].ToString();
                objStock.Stock = Convert.ToDecimal(sdr["Stock"]).ToString("N0");
                objStock.Solicitado = Convert.ToDecimal(sdr["Solicitado"]).ToString("N0");
                lstStock.Add(objStock);
            }
        }
        connection.Close();
        return lstStock;

    }

    [System.Web.Services.WebMethod]
    public static string CalculaUtilidadPrecio(int TipoConsulta, string CodArticulo, int TipoMoneda, string Monto)
    {

        string Util = "";
        decimal MontoMoneda = Convert.ToDecimal(Monto);
        //decimal Usd = Convert.ToDecimal(Monto);
       // decimal Porcentaje = Convert.ToDecimal(Monto);

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        SqlParameter PrecCompra = new SqlParameter("@PrecioCompra", decimal.Zero);
        PrecCompra.Direction = ParameterDirection.Output;
        PrecCompra.DbType = DbType.Decimal;
        PrecCompra.Scale = 6;
        command.Parameters.Add(PrecCompra);

        connection.Open();
        command.ExecuteNonQuery();
        PrecioCompra = Convert.ToDecimal(command.Parameters["@PrecioCompra"].Value.ToString());
        connection.Close();

        Util = decimal.Round((((PrecioCompra / MontoMoneda) - 1) * -100), 2).ToString() /*+ "%"*/;       

        return Util;
        

    }


    
    [System.Web.Services.WebMethod]
    public static string CalculaUtilidadPorciento(int TipoConsulta, string DescripArticulo, int TipoMoneda, string Monto, int BDescripcion)
    {

        string Util = "";
        //decimal Pesos = Convert.ToDecimal(Monto);
        //decimal Usd = Convert.ToDecimal(Monto);
        decimal Porcentaje = Convert.ToDecimal(Monto);

        string CodArticulo = "--------------------";
        if (BDescripcion == 1)
            CodArticulo = ObtenerCodigo(8, DescripArticulo);
        else
            CodArticulo = DescripArticulo;

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        SqlParameter PrecCompra = new SqlParameter("@PrecioCompra", decimal.Zero);
        PrecCompra.Direction = ParameterDirection.Output;
        PrecCompra.DbType = DbType.Decimal;
        PrecCompra.Scale = 6;
        command.Parameters.Add(PrecCompra);

        connection.Open();
        command.ExecuteNonQuery();
        PrecioCompra = Convert.ToDecimal(command.Parameters["@PrecioCompra"].Value.ToString());
        connection.Close();
        if (100 - Porcentaje == 0)
            Util = PrecioCompra.ToString();
        else
            Util = decimal.Round((PrecioCompra / (100 - Porcentaje)) * 100, 2).ToString(/*"C2"*/);
        return Util;


    }
    
    [System.Web.Services.WebMethod]
    public static string ObtenerDescripcionArticulo(int TipoConsulta, string CodArticulo)
    {
        string Descripcion = "";

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                Descripcion = sdr["Dscription"].ToString();
            }
        }

        return Descripcion;
    }


    public static string ObtenerCodigo(int TipoConsulta, string CodArticulo)
    {
        string Codigo = "---------------------";

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                Codigo = sdr["ItemCode"].ToString();
            }
        }

        return Codigo;
    }

    public class Articulo
    {
        public string ItemCode { get; set; }
        public string Dscription { get; set; }
 
    }

    public class Precios
    {
        public string ListName { get; set; }
        public string MXP { get; set; }
        public string USD { get; set; } 
    }

    public class Stocks
    {
        public string Almacen { get; set; }
        public string Stock { get; set; }
        public string Solicitado { get; set; }
    }
}
