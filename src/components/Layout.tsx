
import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const Layout = ({ children, sidebar }: LayoutProps) => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Sky-Path Navigator</h1>
          <p className="text-sm opacity-90">Optimized Flight Path Calculator for Indian Airports</p>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          {sidebar}
        </Sidebar>
        
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
