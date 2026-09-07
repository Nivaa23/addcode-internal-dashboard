import React from 'react';

export default function OutlookIcon({ className = 'w-5 h-5', ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Microsoft Outlook 365 SVG Icon */}
      <rect x="2" y="4" width="20" height="16" rx="2.5" fill="#0078D4" />
      {/* Envelope flap folds */}
      <path
        d="M2.5 5.5L12 12.5L21.5 5.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* Front envelope bevel */}
      <path
        d="M2.5 18.5L8.5 12.5M21.5 18.5L15.5 12.5"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Floating 3D 'O' badge */}
      <rect
        x="1.5"
        y="6.5"
        width="11"
        height="11"
        rx="2.5"
        fill="#002446"
        stroke="#0078D4"
        strokeWidth="0.8"
      />
      {/* Letter 'O' inner cutout */}
      <ellipse
        cx="7"
        cy="12"
        rx="2.8"
        ry="3.4"
        stroke="white"
        strokeWidth="1.6"
      />
    </svg>
  );
}
