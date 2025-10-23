import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaGamepad, FaIdCard, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <FaUser color="#ff4500" /> Profile
      </h1>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          <FaUser size={50} color="#ff4500" />
        </div>
        <h2 style={styles.name}>{user.freeFireName}</h2>
        <p style={styles.email}>{user.email}</p>
      </div>

      {/* Details */}
      <div style={styles.detailsCard}>
        <div style={styles.detailItem}>
          <div style={styles.detailIcon}>
            <FaIdCard color="#ff4500" />
          </div>
          <div>
            <div style={styles.detailLabel}>Free Fire UID</div>
            <div style={styles.detailValue}>{user.freeFireUID}</div>
          </div>
        </div>

        <div style={styles.detailItem}>
          <div style={styles.detailIcon}>
            <FaGamepad color="#ff4500" />
          </div>
          <div>
            <div style={styles.detailLabel}>In-Game Name</div>
            <div style={styles.detailValue}>{user.freeFireName}</div>
          </div>
        </div>

        <div style={styles.detailItem}>
          <div style={styles.detailIcon}>
            <FaEnvelope color="#ff4500" />
          </div>
          <div>
            <div style={styles.detailLabel}>Email</div>
            <div style={styles.detailValue}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          ⚠️ Free Fire UID and Name are locked and cannot be changed
        </p>
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        <FaSignOutAlt /> Logout
      </button>

      {/* Version */}
      <div style={styles.version}>
        FireBet v1.0.0
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  profileCard: {
    background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 69, 0, 0.3)',
    textAlign: 'center'
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(255, 69, 0, 0.2)',
    border: '3px solid #ff4500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px'
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '8px'
  },
  email: {
    fontSize: '14px',
    color: '#888'
  },
  detailsCard: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  detailIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(255, 69, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '4px'
  },
  detailValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff'
  },
  infoBox: {
    background: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px'
  },
  infoText: {
    fontSize: '13px',
    color: '#ffa500',
    lineHeight: '1.5'
  },
  logoutBtn: {
    width: '100%',
    padding: '16px',
    background: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    borderRadius: '12px',
    color: '#ff0000',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px'
  },
  version: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#666'
  }
};

export default Profile;
