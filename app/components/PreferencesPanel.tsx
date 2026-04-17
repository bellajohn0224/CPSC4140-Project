import { X, RefreshCcw, Check } from 'lucide-react';
import {
  useSession,
  ALL_PREFERENCES,
  PREFERENCE_CONFIG,
  type Preference,
} from '../context/SessionContext';

interface Props {
  onClose: () => void;
}

export function PreferencesPanel({ onClose }: Props) {
  const { preferences, togglePreference, clearPreferences } = useSession();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(47,52,47,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-kiosk-surface w-full max-w-3xl rounded-t-3xl p-8 shadow-2xl border-t-2 border-kiosk-border">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl text-kiosk-text">What are you looking for today?</h2>
            <p className="text-lg text-kiosk-text-secondary mt-1">
              Select any that apply. Results will be filtered for this session only.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-kiosk-surface-alt transition-all active:scale-95 text-kiosk-text-secondary hover:text-kiosk-text shrink-0 ml-4"
          >
            <X size={28} />
          </button>
        </div>

        {/* Preference options */}
        <div className="grid grid-cols-2 gap-3">
          {ALL_PREFERENCES.map((pref: Preference) => {
            const cfg = PREFERENCE_CONFIG[pref];
            const active = preferences.has(pref);
            return (
              <button
                key={pref}
                onClick={() => togglePreference(pref)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-all duration-150 active:scale-95 ${
                  active
                    ? 'bg-kiosk-primary border-kiosk-primary-dark text-white'
                    : 'bg-kiosk-bg border-kiosk-border text-kiosk-text hover:bg-kiosk-surface-alt'
                }`}
              >
                <div>
                  <div className={`text-xl ${active ? 'text-white' : 'text-kiosk-text'}`}>
                    {cfg.label}
                  </div>
                  <div className={`text-base mt-0.5 ${active ? 'text-white/80' : 'text-kiosk-text-secondary'}`}>
                    {cfg.description}
                  </div>
                </div>
                {active && <Check size={22} className="shrink-0 text-white ml-4" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-6">
          {preferences.size > 0 && (
            <button
              onClick={clearPreferences}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-kiosk-border bg-kiosk-bg hover:bg-kiosk-surface-alt text-kiosk-text-secondary text-xl transition-all active:scale-95"
            >
              <RefreshCcw size={20} />
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-kiosk-primary hover:bg-kiosk-primary-dark text-white text-xl px-8 py-4 rounded-2xl transition-all active:scale-95"
          >
            {preferences.size > 0
              ? `Apply ${preferences.size} Preference${preferences.size > 1 ? 's' : ''}`
              : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
