import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div style={{ paddingBottom: '70px', minHeight: '100vh' }}>
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default Layout;
