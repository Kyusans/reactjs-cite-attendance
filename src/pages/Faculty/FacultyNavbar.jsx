import { LogOut, Settings } from "lucide-react"
import { Dropdown, Navbar } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { removeData } from "../../utils/cryptoUtils";

export const FacultyNavbar = () => {
  const navigateTo = useNavigate();
  const handleLogout = () => {
    navigateTo("/");
    removeData("userId");
  };

  return (
    <Navbar bg="dark" expand="lg" className="mb-3">
      <Navbar.Brand className='text-white ms-3'>CITE</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        <Dropdown drop="start" className="me-3">
          <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
            <Settings />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}><LogOut size={16} /> Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};
