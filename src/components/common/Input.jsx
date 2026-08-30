import React from 'react';

const Input = ({
  label = '',
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  error = '',
  helperText = '',
  leftIcon = null,
  options = [], // for type="select"
  rows = 3, // for type="textarea"
  className = '',
  disabled = false,
  required = false,
  ...props
}) => {
  const inputBaseStyles = `
    w-full 
    bg-white 
    text-sm 
    text-slate-800 
    border 
    rounded-lg 
    transition-all 
    duration-200 
    placeholder:text-slate-400
    disabled:bg-slate-50 
    disabled:text-slate-400 
    disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none'}
  `;

  const paddingStyles = leftIcon ? 'pl-10 pr-4 py-2' : 'px-4 py-2';

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputBaseStyles} ${paddingStyles} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[size:1.25rem] bg-[position:right_0.75rem_center] bg-no-repeat`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={rows}
            placeholder={placeholder}
            className={`${inputBaseStyles} px-4 py-2 resize-none`}
            {...props}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`${inputBaseStyles} ${paddingStyles}`}
            {...props}
          />
        )}
      </div>

      {error ? (
        <span className="text-[11px] text-red-500 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-slate-400">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Input;
