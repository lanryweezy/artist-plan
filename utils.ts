
import { ContentItem } from './types';

export const calculateContentAnalytics = (contentItems: ContentItem[]): {
  totalItems: number;
  activeItems: number;
  archivedItems: number;
  mostUsedTags: string[];
  contentTypeDistribution: { [key: string]: number };
  averageContentAge: number;
} => {
  const analytics = {
    totalItems: contentItems.length,
    activeItems: contentItems.filter(item => item.status !== 'Archived').length,
    archivedItems: contentItems.filter(item => item.status === 'Archived').length,
    mostUsedTags: [],
    contentTypeDistribution: {},
    averageContentAge: 0,
  };

  // Calculate tag frequency
  const tagFrequency: { [key: string]: number } = {};
  contentItems.forEach(item => {
    if (item.tags) {
      item.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    }
  });

  // Get top 3 most used tags
  analytics.mostUsedTags = Object.entries(tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);

  // Calculate content type distribution
  contentItems.forEach(item => {
    analytics.contentTypeDistribution[item.type] = 
      (analytics.contentTypeDistribution[item.type] || 0) + 1;
  });

  // Calculate average content age
  const now = new Date();
  const ages = contentItems.map(item => {
    const creationDate = new Date(item.creationDate);
    return Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
  });
  analytics.averageContentAge = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);

  return analytics;
};

export const cleanAIResponseText = (text: string | null | undefined): string => {
  if (!text) return '';
  let cleanedText = text.trim();
  
  const fenceRegex = /^```(\w*)\s*\n?([\s\S]*?)\n?\s*```$/s;
  const match = cleanedText.match(fenceRegex);

  if (match && match[2]) {
    cleanedText = match[2].trim();
  }
  
  return cleanedText;
};

export const renderMarkdownToHtml = (markdownText: string | null | undefined): string => {
  if (!markdownText) return '';
  let html = markdownText;

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  // Use lookarounds to avoid interfering with strong if it also uses single asterisks (though less common for strong)
  // For _italic_
  html = html.replace(/(?<![a-zA-Z0-9_])_(.+?)_(?![a-zA-Z0-9_])/g, '<em>$1</em>');
  // For *italic* (be careful not to match ** which is strong)
  html = html.replace(/(?<!\*)\*(?!\s|\*)(.+?)(?<!\s|\*)\*(?!\*)/g, '<em>$1</em>');


  // Simple Unordered List items (lines starting with -, *, +)
  // Convert to <li> and then attempt to wrap in <ul> if multiple consecutive
  html = html.replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>');
  
  // Simple Ordered List items (lines starting with 1., 2.)
  html = html.replace(/^\s*\d+\.\s+(.*)/gm, '<li>$1</li>');

  // Wrap consecutive <li> items in <ul> or <ol> respectively.
  // This is a basic approach and might not cover all edge cases like nested lists.
  // For unordered lists:
  html = html.replace(/(?:<li>.*?<\/li>\s*)+(?=\s*[^<]|$)/g, (match) => {
    if (match.includes('<ul>') || match.includes('<ol>')) return match; // Avoid double wrapping
    return `<ul>\n${match.trim()}\n</ul>`;
  });
  // Note: A similar regex for <ol> could be added if ordered list markers (1., 2.) are strictly used by AI.
  // For simplicity, current conversion changes both to <li> and wraps in <ul>.
  // This could be refined if AI consistently provides numbered lists and they need <ol>.

  // Replace newlines with <br> for paragraphs, but only if not already in a block element like <li>
  // This helps preserve paragraph breaks when `whitespace-pre-wrap` is not enough due to HTML interpretation.
  // Avoid adding <br> inside <ul>, <ol>, <li>
  // A simpler approach is to rely on prose and whitespace-pre-wrap for paragraphing,
  // and let this function focus on inline and list item conversion.
  // Let's ensure double newlines become paragraph breaks if possible,
  // by splitting, wrapping non-list parts in <p>, then rejoining.
  const blocks = html.split(/(\n\s*\n)/); // Split by double newlines
  html = blocks.map(block => {
    if (block.match(/^\s*$/)) return ''; // Keep empty lines if they are separators
    if (block.startsWith('<ul>') || block.startsWith('<li>')) {
      return block; // Don't wrap lists in <p>
    }
    const trimmedBlock = block.trim();
    if (trimmedBlock.length > 0 && !trimmedBlock.startsWith('<')) { // Avoid wrapping existing HTML tags
        return `<p>${trimmedBlock}</p>`;
    }
    return block;
  }).join('\n'); // Join with single newline, <p> tags handle spacing

  return html;
};
