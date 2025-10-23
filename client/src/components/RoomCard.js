import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCoins, FaGamepad } from 'react-icons/fa';
import { formatCurrency, getStatusBadge } from '../utils/helpers';
import CountdownTimer from './CountdownTimer';

const RoomCard = ({ room, showActions = false, onDelete }) => {
  const navigate = useNavigate();
  const statusBadge = getStatusBadge(room.status);

  const handleClick = () => {
    navigate(`/rooms/${room._id}`);
  };

  const totalPool = room.stakeAmount * 2;
  const adminCut = totalPool * 0.20;
  const winnerAmount = totalPool - adminCut;

  return (
    <div className="card slide-in" style={styles.card} onClick={handleClick}>
      <div style={styles.header}>
        <div style={styles.matchType}>
          <FaGamepad size={18} color="#ff4500" />
          <span style={styles.matchTypeText}>{room.matchType}</span>
        </div>
        <div style={{
          ...styles.statusBadge,
          background: statusBadge.bg,
          color: statusBadge.color
        }}>
          {statusBadge.text}
        </div>
      </div>

      <div style={styles.roomInfo}>
        <div style={styles.infoRow}>
          <span style={styles.label}>Room ID:</span>
          <span style={styles.value}>{room.roomId}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Password:</span>
          <span style={styles.value}>••••••</span>
        </div>
      </div>

      <div style={styles.players}>
        <div style={styles.player}>
          <FaUsers size={14} color="#ff4500" />
          <div>
            <div style={styles.playerName}>{room.creator.freeFireName}</div>
            <div style={styles.playerUID}>UID: {room.creator.freeFireUID}</div>
          </div>
        </div>
        {room.opponent && (
          <>
            <div style={styles.vs}>VS</div>
            <div style={styles.player}>
              <FaUsers size={14} color="#00ff00" />
              <div>
                <div style={styles.playerName}>{room.opponent.freeFireName}</div>
                <div style={styles.playerUID}>UID: {room.opponent.freeFireUID}</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={styles.stakes}>
        <div style={styles.stakeItem}>
          <FaCoins size={16} color="#ffd700" />
          <div>
            <div style={styles.stakeLabel}>Entry Fee</div>
            <div style={styles.stakeValue}>{formatCurrency(room.stakeAmount)}</div>
          </div>
        </div>
        <div style={styles.stakeItem}>
          <FaCoins size={16} color="#ff4500" />
          <div>
            <div style={styles.stakeLabel}>Winner Gets</div>
            <div style={styles.stakeValue}>{formatCurrency(winnerAmount)}</div>
          </div>
        </div>
      </div>

      {room.status === 'active' && (
        <div style={styles.timer}>
          <CountdownTimer deadline={room.deadline} />
        </div>
      )}

      {showActions && room.status === 'waiting' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(room._id);
          }}
          style={styles.deleteBtn}
        >
          Cancel Room
        </button>
      )}
    </div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 69, 0, 0.3)',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  matchType: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  matchTypeText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  roomInfo: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '16px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
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
  players: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    gap: '12px'
  },
  player: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1
  },
  playerName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff'
  },
  playerUID: {
    fontSize: '11px',
    color: '#888'
  },
  vs: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#ff4500',
    padding: '4px 8px',
    background: 'rgba(255, 69, 0, 0.2)',
    borderRadius: '8px'
  },
  stakes: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  stakeItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '12px',
    borderRadius: '12px'
  },
  stakeLabel: {
    fontSize: '11px',
    color: '#888'
  },
  stakeValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff'
  },
  timer: {
    display: 'flex',
    justifyContent: 'center'
  },
  deleteBtn: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid #ff0000',
    borderRadius: '12px',
    color: '#ff0000',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px'
  }
};

export default RoomCard;
