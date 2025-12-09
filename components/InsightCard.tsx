import React from 'react';

interface InsightCardProps {
  title: string;
  content: string;
  icon: string;
  delay?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, content, icon, delay = "0s" }) => {
  return (
    <div 
      className="glass-panel p-6 rounded-3xl h-full flex flex-col transition-transform hover:scale-[1.02] duration-300"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white/10 rounded-full flex items-center justify-center">
          <span className="material-icons-round text-yellow-300">{icon}</span>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">{title}</h3>
      </div>
      <p className="text-lg leading-relaxed font-medium text-white/90">
        {content}
      </p>
    </div>
  );
};