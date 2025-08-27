import axios from 'axios';
import React, { useState } from 'react'
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
export const Login = () => {
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
      if(res.data !== 0){
        toast.success("Login Success");
        setTimeout(() => {
          navigateTo("/faculty/dashboard");
        }, 1500);
      }else{
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
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className='border-2 border-black shadow'>
        <Card.Body className="p-5">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" id='email' placeholder="name@example.com" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" id='password' required />
            </Form.Group>

            <div className="d-grid mb-3 mt-4">
              <Button variant="outline-dark" type="submit" size="lg" disabled={isLoading}>
                {isLoading && (<Spinner className='me-2' size="sm" as={"span"} />)}
                Login
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
