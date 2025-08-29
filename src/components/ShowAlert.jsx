import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

function ShowAlert({ open, onHide, message, duration }) {
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    let timer;
    if (open && duration) {
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
  }, [open, duration]);

  const handleClose = () => {
    onHide(0);
  };

  const handleContinue = () => {
    onHide(1);
  };

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Are you absolutely sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
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

export default ShowAlert;
