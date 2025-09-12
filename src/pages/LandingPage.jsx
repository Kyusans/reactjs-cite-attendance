import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Nav,
  Navbar,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast } from "sonner";
import { Login } from "./Login";
import { Menu } from "lucide-react";
import { ViewFacultyProfile } from "./modal/ViewFacultyProfile";

export const LandingPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [loginModalShow, setLoginModalShow] = useState(false);
  const handleOpenLoginModal = () => setLoginModalShow(true);
  const handleCloseLoginModal = () => setLoginModalShow(false);

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
    getTodayFacultySchedules();
    setShowViewFacultyModal(false)
  };
  const getTodayFacultySchedules = async () => {
    setIsLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getTodayFacultySchedules");
      const res = await axios.post(url, formData);
      console.log("res ni getTodayFacultySchedules", res);
      setData(res.data !== 0 ? res.data : []);
    } catch (error) {
      toast.error("Network Error");
      console.log(
        "LandingPage.jsx => getTodayFacultySchedules(): ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTodayFacultySchedules();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <Navbar bg="success" expand="lg" className="mb-3">
        <Navbar.Brand className="ms-3 text-white">CITE</Navbar.Brand>
        <Button
          size="sm"
          className="rounded-3 d-lg-none"
          aria-controls="basic-navbar-nav"
          aria-expanded={false}
          onClick={() => {
            const collapse = document.getElementById("basic-navbar-nav");
            collapse?.classList.toggle("show");
          }}
          style={{
            backgroundColor: "#212529",
            borderColor: "white",
            color: "white",
            padding: "6px 10px",
            borderRadius: "4px",
            marginRight: "1rem",
          }}
        >
          <Menu color="white" />
        </Button>

        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end"
        >
          <Nav className="ms-auto">
            <Nav.Link
              className="text-white me-3"
              onClick={handleOpenLoginModal}
              style={{ cursor: "pointer" }}
            >
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* CONTENT */}
      <Container className="mt-3">
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="dark" />
          </div>
        ) : data.length === 0 ? (
          <h3 className="text-center">No Faculty Schedules Today</h3>
        ) : (
          <Row className="g-4">
            {data.map((faculty, idx) => (
              <Col xs={12} md={6} lg={4} key={idx}>
                <Card className="shadow-md h-100 rounded-4 overflow-hidden">
                  {/* Faculty Image */}
                  <div style={{ position: "relative" }}>
                    <Card.Img
                      src={
                        process.env.REACT_APP_API_URL +
                        "images/" +
                        (faculty.user_image || "default.png")
                      }
                      alt={faculty.fullName}
                      style={{
                        width: "100%",
                        height: "350px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "15px",
                        background: "rgba(0,0,0,0.55)", // dark opacity background
                        color: "white",
                      }}
                    >
                      <h5 className="fw-bold mb-2">{faculty.fullName}</h5>

                      <Badge
                        bg={
                          faculty.statusMId === 2
                            ? "danger"
                            : faculty.statusMId === 3
                              ? "warning"
                              : "success"
                        }
                        className="mb-2"
                        style={{
                          padding: "6px 10px",
                          fontSize: "0.85rem",
                          backgroundColor: "rgba(0,0,0,0.7)", // dark background for badge
                        }}
                      >
                        {`${faculty.status_note} ${faculty.statusMId === 2 ? "(Out)" : ""}`}
                      </Badge>

                      <div>
                        <Button
                          size="sm"
                          variant="light"
                          className="fw-semibold rounded-3"
                          onClick={() => handleOpenViewFacultyModal(faculty.userId, faculty.fullName, faculty.user_image)}
                          style={{
                            border: "none",
                            color: "dark",
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>

                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

      </Container>

      {/* LOGIN MODAL */}
      <Login show={loginModalShow} onHide={handleCloseLoginModal} />
      <ViewFacultyProfile
        open={showViewFacultyModal}
        onHide={handleCloseViewFacultyModal}
        facultyId={facultyId}
        facultyName={facultyName}
        facultyImage={facultyImage}
      />
    </>
  );
};
