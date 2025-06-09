import React, { useState, useEffect } from 'react';
import { ITab } from '../../../domain/tabs/entities/Tab';
import { TabNode } from './TabNode';
import { TabService } from '../../../application/services/TabService';

interface GraphViewProps {
  tabService: TabService;
  onTabSelect?: (tab: ITab) => void;
  selectedTabId?: number | null;
}

export const GraphView: React.FC<GraphViewProps> = ({
  tabService,
  onTabSelect,
  selectedTabId = null,
}) => {
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTabs = async () => {
      try {
        setLoading(true);
        const windows = await tabService.getTabGraph();
        const allTabs = windows.flatMap(win => win.tabs);
        setTabs(allTabs);
      } catch (err) {
        console.error('Failed to load tabs:', err);
        setError('Failed to load tab graph');
      } finally {
        setLoading(false);
      }
    };

    loadTabs();
  }, [tabService]);

  const handleTabClick = (tab: ITab) => {
    if (onTabSelect) {
      onTabSelect(tab);
    }
  };

  if (loading) {
    return <div>Loading tab graph...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '16px',
      overflow: 'auto',
      height: '100%',
    }}>
      {tabs.map(tab => (
        <TabNode
          key={tab.info.id}
          tab={tab}
          isSelected={selectedTabId === tab.info.id}
          onClick={handleTabClick}
        />
      ))}
    </div>
  );
};
