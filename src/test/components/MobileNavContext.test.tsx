import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MobileNavProvider, useMobileNav } from '@/components/MobileNavContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <MobileNavProvider>{children}</MobileNavProvider>
);

describe('MobileNavContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useMobileNav(), { wrapper });

    expect(result.current.isSectionPickerOpen).toBe(false);
    expect(result.current.isInCinematicZone).toBe(false);
    expect(result.current.isScrollingDown).toBe(false);
    expect(result.current.shouldShowSocialDock).toBe(true);
  });

  it('should update section picker state', () => {
    const { result } = renderHook(() => useMobileNav(), { wrapper });

    act(() => {
      result.current.setSectionPickerOpen(true);
    });

    expect(result.current.isSectionPickerOpen).toBe(true);
  });

  it('should update cinematic zone state', () => {
    const { result } = renderHook(() => useMobileNav(), { wrapper });

    act(() => {
      result.current.setInCinematicZone(true);
    });

    expect(result.current.isInCinematicZone).toBe(true);
  });

  it('should hide social dock when section picker is open', () => {
    const { result } = renderHook(() => useMobileNav(), { wrapper });

    act(() => {
      result.current.setSectionPickerOpen(true);
    });

    expect(result.current.shouldShowSocialDock).toBe(false);
  });

  it('should hide social dock when in cinematic zone', () => {
    const { result } = renderHook(() => useMobileNav(), { wrapper });

    act(() => {
      result.current.setInCinematicZone(true);
    });

    expect(result.current.shouldShowSocialDock).toBe(false);
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useMobileNav());
    }).toThrow('useMobileNav must be used within MobileNavProvider');
  });
});
