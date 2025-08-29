import { Badge, Card, Container, Form } from "react-bootstrap"
import { FacultyNavbar } from "./FacultyNavbar"
import { useEffect, useState } from "react";
import { retrieveData } from "../../utils/cryptoUtils";
import axios from "axios";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import DataTable from "../../components/DataTable";
import { AddSchedule } from "./modal/AddSchedule";
import { PlusSquare } from "lucide-react";
import ChangeStatusAlert from "./modal/ChangeStatusAlert";

export const FacultyDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    setSelectedStatus(value);
    handleShowAlert("You want to change the status?");
  };

  const handleChangeStatus = async (notes) => {
    setIsLoading(true);
    try {
      console.log("status", selectedStatus);
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const userId = retrieveData("userId");
      const jsonData = { userId: userId, status: selectedStatus, notes: selectedStatus === 1 ? "In Office" : notes }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "changeFacultyStatus");
      const res = await axios.post(url, formData);
      console.log("res ni handleChangeStatus", res);

      if (res.data !== 0) {
        toast.success("Status successfully changed");
        getFacultySchedules();
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

  const columns = [
    { header: "Day", accessor: "sched_day", sortable: true },
    { header: "Start Time", accessor: "sched_startTime", sortable: true },
    { header: "End Time", accessor: "sched_endTime", sortable: true },
  ]

  useEffect(() => {
    getFacultySchedules();
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
                  {facultyStatus && (
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="switch"
                        checked={statusSwitch}
                        onChange={() => handleShowSwitchStatusAlert(!statusSwitch ? 1 : 2)}
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
                </Card.Body>
              </Card>
              <Card className="rounded-4">
                <Card.Body>
                  <DataTable
                    title="Schedule"
                    data={filteredData}
                    columns={columns}
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
        </Container>
      </main>
    </>
  )
}
