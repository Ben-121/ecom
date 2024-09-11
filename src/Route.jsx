import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

const HeaderLayout = ({ onCategoryChange, setSearchQuery }) => {
  return (
    <>
      <Header 
        onCategoryChange={onCategoryChange} 
        setSearchQuery={setSearchQuery} 
      />
      <Outlet />
    </>
  );
};

const LoginsignupLayout = () => {
  return <Outlet />;
};

export { HeaderLayout, LoginsignupLayout };
