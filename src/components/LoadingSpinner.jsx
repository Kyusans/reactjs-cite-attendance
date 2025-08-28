import React from 'react'
import { Spinner } from 'react-bootstrap'

export const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="dark" size="sm" />
    </div>
  )
}
