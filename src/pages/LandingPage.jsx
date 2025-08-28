import axios from 'axios';
import React, { useEffect } from 'react'
import { Badge, Container } from 'react-bootstrap';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const LandingPage = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

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
      console.log("LandingPage.jsx => getTodayFacultySchedules(): ", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTodayFacultySchedules();
  }, [])

  const columns = [
    { header: "Full Name", accessor: "fullName" },
    {
      header: "Status", cell: (row) => (
        <Badge bg={row.statusMId === 2 ? "danger" : row.statusMId === 3 ? "warning" : "success"}>
          {row.status_note}
        </Badge>
      )
    },
  ]
  return (
    <Container className='mt-3'>
      {isLoading ? (
        <LoadingSpinner />
      ) :
        <DataTable columns={columns} data={data} itemsPerPage={10} autoIndex />
      }
    </Container>
  )
}
