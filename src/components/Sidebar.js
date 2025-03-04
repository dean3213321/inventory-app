import React from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = ({ isExpanded }) => {
  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <ul className="list-unstyled">
        <li>
          <i className="bi bi-house-door"></i>
          <span className="sidebar-text">
            <a href="/">Dashboard</a>
          </span>
        </li>
        <li>
          <i className="bi bi-people-fill"></i>
          <span className="sidebar-text">
            <a href="Users">Users</a>
          </span>
        </li>
        <li>
          <i className="bi bi-box-seam"></i>
          <span className="sidebar-text">
            <a href="Products">Products</a>
          </span>
        </li>
        <li>
          <i className="bi bi-coin"></i>
          <span className="sidebar-text">
            <a href="Sales">Sales</a>
          </span>
        </li>
        <li>
          <i className="bi bi-bar-chart-line"></i>
          <span className="sidebar-text">
            <a href="Reports">Reports</a>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;