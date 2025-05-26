import React from 'react';

interface ListItem {
  text: string;
  isBold: boolean;
}

const ContentRenderer = ({ content }: { content: string }) => {
  const parseContent = (text: string): ListItem[] => {
    // Split content into segments based on asterisk patterns
    const segments = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    
    return segments
      .filter(Boolean) // Remove empty strings
      .map(segment => ({
        text: segment.replace(/\*\*/g, '').replace(/\*/g, ''),
        isBold: segment.startsWith('**') || segment.startsWith('*')
      }));
  };

  const renderSegments = (items: ListItem[]) => {
    return items.map((item, index) => (
      <span
        key={index}
        className={`${
          item.isBold 
            ? 'font-semibold text-primary bg-primary/5 px-1 rounded' 
            : 'text-foreground'
        }`}
      >
        {item.text}
      </span>
    ));
  };

  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(Boolean);

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => {
        // Check if paragraph is a list item
        if (paragraph.trim().startsWith('*')) {
          return (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 transition-all duration-300"
            >
              <span className="text-primary mt-1">•</span>
              <div className="flex-1">
                {renderSegments(parseContent(paragraph.substring(1).trim()))}
              </div>
            </div>
          );
        }
        
        // Regular paragraph
        return (
          <p key={index} className="leading-relaxed">
            {renderSegments(parseContent(paragraph))}
          </p>
        );
      })}
    </div>
  );
};

export default ContentRenderer;