import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";
import generatePDF from "../utils/generatePDF";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Estilos del PDF
const styles = StyleSheet.create({
  page: { padding: 20 },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "17%",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#ddd",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: { width: "17%", borderStyle: "solid", borderWidth: 1, padding: 5 },
});

// Componente del documento PDF
const ListadoSenseisPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Listado de senseis</Text>
      <View style={styles.table}>
        {/* Encabezado */}
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>IDSENSEI</Text>
          <Text style={styles.tableColHeader}>NOMBRE</Text>
          <Text style={styles.tableColHeader}>FECHA NACIMIENTO</Text>
          <Text style={styles.tableColHeader}>TIPO</Text>
          <Text style={styles.tableColHeader}>PESO</Text>
          <Text style={styles.tableColHeader}>ACTIVO</Text>
        </View>
        {/* Filas de datos */}
        {data.map((row) => (
          <View style={styles.tableRow} key={row.id}>
            <Text style={styles.tableCol}>{row.idSensei}</Text>
            <Text style={styles.tableCol}>{row.nombre}</Text>
            <Text style={styles.tableCol}>{row.fecha_nacimiento}</Text>
            <Text style={styles.tableCol}>{row.tipo}</Text>
            <Text style={styles.tableCol}>{row.peso}</Text>
            <Text style={styles.tableCol}>{row.activo ? "Si" : "No"}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

/**
 * Componente para listar los senseis.
 * @returns {JSX.Element} El componente de listado de senseis.
 */
function ListadoSensei() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Obtiene la lista de senseis.
     */
    async function getSensei() {
      let response = await fetch(apiUrl + "/sensei");

      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
      }
    }

    getSensei();
  }, []); // Se ejecuta solo en el primer renderizado

  /**
   * Maneja la eliminación de un sensei.
   * @param {number} idSensei - El ID del sensei a eliminar.
   */
  const handleDelete = async (idSensei) => {
    let response = await fetch(apiUrl + "/sensei/" + idSensei, {
      method: "DELETE",
    });

    if (response.ok) {
      // Utilizando filter creo un array sin el plato borrado
      const senseiTrasBorrado = rows.filter(
        (sensei) => sensei.idSensei != idSensei
      );
      // Establece los datos de nuevo para provocar un renderizado
      setRows(senseiTrasBorrado);
    }
  };

  return (
    <>
      <Box id="pdf-content">
        <Typography variant="h4" align="center" sx={{ mt: 2 }}>
          Listado de sensei
        </Typography>

        <Box sx={{ mx: 4 }}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">IDSENSEI</TableCell>
                  <TableCell>NOMBRE</TableCell>
                  <TableCell>FECHA NACIMIENTO</TableCell>
                  <TableCell>TIPO</TableCell>
                  <TableCell>PESO</TableCell>
                  <TableCell>ACTIVO</TableCell>
                  <TableCell>ELIMINAR</TableCell>
                  <TableCell>EDITAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.idSensei}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">{row.idSensei}</TableCell>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>{row.fecha_nacimiento}</TableCell>
                    <TableCell>{row.tipo}</TableCell>
                    <TableCell>{row.peso}</TableCell>
                    <TableCell>{row.activo ? "Si" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(row.idSensei)}
                        color="error"
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/modificarsensei/" + row.idSensei)}
                      >
                        <EditNoteIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box sx={{ mx: 4, mt: 2 }}>
        <Button variant="contained" onClick={() => window.print()}>
          Imprimir listado (navegador)
        </Button>
      </Box>
      <Box sx={{ mx: 4, mt: 2 }}>
        <Button variant="contained" onClick={generatePDF}>
          Imprimir listado (jsPDF + html2canvas)
        </Button>
      </Box>
      <Box sx={{ mx: 4, mt: 2 }}>
        <Button variant="contained">
          <PDFDownloadLink
            document={<ListadoSenseisPDF data={rows} />}
            fileName="tabla.pdf"
            style={{ color: "white", textDecoration: "none" }}
          >
            {({ loading }) =>
              loading ? "Generando PDF..." : "Imprimir listado (react-pdf)"
            }
          </PDFDownloadLink>
        </Button>
      </Box>
    </>
  );
}

export default ListadoSensei;
