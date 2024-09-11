// Example for Clothes.jsx
import React from 'react';
import Body from '../components/Body';

function Clothes({ category }) {
  const name = "casual"; // or use any relevant name based on your logic

  return (
    <>
      <Body category={category} name={name} />
    </>
  );
}

export default Clothes;
