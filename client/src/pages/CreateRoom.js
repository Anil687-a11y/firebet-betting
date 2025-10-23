import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaGamepad, FaLock, FaCoins } from 'react-icons/fa';
import { roomAPI } from '../utils/api';
import { validateStakeAmount, formatCurrency } from '../utils/helpers';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomId: '',
    password: '',
    matchType: '1v1',
    stakeAmount: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amountError = validateStakeAmount(formData.stakeAmount);
    if (amountError) {
      toast.error(amountError);
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...formData,
        stakeAmount: Number(formData.stakeAmount)
      };
      await roomAPI.create(data);
      toast.success('Room created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const totalPool = formData.stakeAmount ? Number(formData.stakeAmount) * 2 : 0;
  const adminCut = totalPool * 0.20;
  const winnerAmount = totalPool - adminCut;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <FaArrowLeft />
        </button>
        <h1 style={styles.title}>Create Room</h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Match Type */}
        <div style={styles.section}>
          <label style={styles.label}>
            <FaGamepad color="#ff4500" /> Match Type
          </label>
          <div style={styles.matchTypes}>
            {['1v1', '2v2', '3v3', '4v4'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, matchType: type })}
                style={{
                  ...styles.matchTypeBtn,
                  background: formData.matchType === type ? '#ff4500' : 'rgba(255, 69, 0, 0.2)',
                  border: `2px solid ${formData.matchType === type ? '#ff4500' : 'rgba(255, 69, 0, 0.3)'}`
                }}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Room Details */}
        <div style={styles.section}>
          <label style={styles.label}>Room ID</label>
          <input
            type="text"
            name="roomId"
            placeholder="Enter Free Fire Room ID"
            value={formData.roomId}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>
            <FaLock color="#888" /> Room Password
          </label>
          <input
            type="text"
            name="password"
            placeholder="Enter Room Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Stake Amount */}
        <div style={styles.section}>
          <label style={styles.label}>
            <FaCoins color="#ffd700" /> Entry Fee (₹20 - ₹1000, multiples of 5)
          </label>
          <input
            type="number"
            name="stakeAmount"
            placeholder="Enter amount"
            value={formData.stakeAmount}
            onChange={handleChange}
            required
            min="20"
            max="1000"
            step="5"
            style={styles.input}
          />
        </div>

        {/* Prize Breakdown */}
        {formData.stakeAmount && !validateStakeAmount(formData.stakeAmount) && (
          <div style={styles.breakdown}>
            <h3 style={styles.breakdownTitle}>Prize Pool</h3>
            <div style={styles.breakdownItem}>
              <span>Your Entry Fee</span>
              <span style={styles.breakdownValue}>{formatCurrency(Number(formData.stakeAmount))}</span>
            </div>
            <div style={styles.breakdownItem}>
              <span>Opponent's Entry Fee</span>
              <span style={styles.breakdownValue}>{formatCurrency(Number(formData.stakeAmount))}</span>
            </div>
            <div style={{...styles.breakdownItem, ...styles.winnerRow}}>
              <span>🏆 Winner Gets</span>
              <span style={{...styles.breakdownValue, color: '#00ff00', fontSize: '20px'}}>
                {formatCurrency(winnerAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            ⚠️ Entry fee will be deducted immediately. If no one joins, you can cancel and get a refund.
          </p>
          <p style={styles.infoText}>
            ⏱️ You have 1 hour to submit match result after room is created.
          </p>
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Creating Room...' : 'Create Room & Pay'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  backBtn: {
    background: 'rgba(255, 69, 0, 0.2)',
    border: '1px solid rgba(255, 69, 0, 0.3)',
    borderRadius: '12px',
    padding: '12px',
    color: '#ff4500',
    cursor: 'pointer',
    fontSize: '18px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  matchTypes: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  matchTypeBtn: {
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    cursor: 'pointer'
  },
  input: {
    padding: '14px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px'
  },
  breakdown: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(255, 69, 0, 0.3)'
  },
  breakdownTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '12px'
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#888',
    fontSize: '14px'
  },
  breakdownValue: {
    fontWeight: 'bold',
    color: '#fff'
  },
  winnerRow: {
    borderBottom: 'none',
    paddingTop: '12px',
    marginTop: '8px',
    borderTop: '2px solid rgba(0, 255, 0, 0.3)'
  },
  infoBox: {
    background: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    borderRadius: '12px',
    padding: '16px'
  },
  infoText: {
    fontSize: '13px',
    color: '#ffa500',
    marginBottom: '8px',
    lineHeight: '1.5'
  },
  submitBtn: {
    padding: '16px',
    background: 'linear-gradient(135deg, #ff4500 0%, #ff6a33 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default CreateRoom;
