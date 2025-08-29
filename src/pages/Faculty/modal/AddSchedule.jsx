import React, { useState } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import '../../../App.css'
import { retrieveData } from '../../../utils/cryptoUtils'
import axios from 'axios'
import { toast } from 'sonner'

export const AddSchedule = ({ open, onHide }) => {
  const [day, setDay] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleDaySelect = (e) => {
    setDay(e.target.value)
    setErrors({ ...errors, day: '' })
  }

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value)
    setErrors({ ...errors, startTime: '' })
  }

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value)
    setErrors({ ...errors, endTime: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = {}

    if (!day) errors.day = 'Day is required'
    if (!startTime) errors.startTime = 'Start time is required'
    if (!endTime) errors.endTime = 'End time is required'

    const toMinutes = (time) => {
      const [h, m] = time.split(':')
      return parseInt(h) * 60 + parseInt(m)
    }

    if (startTime && endTime && toMinutes(startTime) >= toMinutes(endTime)) {
      errors.endTime = 'End time must be after start time'
    }

    setErrors(errors)

    if (Object.keys(errors).length === 0) {
      // add seconds (":00")
      const formattedStart = `${startTime}:00`
      const formattedEnd = `${endTime}:00`

      console.log(`Add schedule: ${day} ${formattedStart} - ${formattedEnd}`)
      setIsLoading(true);
      try {
        const url = process.env.REACT_APP_API_URL + "admin.php";
        const userId = retrieveData("userId");
        const jsonData = {
          day: day,
          startTime: formattedStart,
          endTime: formattedEnd,
          userId: userId
        }
        const formData = new FormData();
        formData.append("json", JSON.stringify(jsonData));
        formData.append("operation", "addSchedule");
        const res = await axios.post(url, formData);
        console.log("res ni addSchedule", res);
        if(res.data === -1){
          toast.error("Schedule conflict");
        }else if (res.data === 1) {
          toast.success("Schedule added successfully");
          onHide();
        }
      } catch (error) {
        toast.error("Network Error");
        console.log("LandingPage.jsx => getTodayFacultySchedules(): ", error);
      } finally {
        setIsLoading(false);
      }

    }
  }

  const handleHide = () => {
    setDay('');
    setStartTime('');
    setEndTime('');
    onHide();
    setErrors({});
  }

  return (
    <Modal show={open} onHide={handleHide} backdrop="static" centered>
      <Form onSubmit={handleSubmit}>

        <Modal.Header closeButton >
          <Modal.Title>Add Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formDaySelect">
            <Form.Label>Day</Form.Label>
            <Form.Select value={day} onChange={handleDaySelect}>
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </Form.Select>
            {errors.day && <div className="text-danger">{errors.day}</div>}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" value={startTime} onChange={handleStartTimeChange} required />
            {errors.startTime && <div className="text-danger">{errors.startTime}</div>}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" value={endTime} onChange={handleEndTimeChange} required />
            {errors.endTime && <div className="text-danger">{errors.endTime}</div>}
          </Form.Group>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleHide}>
            Close
          </Button>
          <Button variant="outline-success" type="submit" disabled={isLoading}>
            {isLoading && <Spinner size="sm" animation="border" />}
            Submit
          </Button>
        </Modal.Footer>
      </Form>

    </Modal>
  )
}
