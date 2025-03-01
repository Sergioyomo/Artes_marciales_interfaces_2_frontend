import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { apiUrl } from "../config";
import generatePDF from "../utils/generatePDF";
import Typography from "@mui/material/Typography";

/**
 * Componente para mostrar una gráfica de barras con los pesos de los senseis.
 * @returns {JSX.Element} El componente de la gráfica de senseis.
 */
function GraficaSenseis() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    /**
     * Obtiene los datos de los senseis para la gráfica.
     */
    async function getDatosGraficaSenseis() {
      let response = await fetch(apiUrl + "/sensei", {
        method: "GET",
      }); 

      if (response.ok) {
        let data = await response.json();
        // Hacer map para simplificar estructura de datos, eliminando atributos que contienen un punto en el nombre
        let datosGrafica = data.datos.map((fila) => {
          return {
            nombre: fila.nombre,
            peso: parseFloat(fila.peso),
          };
        });
        setDatos(datosGrafica);
        // console.log(data.datos);
        // console.log(datosGrafica);
      }
    }

    getDatosGraficaSenseis();
  }, []); // Se ejecuta solo en el primer renderizado

  return (
    <>
      {/* Contenedor para el contenido del PDF */}
      <Box id="pdf-content">
        <Typography variant="h4" align="center" sx={{ mt: 4 }}>
          Peso de los senseis
        </Typography>

        {/* Gráfico de barras para los pesos */}  
        <BarChart
          width={800}
          height={400}
          dataKey="nombre"
          nameKey="peso"
          data={datos}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="peso" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
        </BarChart>

      </Box>

      {/* Botón para generar el PDF */}
      <Box sx={{ mx: 4, mt: 2 }}>
        <Button variant="contained" onClick={generatePDF}>
          Imprimir listado (jsPDF + html2canvas)
        </Button>
      </Box>
    </>
  );
}

export default GraficaSenseis;
