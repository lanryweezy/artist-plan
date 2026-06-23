import React from 'react';

const Separator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`border-b border-border ${className}`}
      {...props}
    />
  );
};

export { Separator };
