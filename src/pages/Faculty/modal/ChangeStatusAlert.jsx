import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ChangeStatusAlert({ open, onHide, message, duration, status }) {
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [notes, setNotes] = useState(""); 
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    let timer;
    if (open && duration) {
      console.log("status", status);
      setCountdown(duration);
      setIsButtonDisabled(true);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(timer);
          setIsButtonDisabled(false);
          return 0;
        });
      }, 1000);
    } else if (open && !duration) {
      setIsButtonDisabled(false);
    }

    return () => clearInterval(timer);
  }, [open, duration, status]);

  const handleClose = () => {
    onHide(0, notes);
    setNotes("");
    setValidated(false);
  };

  const handleContinue = () => {
    if (status === 2 && notes.trim() === "") {
      setValidated(true); // mark as invalid
      return;
    }
    onHide(1, notes);
    setNotes("");
    setValidated(false);
  };

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Are you absolutely sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
        {status === 2 && (
          <Form>
            <Form.Group controlId="notes">
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes here..."
                isInvalid={validated && notes.trim() === ""}
              />
              <Form.Control.Feedback type="invalid">
                Notes are required.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          disabled={isButtonDisabled}
          variant="outline-success"
          size="sm"
        >
          {isButtonDisabled ? `Continue in ${countdown}` : "Continue"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChangeStatusAlert;
