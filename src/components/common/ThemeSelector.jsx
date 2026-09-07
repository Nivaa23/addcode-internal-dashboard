import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useEmployees, accentPalettes } from '../../context/EmployeeContext';

export default function ThemeSelector({ 
  variant = 'default', // 'default' | 'pill' | 'header'
  align = 'right',    // 'left' | 'right'
  className = ''
}) {
  const { accentTheme, setAccentTheme } = useEmployees();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPalette = accentPalettes[accentTheme] || accentPalettes.blue;

  return (
    <div className={`relative inline-block text-left font-sans ${className}`} ref={containerRef}>
      {/* Trigger Button based on variant */}
      {variant === 'pill' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 border cursor-pointer select-none shadow-xs ${
            isOpen
              ? 'bg-white/95 border-slate-300 text-slate-900 shadow-md ring-2 ring-slate-200/80'
              : 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm'
          }`}
          aria-expanded={isOpen}
          title="Change Theme Color"
        >
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-black/15 shrink-0 transition-transform duration-200"
            style={{ backgroundColor: currentPalette.hex }}
          />
          <span className="text-[11px] font-medium tracking-wide text-slate-600">Theme</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-600' : ''}`} />
        </button>
      ) : variant === 'header' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
            isOpen
              ? 'bg-slate-100 border-slate-300 text-slate-900'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
          }`}
          aria-expanded={isOpen}
          title="Custom Accent Color"
        >
          <Palette className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            isOpen
              ? 'bg-slate-100 border-slate-300 text-slate-900'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          aria-expanded={isOpen}
          title="Custom Accent Color"
        >
          <span
            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: currentPalette.hex }}
          />
          <span className="hidden sm:inline">{currentPalette.name}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-60 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl py-2.5 px-3 z-50 text-left space-y-2 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Accent Theme</h4>
              <p className="text-[10px] text-slate-500">Instant UI highlights & accents</p>
            </div>
            <div
              className="w-3 h-3 rounded-full ring-2 ring-white shadow-xs"
              style={{ backgroundColor: currentPalette.hex }}
            />
          </div>

          <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto pr-0.5">
            {Object.entries(accentPalettes).map(([key, item]) => {
              const isSelected = accentTheme === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setAccentTheme(key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-100 font-semibold text-slate-900 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs transition-transform group-hover:scale-110"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
