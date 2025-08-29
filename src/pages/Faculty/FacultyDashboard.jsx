import { Card, Container } from "react-bootstrap"
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
      console.log(jsonData);
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getFacultySchedule");
      const res = await axios.post(url, formData);
      console.log("res ni getFacultySchedules", res);
      setData(res.data !== 0 ? res.data : []);
    } catch (error) {
      toast.error("Network Error");
      console.log("LandingPage.jsx => getTodayFacultySchedules(): ", error);
    } finally {
      setIsLoading(false);
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
                    data={data}
                    columns={columns}
                    headerAction={
                      <>
                        <PlusSquare size={20} className="cursor-pointer text-success" onClick={handleOpenAddSched} />
                      </>
                    }
                  />
                </>
              )}
            </Card.Body>
          </Card>
          <AddSchedule open={showAddSched} onHide={handleCloseAddSched} />
        </Container>
      </main >
    </>
  )
}
