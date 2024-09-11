import React from 'react';
import Body from '../../components/Body';

function Men({ category }) {
  const names = [
    "Mens Casual Premium Slim",
    "Mens Cotton Jacket",
    "Mens Casual Slim Fit",
    
  ];

  return (
    <>
      <Body category={category} names={names} />
    </>
  );
}

export default Men;
