// Format currency
export const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// Calculate time remaining
export const getTimeRemaining = (deadline) => {
  const total = Date.parse(deadline) - Date.now();
  
  if (total <= 0) {
    return { total: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  
  return { total, hours, minutes, seconds, expired: false };
};

// Format time display
export const formatTime = (hours, minutes, seconds) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

// Validate stake amount
export const validateStakeAmount = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return 'Invalid amount';
  if (num < 20) return 'Minimum amount is ₹20';
  if (num > 1000) return 'Maximum amount is ₹1000';
  if (num % 5 !== 0) return 'Amount must be multiple of 5';
  return null;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    waiting: '#ffa500',
    active: '#00ff00',
    completed: '#808080',
    disputed: '#ff0000',
    cancelled: '#666666'
  };
  return colors[status] || '#ffffff';
};

// Get status badge style
export const getStatusBadge = (status) => {
  const styles = {
    waiting: { bg: '#ffa50020', color: '#ffa500', text: 'Waiting' },
    active: { bg: '#00ff0020', color: '#00ff00', text: 'Active' },
    completed: { bg: '#80808020', color: '#808080', text: 'Completed' },
    disputed: { bg: '#ff000020', color: '#ff0000', text: 'Disputed' },
    cancelled: { bg: '#66666620', color: '#666666', text: 'Cancelled' }
  };
  return styles[status] || styles.waiting;
};
