import React from 'react';
import Body from '../../components/Body';

function Monitors({ category }) {
  const names = [
    "Acer SB220Q bi 21.5 inches",
    "Samsung 49-inch CHG90"
  ];

  return (
    <>
      <Body category={category} names={names} />
    </>
  );
}

export default Monitors;
