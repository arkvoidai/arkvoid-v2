"use client"

import * as React from 'react';
import type { Organization, Profile } from '../../components/layout/sidebar';

interface AppContextValue {
  org: Organization;
  profile: Profile;
}

export const AppContext = React.createContext<AppContextValue | null>(null);

export function AppProvider({ 
  children, 
  org, 
  profile 
}: AppContextValue & { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ org, profile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
