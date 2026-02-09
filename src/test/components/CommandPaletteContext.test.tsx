import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CommandPaletteProvider, useCommandPalette } from '@/components/CommandPaletteContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <CommandPaletteProvider>{children}</CommandPaletteProvider>
);

describe('CommandPaletteContext', () => {
  it('should provide initial state', () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });

    expect(result.current.isOpen).toBe(false);
  });

  it('should open command palette', () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should close command palette', () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle command palette', () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useCommandPalette());
    }).toThrow('useCommandPalette must be used within CommandPaletteProvider');
  });
});
