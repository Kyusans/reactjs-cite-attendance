import { Circle, LayoutDashboard, Menu } from "lucide-react";
import { useState } from "react";

export const FacultySidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // default to Dashboard

  const toggleSidebar = () => setIsOpen(!isOpen);

  const pages = [
    { name: "Dashboard", icon: <LayoutDashboard />, href: "#" },
    { name: "Change Status", icon: <Circle /> },
    // Add more pages here if needed
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-dark text-white vh-100"
        style={{
          width: isOpen ? "250px" : "0px",
          transition: "width 0.3s ease",
          overflowX: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {isOpen && (
          <div className="p-3">
            <h4 className="mb-4">Menu</h4>
            <ul className="nav flex-column">
              {pages.map((page, index) => (
                <li
                  key={index}
                  className={`nav-item mb-2 ${index === currentPageIndex ? "bg-secondary rounded" : ""
                    }`}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onClick={() => setCurrentPageIndex(index)}
                >
                  <span>{page.icon}</span>
                  <a
                    href={page.href}
                    className="nav-link text-white p-0"
                    style={{ textDecoration: "none" }}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Toggle Icon */}
      <div className="flex-grow-1 p-3">
        <div
          onClick={toggleSidebar}
          style={{
            cursor: "pointer",
            display: "inline-block",
            color: "#333",
          }}
        >
          <Menu size={28} />
        </div>
      </div>
    </div>
  );
};
