import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaFire, FaWallet, FaUser, FaCrown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Home' },
    { path: '/rooms', icon: FaFire, label: 'Rooms' },
    { path: '/wallet', icon: FaWallet, label: 'Wallet' },
    { path: '/profile', icon: FaUser, label: 'Profile' }
  ];

  if (user?.isAdmin) {
    navItems.push({ path: '/admin', icon: FaCrown, label: 'Admin' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.navItem,
              color: active ? '#ff4500' : '#888'
            }}
          >
            <Icon size={24} />
            <span style={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 69, 0, 0.2)',
    zIndex: 1000,
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
  },
  navItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    padding: '8px 12px',
    transition: 'all 0.3s ease'
  },
  label: {
    fontSize: '11px',
    fontWeight: '500'
  }
};

export default BottomNav;
