import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUpload, FaExclamationTriangle } from 'react-icons/fa';
import { roomAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getStatusBadge } from '../utils/helpers';
import CountdownTimer from '../components/CountdownTimer';

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenshot, setScreenshot] = useState(null);
  const [disputeProof, setDisputeProof] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [showDispute, setShowDispute] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const response = await roomAPI.getMyRooms();
      const foundRoom = response.data.rooms.find(r => r._id === roomId);
      if (foundRoom) {
        setRoom(foundRoom);
      } else {
        toast.error('Room not found');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to load room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!window.confirm(`Join this room for ${formatCurrency(room.stakeAmount)}?`)) return;

    try {
      await roomAPI.join(roomId);
      toast.success('Joined room successfully!');
      fetchRoom();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to join room');
    }
  };

  const handleSubmitResult = async (e) => {
    e.preventDefault();
    
    if (!screenshot) {
      toast.error('Please select a screenshot');
      return;
    }

    const formData = new FormData();
    formData.append('screenshot', screenshot);

    try {
      await roomAPI.submitResult(roomId, formData);
      toast.success('Result submitted successfully!');
      fetchRoom();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit result');
    }
  };

  const handleSubmitDispute = async (e) => {
    e.preventDefault();

    if (!disputeReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    const formData = new FormData();
    formData.append('reason', disputeReason);
    if (disputeProof) {
      formData.append('proof', disputeProof);
    }

    try {
      await roomAPI.submitDispute(roomId, formData);
      toast.success('Dispute submitted successfully!');
      setShowDispute(false);
      fetchRoom();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit dispute');
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '50px auto' }}></div>;
  }

  if (!room) return null;

  const statusBadge = getStatusBadge(room.status);
  const isCreator = room.creator._id === user.id;
  const isOpponent = room.opponent?._id === user.id;
  const canSubmitResult = room.status === 'active' && (isCreator || isOpponent);
  const hasSubmitted = isCreator ? room.results?.creator?.screenshot : room.results?.opponent?.screenshot;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <FaArrowLeft />
        </button>
        <h1 style={styles.title}>Room Details</h1>
      </div>

      {/* Status Badge */}
      <div style={{
        ...styles.statusBadge,
        background: statusBadge.bg,
        color: statusBadge.color
      }}>
        {statusBadge.text}
      </div>

      {/* Room Info */}
      <div style={styles.card}>
        <div style={styles.infoRow}>
          <span style={styles.label}>Match Type</span>
          <span style={styles.value}>{room.matchType.toUpperCase()}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Room ID</span>
          <span style={styles.value}>{room.roomId}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Password</span>
          <span style={styles.value}>{room.password}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Entry Fee</span>
          <span style={styles.value}>{formatCurrency(room.stakeAmount)}</span>
        </div>
      </div>

      {/* Players */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Players</h3>
        <div style={styles.player}>
          <div>
            <div style={styles.playerName}>{room.creator.freeFireName}</div>
            <div style={styles.playerUID}>UID: {room.creator.freeFireUID}</div>
          </div>
          {isCreator && <span style={styles.youBadge}>You</span>}
        </div>
        {room.opponent ? (
          <div style={styles.player}>
            <div>
              <div style={styles.playerName}>{room.opponent.freeFireName}</div>
              <div style={styles.playerUID}>UID: {room.opponent.freeFireUID}</div>
            </div>
            {isOpponent && <span style={styles.youBadge}>You</span>}
          </div>
        ) : (
          <div style={styles.waiting}>Waiting for opponent...</div>
        )}
      </div>

      {/* Timer */}
      {room.status === 'active' && (
        <div style={styles.timerCard}>
          <span style={styles.timerLabel}>Time Remaining</span>
          <CountdownTimer deadline={room.deadline} onExpire={fetchRoom} />
        </div>
      )}

      {/* Join Button */}
      {room.status === 'waiting' && !isCreator && (
        <button onClick={handleJoinRoom} style={styles.joinBtn}>
          Join Room - {formatCurrency(room.stakeAmount)}
        </button>
      )}

      {/* Submit Result */}
      {canSubmitResult && !hasSubmitted && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <FaUpload /> Submit Match Result
          </h3>
          <form onSubmit={handleSubmitResult}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0])}
              style={styles.fileInput}
            />
            {screenshot && (
              <div style={styles.fileName}>{screenshot.name}</div>
            )}
            <button type="submit" style={styles.submitBtn}>
              Submit Screenshot
            </button>
          </form>
        </div>
      )}

      {hasSubmitted && (
        <div style={styles.successCard}>
          ✅ You have submitted your result. Waiting for admin verification.
        </div>
      )}

      {/* Dispute */}
      {canSubmitResult && !showDispute && room.status !== 'disputed' && (
        <button
          onClick={() => setShowDispute(true)}
          style={styles.disputeBtn}
        >
          <FaExclamationTriangle /> Report Cheating
        </button>
      )}

      {showDispute && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <FaExclamationTriangle color="#ff0000" /> Report Dispute
          </h3>
          <form onSubmit={handleSubmitDispute}>
            <textarea
              placeholder="Describe the issue (e.g., opponent used hacks)"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              required
              style={styles.textarea}
            />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setDisputeProof(e.target.files[0])}
              style={styles.fileInput}
            />
            {disputeProof && (
              <div style={styles.fileName}>{disputeProof.name}</div>
            )}
            <div style={styles.disputeActions}>
              <button type="button" onClick={() => setShowDispute(false)} style={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" style={styles.submitDisputeBtn}>
                Submit Dispute
              </button>
            </div>
          </form>
        </div>
      )}

      {room.status === 'disputed' && (
        <div style={styles.disputedCard}>
          ⚠️ This room is under dispute. Admin will review and decide.
        </div>
      )}
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
  statusBadge: {
    padding: '12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '20px'
  },
  card: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  label: {
    color: '#888',
    fontSize: '14px'
  },
  value: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600'
  },
  player: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255, 69, 0, 0.1)',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  playerName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff'
  },
  playerUID: {
    fontSize: '12px',
    color: '#888'
  },
  youBadge: {
    background: '#ff4500',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  waiting: {
    padding: '20px',
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic'
  },
  timerCard: {
    background: 'rgba(255, 69, 0, 0.1)',
    border: '1px solid rgba(255, 69, 0, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  timerLabel: {
    fontSize: '14px',
    color: '#888'
  },
  joinBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  fileInput: {
    width: '100%',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    marginBottom: '12px'
  },
  fileName: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '12px'
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #ff4500 0%, #ff6a33 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  successCard: {
    background: 'rgba(0, 255, 0, 0.1)',
    border: '1px solid rgba(0, 255, 0, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    color: '#00ff00',
    textAlign: 'center',
    marginBottom: '16px'
  },
  disputeBtn: {
    width: '100%',
    padding: '14px',
    background: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    borderRadius: '12px',
    color: '#ff0000',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    minHeight: '100px',
    marginBottom: '12px',
    resize: 'vertical'
  },
  disputeActions: {
    display: 'flex',
    gap: '12px'
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    background: 'rgba(128, 128, 128, 0.2)',
    border: '1px solid rgba(128, 128, 128, 0.3)',
    borderRadius: '12px',
    color: '#888',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitDisputeBtn: {
    flex: 1,
    padding: '14px',
    background: 'rgba(255, 0, 0, 0.3)',
    border: '1px solid rgba(255, 0, 0, 0.5)',
    borderRadius: '12px',
    color: '#ff0000',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  disputedCard: {
    background: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    color: '#ffa500',
    textAlign: 'center'
  }
};

export default RoomDetail;
