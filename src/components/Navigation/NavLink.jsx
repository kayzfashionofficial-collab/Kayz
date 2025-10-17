import React from "react";
import { Link } from "react-router-dom";

const NavLink = ({ label, to = "/", isRed }) => {
  return (
    <Link to={to} className={isRed ? "red" : ""}>
      {label}
    </Link>
  );
};

export default NavLink;
