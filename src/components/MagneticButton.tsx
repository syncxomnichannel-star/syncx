import React, { useRef, useState } from 'react';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  maxOffset?: number;
}

/**
 * MagneticButton creates an Apple-grade tactile cursor magnet effect.
 * The button smoothly pulls toward the cursor within a bounded radius on hover,
 * and snaps back gently on mouse leave.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.22,
  maxOffset = 6,
  className = '',
  style,
  disabled,
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullX = (e.clientX - centerX) * strength;
    const pullY = (e.clientY - centerY) * strength;

    // Constrain maximum displacement for clean, restrained Apple-style feedback
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, pullX));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, pullY));

    setOffset({ x: clampedX, y: clampedY });
    setIsHovered(true);

    if (onMouseMove) onMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        willChange: 'transform'
      }}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
