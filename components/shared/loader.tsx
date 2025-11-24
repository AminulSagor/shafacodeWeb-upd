'use client';
import React from 'react';
import { Audio } from 'react-loader-spinner';

const SpinningLoader = () => {
  return (
    <Audio
      height={80}
      width={80}
      color="green"
      ariaLabel="audio-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default SpinningLoader;
