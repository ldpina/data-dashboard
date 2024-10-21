import React from 'react'
import './css/Card.css';

const Card = (props) => {
  return (
    <div className='Card'>
      <h1 className="number">{props.title}</h1>
      <h2>{props.subTitle}</h2>
    </div>
  );
}

export default Card;