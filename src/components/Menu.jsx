import React, { useState } from "react";
import { Container, Nav, Navbar, Offcanvas, Button, Form, Modal } from "react-bootstrap";
import { db } from "../firebase"; // Importa la base de datos Firebase
import { collection, addDoc } from "firebase/firestore"; // Importa la función para agregar documentos

function Menu() {
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

  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Función para abrir el modal
  const handleShow = () => setShowModal(true);

  // Función para cerrar el modal
  const handleClose = () => setShowModal(false);

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
        imc: parseFloat(imc.toFixed(2)) // Guardar IMC como numero con 2 decimales
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
    } catch (error) {
      console.error("Error al insertar datos:", error);
      alert("Hubo un error al insertar los datos.");
    }
  };

  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Brand href="#home">
              <img
                alt=""
                src="/muscle.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              Healthy Progress
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Menu
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="#action1">Home</Nav.Link>
                  {/* Botón para abrir el modal */}
                  <Button variant="primary" onClick={handleShow}>
                    Add
                  </Button>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}

      {/* Modal para mostrar el formulario */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Formulario dentro del modal */}
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

            <Button variant="primary" type="submit">
              Guardar Datos
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Menu;
