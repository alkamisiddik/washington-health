import React, { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children, actions }) => {
  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">{title}</h1>
        {actions && (
          <div className="flex space-x-2">
            {actions}
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;