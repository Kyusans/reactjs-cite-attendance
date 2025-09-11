import { LogOut, Settings } from "lucide-react";
import { Dropdown, Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { removeData } from "../../utils/cryptoUtils";
import { useEffect, useState } from "react";

export const FacultyNavbar = () => {
  const navigateTo = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992); 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    navigateTo("/");
    removeData("userId");
  };

  return (
    <Navbar bg="dark" expand="lg" className="mb-3">
      <Navbar.Brand className="text-white ms-3">CITE</Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
        <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
      </Navbar.Toggle>

      <Navbar.Collapse className="justify-content-end">
        {isMobile ? (
          <Button variant="outline-light" className="me-3 d-flex align-items-center" onClick={handleLogout}>
            <LogOut size={16} className="me-1" /> Logout
          </Button>
        ) : (
          <Dropdown drop="start" className="me-3">
            <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
              <Settings />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
