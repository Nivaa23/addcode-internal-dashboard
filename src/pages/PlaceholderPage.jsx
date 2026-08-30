import React from 'react';
import { Construction, LayoutGrid, Clock, ClipboardList } from 'lucide-react';
import Card from '../components/common/Card';

const PlaceholderPage = ({ title = '', description = '' }) => {
  // Select a contextual decoration icon
  const getIcon = () => {
    const t = title.toLowerCase();
    if (t.includes('task')) return <ClipboardList className="w-8 h-8 text-brand-500" />;
    if (t.includes('project')) return <LayoutGrid className="w-8 h-8 text-pink-500" />;
    if (t.includes('attendance')) return <Clock className="w-8 h-8 text-emerald-500" />;
    return <Construction className="w-8 h-8 text-purple-500" />;
  };

  return (
    <div className="space-y-6">
      <Card className="text-center py-16 bg-white flex flex-col items-center max-w-xl mx-auto mt-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
          {getIcon()}
        </div>
        <h3 className="font-display font-extrabold text-slate-800 text-lg leading-tight">
          {title} Screen
        </h3>
        <p className="text-xs text-slate-400 font-semibold mt-2 max-w-sm">
          {description}
        </p>
        
        {/* Visual progress bar */}
        <div className="w-48 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-6">
          <div className="bg-brand-500 h-full w-2/3 rounded-full animate-pulse" />
        </div>
        
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
          Prototype Phase
        </span>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
