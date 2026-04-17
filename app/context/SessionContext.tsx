import { createContext, useContext, useState, type ReactNode } from 'react';

export type Preference =
  | 'quiet'
  | 'affordable'
  | 'community'
  | 'family-friendly'
  | 'accessible'
  | 'outdoor';

export const PREFERENCE_CONFIG: Record<Preference, { label: string; description: string }> = {
  'quiet':          { label: 'Quiet & Low-Key',      description: 'Calm, unhurried spots' },
  'affordable':     { label: 'Free or Affordable',   description: 'No cost or low cost' },
  'community':      { label: 'Community-Oriented',   description: 'Gathering & social spaces' },
  'family-friendly':{ label: 'Family-Friendly',      description: 'Great for kids & all ages' },
  'accessible':     { label: 'Accessible',           description: 'Mobility-accessible spaces' },
  'outdoor':        { label: 'Outdoors',             description: 'Parks, trails & open air' },
};

export const ALL_PREFERENCES = Object.keys(PREFERENCE_CONFIG) as Preference[];

interface SessionContextType {
  preferences: Set<Preference>;
  togglePreference: (pref: Preference) => void;
  clearPreferences: () => void;
  hasPreferences: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Set<Preference>>(new Set());

  const togglePreference = (pref: Preference) => {
    setPreferences(prev => {
      const next = new Set(prev);
      if (next.has(pref)) {
        next.delete(pref);
      } else {
        next.add(pref);
      }
      return next;
    });
  };

  const clearPreferences = () => setPreferences(new Set());

  return (
    <SessionContext.Provider
      value={{
        preferences,
        togglePreference,
        clearPreferences,
        hasPreferences: preferences.size > 0,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
