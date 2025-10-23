import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaGamepad, FaIdCard, FaFire } from 'react-icons/fa';
import { authAPI } from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    freeFireUID: '',
    freeFireName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authAPI.register(registerData);
      toast.success('Registration successful! Check your email for verification code.');
      navigate('/verify', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="slide-in">
        <div style={styles.logo}>
          <FaFire size={50} color="#ff4500" />
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join FireBet Gaming</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerText}>Free Fire Details</span>
          </div>

          <div style={styles.inputGroup}>
            <FaIdCard style={styles.icon} />
            <input
              type="text"
              name="freeFireUID"
              placeholder="Free Fire UID"
              value={formData.freeFireUID}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaGamepad style={styles.icon} />
            <input
              type="text"
              name="freeFireName"
              placeholder="Free Fire In-Game Name"
              value={formData.freeFireName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.warning}>
            ⚠️ Free Fire UID and Name cannot be changed after registration
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account?</span>
          <Link to="/login" style={styles.link}>Login</Link>
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
    border: '1px solid rgba(255, 69, 0, 0.3)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
  },
  logo: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '16px 0 8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#888'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    left: '16px',
    color: '#888',
    fontSize: '18px'
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 48px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px'
  },
  divider: {
    textAlign: 'center',
    margin: '10px 0',
    position: 'relative'
  },
  dividerText: {
    color: '#888',
    fontSize: '13px',
    background: '#1e1e2e',
    padding: '0 10px',
    position: 'relative',
    zIndex: 1
  },
  warning: {
    background: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '12px',
    color: '#ffa500',
    textAlign: 'center'
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #ff4500 0%, #ff6a33 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  footerText: {
    color: '#888',
    fontSize: '14px'
  },
  link: {
    color: '#ff4500',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default Register;
