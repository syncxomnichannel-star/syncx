import React from 'react';

interface SyncIdLogoProps {
  className?: string;
  size?: number;
}

/**
 * SyncID Logo: Simple, modern, and iconic.
 * - Circular sync arcs with directional flow (Omnichannel synchronization)
 * - Central focal node (Verified Customer Identity)
 */
export const SyncIdLogo: React.FC<SyncIdLogoProps> = ({
  className = 'w-5 h-5',
  size
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
    >
      {/* Top Sync Arc & Arrow */}
      <path
        d="M3 12a9 9 0 0 1 15-6.7L21 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="21 3 21 8 16 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Sync Arc & Arrow */}
      <path
        d="M21 12a9 9 0 0 1-15 6.7L3 16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="3 21 3 16 8 16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Identity Node */}
      <circle
        cx="12"
        cy="12"
        r="2.2"
        fill="currentColor"
      />
    </svg>
  );
};
