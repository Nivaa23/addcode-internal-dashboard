import React from 'react';

const Badge = ({
  children,
  type = 'default', // success, warning, danger, info, neutral, accent
  className = '',
  status = null, // shorthand helper: Active, On Leave, Onboarding, Pending, Approved, Rejected etc.
}) => {
  // Map shorthand statuses to types
  let resolvedType = type;
  if (status) {
    const s = status.toLowerCase();
    if (s === 'active' || s === 'approved' || s === 'signed' || s === 'success') {
      resolvedType = 'success';
    } else if (s === 'onboarding' || s === 'pending' || s === 'warning') {
      resolvedType = 'warning';
    } else if (s === 'on leave' || s === 'rejected' || s === 'danger' || s === 'suspended') {
      resolvedType = 'danger';
    } else if (s === 'remote' || s === 'info') {
      resolvedType = 'info';
    } else if (s === 'accent' || s === 'completed') {
      resolvedType = 'accent';
    } else {
      resolvedType = 'neutral';
    }
  }

  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';

  const types = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/50',
    danger: 'bg-red-50 text-red-700 border-red-200/50',
    info: 'bg-sky-50 text-sky-700 border-sky-200/50',
    accent: 'bg-brand-50 text-brand-700 border-brand-200/50',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200/50',
  };

  return (
    <span className={`${baseStyles} ${types[resolvedType]} ${className}`}>
      {children || status}
    </span>
  );
};

export default Badge;
