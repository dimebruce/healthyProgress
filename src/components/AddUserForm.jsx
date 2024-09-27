import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { db } from "../firebase"; // Importa la base de datos Firebase
import { collection, addDoc } from "firebase/firestore"; // Importa la función para agregar documentos

function AddUserForm({ handleClose, fetchUserData }) {
  // Estado para almacenar los valores del formulario
  const [formData, setFormData] = useState({
    weight: "",
    biceps: "",
    buttock: "",
    chest: "",
    date: new Date(), // Fecha actual por defecto
    hip: "",
    quadriceps: "",
    twin: ""
  });

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calcular el IMC (IMC = peso en kg / (altura en metros) ^ 2)
  const calculateIMC = (weight) => {
    const height = 1.63; // Altura es fija y personal
    return weight / (height * height);
  };

  // Función para enviar los datos a Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const imc = calculateIMC(parseFloat(formData.weight)); // Calcular IMC
      const newEntry = {
        ...formData,
        weight: parseFloat(formData.weight),
        biceps: parseFloat(formData.biceps),
        buttock: parseFloat(formData.buttock),
        chest: parseFloat(formData.chest),
        date: new Date(), // Usar fecha actual
        hip: parseFloat(formData.hip),
        quadriceps: parseFloat(formData.quadriceps),
        twin: parseFloat(formData.twin),
        imc: parseFloat(imc.toFixed(2)) // Guardar IMC como número con 2 decimales
      };
  
      // Insertar los datos en la colección de Firebase
      await addDoc(collection(db, "userData"), newEntry);
  
      // Limpiar el formulario después de enviar
      setFormData({
        weight: "",
        biceps: "",
        buttock: "",
        chest: "",
        date: new Date(),
        hip: "",
        quadriceps: "",
        twin: ""
      });
  
      alert("Datos insertados correctamente en Firebase.");
      handleClose(); // Cierra el modal después de enviar
  
      // Llamar a fetchUserData para actualizar los datos sin recargar la página
      fetchUserData(); // <--- Esta es la llamada clave para actualizar los datos en User.jsx
    } catch (error) {
      console.error("Error al insertar datos:", error);
      alert("Hubo un error al insertar los datos.");
    }
  };
  

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Peso (kg)</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Bíceps (cm)</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          name="biceps"
          value={formData.biceps}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Glúteos (cm)</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          name="buttock"
          value={formData.buttock}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Pecho (cm)</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          name="chest"
          value={formData.chest}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cadera (cm)</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          name="hip"
          value={formData.hip}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cuádriceps (cm)</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          name="quadriceps"
          value={formData.quadriceps}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Pantorrilla (cm)</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          name="twin"
          value={formData.twin}
          onChange={handleChange}
        />
      </Form.Group>

      <Button  className="w-100" variant="primary" type="submit">
        Guardar
      </Button>
    </Form>
  );
}

export default AddUserForm;
