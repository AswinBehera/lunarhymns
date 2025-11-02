/**
 * Keyboard Shortcuts Hook
 *
 * Manages keyboard navigation for the application.
 * Provides shortcuts for toggling panels and other actions.
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}

export interface UseKeyboardShortcutsOptions {
  /** Whether keyboard shortcuts are enabled */
  enabled?: boolean;
  /** Custom shortcuts to add */
  shortcuts?: KeyboardShortcut[];
}

/**
 * Check if keyboard shortcut matches the event
 */
function matchesShortcut(
  event: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean {
  const key = event.key.toLowerCase();
  const shortcutKey = shortcut.key.toLowerCase();

  if (key !== shortcutKey) return false;
  if (!!event.ctrlKey !== !!shortcut.ctrl) return false;
  if (!!event.altKey !== !!shortcut.alt) return false;
  if (!!event.shiftKey !== !!shortcut.shift) return false;
  if (!!event.metaKey !== !!shortcut.meta) return false;

  return true;
}

/**
 * Custom hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Check each shortcut
      for (const shortcut of shortcuts) {
        if (matchesShortcut(event, shortcut)) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  return shortcuts;
}

/**
 * Hook for panel keyboard shortcuts
 */
export function usePanelShortcuts(panelActions: {
  toggleLeft: () => void;
  toggleRight: () => void;
  toggleBottom: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      ctrl: true,
      action: panelActions.toggleLeft,
      description: 'Toggle left panel (Vedic Time Details)',
    },
    {
      key: '2',
      ctrl: true,
      action: panelActions.toggleRight,
      description: 'Toggle right panel (Calendar & Tasks)',
    },
    {
      key: '3',
      ctrl: true,
      action: panelActions.toggleBottom,
      description: 'Toggle bottom panel (Daily Hymn)',
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

/**
 * Hook for global keyboard shortcuts
 */
export function useGlobalShortcuts(actions: {
  openBreathingModal?: () => void;
  refresh?: () => void;
  showHelp?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.openBreathingModal) {
    shortcuts.push({
      key: 'b',
      ctrl: true,
      action: actions.openBreathingModal,
      description: 'Open breathing/meditation modal',
    });
  }

  if (actions.refresh) {
    shortcuts.push({
      key: 'r',
      ctrl: true,
      shift: true,
      action: actions.refresh,
      description: 'Refresh Vedic time',
    });
  }

  if (actions.showHelp) {
    shortcuts.push({
      key: '?',
      shift: true,
      action: actions.showHelp,
      description: 'Show keyboard shortcuts help',
    });
  }

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

/**
 * Hook to announce to screen readers
 */
export function useScreenReaderAnnouncement() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return announce;
}
