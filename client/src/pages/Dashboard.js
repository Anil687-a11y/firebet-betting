import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaFire, FaWallet, FaTrophy } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { roomAPI, walletAPI } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import RoomCard from '../components/RoomCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myRooms, setMyRooms] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, walletRes] = await Promise.all([
        roomAPI.getMyRooms(),
        walletAPI.getBalance()
      ]);
      setMyRooms(roomsRes.data.rooms);
      setWallet(walletRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to cancel this room?')) return;

    try {
      await roomAPI.delete(roomId);
      toast.success('Room cancelled and amount refunded');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel room');
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '50px auto' }}></div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <FaFire color="#ff4500" /> FireBet
          </h1>
          <p style={styles.subtitle}>Welcome, {user.freeFireName}</p>
        </div>
      </div>

      {/* Wallet Card */}
      <div style={styles.walletCard} className="card">
        <div style={styles.walletHeader}>
          <FaWallet size={24} color="#ffd700" />
          <span style={styles.walletTitle}>My Wallet</span>
        </div>
        <div style={styles.balances}>
          <div style={styles.balanceItem}>
            <span style={styles.balanceLabel}>Deposit</span>
            <span style={styles.balanceValue}>
              {formatCurrency(wallet?.wallet.depositBalance || 0)}
            </span>
          </div>
          <div style={styles.balanceItem}>
            <span style={styles.balanceLabel}>Winnings</span>
            <span style={{...styles.balanceValue, color: '#00ff00'}}>
              {formatCurrency(wallet?.wallet.winningBalance || 0)}
            </span>
          </div>
        </div>
        <div style={styles.totalBalance}>
          <span>Total Balance</span>
          <span style={styles.totalValue}>
            {formatCurrency(wallet?.totalBalance || 0)}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actions}>
        <button
          onClick={() => navigate('/rooms/create')}
          style={{...styles.actionBtn, background: 'linear-gradient(135deg, #ff4500 0%, #ff6a33 100%)'}}
        >
          <FaPlus size={20} />
          <span>Create Room</span>
        </button>
        <button
          onClick={() => navigate('/rooms')}
          style={{...styles.actionBtn, background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)'}}
        >
          <FaTrophy size={20} />
          <span>Join Room</span>
        </button>
      </div>

      {/* My Active Rooms */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>My Active Rooms</h2>
        {myRooms.length === 0 ? (
          <div style={styles.emptyState}>
            <FaFire size={50} color="#444" />
            <p style={styles.emptyText}>No active rooms</p>
            <p style={styles.emptySubtext}>Create or join a room to start playing</p>
          </div>
        ) : (
          myRooms.map(room => (
            <RoomCard
              key={room._id}
              room={room}
              showActions={room.status === 'waiting' && room.creator._id === user.id}
              onDelete={handleDeleteRoom}
            />
          ))
        )}
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
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#888'
  },
  walletCard: {
    background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 215, 0, 0.3)'
  },
  walletHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  walletTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff'
  },
  balances: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  balanceItem: {
    flex: 1,
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  balanceLabel: {
    fontSize: '12px',
    color: '#888'
  },
  balanceValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff'
  },
  totalBalance: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: 'rgba(255, 69, 0, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 69, 0, 0.3)'
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ff4500'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px'
  },
  actionBtn: {
    flex: 1,
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    border: '1px dashed rgba(255, 255, 255, 0.1)'
  },
  emptyText: {
    fontSize: '18px',
    color: '#888',
    marginTop: '16px',
    marginBottom: '8px'
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#666'
  }
};

export default Dashboard;
