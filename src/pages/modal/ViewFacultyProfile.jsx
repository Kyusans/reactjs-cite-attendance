import axios from "axios";
import React, { useCallback, useMemo } from "react";
import {
  Button,
  Col,
  Container,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast } from "sonner";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup localizer for react-big-calendar
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export const ViewFacultyProfile = ({
  open,
  onHide,
  facultyId,
  facultyName,
  facultyImage,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState({ schedules: [], status: [] });
  const [liveDateTime, setLiveDateTime] = React.useState("");

  const getFacultySchedule = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + "admin.php";
      const jsonData = { userId: facultyId };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getFacultySchedule");
      const res = await axios.post(url, formData);
      console.log("res ni getFacultySchedule", res);
      setData(res.data !== 0 ? res.data : { schedules: [], status: [] });
    } catch (error) {
      toast.error("Network Error");
      console.log("FacultyDashboard => getFacultySchedule(): ", error);
    } finally {
      setIsLoading(false);
    }
  }, [facultyId]);

  const handleClose = () => {
    onHide();
  };

  React.useEffect(() => {
    if (open) {
      getFacultySchedule();
    }
  }, [getFacultySchedule, open]);

  // Live PH Date & Time
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Manila",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setLiveDateTime(new Intl.DateTimeFormat("en-PH", options).format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Convert JSON schedules into events for calendar
  const events = useMemo(() => {
    const dayMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
    };

    return data.schedules.map((s) => {
      const today = new Date();
      const dayDiff = dayMap[s.sched_day] - today.getDay();
      const baseDate = new Date(today);
      baseDate.setDate(today.getDate() + dayDiff);

      const start = new Date(baseDate.toDateString() + " " + s.sched_startTime);
      const end = new Date(baseDate.toDateString() + " " + s.sched_endTime);

      return {
        id: s.sched_id,
        title: "Class Hours",
        start,
        end,
        allDay: false,
      };
    });
  }, [data.schedules]);

  return (
    <Modal
      show={open}
      onHide={handleClose}
      fullscreen // ✅ Fullscreen on mobile
      centered
    >
      <Modal.Body>
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <Spinner animation="border" variant="dark" />
          </div>
        ) : (
          <Container fluid>
            {/* Profile Section */}
            <Row className="align-items-center mb-3">
              <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                <Image
                  src={process.env.REACT_APP_API_URL + "images/" + facultyImage}
                  width={150}
                  height={150}
                  roundedCircle
                  style={{ objectFit: "cover" }}
                />
              </Col>
              <Col xs={12} md={9}>
                <h4 className="text-center text-md-start">{facultyName}</h4>
              </Col>
            </Row>

            {/* Calendar Section */}
            <h4>Class Schedule</h4>
            <p className="text-muted mb-1">📅 {liveDateTime}</p>

            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: "700px" }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  views={["week"]}
                  defaultView="week"
                  toolbar={false}
                  min={new Date(1970, 1, 1, 8, 0)} // 8:00 AM
                  max={new Date(1970, 1, 1, 21, 0)} // 9:00 PM
                  eventPropGetter={() => ({
                    style: {
                      backgroundColor: "#f0ad4e",
                      borderRadius: "6px",
                      color: "white",
                      border: "none",
                      padding: "4px",
                    },
                  })}
                />
              </div>
            </div>
          </Container>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="outline-danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
