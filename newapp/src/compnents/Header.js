import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
      <div>
<nav className="main-header navbar navbar-expand navbar-white navbar-light">
  <ul className="navbar-nav">
    <li className="nav-item">
    </li>
    <li className="nav-item d-none d-sm-inline-block">
      <Link to="/home" className="nav-link">Home</Link>
    </li>
    
  </ul>

</nav>
      </div>
    );
  }
  
  export default Header;
  