import React, { useState } from "react";
import { Container, Nav, Navbar, Offcanvas, Button, Modal } from "react-bootstrap";
import AddUserForm from "./AddUserForm"; // Importa el formulario

function Menu({ fetchUserData }) {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Función para abrir el modal
  const handleShow = () => setShowModal(true);

  // Función para cerrar el modal
  const handleClose = () => setShowModal(false);

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
                  <Nav.Link href="closeButton">Home</Nav.Link>
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
          <AddUserForm handleClose={handleClose} fetchUserData={fetchUserData} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Menu;
