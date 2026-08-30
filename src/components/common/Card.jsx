import React from 'react';

const Card = ({
  children,
  title = '',
  subtitle = '',
  headerAction = null,
  footer = null,
  hoverable = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white 
        border border-slate-200/60 
        rounded-2xl 
        shadow-[0_4px_20px_-2px_rgba(99,102,241,0.05)]
        ${hoverable ? 'hover:shadow-[0_10px_30px_-4px_rgba(99,102,241,0.08)] hover:border-slate-200 transition-all duration-300' : ''} 
        ${className}
      `}
      {...props}
    >
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="font-display font-semibold text-slate-800 text-base tracking-tight leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={paddings[padding]}>
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
