import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Calendar, UtensilsCrossed, Palette, TreePine, ShoppingBag, LayoutGrid,
  Search, PlusCircle, Home, Settings2, RefreshCcw, MapPin,
} from 'lucide-react';
import { categories, getFeaturedPlaces, FEATURED_SECTION_LABELS, type FeaturedSection } from '../data/places';
import { useSession, PREFERENCE_CONFIG } from '../context/SessionContext';
import { PreferencesPanel } from './PreferencesPanel';

const iconMap = { Calendar, UtensilsCrossed, Palette, TreePine, ShoppingBag, LayoutGrid };

const categoryColors: Record<string, { border: string; icon: string; bg: string }> = {
  events:   { border: '#A692BC', icon: '#A692BC', bg: '#A692BC18' },
  food:     { border: '#C4845C', icon: '#C4845C', bg: '#C4845C18' },
  arts:     { border: '#7A9BB5', icon: '#7A9BB5', bg: '#7A9BB518' },
  outdoor:  { border: '#7A9B78', icon: '#7A9B78', bg: '#7A9B7818' },
  shopping: { border: '#C4A45C', icon: '#C4A45C', bg: '#C4A45C18' },
  other:    { border: '#9B9B8A', icon: '#9B9B8A', bg: '#9B9B8A18' },
};

// Show only the most discovery-oriented featured section
const FEATURED_SECTIONS: FeaturedSection[] = ['weekend'];

export function CategorySelectionScreen() {
  const navigate = useNavigate();
  const { preferences, hasPreferences, clearPreferences } = useSession();
  const [showPrefs, setShowPrefs] = useState(false);

  return (
    <div className="min-h-screen bg-kiosk-bg">
      <div className="max-w-5xl mx-auto px-6 py-5">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('/')}
            className="p-3 rounded-2xl hover:bg-kiosk-surface text-kiosk-text-secondary hover:text-kiosk-text transition-all active:scale-95"
          >
            <Home size={26} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl text-kiosk-text">Community Discovery Board</h1>
            <p className="text-base text-kiosk-text-secondary">Explore local places, events, and resources</p>
          </div>
          <button
            onClick={() => setShowPrefs(true)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95 ${
              hasPreferences
                ? 'bg-kiosk-primary border-kiosk-primary-dark text-white'
                : 'bg-kiosk-surface border-kiosk-border text-kiosk-text-secondary hover:bg-kiosk-surface-alt'
            }`}
          >
            <Settings2 size={20} />
            <span className="text-base">
              {hasPreferences
                ? `${preferences.size} Preference${preferences.size > 1 ? 's' : ''} Active`
                : 'Preferences'}
            </span>
          </button>
        </div>

        {/* ── Active preferences banner ─────────────────── */}
        {hasPreferences && (
          <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-2xl px-5 py-3 mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-kiosk-text-secondary text-sm">Filtering by:</span>
              {[...preferences].map(p => (
                <span
                  key={p}
                  className="text-sm px-3 py-1 rounded-full font-medium"
                  style={{ backgroundColor: '#7F947820', color: '#3D5C38', border: '1.5px solid #7F947850' }}
                >
                  {PREFERENCE_CONFIG[p].label}
                </span>
              ))}
            </div>
            <button
              onClick={clearPreferences}
              className="flex items-center gap-1.5 text-kiosk-text-secondary hover:text-kiosk-text text-sm font-medium active:scale-95 shrink-0 px-3 py-1.5 rounded-xl hover:bg-kiosk-surface-alt transition-all"
            >
              <RefreshCcw size={13} />
              Clear
            </button>
          </div>
        )}

        {/* ── Search bar ─────────────────────────────────── */}
        <button
          onClick={() => navigate('/browse')}
          className="w-full bg-kiosk-surface border-2 border-kiosk-border hover:border-kiosk-primary rounded-2xl px-5 py-4 flex items-center gap-4 text-left transition-all active:scale-[0.99] shadow-sm hover:shadow-md mb-6 group"
        >
          <Search size={24} className="text-kiosk-text-muted group-hover:text-kiosk-primary transition-colors shrink-0" />
          <span className="text-xl text-kiosk-text-muted">
            Search places, events, and more...
          </span>
        </button>

        {/* ── Browse by Category ─────────────────────────── */}
        <div className="mb-7">
          <h2 className="text-xl text-kiosk-text mb-3">Browse by Category</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map(cat => {
              const colors = categoryColors[cat.id] ?? { border: '#D9D7CF', icon: '#7F9478', bg: '#7F947818' };
              const Icon = iconMap[cat.icon as keyof typeof iconMap];
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/results/${cat.id}`)}
                  style={{ borderColor: colors.border }}
                  className="bg-kiosk-surface hover:bg-kiosk-surface-alt border-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-3 py-12"
                >
                  <div style={{ color: colors.icon }}>
                    {Icon && <Icon size={32} />}
                  </div>
                  <span className="text-base text-kiosk-text text-center px-2">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Featured sections ─────────────────────────── */}
        {FEATURED_SECTIONS.map(id => {
          const featured = getFeaturedPlaces(id);
          if (featured.length === 0) return null;
          return (
            <div key={id} className="mb-6">
              <h2 className="text-xl text-kiosk-text mb-3">{FEATURED_SECTION_LABELS[id]}</h2>
              <div
                className="flex gap-4 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featured.slice(0, 6).map(place => {
                  const colors = categoryColors[place.category] ?? categoryColors.other;
                  return (
                    <button
                      key={place.id}
                      onClick={() => navigate(`/place/${place.id}`)}
                      className="bg-kiosk-surface border-2 rounded-2xl p-4 text-left transition-all active:scale-95 hover:shadow-md shrink-0 flex flex-col"
                      style={{ width: 220, minWidth: 220, borderColor: colors.border }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: colors.bg, color: colors.icon }}
                        >
                          {categories.find(c => c.id === place.category)?.name}
                        </span>
                        {place.isFree && (
                          <span className="bg-kiosk-surface-alt text-kiosk-text-secondary text-xs px-2 py-1 rounded-full border border-kiosk-border">
                            Free
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg text-kiosk-text mb-1 line-clamp-2 leading-snug">
                        {place.name}
                      </h3>

                      {place.date ? (
                        <p className="text-sm text-kiosk-text-secondary flex items-center gap-1 mt-auto pt-2">
                          <Calendar size={12} />
                          {place.date}{place.time ? `, ${place.time}` : ''}
                        </p>
                      ) : (
                        <p className="text-sm text-kiosk-text-muted flex items-center gap-1 mt-auto pt-2">
                          <MapPin size={12} />
                          {place.address.split(',').slice(-2).join(',').trim()}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── Suggest a Place ────────────────────────────── */}
        <button
          onClick={() => navigate('/suggest')}
          style={{ borderColor: '#6B9B96' }}
          className="w-full bg-kiosk-surface hover:bg-kiosk-surface-alt border-2 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex items-center gap-5"
        >
          <PlusCircle size={36} style={{ color: '#6B9B96' }} className="shrink-0" />
          <div className="text-left">
            <div className="text-xl text-kiosk-text">Suggest a Community Place</div>
            <div className="text-base text-kiosk-text-secondary">Know a great local spot? Share it with the community.</div>
          </div>
        </button>

      </div>

      {showPrefs && <PreferencesPanel onClose={() => setShowPrefs(false)} />}
    </div>
  );
}
