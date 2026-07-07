import React from 'react';

const Loader = ({ size = 'medium', className = '' }) => {
  let fontSize = '14px';
  if (typeof size === 'number') {
    fontSize = `${size}px`;
  } else {
    switch (size) {
      case 'small':
        fontSize = '10px';
        break;
      case 'large':
        fontSize = '20px';
        break;
      case 'medium':
      default:
        fontSize = '14px';
        break;
    }
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        aria-label="Orange and tan hamster running in a metal wheel" 
        role="img" 
        className="wheel-and-hamster"
        style={{ fontSize }}
      >
        <div className="wheel" />
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear" />
              <div className="hamster__eye" />
              <div className="hamster__nose" />
            </div>
            <div className="hamster__limb hamster__limb--fr" />
            <div className="hamster__limb hamster__limb--fl" />
            <div className="hamster__limb hamster__limb--br" />
            <div className="hamster__limb hamster__limb--bl" />
            <div className="hamster__tail" />
          </div>
        </div>
        <div className="spoke" />
      </div>
    </div>
  );
};

export default Loader;
