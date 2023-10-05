import React from 'react';

const Image = ({ photo , ...rest }) => {
  const local = 'http://localhost:4000/uploads'; 
  // console.log({photo})

  function getName(photo){
    return `${local}/${photo?.pad}${photo?.original}`
  }

  // console.log({path:getName(photo)})

  
if(photo) 
  return (
    <img src={getName(photo)} alt="image" {...rest} />
  );
};

export default Image;
