import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

import { useScrollAnimation, useParallax } from '@/hooks/useScrollAnimation';

describe('useScrollAnimation hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return ref, isInView, and scrollProgress', () => {
    const { result } = renderHook(() => useScrollAnimation());
    
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.isInView).toBe('boolean');
    expect(typeof result.current.scrollProgress).toBe('number');
  });

  it('should initialize with isInView as false', () => {
    const { result } = renderHook(() => useScrollAnimation());
    
    expect(result.current.isInView).toBe(false);
  });

  it('should initialize with scrollProgress as 0', () => {
    const { result } = renderHook(() => useScrollAnimation());
    
    expect(result.current.scrollProgress).toBe(0);
  });

  it('should accept custom options', () => {
    const { result } = renderHook(() => 
      useScrollAnimation({ threshold: 0.5, rootMargin: '10px', triggerOnce: false })
    );
    
    expect(result.current.ref).toBeDefined();
  });

  it('should set isInView to true if prefers-reduced-motion is enabled', () => {
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useScrollAnimation());
    
    // With reduced motion, isInView should be true immediately
    expect(result.current.isInView).toBe(true);
  });
});

describe('useParallax hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset matchMedia to default
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('should return ref and offset', () => {
    const { result } = renderHook(() => useParallax());
    
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.offset).toBe('number');
  });

  it('should initialize with offset as 0', () => {
    const { result } = renderHook(() => useParallax());
    
    expect(result.current.offset).toBe(0);
  });

  it('should accept custom speed parameter', () => {
    const { result } = renderHook(() => useParallax(0.8));
    
    expect(result.current.ref).toBeDefined();
  });

  it('should not update offset when prefers-reduced-motion is enabled', () => {
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useParallax());
    
    // Offset should remain 0 with reduced motion
    expect(result.current.offset).toBe(0);
  });
});
