import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Badge } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaLock,
  FaShieldAlt,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import "../styles/accountSettings.css";

const AccountSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="mobile-container">
      <div className="popx-header">
        <FaUserCircle size={40} />
        <div>Account Settings</div>
      </div>

      <div className="profile-card">
        <Row className="align-items-center mb-4">
          <Col xs="auto">
            <div className="popx-avatar">
              MD
              <div className="popx-status-dot" />
            </div>
          </Col>
          <Col>
            <h3 className="profile-name">Marry Doe</h3>
            <p className="profile-email">marry.doe@popx.com</p>
            <Badge bg="primary">PRO Member</Badge>
          </Col>
        </Row>

        <div className="profile-info-item">
          <FaEnvelope /> marry.doe@popx.com
        </div>
        <div className="profile-info-item">
          <FaPhone /> +1 (555) 123-4567
        </div>
        <div className="profile-info-item">
          <FaMapMarkerAlt /> San Francisco, CA
        </div>
        <div className="profile-info-item">
          <FaCalendarAlt /> Joined January 2023
        </div>

        <div className="d-grid gap-2 mt-4">
          <Button className="btn-popx">
            <FaEdit /> Edit Profile
          </Button>
          <Button className="btn-popx-secondary">
            <FaLock /> Change Password
          </Button>
          <Button className="btn-popx-secondary">
            <FaShieldAlt /> Privacy Settings
          </Button>
          <Button className="btn-popx-secondary">
            <FaBell /> Notifications
          </Button>
          <Button
            variant="danger"
            className="mt-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;