import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
const HeaderLayout = ({ onCategoryChange, setSearchQuery }) => {
  return (
    <>
      <Header 
        onCategoryChange={onCategoryChange} 
        setSearchQuery={setSearchQuery} 
      />
      <Outlet />
      <Footer />
    </>
  );
};

const LoginsignupLayout = () => {
  return <Outlet />;
};

export { HeaderLayout, LoginsignupLayout };
