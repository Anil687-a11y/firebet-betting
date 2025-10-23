import axios from 'axios';

const API_BASE = '/api';

// Auth APIs
export const authAPI = {
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  verify: (data) => axios.post(`${API_BASE}/auth/verify`, data),
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
  getMe: () => axios.get(`${API_BASE}/auth/me`)
};

// Room APIs
export const roomAPI = {
  create: (data) => axios.post(`${API_BASE}/rooms/create`, data),
  getAvailable: () => axios.get(`${API_BASE}/rooms/available`),
  getMyRooms: () => axios.get(`${API_BASE}/rooms/my-rooms`),
  join: (roomId) => axios.post(`${API_BASE}/rooms/${roomId}/join`),
  delete: (roomId) => axios.delete(`${API_BASE}/rooms/${roomId}`),
  submitResult: (roomId, formData) => axios.post(`${API_BASE}/rooms/${roomId}/submit-result`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  submitDispute: (roomId, formData) => axios.post(`${API_BASE}/rooms/${roomId}/dispute`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Wallet APIs
export const walletAPI = {
  getBalance: () => axios.get(`${API_BASE}/wallet/balance`),
  deposit: (data) => axios.post(`${API_BASE}/wallet/deposit`, data),
  withdraw: (data) => axios.post(`${API_BASE}/wallet/withdraw`, data),
  getTransactions: () => axios.get(`${API_BASE}/wallet/transactions`)
};

// Admin APIs
export const adminAPI = {
  getRooms: (status) => axios.get(`${API_BASE}/admin/rooms`, { params: { status } }),
  declareWinner: (roomId, data) => axios.post(`${API_BASE}/admin/rooms/${roomId}/declare-winner`, data),
  expireRoom: (roomId) => axios.post(`${API_BASE}/admin/rooms/${roomId}/expire`),
  getUsers: () => axios.get(`${API_BASE}/admin/users`),
  banUser: (userId, data) => axios.post(`${API_BASE}/admin/users/${userId}/ban`, data),
  unbanUser: (userId) => axios.post(`${API_BASE}/admin/users/${userId}/unban`),
  getWithdrawals: () => axios.get(`${API_BASE}/admin/withdrawals`),
  approveWithdrawal: (transactionId) => axios.post(`${API_BASE}/admin/withdrawals/${transactionId}/approve`)
};

export default {
  auth: authAPI,
  room: roomAPI,
  wallet: walletAPI,
  admin: adminAPI
};
