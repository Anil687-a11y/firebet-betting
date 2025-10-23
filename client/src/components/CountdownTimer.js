import React, { useState, useEffect } from 'react';
import { getTimeRemaining, formatTime } from '../utils/helpers';
import { FaClock } from 'react-icons/fa';

const CountdownTimer = ({ deadline, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(deadline);
      setTimeLeft(remaining);
      
      if (remaining.expired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  if (timeLeft.expired) {
    return (
      <div style={styles.expired}>
        <FaClock size={16} />
        <span>Expired</span>
      </div>
    );
  }

  const isUrgent = timeLeft.total < 10 * 60 * 1000; // Less than 10 minutes

  return (
    <div style={{
      ...styles.container,
      background: isUrgent ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 69, 0, 0.2)',
      border: `1px solid ${isUrgent ? '#ff0000' : '#ff4500'}`
    }}>
      <FaClock size={16} color={isUrgent ? '#ff0000' : '#ff4500'} />
      <span style={{ color: isUrgent ? '#ff0000' : '#ff4500', fontWeight: 'bold' }}>
        {formatTime(timeLeft.hours, timeLeft.minutes, timeLeft.seconds)}
      </span>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  expired: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    background: 'rgba(128, 128, 128, 0.2)',
    border: '1px solid #808080',
    color: '#808080',
    fontSize: '14px'
  }
};

export default CountdownTimer;
