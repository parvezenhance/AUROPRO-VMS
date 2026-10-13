import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  lightMode?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  showTagline = true,
  lightMode = true 
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 34;

  return (
    <div id="auropro-brand-logo" className="flex items-center gap-3 select-none">
      {/* Tri-Color Geometric Emblem (Orange, Blue, Green) */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-blue-600 to-emerald-500 p-0.5 shadow-md shadow-orange-500/10 shrink-0"
        style={{ width: iconSize + 10, height: iconSize + 10 }}
      >
        <div className="w-full h-full bg-[#fafaf8] dark:bg-slate-900 rounded-[10px] flex items-center justify-center relative overflow-hidden transition-colors">
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Shield with interlocking nodes */}
            <path
              d="M20 4L34 11V26L20 36L6 26V11L20 4Z"
              stroke="url(#auropro_grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Vendor-Client Convergence Lines */}
            <path
              d="M12 17L20 22L28 17"
              stroke="#3b82f6"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M20 22V31"
              stroke="#10b981"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Vendor Node (Orange) */}
            <circle cx="12" cy="17" r="2.5" fill="#f97316" />
            {/* Client Node (Blue) */}
            <circle cx="28" cy="17" r="2.5" fill="#3b82f6" />
            {/* Central Governance Hub (Green) */}
            <circle cx="20" cy="22" r="3" fill="#10b981" />
            {/* Super Admin Governance Node */}
            <circle cx="20" cy="9" r="2.2" fill="#ea580c" />

            <defs>
              <linearGradient id="auropro_grad" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f97316" />
                <stop offset="0.5" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className={`font-extrabold tracking-tight font-sans transition-colors ${lightMode ? 'text-slate-900 dark:text-white' : 'text-white'} ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
            Auro<span className="text-orange-600 dark:text-orange-500">Pro</span>
          </span>
        </div>
        {showTagline && (
          <p className="text-[7px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide leading-none mt-0.5 transition-colors truncate max-w-[170px] sm:max-w-none">
            Designed for Vendors &amp; Clients
          </p>
        )}
      </div>
    </div>
  );
};
