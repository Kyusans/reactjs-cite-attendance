import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { AddFacultyModal } from './modal/AddFacultyModal';
import { AdminNavbar } from './AdminNavbar';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { ViewFacultyProfile } from '../modal/ViewFacultyProfile';

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const getActiveFaculties = async () => {
    try {
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getActiveFaculties");
      const res = await axios.post(url, formData);
      console.log("res ni getActiveFaculties", res);
      setData(res.data !== 0 ? res.data : []);
    } catch (error) {
      toast.error("Network Error");
      console.log("LandingPage.jsx => getActiveFaculties(): ", error);
    } finally {
      setIsLoading(false);
    }
  }

  // add faculty diri
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const handleOpenAddFacultyModal = () => setShowAddFacultyModal(true);
  const handleCloseAddFacultyModal = () => {
    getActiveFaculties();
    setShowAddFacultyModal(false)
  };

  // view faculty diri
  const [facultyId, setFacultyId] = useState(0);
  const [facultyName, setFacultyName] = useState('');
  const [facultyImage, setFacultyImage] = useState('');
  const [showViewFacultyModal, setShowViewFacultyModal] = useState(false);
  const handleOpenViewFacultyModal = (facultyId, facultyName, facultyImage) => {
    setFacultyId(facultyId);
    setFacultyName(facultyName);
    setFacultyImage(facultyImage);
    setShowViewFacultyModal(true);
  };
  const handleCloseViewFacultyModal = () => {
    getActiveFaculties();
    setShowViewFacultyModal(false)
  };


  useEffect(() => {
    getActiveFaculties();
  }, [])

  return (
    <div>
      <AdminNavbar />
      <Container className='mt-3'>
        <Button variant='outline-success' onClick={handleOpenAddFacultyModal}><Plus size={16} /> Add Faculty</Button>
        <div className='d-flex justify-content-center align-items-center'>
          {isLoading ? <Spinner animation="border" variant="dark" size="sm" /> :
            <Row className="g-3">
              {data.length === 0 ? <h1>No Faculties</h1> : data.map((faculty, index) => (
                <Col xs={12} md={3} key={index} className="d-flex">
                  <Card className="text-center p-3 mt-3 h-100 w-100" variant="dark">
                    <div className="d-flex justify-content-center">
                      <Card.Img
                        variant="top"
                        src={process.env.REACT_APP_API_URL + "images/" + faculty.user_image}
                        className="rounded-circle"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <Card.Title>{`${faculty.user_firstName} ${faculty.user_lastName}`}</Card.Title>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleOpenViewFacultyModal(
                          faculty.user_id,
                          faculty.user_firstName + " " + faculty.user_lastName,
                          faculty.user_image
                        )
                        }
                      >
                        View Profile
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>


          }
        </div>

      </Container>
      <AddFacultyModal
        show={showAddFacultyModal}
        onHide={handleCloseAddFacultyModal}
      />
      <ViewFacultyProfile
        open={showViewFacultyModal}
        onHide={handleCloseViewFacultyModal}
        facultyId={facultyId}
        facultyName={facultyName}
        facultyImage={facultyImage}
      />
    </div>
  )
}
