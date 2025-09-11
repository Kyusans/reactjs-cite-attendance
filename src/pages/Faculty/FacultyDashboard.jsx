import { Badge, Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap"
import { FacultyNavbar } from "./FacultyNavbar"
import { useEffect, useState } from "react";
import { retrieveData } from "../../utils/cryptoUtils";
import axios from "axios";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import DataTable from "../../components/DataTable";
import { AddSchedule } from "./modal/AddSchedule";
import { Edit2, PlusSquare, Trash2 } from "lucide-react";
import ChangeStatusAlert from "./modal/ChangeStatusAlert";
import { UpdateSchedule } from "./modal/UpdateSchedule";
import ShowAlert from "../../components/ShowAlert";
import { ChangeProfilePicture } from "./modal/ChangeProfilePicture";
import { UpdateFacultyProfile } from "./modal/UpdateFacultyProfile";

export const FacultyDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [facultyProfile, setFacultyProfile] = useState([]);
  const [data, setData] = useState([]);
  const [facultyStatus, setFacultyStatus] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [statusSwitch, setStatusSwitch] = useState(true);

  const [filterDay, setFilterDay] = useState("All");

  const [showAddSched, setShowAddSched] = useState(false);
  const handleOpenAddSched = () => setShowAddSched(true);
  const handleCloseAddSched = () => {
    getFacultySchedules();
    setShowAddSched(false)
  };

  const [showChangeProfile, setShowChangeProfile] = useState(false);
  const handleOpenChangeProfile = () => {
    setShowChangeProfile(true)
  };
  const handleCloseChangeProfile = () => {
    getFacultyProfile();
    setShowChangeProfile(false)
  };

  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const handleOpenUpdateProfile = () => setShowUpdateProfile(true);
  const handleCloseUpdateProfile = () => {
    getFacultyProfile();
    setShowUpdateProfile(false)
  };

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = (confirmed, notes) => {
    if (confirmed === 1) {
      setStatusSwitch(selectedStatus === 1);
      handleChangeStatus(notes);
      console.log("Confirmed! Notes:", notes);
    }
    setShowAlert(false);
  };


  const handleShowSwitchStatusAlert = (value) => {
    console.log("value", value);
    setSelectedStatus(value);
    handleShowAlert("You want to change the status?");
  };

  const [showUpdateSched, setShowUpdateSched] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleOpenUpdateSched = (row) => {
    setSelectedSchedule(row);
    setShowUpdateSched(true);
  };
  const handleCloseUpdateSched = () => {
    getFacultySchedules();
    setShowUpdateSched(false);
  };

  const getFacultyProfile = async () => {
    setIsLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const userId = retrieveData("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getFacultyProfile");
      const res = await axios.post(url, formData);
      setFacultyProfile(res.data);
      console.log("res ni getFacultyProfile", res);
    } catch (error) {
      toast.error("Network Error");
      console.log("FacultyDashboard => getFacultyProfile(): ", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleChangeStatus = async (notes) => {
    setIsLoading(true);
    try {
      console.log("status", selectedStatus);
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const userId = retrieveData("userId");
      const jsonData = {
        userId: userId,
        status: selectedStatus,
        notes: selectedStatus === 1 ? "In Office" : notes
      }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "changeFacultyStatus");
      const res = await axios.post(url, formData);

      console.log("res ni handleChangeStatus", res);

      if (res.data !== 0) {
        toast.success("Status successfully changed");
        // ✅ Always refetch after updating
        await getFacultySchedules(); // <--- THIS refreshes facultyStatus from DB
      } else {
        toast.error("Unable to change status");
      }
    } catch (error) {
      toast.error("Network Error");
      console.log("FacultyDashboard => handleChangeStatus(): ", error);
    } finally {
      setIsLoading(false);
    }
  };


  const getFacultySchedules = async () => {
    setIsLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const userId = retrieveData("userId");
      const jsonData = { userId: userId }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getFacultySchedule");
      const res = await axios.post(url, formData);
      console.log("res ni getFacultySchedules", res);

      const response = res.data;
      setData(response.schedules !== 0 ? response.schedules : []);
      setFilteredData(response.schedules !== 0 ? response.schedules : []);

      const status = response.status !== 0 ? response.status[0] : null;
      setFacultyStatus(status);
      console.log("statusssss", status);

      if (status) {
        setStatusSwitch(status.facStatus_statusMId === 1);
      }

    } catch (error) {
      toast.error("Network Error");
      console.log("FacultyDashboard => getFacultySchedules(): ", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterDay(value);
    if (value === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => item.sched_day === value));
    }
  }

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleShowDeleteAlert = (message) => {
    setAlertMessage(message);
    setShowDeleteAlert(true);
  };
  const handleCloseDeleteAlert = (status) => {
    if (status === 1) {
      deleteSchedule();
    }
    setShowDeleteAlert(false);
  };
  const handleRemoveList = (id) => {
    setSelectedId(id);
    handleShowDeleteAlert("This action cannot be undone. It will permanently delete the item and remove it from your list");
  };

  const deleteSchedule = async () => {
    setIsLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const jsonData = { sched_id: selectedId }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "deleteSchedule");
      const res = await axios.post(url, formData);
      console.log("res ni deleteSchedule", res);
      if (res.data !== 0) {
        toast.success("Schedule successfully deleted");
        getFacultySchedules();
      } else {
        toast.error("Unable to delete schedule");
      }
    } catch (error) {
      toast.error("Network Error");
      console.log("FacultyDashboard => deleteSchedule(): ", error);
    } finally {
      setIsLoading(false);
    }
  }

  const columns = [
    { header: "Day", accessor: "sched_day", sortable: true },
    { header: "Start Time", accessor: "sched_startTime", sortable: true },
    { header: "End Time", accessor: "sched_endTime", sortable: true },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Edit2 className="cursor-pointer text-primary" onClick={() => handleOpenUpdateSched(row)} />
          <Trash2 className="cursor-pointer text-danger" onClick={() => handleRemoveList(row.sched_id)} />
        </div>
      )
    }
  ]

  useEffect(() => {
    getFacultySchedules();
    getFacultyProfile();
  }, [])

  return (
    <>
      <FacultyNavbar />
      <main>
        <Container>
          {isLoading ? <LoadingSpinner /> :
            <>
              <Card className="mb-3 shadow-sm rounded-4">
                <Card.Body>
                  <Row className="align-items-center mb-3">
                    <Col xs={12} md={3} className="text-center">
                      <div
                        style={{
                          position: "relative",
                          width: "150px",
                          height: "150px",
                          margin: "0 auto",
                          borderRadius: "50%",
                          overflow: "hidden",
                        }}
                        // parent hover triggers overlay opacity
                        onMouseEnter={(e) =>
                          e.currentTarget.querySelector(".overlay").style.opacity = "1"
                        }
                        onMouseLeave={(e) =>
                          e.currentTarget.querySelector(".overlay").style.opacity = "0"
                        }
                      >
                        <Image
                          src={`${process.env.REACT_APP_API_URL}images/${facultyProfile.user_image}`}
                          roundedCircle
                          width={150}
                          height={150}
                          style={{ objectFit: "cover" }}
                        />
                        <div
                          className="overlay d-flex align-items-center justify-content-center"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: "50%",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={handleOpenChangeProfile}
                        >
                          Change Profile Picture
                        </div>
                      </div>
                    </Col>


                    <Col xs={12} md={9}>
                      <h4 className="text-center text-md-start">
                        {facultyProfile.user_firstName} {facultyProfile.user_lastName}
                      </h4>
                      <h6 className="text-center text-md-start text-muted">
                        {facultyProfile.user_email}
                      </h6>
                      <div className="text-center text-md-start mt-2">
                        <Button
                          size="sm"
                          onClick={handleOpenUpdateProfile}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </Col>

                  </Row>
                  <div>
                    {facultyStatus && (
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="switch"
                          checked={
                            facultyStatus &&
                            (facultyStatus.facStatus_statusMId === 1 ||
                              facultyStatus.facStatus_statusMId === 3)
                          }
                          onChange={() =>
                            handleShowSwitchStatusAlert(
                              facultyStatus.facStatus_statusMId === 1 ||
                                facultyStatus.facStatus_statusMId === 3
                                ? 2
                                : 1
                            )
                          }
                        />

                        <Badge bg={
                          facultyStatus.facStatus_statusMId === 2
                            ? "danger"
                            : facultyStatus.facStatus_statusMId === 3
                              ? "warning"
                              : "success"
                        } className="ms-2">
                          {`Status: ${facultyStatus.facStatus_note} ${facultyStatus.facStatus_statusMId === 2 ? "(Out)" : ""}`}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
              <Card className="rounded-4">
                <Card.Body>
                  <DataTable
                    title="Schedule"
                    data={filteredData}
                    columns={columns}
                    hideSearch
                    headerAction={
                      <div className="d-flex">
                        <PlusSquare
                          size={20}
                          className="cursor-pointer text-success"
                          onClick={handleOpenAddSched}
                        />

                        <div className="ms-3">
                          <Form.Select size="sm" value={filterDay} onChange={handleFilterChange}>
                            <option value="All">All Days</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                          </Form.Select>
                        </div>
                      </div>
                    }
                  />
                </Card.Body>
              </Card>
            </>
          }
          <ChangeStatusAlert open={showAlert} onHide={handleCloseAlert} duration={1} message={alertMessage} status={selectedStatus} />
          <AddSchedule open={showAddSched} onHide={handleCloseAddSched} />
          <UpdateSchedule
            open={showUpdateSched}
            onHide={handleCloseUpdateSched}
            schedule={selectedSchedule}
          />
          <ChangeProfilePicture
            show={showChangeProfile}
            onHide={handleCloseChangeProfile}
          />
          <UpdateFacultyProfile
            show={showUpdateProfile}
            onHide={handleCloseUpdateProfile}
            faculty={facultyProfile}
          />
          <ShowAlert open={showDeleteAlert} onHide={handleCloseDeleteAlert} message={alertMessage} />
        </Container>
      </main>
    </>
  )
}
