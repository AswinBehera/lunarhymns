/**
 * CollapsiblePanel Component
 *
 * A reusable collapsible panel that can be positioned on any side of the screen.
 * Features:
 * - Draggable handle for smooth expand/collapse
 * - Smooth animations
 * - Glassmorphic design
 * - Persistent state option
 */

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useScreenSize } from '../../hooks/useScreenSize';

export type PanelPosition = 'left' | 'right' | 'bottom' | 'top';

interface CollapsiblePanelProps {
  /** Position of the panel */
  position: PanelPosition;

  /** Whether panel is open by default */
  defaultOpen?: boolean;

  /** Size when collapsed (px) */
  collapsedSize?: number;

  /** Size when expanded (px or percentage string) */
  expandedSize?: string | number;

  /** Panel content */
  children: React.ReactNode;

  /** Handle/tab content when collapsed */
  handleContent?: React.ReactNode;

  /** Storage key for persisting state */
  storageKey?: string;

  /** Z-index for the panel */
  zIndex?: number;

  /** Force modal mode regardless of screen size */
  forceModal?: boolean;
}

/**
 * Reusable collapsible panel component
 */
export function CollapsiblePanel({
  position,
  defaultOpen = false,
  collapsedSize = 40,
  expandedSize = '50%',
  children,
  handleContent,
  storageKey,
  zIndex = 30,
  forceModal = false,
}: CollapsiblePanelProps) {
  // Detect screen size for responsive behavior
  const screenSize = useScreenSize();

  // On mobile, convert left/right panels to modal overlays
  const shouldUseModal = forceModal || (screenSize.isMobile && (position === 'left' || position === 'right'));

  // Load initial state from storage if available
  const getInitialState = () => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        return stored === 'true';
      }
    }
    return defaultOpen;
  };

  const [isOpen, setIsOpen] = useState(getInitialState);
  const dragY = useMotionValue(0);
  const dragX = useMotionValue(0);

  // Persist state changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, String(isOpen));
    }
  }, [isOpen, storageKey]);

  /**
   * Handle drag end to snap to open/closed state
   */
  const handleDragEnd = (_: any, info: any) => {
    const threshold = 50; // pixels

    if (position === 'bottom' || position === 'top') {
      const offset = info.offset.y;
      if (position === 'bottom') {
        setIsOpen(offset < -threshold);
      } else {
        setIsOpen(offset > threshold);
      }
    } else {
      const offset = info.offset.x;
      if (position === 'right') {
        setIsOpen(offset < -threshold);
      } else {
        setIsOpen(offset > threshold);
      }
    }
  };

  /**
   * Get panel styles based on position
   */
  const getPanelStyles = () => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed' as const,
      zIndex,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      borderColor: 'rgba(212, 175, 55, 0.3)',
    };

    switch (position) {
      case 'bottom':
        return {
          ...baseStyles,
          left: 0,
          right: 0,
          bottom: 0,
          height: isOpen ? expandedSize : collapsedSize,
          borderTop: '1px solid',
        };
      case 'top':
        return {
          ...baseStyles,
          left: 0,
          right: 0,
          top: 0,
          height: isOpen ? expandedSize : collapsedSize,
          borderBottom: '1px solid',
        };
      case 'left':
        return {
          ...baseStyles,
          top: 0,
          bottom: 0,
          left: 0,
          width: isOpen ? expandedSize : collapsedSize,
          borderRight: '1px solid',
        };
      case 'right':
        return {
          ...baseStyles,
          top: 0,
          bottom: 0,
          right: 0,
          width: isOpen ? expandedSize : collapsedSize,
          borderLeft: '1px solid',
        };
    }
  };

  /**
   * Get drag constraints based on position
   */
  const getDragConstraints = () => {
    switch (position) {
      case 'bottom':
        return { top: -100, bottom: 0 };
      case 'top':
        return { top: 0, bottom: 100 };
      case 'left':
        return { left: 0, right: 100 };
      case 'right':
        return { left: -100, right: 0 };
    }
  };

  /**
   * Get handle styles and position
   */
  const getHandleStyles = () => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute' as const,
      cursor: isOpen ? 'row-resize' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(212, 175, 55, 0.1)',
      borderColor: 'rgba(212, 175, 55, 0.3)',
    };

    switch (position) {
      case 'bottom':
        return {
          ...baseStyles,
          top: 0,
          left: 0,
          right: 0,
          height: collapsedSize,
          borderBottom: '1px solid',
          cursor: isOpen ? 'row-resize' : 'pointer',
        };
      case 'top':
        return {
          ...baseStyles,
          bottom: 0,
          left: 0,
          right: 0,
          height: collapsedSize,
          borderTop: '1px solid',
          cursor: isOpen ? 'row-resize' : 'pointer',
        };
      case 'left':
        return {
          ...baseStyles,
          right: 0,
          top: 0,
          bottom: 0,
          width: collapsedSize,
          borderLeft: '1px solid',
          cursor: isOpen ? 'col-resize' : 'pointer',
        };
      case 'right':
        return {
          ...baseStyles,
          left: 0,
          top: 0,
          bottom: 0,
          width: collapsedSize,
          borderRight: '1px solid',
          cursor: isOpen ? 'col-resize' : 'pointer',
        };
    }
  };

  /**
   * Get chevron icon rotation based on position and state
   */
  const getChevronRotation = () => {
    switch (position) {
      case 'bottom':
        return isOpen ? 180 : 0;
      case 'top':
        return isOpen ? 0 : 180;
      case 'left':
        return isOpen ? -90 : 90;
      case 'right':
        return isOpen ? 90 : -90;
      default:
        return 0;
    }
  };

  // Modal mode rendering for mobile
  if (shouldUseModal) {
    return (
      <>
        {/* Floating Tab Button (always visible when closed) */}
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 px-4 py-2 rounded-full shadow-lg"
            style={{
              [position === 'left' ? 'left' : 'right']: '16px',
              zIndex: zIndex - 1,
              backgroundColor: 'rgba(212, 175, 55, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
            }}
          >
            <div className="text-sm font-medium text-slate-950">
              {handleContent || `Open ${position === 'left' ? 'Details' : 'Calendar'}`}
            </div>
          </motion.button>
        )}

        {/* Modal Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                style={{ zIndex: zIndex - 1 }}
              />

              {/* Modal Panel */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed inset-x-4 bottom-4 max-h-[80vh] rounded-xl overflow-hidden"
                style={{
                  zIndex,
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                }}
              >
                {/* Modal Header with Close Button */}
                <div
                  className="flex items-center justify-between px-6 py-4 border-b"
                  style={{
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.1), transparent)',
                  }}
                >
                  <div className="text-sm font-medium" style={{ color: '#F4E5B8' }}>
                    {position === 'left' ? 'Vedic Time Details' : 'Calendar & Tasks'}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    style={{ color: '#D4AF37' }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(80vh - 70px)' }}>
                  {children}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Standard panel mode for desktop/tablet
  return (
    <motion.div
      style={getPanelStyles()}
      initial={false}
      animate={{
        height: position === 'bottom' || position === 'top'
          ? (isOpen ? expandedSize : collapsedSize)
          : undefined,
        width: position === 'left' || position === 'right'
          ? (isOpen ? expandedSize : collapsedSize)
          : undefined,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {/* Draggable Handle */}
      <motion.div
        style={getHandleStyles()}
        onClick={() => setIsOpen(!isOpen)}
        drag={position === 'bottom' || position === 'top' ? 'y' : 'x'}
        dragConstraints={getDragConstraints()}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}
        className="select-none"
      >
        {handleContent || (
          <div className="flex items-center gap-2">
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: '#D4AF37' }}
              animate={{ rotate: getChevronRotation() }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </div>
        )}
      </motion.div>

      {/* Panel Content */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="h-full overflow-auto"
          style={{
            paddingTop: position === 'bottom' ? collapsedSize + 16 : 16,
            paddingBottom: position === 'top' ? collapsedSize + 16 : 16,
            paddingLeft: position === 'right' ? collapsedSize + 16 : 32,
            paddingRight: position === 'left' ? collapsedSize + 16 : 32,
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
