
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Sidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`relative bg-card border-r border-border transition-all duration-300 ${collapsed ? 'w-12' : 'w-80'}`}>
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute -right-3 top-2 rounded-full border shadow-md z-10 bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </Button>
      
      <div className={`p-4 h-full overflow-y-auto ${collapsed ? 'invisible' : 'visible'}`}>
        {children}
      </div>
    </div>
  );
};
