import React, { useState, useEffect } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; // Already installed
    }

    // Listen for install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show prompt after 3 seconds if not triggered
    const timer = setTimeout(() => {
      if (!deferredPrompt) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } else {
      // Show manual instructions
      alert(
        'To install FireBet:\n\n' +
        'Android: Menu (⋮) → Add to Home screen\n' +
        'iPhone: Share (⬆) → Add to Home Screen\n' +
        'Desktop: Address bar → Install icon'
      );
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    // Show again after 1 hour
    localStorage.setItem('installPromptClosed', Date.now());
  };

  // Don't show if closed recently (1 hour)
  const lastClosed = localStorage.getItem('installPromptClosed');
  if (lastClosed && Date.now() - lastClosed < 60 * 60 * 1000) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.bannerContent}>
        <FaDownload size={20} color="#ff4500" />
        <span style={styles.bannerText}>
          📱 Install FireBet app for better experience!
        </span>
      </div>
      <div style={styles.bannerActions}>
        <button onClick={handleInstall} style={styles.installBtn}>
          Install
        </button>
        <button onClick={handleClose} style={styles.closeBtn}>
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(135deg, #ff4500 0%, #ff6a33 100%)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    zIndex: 9999,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    animation: 'slideDown 0.5s ease-out'
  },
  bannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1
  },
  bannerText: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.3'
  },
  bannerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  installBtn: {
    padding: '8px 16px',
    background: '#fff',
    border: 'none',
    borderRadius: '20px',
    color: '#ff4500',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    cursor: 'pointer',
    padding: 0
  }
};

export default InstallPrompt;
