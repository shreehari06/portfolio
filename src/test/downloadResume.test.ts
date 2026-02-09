import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock jspdf before importing the module
vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 612,
        getHeight: () => 792,
      },
    },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    setTextColor: vi.fn(),
    setDrawColor: vi.fn(),
    splitTextToSize: vi.fn((text: string) => [text]),
    text: vi.fn(),
    line: vi.fn(),
    save: vi.fn(),
  })),
}));

describe('downloadResume utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be importable', async () => {
    const { downloadResume } = await import('@/utils/downloadResume');
    expect(downloadResume).toBeDefined();
    expect(typeof downloadResume).toBe('function');
  });

  it('should call jsPDF methods when executed', async () => {
    const { jsPDF } = await import('jspdf');
    const { downloadResume } = await import('@/utils/downloadResume');
    
    await downloadResume();
    
    expect(jsPDF).toHaveBeenCalled();
  });
});
