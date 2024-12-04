import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { loginUser, signupUser } from "../services/api";

const AuthModal = ({
  show,
  handleClose,
  handleSuccess,
  initialType = "login",
}) => {
  const [type, setType] = useState(initialType);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    city: "",
    bank_card: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "login") {
      try {
        const response = await loginUser(formData.name, formData.password);
        handleSuccess(response.name);
        handleClose();
      } catch (error) {
        alert("Login failed! Please check your credentials.");
      }
    } else {
      try {
        await signupUser(formData);
        alert("Signup successful! Please login.");
        setType("login"); // Switch to login form after successful signup
      } catch (error) {
        alert("Signup failed! Please try again.");
      }
    }
  };

  const toggleType = () => {
    setType(type === "login" ? "signup" : "login");
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{type === "login" ? "Login" : "Signup"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </Form.Group>
          {type === "signup" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bank Card</Form.Label>
                <Form.Control
                  type="text"
                  name="bank_card"
                  placeholder="Enter your bank card"
                  onChange={handleChange}
                />
              </Form.Group>
            </>
          )}
          <Button variant="primary" type="submit">
            {type === "login" ? "Login" : "Signup"}
          </Button>
        </Form>
        <div className="mt-3">
          {type === "login" ? (
            <p>
              Don't have an account?{" "}
              <Button variant="link" onClick={toggleType}>
                Signup here
              </Button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Button variant="link" onClick={toggleType}>
                Login here
              </Button>
            </p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
