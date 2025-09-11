import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'sonner';

export const UpdateFacultyProfile = ({ show, onHide, faculty }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  // State for each input field
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolId, setSchoolId] = useState('');

  // Prefill fields when modal opens
  useEffect(() => {
    if (show && faculty) {
      setFirstName(faculty.user_firstName || '');
      setMiddleName(faculty.user_middleName || '');
      setLastName(faculty.user_lastName || '');
      setEmail(faculty.user_email || '');
      setSchoolId(faculty.user_schoolId || '');
    }
  }, [show, faculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const noChange =
      firstName === (faculty.user_firstName || '') &&
      middleName === (faculty.user_middleName || '') &&
      lastName === (faculty.user_lastName || '') &&
      email === (faculty.user_email || '') &&
      schoolId === (faculty.user_schoolId || '');

    if (noChange) {
      onHide();
      return;
    }

    setIsLoading(true);

    try {
      const jsonData = {
        userId: faculty.user_id, 
        firstName,
        middleName,
        lastName,
        email,
        schoolId,
      };

      const url = process.env.REACT_APP_API_URL + 'admin.php';
      const formData = new FormData();
      formData.append('json', JSON.stringify(jsonData));
      formData.append('operation', 'updateFaculty');

      const res = await axios.post(url, formData);

      if (res.data === -1) {
        toast.error('Email already exists');
      } else if (res.data === -2) {
        toast.error('School ID exists');
      } else if (res.data === 1) {
        toast.success('Faculty updated successfully');
        onHide();
      } else {
        toast.error('Network Error');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onHide();
    setIsLoading(false);
    setValidated(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Faculty Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>
              First Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Last Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              Email<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>
              School ID<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-success" type="submit" disabled={isLoading}>
            {isLoading && <Spinner animation="border" size="sm" className="me-1" />}
            Update
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
