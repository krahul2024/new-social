import React from 'react';

const Image = ({ photo , ...rest }) => {
  
  if(photo) 
    return (
      <img src={photo} alt="image" {...rest} />
    );
};

export default Image;
