import React, { useState, useEffect } from 'react';
import { TabService } from '../application/services/TabService';
import { BrowserTabRepository } from '../infrastructure/storage/BrowserTabRepository';
import { GraphView } from './components/GraphView';
import { ITab } from '../domain/tabs/entities/Tab';

// Initialize services
const tabRepository = new BrowserTabRepository();
const tabService = new TabService(tabRepository);

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ITab | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the application
  useEffect(() => {
    const initialize = async () => {
      try {
        // Here you can add any initialization logic
        // For example, setting up browser event listeners
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initialize();
  }, []);

  const handleTabSelect = (tab: ITab) => {
    setSelectedTab(tab);
  };

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
    }}>
      <header style={{
        padding: '16px',
        backgroundColor: '#1976d2',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ margin: 0 }}>Graphy - Tab Relationship Visualizer</h1>
      </header>
      
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
        }}>
          <GraphView 
            tabService={tabService} 
            onTabSelect={handleTabSelect}
            selectedTabId={selectedTab?.info.id || null}
          />
        </div>
        
        {selectedTab && (
          <div style={{
            width: '300px',
            backgroundColor: 'white',
            borderLeft: '1px solid #e0e0e0',
            padding: '16px',
            overflowY: 'auto',
          }}>
            <h2>Tab Details</h2>
            <div><strong>Title:</strong> {selectedTab.info.title || 'Untitled'}</div>
            <div style={{
              marginTop: '8px',
              wordBreak: 'break-all',
            }}>
              <strong>URL:</strong> {selectedTab.info.url || 'No URL'}
            </div>
            
            <h3 style={{ marginTop: '16px' }}>Relationships</h3>
            <div>
              {/* You can add relationship information here */}
              Tab ID: {selectedTab.info.id}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
