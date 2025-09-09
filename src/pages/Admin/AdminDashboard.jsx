import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { AddFacultyModal } from './modal/AddFacultyModal';

export const AdminDashboard = () => {

  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const handleOpenAddFacultyModal = () => setShowAddFacultyModal(true);
  const handleCloseAddFacultyModal = () => {
    setShowAddFacultyModal(false)
  };
  return (
    <Container className='mt-3'>
      <Button onClick={handleOpenAddFacultyModal}>Add Faculty</Button>
      <div className='d-flex justify-content-center align-items-center'>
        <h1>Admin Dashboard</h1>
      </div>
      <AddFacultyModal 
        show={showAddFacultyModal}
        onHide={handleCloseAddFacultyModal}
        // onAddFaculty={handleOpenAddFacultyModal}
      />
    </Container>
  )
}
