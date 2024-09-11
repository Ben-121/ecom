import React from 'react';
import Body from '../../components/Body';

function Bags({ category }) {
  const names = [
    "Backpack",
    
  ];

  return (
    <>
      <Body category={category} names={names} />
    </>
  );
}

export default Bags;
