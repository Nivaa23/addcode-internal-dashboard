import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, GitPullRequest, Terminal } from 'lucide-react';
import { useEmployees, accentPalettes } from '../../context/EmployeeContext';
import logoImg from '../../assets/addcode-logo.png';

export default function AuthBrandSide() {
  const { accentTheme } = useEmployees();
  const currentPalette = accentPalettes[accentTheme] || accentPalettes.blue;

  return (
<div className="relative w-full h-full min-h-137.5 lg:min-h-screen bg-slate-950 text-white flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden select-none font-sans">
      {/* Dynamic Ambient Theme Glows */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentPalette.hex }}
      />
      <div
        className="absolute bottom-0 right-0 w-36 h-36 rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentPalette.hex }}
      />

      {/* Subtle Engineering Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Logo container with glass treatment */}
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-2 flex items-center justify-center shadow-lg shadow-black/20">
            <img
              src={logoImg}
              alt="Addcode Engineering Official Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl font-black tracking-tight text-white font-sans">
                Addcode
              </span>
              <span 
                className="text-xl font-black tracking-tight font-sans transition-colors duration-300"
                style={{ color: currentPalette.hex }}
              >
                Engineering
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
              Internal Operations Hub
            </span>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: currentPalette.hex }}
            />
            <span 
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: currentPalette.hex }}
            />
          </span>
          <span className="text-[11px] font-medium text-slate-300">All Systems Operational</span>
        </div>
      </div>

      {/* Center Main Message & Visual Treatment */}
      <div className="relative z-10 my-auto py-10 lg:py-14 text-left max-w-xl">
        {/* Category Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-5 border backdrop-blur-md"
          style={{
            borderColor: `${currentPalette.hex}40`,
            backgroundColor: `${currentPalette.hex}15`,
            color: currentPalette[200] || '#93c5fd'
          }}
        >
          <Cpu className="w-3.5 h-3.5" style={{ color: currentPalette.hex }} />
          <span>Operations & Telemetry Platform</span>
        </motion.div>

        {/* Primary Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white"
        >
          Unified workspace for high-velocity engineering.
        </motion.h1>

        {/* Supporting Message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed font-normal"
        >
          Streamline daily standups, track sprint deliverables, manage corporate attendance, and collaborate seamlessly within the Addcode Engineering ecosystem.
        </motion.p>

        {/* Interactive Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8"
        >
          {/* Card 1: Enterprise SSO */}
          <div className="p-3.5 rounded-xl bg-white/4 hover:bg-white/[0.07] border border-white/10 backdrop-blur-md transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${currentPalette.hex}25` }}
              >
                <ShieldCheck className="w-4 h-4" style={{ color: currentPalette.hex }} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-slate-100">
                  Microsoft SSO
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Zero-trust identity verification
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Operations & Sprint Telemetry */}
          <div className="p-3.5 rounded-xl bg-white/4 hover:bg-white/7 border border-white/10 backdrop-blur-md transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${currentPalette.hex}25` }}
              >
                <GitPullRequest className="w-4 h-4" style={{ color: currentPalette.hex }} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-slate-100">
                  Sprint Telemetry
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Live team metrics & tasks
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding Info */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span>v2.4.0 • Enterprise Cluster</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Restricted to Authorized Addcode Personnel</span>
        </div>
      </div>
    </div>
  );
}
