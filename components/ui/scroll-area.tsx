import React from 'react';

const ScrollArea = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`overflow-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { ScrollArea };
