import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import '../../../App.css'
import { retrieveData } from '../../../utils/cryptoUtils'
import axios from 'axios'
import { toast } from 'sonner'

export const UpdateSchedule = ({ open, onHide, schedule }) => {
  const [day, setDay] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // pre-fill when schedule changes
  useEffect(() => {
    if (schedule) {
      setDay(schedule.sched_day || '')

      // convert to 24h format HH:MM
      const normalizeTime = (t) => {
        if (!t) return ''
        // case "07:00:00"
        if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5)
        // case "7:00 AM"
        if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(t)) {
          const d = new Date(`1970-01-01 ${t}`)
          return d.toTimeString().slice(0, 5)
        }
        // fallback
        return t.slice(0, 5)
      }

      setStartTime(normalizeTime(schedule.sched_startTime_24h || schedule.sched_startTime))
      setEndTime(normalizeTime(schedule.sched_endTime_24h || schedule.sched_endTime))
    }
  }, [schedule])


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

      setIsLoading(true)
      try {
        const url = process.env.REACT_APP_API_URL + 'admin.php'
        const userId = retrieveData('userId')
        const jsonData = {
          sched_id: schedule.sched_id,
          day: day,
          startTime: formattedStart,
          endTime: formattedEnd,
          userId: userId
        }
        const formData = new FormData()
        formData.append('json', JSON.stringify(jsonData))
        formData.append('operation', 'updateSchedule')
        const res = await axios.post(url, formData)

        if (res.data === -1) {
          toast.error('Schedule conflict')
        } else if (res.data === 1) {
          toast.success('Schedule updated successfully')
          onHide()
        } else {
          toast.error('Unable to update schedule')
        }
      } catch (error) {
        toast.error('Network Error')
        console.log('UpdateSchedule error', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleHide = () => {
    setErrors({})
    onHide()
  }

  return (
    <Modal show={open} onHide={handleHide} backdrop="static" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Schedule</Modal.Title>
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
            Update
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
