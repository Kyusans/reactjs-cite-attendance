import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Form, Button, Spinner, Image } from 'react-bootstrap';
import { toast } from 'sonner';
import { retrieveData } from '../../../utils/cryptoUtils';
export const ChangeProfilePicture = ({ show, onHide }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('/emptyImage.jpg');

  const handleImageChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    handleImageChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setIsLoading(true);

    try {
      const userId = retrieveData('userId'); // get userId from storage
      const jsonData = {
        userId,
        image: image ? image.name : 'emptyImage.jpg'
      };

      const url = process.env.REACT_APP_API_URL + 'admin.php';
      const formData = new FormData();
      formData.append('json', JSON.stringify(jsonData));
      formData.append('operation', 'changeProfilePicture');
      if (image) formData.append('file', image);

      const res = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data === 2) {
        toast.error('You cannot upload files of this type!');
      } else if (res.data === 3) {
        toast.error('There was an error uploading your file!');
      } else if (res.data === 4) {
        toast.error('Your file is too big (25mb maximum)');
      } else if (res.data === 1) {
        toast.success('Profile picture updated successfully');
        onHide();
      } else {
        toast.error('Network Error');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onHide();
    setImage(null);
    setImagePreview('/emptyImage.jpg');
    setIsLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="d-flex flex-column align-items-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              border: '2px dashed #ccc',
              padding: '20px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
            onClick={() =>
              document.getElementById('profileImageUpload').click()
            }
          >
            <Image
              src={imagePreview}
              roundedCircle
              className="mb-3"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover'
              }}
            />
            <div className="text-muted">
              Drag & Drop or Click to select an image
            </div>
          </div>

          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            id="profileImageUpload"
            style={{ display: 'none' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="outline-success" type="submit" disabled={isLoading}>
            {isLoading && <Spinner animation="border" size="sm" />} Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
