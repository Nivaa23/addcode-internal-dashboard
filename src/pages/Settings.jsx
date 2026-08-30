import React from 'react';
import Card from '../components/common/Card';

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Design Tokens Display */}
      <Card title="Design System & Core Tokens" subtitle="Inspect the tokens that build Addcode Engineering's branding.">
        <div className="space-y-6 pt-2">
          
          {/* Colors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color Palette</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <div className="space-y-1.5 text-center">
                <div className="h-12 w-full rounded-lg bg-brand-500 border border-brand-600/20" />
                <span className="text-[10px] font-bold text-slate-600">Brand Primary</span>
                <span className="text-[9px] text-slate-400 font-mono block">#6366f1</span>
              </div>
              <div className="space-y-1.5 text-center">
                <div className="h-12 w-full rounded-lg bg-brand-600 border border-brand-700/20" />
                <span className="text-[10px] font-bold text-slate-600">Brand Active</span>
                <span className="text-[9px] text-slate-400 font-mono block">#4f46e5</span>
              </div>
              <div className="space-y-1.5 text-center">
                <div className="h-12 w-full rounded-lg bg-accent-500 border border-accent-600/20" />
                <span className="text-[10px] font-bold text-slate-600">Accent Purple</span>
                <span className="text-[9px] text-slate-400 font-mono block">#a855f7</span>
              </div>
              <div className="space-y-1.5 text-center">
                <div className="h-12 w-full rounded-lg bg-slate-50 border border-slate-200" />
                <span className="text-[10px] font-bold text-slate-600">Canvas Bg</span>
                <span className="text-[9px] text-slate-400 font-mono block">#f8fafc</span>
              </div>
              <div className="space-y-1.5 text-center">
                <div className="h-12 w-full rounded-lg bg-white border border-slate-200" />
                <span className="text-[10px] font-bold text-slate-600">Surface Card</span>
                <span className="text-[9px] text-slate-400 font-mono block">#ffffff</span>
              </div>
              <div className="space-y-1.5 text-center">
                <div className="h-12 w-full rounded-lg bg-slate-800 border border-slate-900" />
                <span className="text-[10px] font-bold text-slate-600">Heading Text</span>
                <span className="text-[9px] text-slate-400 font-mono block">#1e293b</span>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3 border-t border-slate-100 pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typography Hierarchy</h4>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 font-mono">font-display (Outfit)</span>
                <span className="font-display font-extrabold text-lg text-slate-800">Aa Bb Cc - Headings</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 font-mono">font-sans (Plus Jakarta Sans)</span>
                <span className="font-sans font-medium text-sm text-slate-600">Aa Bb Cc - UI and Body copy</span>
              </div>
            </div>
          </div>

          {/* Spacing & Radii */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Border Radii</h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-50 border border-brand-200 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-brand-700">8px</div>
                <div className="h-10 w-10 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-center text-[10px] font-extrabold text-brand-700">12px</div>
                <div className="h-10 w-10 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-center text-[10px] font-extrabold text-brand-700">16px</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Elevations</h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-24 bg-white border border-slate-200/60 rounded-xl shadow-[0_4px_20px_-2px_rgba(99,102,241,0.05)] flex items-center justify-center text-[9px] font-bold text-slate-400">Card Base</div>
                <div className="h-10 w-24 bg-white border border-slate-200/60 rounded-xl shadow-[0_10px_30px_-4px_rgba(99,102,241,0.08)] flex items-center justify-center text-[9px] font-bold text-slate-400">Hover Overlay</div>
              </div>
            </div>
          </div>
          
        </div>
      </Card>

      {/* Platform Information */}
      <Card title="System Specifications" subtitle="Underlying environment settings.">
        <div className="space-y-3 pt-2 text-xs font-semibold text-slate-500">
          <div className="flex justify-between border-b border-slate-50 py-2">
            <span>Framework</span>
            <span className="text-slate-800">React v19.2.8 (Vite Bundler)</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 py-2">
            <span>Styling Core</span>
            <span className="text-slate-800">Tailwind CSS v4.3.3</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 py-2">
            <span>Routing Core</span>
            <span className="text-slate-800">React Router v7.18.3</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Asset Manager</span>
            <span className="text-slate-800">Lucide Icons & Google Fonts Integration</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
