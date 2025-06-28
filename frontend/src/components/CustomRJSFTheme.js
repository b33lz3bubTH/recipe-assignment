import React from 'react';
import './CustomRJSFTheme.css';

// Simple wrapper component that applies custom styling
const CustomRJSFTheme = ({ children, ...props }) => {
  return (
    <div className="custom-rjsf-theme" {...props}>
      {children}
    </div>
  );
};

export default CustomRJSFTheme; 