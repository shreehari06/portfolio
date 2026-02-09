import { site, experience, capabilities, links } from '@/content';

export const downloadResume = async () => {
  const { jsPDF } = await import('jspdf');
  
  const pdf = new jsPDF('p', 'pt', 'letter');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper for text
  const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', color = '#1a1a1a') => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.setTextColor(color);
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, y);
    y += lines.length * size * 1.3;
  };

  const addSpacing = (space: number) => {
    y += space;
  };

  const addSection = (title: string) => {
    addSpacing(16);
    pdf.setDrawColor('#cccccc');
    pdf.line(margin, y, pageWidth - margin, y);
    y += 12;
    addText(title.toUpperCase(), 11, 'bold', '#666666');
    addSpacing(8);
  };

  // Header
  addText(site.name, 24, 'bold');
  addSpacing(4);
  addText(site.title, 12, 'normal', '#666666');
  addSpacing(8);
  addText(`${site.location} • ${links.email} • ${links.linkedinDisplay} • ${links.githubDisplay}`, 10, 'normal', '#888888');

  // Summary
  addSection('Summary');
  addText(site.shortIntro, 11);

  // Experience
  addSection('Experience');
  experience.timeline.forEach((item) => {
    addText(`${item.role}`, 12, 'bold');
    addSpacing(2);
    addText(`${item.company} | ${item.period}`, 10, 'normal', '#666666');
    addSpacing(4);
    addText(item.impact, 10);
    addSpacing(12);
  });

  // Skills
  addSection('Skills');
  capabilities.groups.forEach((group) => {
    addText(group.category, 11, 'bold');
    addSpacing(2);
    addText(group.skills.join(' • '), 10, 'normal', '#666666');
    addSpacing(10);
  });

  // Education
  addSection('Education');
  addText('B.Tech in Computer Science', 12, 'bold');
  addSpacing(2);
  addText('Amrita Vishwa Vidyapeetham, Amritapuri | 2018 — 2022', 10, 'normal', '#666666');

  // Save
  pdf.save(`${site.name.replace(/\s+/g, '_')}_Resume.pdf`);
};
