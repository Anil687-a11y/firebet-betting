import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaWallet, FaPlus, FaMinus, FaHistory } from 'react-icons/fa';
import { walletAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getTransactions()
      ]);
      setWallet(walletRes.data);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    const amount = Number(depositAmount);
    if (amount <= 0) {
      toast.error('Invalid amount');
      return;
    }

    try {
      // Manual payment - Admin will verify
      await walletAPI.deposit({ amount, transactionId: 'MANUAL_' + Date.now() });
      toast.success('Deposit request submitted! Admin will verify and add balance.');
      setShowDeposit(false);
      setDepositAmount('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    const amount = Number(withdrawAmount);
    if (amount < 150) {
      toast.error('Minimum withdrawal is ₹150');
      return;
    }

    if (amount > wallet.wallet.winningBalance) {
      toast.error('Insufficient winning balance');
      return;
    }

    try {
      await walletAPI.withdraw({ amount });
      toast.success('Withdrawal request submitted!');
      setShowWithdraw(false);
      setWithdrawAmount('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Withdrawal failed');
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '50px auto' }}></div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <FaWallet color="#ffd700" /> My Wallet
      </h1>

      {/* Balance Card */}
      <div style={styles.balanceCard}>
        <div style={styles.balanceHeader}>
          <span style={styles.balanceLabel}>Total Balance</span>
          <span style={styles.totalBalance}>
            {formatCurrency(wallet.totalBalance)}
          </span>
        </div>
        <div style={styles.balanceBreakdown}>
          <div style={styles.balanceItem}>
            <span style={styles.itemLabel}>Deposit Balance</span>
            <span style={styles.itemValue}>
              {formatCurrency(wallet.wallet.depositBalance)}
            </span>
          </div>
          <div style={styles.balanceItem}>
            <span style={styles.itemLabel}>Winning Balance</span>
            <span style={{...styles.itemValue, color: '#00ff00'}}>
              {formatCurrency(wallet.wallet.winningBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={() => setShowDeposit(true)} style={styles.depositBtn}>
          <FaPlus /> Deposit
        </button>
        <button onClick={() => setShowWithdraw(true)} style={styles.withdrawBtn}>
          <FaMinus /> Withdraw
        </button>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Deposit Money</h3>
            <form onSubmit={handleDeposit}>
              <input
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                min="1"
                style={styles.input}
              />
              <p style={styles.note}>
                💡 Send money to admin's eSewa/bank, then submit request here. Admin will verify and add balance.
              </p>
              <p style={styles.note}>
                📱 Contact admin for payment details
              </p>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowDeposit(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.confirmBtn}>
                  Submit Deposit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Withdraw Winnings</h3>
            <form onSubmit={handleWithdraw}>
              <div style={styles.availableBalance}>
                Available: {formatCurrency(wallet.wallet.winningBalance)}
              </div>
              <input
                type="number"
                placeholder="Enter amount (min ₹150)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
                min="150"
                max={wallet.wallet.winningBalance}
                style={styles.input}
              />
              <p style={styles.note}>
                ⚠️ Only winning balance can be withdrawn. Admin will process within 24 hours.
              </p>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowWithdraw(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.confirmBtn}>
                  Request Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div style={styles.historySection}>
        <h2 style={styles.historyTitle}>
          <FaHistory /> Transaction History
        </h2>
        {transactions.length === 0 ? (
          <div style={styles.emptyState}>No transactions yet</div>
        ) : (
          transactions.map(tx => (
            <div key={tx._id} style={styles.transaction}>
              <div>
                <div style={styles.txType}>{tx.description}</div>
                <div style={styles.txDate}>{formatDate(tx.createdAt)}</div>
              </div>
              <div style={{
                ...styles.txAmount,
                color: tx.amount >= 0 ? '#00ff00' : '#ff0000'
              }}>
                {tx.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
              </div>
            </div>
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
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 215, 0, 0.3)'
  },
  balanceHeader: {
    marginBottom: '20px'
  },
  balanceLabel: {
    fontSize: '14px',
    color: '#888',
    display: 'block',
    marginBottom: '8px'
  },
  totalBalance: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ffd700'
  },
  balanceBreakdown: {
    display: 'flex',
    gap: '12px'
  },
  balanceItem: {
    flex: 1,
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '16px',
    borderRadius: '12px'
  },
  itemLabel: {
    fontSize: '12px',
    color: '#888',
    display: 'block',
    marginBottom: '8px'
  },
  itemValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px'
  },
  depositBtn: {
    flex: 1,
    padding: '16px',
    background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  withdrawBtn: {
    flex: 1,
    padding: '16px',
    background: 'linear-gradient(135deg, #ff4500 0%, #ff6a33 100%)',
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(255, 69, 0, 0.3)'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '14px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    marginBottom: '12px'
  },
  availableBalance: {
    fontSize: '14px',
    color: '#00ff00',
    marginBottom: '12px',
    fontWeight: '600'
  },
  note: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  modalActions: {
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
  confirmBtn: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #ff4500 0%, #ff6a33 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  historySection: {
    marginBottom: '24px'
  },
  historyTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  transaction: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  txType: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '4px'
  },
  txDate: {
    fontSize: '12px',
    color: '#888'
  },
  txAmount: {
    fontSize: '16px',
    fontWeight: 'bold'
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

export default Wallet;
