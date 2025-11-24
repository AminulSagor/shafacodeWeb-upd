import SpinningLoader from '@/components/shared/loader';
import React from 'react';

const loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <SpinningLoader />
    </div>
  );
};

export default loading;
