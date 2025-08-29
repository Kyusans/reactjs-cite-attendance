import { Card, Container, Form } from "react-bootstrap"
import { FacultyNavbar } from "./FacultyNavbar"
import { useEffect, useState } from "react";
import { retrieveData } from "../../utils/cryptoUtils";
import axios from "axios";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import DataTable from "../../components/DataTable";
import { AddSchedule } from "./modal/AddSchedule";
import { PlusSquare } from "lucide-react";

export const FacultyDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filterDay, setFilterDay] = useState("All");

  const [showAddSched, setShowAddSched] = useState(false);
  const handleOpenAddSched = () => setShowAddSched(true);
  const handleCloseAddSched = () => {
    getFacultySchedules();
    setShowAddSched(false)
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
      setData(res.data !== 0 ? res.data : []);
      setFilteredData(res.data !== 0 ? res.data : []);
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
          <Card className="rounded-4">
            <Card.Body>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <DataTable
                    title="Schedule"
                    data={filteredData}
                    columns={columns}
                    headerAction={
                      <div className="d-flex">
                        {/* Add Button */}
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
                </>
              )}
            </Card.Body>
          </Card>
          <AddSchedule open={showAddSched} onHide={handleCloseAddSched} />
        </Container>
      </main>
    </>
  )
}
