import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Virtual/AuthProvider"; // Adjust the path as per your project structure

function SideBar() {
  const { user } = useContext(AuthContext); // Assuming `user` is available in AuthContext
  const username = user?.username || "User";
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <div>
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Sidebar */}
        <div className="sidebar">
          {/* User Panel */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex flex-column align-items-center">
            <div
              className="image d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#007bff",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                borderRadius: "50%",
                marginBottom: "10px",
              }}
            >
              {firstLetter}
            </div>
            <div className="info">
              <Link to="#" className="d-block text-center text-white">
                {username}
              </Link>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Dashboard */}
              <li className="nav-item">
              <Link to="/home" className="nav-link active">
                <i className="nav-icon fas fa-tachometer-alt" />
            <p>
              Dashboard
              <i className="right fas fa-angle-right" />
            </p>
          </Link>
              </li>
              {/* Manage Teachers */}
              <li className="nav-item">
                <Link to="/teachers" className="nav-link">
                  <i className="nav-icon fas fa-chalkboard-teacher" />
                  <p>Manage Teachers</p>
                </Link>
              </li>
              {/* Manage Classes */}
              <li className="nav-item">
                <Link to="/classes" className="nav-link">
                  <i className="nav-icon fas fa-school" />
                  <p>Manage Classes</p>
                </Link>
              </li>
              {/* Manage Subjects */}
              <li className="nav-item">
                <Link to="/subjects" className="nav-link">
                  <i className="nav-icon fas fa-book" />
                  <p>Manage Subjects</p>
                </Link>
              </li>
              {/* Manage Students */}
              <li className="nav-item">
                <Link to="/students" className="nav-link">
                  <i className="nav-icon fas fa-user-graduate" />
                  <p>Manage Students</p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
}

export default SideBar;

  


