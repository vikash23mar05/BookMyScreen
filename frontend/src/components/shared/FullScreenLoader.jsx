import React from 'react';
import Loader from './Loader';

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-background/80">
      <div className="flex flex-col items-center gap-6">
        <Loader size="large" />
        <p className="text-lg font-bold text-primary-container animate-pulse tracking-wide">
          Warming up the projector...
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
