import React from 'react';

/**
 * Premium Medical-Grade Input Component
 * Designed for clinical precision and clarity.
 */
const Input = React.forwardRef(({ label, error, helperText, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm transition-all outline-none
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 group-hover:border-gray-200'}
            placeholder:text-gray-300
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[10px] font-medium text-red-500 ml-1 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[10px] text-gray-400 ml-1 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
