/**
 * usePanels Hook
 *
 * Custom hook for managing panel open/closed states.
 * Persists state to localStorage for consistency across sessions.
 */

import { useState, useCallback } from 'react';
import { PanelService } from '../services/storageService';
import type { PanelStates, PanelActions } from '../types';

export interface UsePanelsResult extends PanelStates, PanelActions {
  /** Reset all panels to default state */
  resetPanels: () => void;
}

/**
 * Custom hook for managing panel states
 */
export function usePanels(): UsePanelsResult {
  // Initialize from localStorage
  const [panelStates, setPanelStates] = useState<PanelStates>(() => {
    return PanelService.getPanelStates();
  });

  /**
   * Toggle left panel
   */
  const toggleLeft = useCallback(() => {
    setPanelStates(prev => {
      const newState = !prev.left;
      PanelService.saveLeftPanel(newState);
      return { ...prev, left: newState };
    });
  }, []);

  /**
   * Toggle right panel
   */
  const toggleRight = useCallback(() => {
    setPanelStates(prev => {
      const newState = !prev.right;
      PanelService.saveRightPanel(newState);
      return { ...prev, right: newState };
    });
  }, []);

  /**
   * Toggle bottom panel
   */
  const toggleBottom = useCallback(() => {
    setPanelStates(prev => {
      const newState = !prev.bottom;
      PanelService.saveBottomPanel(newState);
      return { ...prev, bottom: newState };
    });
  }, []);

  /**
   * Set left panel state directly
   */
  const setLeftOpen = useCallback((open: boolean) => {
    setPanelStates(prev => {
      PanelService.saveLeftPanel(open);
      return { ...prev, left: open };
    });
  }, []);

  /**
   * Set right panel state directly
   */
  const setRightOpen = useCallback((open: boolean) => {
    setPanelStates(prev => {
      PanelService.saveRightPanel(open);
      return { ...prev, right: open };
    });
  }, []);

  /**
   * Set bottom panel state directly
   */
  const setBottomOpen = useCallback((open: boolean) => {
    setPanelStates(prev => {
      PanelService.saveBottomPanel(open);
      return { ...prev, bottom: open };
    });
  }, []);

  /**
   * Reset all panels to default state
   */
  const resetPanels = useCallback(() => {
    PanelService.resetPanelStates();
    setPanelStates({
      left: true,
      right: false,
      bottom: false,
    });
  }, []);

  return {
    left: panelStates.left,
    right: panelStates.right,
    bottom: panelStates.bottom,
    toggleLeft,
    toggleRight,
    toggleBottom,
    setLeftOpen,
    setRightOpen,
    setBottomOpen,
    resetPanels,
  };
}

/**
 * Hook to manage a single panel
 */
export function usePanel(
  position: 'left' | 'right' | 'bottom'
): {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
} {
  const panels = usePanels();

  const isOpen = panels[position];

  const toggle = useCallback(() => {
    if (position === 'left') panels.toggleLeft();
    else if (position === 'right') panels.toggleRight();
    else panels.toggleBottom();
  }, [position, panels]);

  const setOpen = useCallback(
    (open: boolean) => {
      if (position === 'left') panels.setLeftOpen(open);
      else if (position === 'right') panels.setRightOpen(open);
      else panels.setBottomOpen(open);
    },
    [position, panels]
  );

  return { isOpen, toggle, setOpen };
}
