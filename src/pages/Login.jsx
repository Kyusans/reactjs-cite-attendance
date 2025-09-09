import axios from 'axios';
import React, { useState } from 'react'
import { Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { storeData } from '../utils/cryptoUtils';
export const Login = ({ show, onHide }) => {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();
  const handleLogin = async () => {
    setIsLoading(true);
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const jsonData = { "email": email, "password": password }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "login");
      const res = await axios.post(url, formData);
      console.log("res ni handleLogin", res);
      if (res.data !== 0) {
        toast.success("Login Success");
        storeData("userId", res.data.user_id);
        setTimeout(() => {
          const url = res.data.user_level === 1 ? "/admin/dashboard" : "/faculty/dashboard";
          navigateTo(url);
        }, 1500);
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      toast.error("Network Error");
      console.log("Login.jsx => handleLogin(): ", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      handleLogin();
    }

    setValidated(true);
  };

  const handleClose = () => {
    onHide();
  }
  return (
    <Container>
      <Modal show={show} onHide={handleClose} centered>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Sign in</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" id='email' placeholder="name@example.com" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" id='password' required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" size="sm" onClick={handleClose}>
              Close
            </Button>
            <Button variant="outline-success" type="submit" size="sm" disabled={isLoading}>
              {isLoading && (<Spinner className='me-2' size="sm" as={"span"} />)}
              Login
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container >
  )
}
