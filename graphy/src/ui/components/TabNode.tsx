import React from 'react';
import { ITab } from '../../../domain/tabs/entities/Tab';

interface TabNodeProps {
  tab: ITab;
  isSelected?: boolean;
  onClick?: (tab: ITab) => void;
}

export const TabNode: React.FC<TabNodeProps> = ({ tab, isSelected = false, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(tab);
    }
  };

  return (
    <div 
      className={`tab-node ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{
        padding: '8px',
        border: `2px solid ${isSelected ? '#4CAF50' : '#2196F3'}`,
        borderRadius: '4px',
        backgroundColor: isSelected ? '#E8F5E9' : '#E3F2FD',
        cursor: 'pointer',
        margin: '4px',
        minWidth: '150px',
        maxWidth: '200px',
        wordBreak: 'break-word',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {tab.info.title || 'Untitled Tab'}
      </div>
      <div style={{
        fontSize: '0.8em',
        color: '#666',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {tab.info.url}
      </div>
    </div>
  );
};
