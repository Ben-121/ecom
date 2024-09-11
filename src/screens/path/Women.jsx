import React from 'react';
import Body from '../../components/Body';

function Women({ category }) {
  const names = [
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

export default Women;
