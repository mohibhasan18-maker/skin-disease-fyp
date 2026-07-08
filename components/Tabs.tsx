'use client';

import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  children: React.ReactNode;
}

export function Tabs({ tabs, activeTab, onChange, children }: TabsProps) {
  return (
    <div className="w-full">
      {/* Tab List */}
      <div
        role="tablist"
        className="flex gap-2 bg-surface-low p-1.5 rounded-2xl overflow-x-auto border border-foreground/5 scrollbar-hide"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`py-2.5 px-6 font-semibold rounded-xl transition-all duration-300 whitespace-nowrap text-sm focus:outline-none ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-100'
                : 'text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div role="tabpanel" id={`panel-${activeTab}`} className="py-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
      </div>
    </div>
  );
}
