import { Card, Container } from "react-bootstrap"
import { FacultyNavbar } from "./FacultyNavbar"

export const FacultyDashboard = () => {
  return (
    <>
      <FacultyNavbar />
      <main>
        <Container>
          <Card className="rounded-4">
            <Card.Body>
              <h1>Faculty Dashboard</h1>
            </Card.Body>
          </Card>
        </Container>
      </main>
    </>
  )
}
