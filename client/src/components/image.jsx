import React from 'react';

const Image = ({ photo , ...rest }) => {
  
  if(photo) 
    return (
      <img src={photo} alt="image" {...rest} />
    );
};

export default Image;


`https://rahul-social-bucket.s3.ap-south-1.amazonaws.com/87446edc4481e54fdee6042c315a70ea_0_pexels-mathew-thomas-906531.jpg`