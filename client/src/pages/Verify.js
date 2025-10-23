import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShieldAlt, FaFire } from 'react-icons/fa';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = location.state?.email || '';
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error('Please enter 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verify({ email, code });
      login(response.data.token, response.data.user);
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="slide-in">
        <div style={styles.logo}>
          <FaShieldAlt size={50} color="#00ff00" />
          <h1 style={styles.title}>Verify Email</h1>
          <p style={styles.subtitle}>Enter the 6-digit code sent to</p>
          <p style={styles.email}>{email}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required
            style={styles.codeInput}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>Didn't receive code? Check spam folder</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
    borderRadius: '24px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(0, 255, 0, 0.3)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
  },
  logo: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '16px 0 8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '4px'
  },
  email: {
    fontSize: '14px',
    color: '#ff4500',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  codeInput: {
    width: '100%',
    padding: '20px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(0, 255, 0, 0.3)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: '8px'
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px'
  },
  footerText: {
    color: '#888',
    fontSize: '13px'
  }
};

export default Verify;
