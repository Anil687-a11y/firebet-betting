import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaFire, FaSearch } from 'react-icons/fa';
import { roomAPI } from '../utils/api';
import RoomCard from '../components/RoomCard';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getAvailable();
      setRooms(response.data.rooms);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.creator.freeFireName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.matchType === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="spinner" style={{ margin: '50px auto' }}></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FaFire color="#ff4500" /> Available Rooms
        </h1>
        <p style={styles.subtitle}>{rooms.length} rooms waiting for players</p>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by Room ID or Player Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Filter */}
      <div style={styles.filters}>
        {['all', '1v1', '2v2', '3v3', '4v4'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              ...styles.filterBtn,
              background: filterType === type ? '#ff4500' : 'rgba(255, 69, 0, 0.2)',
              border: `1px solid ${filterType === type ? '#ff4500' : 'rgba(255, 69, 0, 0.3)'}`
            }}
          >
            {type === 'all' ? 'All' : type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Rooms List */}
      <div style={styles.roomsList}>
        {filteredRooms.length === 0 ? (
          <div style={styles.emptyState}>
            <FaFire size={50} color="#444" />
            <p style={styles.emptyText}>No rooms available</p>
            <p style={styles.emptySubtext}>
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Be the first to create a room!'}
            </p>
          </div>
        ) : (
          filteredRooms.map(room => (
            <RoomCard key={room._id} room={room} />
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
  searchContainer: {
    position: 'relative',
    marginBottom: '16px'
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#888',
    fontSize: '18px'
  },
  searchInput: {
    width: '100%',
    padding: '14px 14px 14px 48px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px'
  },
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    overflowX: 'auto',
    paddingBottom: '4px'
  },
  filterBtn: {
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  roomsList: {
    marginBottom: '24px'
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

export default Rooms;
