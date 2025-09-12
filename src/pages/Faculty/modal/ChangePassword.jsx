import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "sonner";
import { retrieveData } from "../../../utils/cryptoUtils";

export const ChangePasswordModal = ({ show, onHide }) => {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Basic browser validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Password match check
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoading(true);
    setValidated(true);

    try {
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const userId = retrieveData("userId");
      const jsonData = {
        userId,
        oldPassword,
        newPassword,
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "changePassword");

      const res = await axios.post(url, formData);

      if (res.data === 1) {
        toast.success("Password changed successfully");
        onHide();
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setValidated(false);
      } else if (res.data === -1) {
        toast.error("Old password is incorrect");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter old password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your old password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a new password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please confirm your new password.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" variant="outline-success" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" animation="border" /> : "Change Password"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
