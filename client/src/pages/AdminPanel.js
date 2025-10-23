import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCrown, FaUsers, FaBan, FaCheckCircle } from 'react-icons/fa';
import { adminAPI } from '../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../utils/helpers';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'rooms') {
        const response = await adminAPI.getRooms('active');
        setRooms(response.data.rooms);
      } else if (activeTab === 'users') {
        const response = await adminAPI.getUsers();
        setUsers(response.data.users);
      } else if (activeTab === 'withdrawals') {
        const response = await adminAPI.getWithdrawals();
        setWithdrawals(response.data.withdrawals);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclareWinner = async (roomId, winnerId) => {
    const notes = prompt('Admin notes (optional):');
    
    try {
      await adminAPI.declareWinner(roomId, { winnerId, adminNotes: notes });
      toast.success('Winner declared and amount transferred!');
      fetchData();
      setSelectedRoom(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to declare winner');
    }
  };

  const handleExpireRoom = async (roomId) => {
    if (!window.confirm('Mark this room as expired? Money will go to admin.')) return;

    try {
      await adminAPI.expireRoom(roomId);
      toast.success('Room expired');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to expire room');
    }
  };

  const handleBanUser = async (userId) => {
    const type = prompt('Ban type (temporary/permanent):');
    if (!type || !['temporary', 'permanent'].includes(type)) return;

    const reason = prompt('Reason for ban:');
    if (!reason) return;

    let days = null;
    if (type === 'temporary') {
      days = prompt('Number of days:');
      if (!days || isNaN(days)) return;
    }

    const penalty = prompt('Penalty amount (0 for no penalty):');
    const penaltyAmount = penalty ? Number(penalty) : 0;

    try {
      await adminAPI.banUser(userId, { type, reason, days: Number(days), penaltyAmount });
      toast.success('User banned successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    if (!window.confirm('Unban this user?')) return;

    try {
      await adminAPI.unbanUser(userId);
      toast.success('User unbanned');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to unban user');
    }
  };

  const handleApproveWithdrawal = async (transactionId) => {
    if (!window.confirm('Approve this withdrawal?')) return;

    try {
      await adminAPI.approveWithdrawal(transactionId);
      toast.success('Withdrawal approved');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve withdrawal');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <FaCrown color="#ffd700" /> Admin Panel
      </h1>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('rooms')}
          style={{
            ...styles.tab,
            background: activeTab === 'rooms' ? '#ff4500' : 'rgba(255, 69, 0, 0.2)'
          }}
        >
          Rooms
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            ...styles.tab,
            background: activeTab === 'users' ? '#ff4500' : 'rgba(255, 69, 0, 0.2)'
          }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          style={{
            ...styles.tab,
            background: activeTab === 'withdrawals' ? '#ff4500' : 'rgba(255, 69, 0, 0.2)'
          }}
        >
          Withdrawals
        </button>
      </div>

      {loading ? (
        <div className="spinner" style={{ margin: '50px auto' }}></div>
      ) : (
        <>
          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div>
              {rooms.length === 0 ? (
                <div style={styles.emptyState}>No active rooms</div>
              ) : (
                rooms.map(room => {
                  const statusBadge = getStatusBadge(room.status);
                  return (
                    <div key={room._id} style={styles.card}>
                      <div style={styles.cardHeader}>
                        <span style={styles.roomId}>{room.roomId} - {room.matchType}</span>
                        <span style={{
                          ...styles.badge,
                          background: statusBadge.bg,
                          color: statusBadge.color
                        }}>
                          {statusBadge.text}
                        </span>
                      </div>
                      
                      <div style={styles.players}>
                        <div>
                          <div style={styles.playerName}>{room.creator.freeFireName}</div>
                          <div style={styles.playerDetail}>UID: {room.creator.freeFireUID}</div>
                          {room.results?.creator?.screenshot && (
                            <div style={styles.submitted}>✅ Submitted</div>
                          )}
                        </div>
                        <div style={styles.vs}>VS</div>
                        <div>
                          <div style={styles.playerName}>{room.opponent?.freeFireName || 'Waiting...'}</div>
                          {room.opponent && (
                            <>
                              <div style={styles.playerDetail}>UID: {room.opponent.freeFireUID}</div>
                              {room.results?.opponent?.screenshot && (
                                <div style={styles.submitted}>✅ Submitted</div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div style={styles.actions}>
                        {room.opponent && (
                          <>
                            <button
                              onClick={() => handleDeclareWinner(room._id, room.creator._id)}
                              style={styles.winnerBtn}
                            >
                              {room.creator.freeFireName} Wins
                            </button>
                            <button
                              onClick={() => handleDeclareWinner(room._id, room.opponent._id)}
                              style={styles.winnerBtn}
                            >
                              {room.opponent.freeFireName} Wins
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleExpireRoom(room._id)}
                          style={styles.expireBtn}
                        >
                          Mark Expired
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              {users.map(user => (
                <div key={user._id} style={styles.card}>
                  <div style={styles.userHeader}>
                    <div>
                      <div style={styles.userName}>{user.freeFireName}</div>
                      <div style={styles.userEmail}>{user.email}</div>
                      <div style={styles.userDetail}>UID: {user.freeFireUID}</div>
                    </div>
                    {user.isBanned && (
                      <span style={styles.bannedBadge}>BANNED</span>
                    )}
                  </div>
                  
                  <div style={styles.walletInfo}>
                    <span>Deposit: {formatCurrency(user.wallet.depositBalance)}</span>
                    <span>Winnings: {formatCurrency(user.wallet.winningBalance)}</span>
                  </div>

                  <div style={styles.actions}>
                    {user.isBanned ? (
                      <button
                        onClick={() => handleUnbanUser(user._id)}
                        style={styles.unbanBtn}
                      >
                        <FaCheckCircle /> Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBanUser(user._id)}
                        style={styles.banBtn}
                      >
                        <FaBan /> Ban User
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Withdrawals Tab */}
          {activeTab === 'withdrawals' && (
            <div>
              {withdrawals.length === 0 ? (
                <div style={styles.emptyState}>No pending withdrawals</div>
              ) : (
                withdrawals.map(tx => (
                  <div key={tx._id} style={styles.card}>
                    <div style={styles.withdrawalHeader}>
                      <div>
                        <div style={styles.userName}>{tx.user.freeFireName}</div>
                        <div style={styles.userEmail}>{tx.user.email}</div>
                      </div>
                      <div style={styles.withdrawalAmount}>
                        {formatCurrency(Math.abs(tx.amount))}
                      </div>
                    </div>
                    
                    <div style={styles.withdrawalDate}>
                      Requested: {formatDate(tx.createdAt)}
                    </div>

                    <button
                      onClick={() => handleApproveWithdrawal(tx._id)}
                      style={styles.approveBtn}
                    >
                      <FaCheckCircle /> Approve & Transfer
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
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
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  tab: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  card: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  roomId: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  players: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    gap: '12px'
  },
  playerName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '4px'
  },
  playerDetail: {
    fontSize: '12px',
    color: '#888'
  },
  submitted: {
    fontSize: '11px',
    color: '#00ff00',
    marginTop: '4px'
  },
  vs: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#ff4500'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  winnerBtn: {
    flex: 1,
    padding: '10px',
    background: 'rgba(0, 255, 0, 0.2)',
    border: '1px solid rgba(0, 255, 0, 0.3)',
    borderRadius: '8px',
    color: '#00ff00',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  expireBtn: {
    flex: 1,
    padding: '10px',
    background: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    borderRadius: '8px',
    color: '#ff0000',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  userHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '4px'
  },
  userEmail: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '4px'
  },
  userDetail: {
    fontSize: '12px',
    color: '#666'
  },
  bannedBadge: {
    padding: '4px 12px',
    background: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid #ff0000',
    borderRadius: '12px',
    color: '#ff0000',
    fontSize: '12px',
    fontWeight: '600'
  },
  walletInfo: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#888',
    marginBottom: '12px'
  },
  banBtn: {
    padding: '10px 16px',
    background: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    borderRadius: '8px',
    color: '#ff0000',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  unbanBtn: {
    padding: '10px 16px',
    background: 'rgba(0, 255, 0, 0.2)',
    border: '1px solid rgba(0, 255, 0, 0.3)',
    borderRadius: '8px',
    color: '#00ff00',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  withdrawalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  withdrawalAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00ff00'
  },
  withdrawalDate: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '12px'
  },
  approveBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    border: '1px dashed rgba(255, 255, 255, 0.1)'
  }
};

export default AdminPanel;
