import React from 'react';
import Body from '../../components/Body';

function Jewellery({ category }) {
  const names = [
    "John Hardy Women's",
    "Solid Gold Petite Micropave",
    "Pierced Owl Rose Gold",
    "White Gold Plated Princess"
  ];

  return (
    <>
      <Body category={category} names={names} />
    </>
  );
}

export default Jewellery;
