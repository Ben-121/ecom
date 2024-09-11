import React from 'react';
import Body from '../../components/Body';

function Casual({ category }) {
  const names = [
    "Mens Casual Premium Slim",
    "Mens Cotton Jacket",
    "Mens Casual Slim Fit",
    "Lock and Love Women",
    "Women's 3",
    "Rain Jacket Women",
    "MBJ Women Solid",
    "Opna Women's Short Sleeve",
    "Womens T Shirt"
  ];

  return (
    <>
      <Body category={category} names={names} />
    </>
  );
}

export default Casual;
