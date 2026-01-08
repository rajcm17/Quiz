import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow overflow-hidden sm:rounded-lg ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-5 sm:px-6 ${className}`}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-4 sm:px-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };