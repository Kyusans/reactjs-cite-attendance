import axios from 'axios';
import React, { useState } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import { toast } from 'sonner';

export const AddFacultyModal = ({ show, onHide }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setValidated(true);

    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const schoolId = document.getElementById('schoolId').value;
    const password = document.getElementById('password').value;

    try {
      const jsonData = {
        "firstName": firstName,
        "middleName": middleName,
        "lastName": lastName,
        "email": email,
        "schoolId": schoolId,
        "password": password
      };

      const url = process.env.REACT_APP_API_URL + "admin.php";
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addFaculty");

      const res = await axios.post(url, formData);
      console.log("res ni handleLogin", res);
      if (res.data === -1) {
        toast.error("Email already exists");
      } else if (res.data === -2) {
        toast.error("School ID exist");
      }
      else if (res.data === 1) {
        toast.success("Faculty added successfully");
        // onHide();
      } else {
        toast.error("Network Error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleClose = () => {
    onHide();
    setIsLoading(false);
    setValidated(false);
  }


  return (
    <Modal show={show} onHide={handleClose}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>First Name<span className='text-danger'>*</span></Form.Label>
            <Form.Control type="text" id="firstName" required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Middle Name</Form.Label>
            <Form.Control type="text" id="middleName" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Last Name<span className='text-danger'>*</span></Form.Label>
            <Form.Control type="text" id="lastName" required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email<span className='text-danger'>*</span></Form.Label>
            <Form.Control type="email" id="email" required />
          </Form.Group>

          <Form.Group>
            <Form.Label>School ID<span className='text-danger'>*</span></Form.Label>
            <Form.Control type="text" id="schoolId" required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password<span className='text-danger'>*</span></Form.Label>
            <Form.Control type="password" id="password" required />
          </Form.Group>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-success" type="submit" disabled={isLoading}>
            {isLoading && <Spinner animation="border" size="sm" />}
            Submit
          </Button>
        </Modal.Footer>
      </Form>

    </Modal>
  )
}

