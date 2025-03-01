import { Typography, TextField, Stack, Button, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

/**
 * Componente para modificar los datos de un sensei.
 * Obtiene los datos del sensei por su ID y permite modificarlos.
 *
 * @component
 * @example
 * return (
 *   <ModificarSensei />
 * )
 */
function ModificarSensei() {
  const params = useParams();
  let [checked, setChecked] = useState(true);
  let [datos, setDatos] = useState({
    idSensei: params.idSensei,
    nombre: "",
    fecha_nacimiento: "",
    tipo: "",
    peso: "",
    activo: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function getSenseiById() {
      let response = await fetch(apiUrl + "/sensei/" + datos.idSensei);
      if (response.ok) {
        let data = await response.json();
        setDatos(data.datos);
        checked = data.datos.activo;
        setChecked(checked);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/"); // Volver a la página principal por ruta erronea
      }
    }

    getSenseiById();
  }, []); // Se ejecuta solo en el primer renderizado

  /**
   * Maneja el envío del formulario.
   * Envía los datos modificados del sensei al servidor.
   *
   * @param {Event} e - Evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl + "/sensei/" + datos.idSensei, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        alert("Actualización correcta");
        navigate(-1); // Volver a la ruta anterior
      } else {
        const data = await response.json();
        alert(data.mensaje);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error:", error);
    }
  };

  /**
   * Maneja los cambios en los campos de texto.
   *
   * @param {Event} e - Evento de cambio en el campo de texto.
   */
  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Maneja los cambios en el checkbox.
   *
   * @param {Event} e - Evento de cambio en el checkbox.
   */
  const handleChangeChecked = (e) => {
    checked = e.target.checked;
    setChecked(checked);
    setDatos({
      ...datos,
      [e.target.name]: checked,
    });
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Modificar sensei
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{ mx: 2 }}
          >
            <TextField
              id="outlined-basic"
              label="Nombre"
              variant="outlined"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
            />
            <TextField
              id="outlined-basic"
              label="Fecha nacimiento"
              variant="outlined"
              name="fecha_nacimiento"
              value={datos.fecha_nacimiento}
              onChange={handleChange}
            />
            <TextField
              id="outlined-basic"
              label="Peso"
              variant="outlined"
              name="peso"
              value={datos.peso}
              onChange={handleChange}
            />
            <TextField
              id="outlined-basic"
              label="Tipo"
              variant="outlined"
              name="tipo"
              value={datos.tipo}
              onChange={handleChange}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    id="outlined-basic"
                    label="Activo"
                    variant="outlined"
                    name="activo"
                    checked={checked}
                    value={datos.activo}
                    onChange={handleChangeChecked}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Activo"
              />
            </FormGroup>
            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default ModificarSensei;
