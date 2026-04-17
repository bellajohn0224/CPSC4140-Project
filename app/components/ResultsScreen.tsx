import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Search, X, MapPin, Calendar,
  SlidersHorizontal, ChevronDown, ChevronUp, Settings2,
} from 'lucide-react';
import {
  getPlacesByCategory,
  categories,
  applyFilters,
  applySort,
  type SortOption,
  type Place,
} from '../data/places';
import { useSession } from '../context/SessionContext';
import { PreferencesPanel } from './PreferencesPanel';

const categoryAccent: Record<string, string> = {
  events:   '#A692BC',
  food:     '#C4845C',
  arts:     '#7A9BB5',
  outdoor:  '#7A9B78',
  shopping: '#C4A45C',
  other:    '#9B9B8A',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-az',      label: 'A to Z' },
  { value: 'name-za',      label: 'Z to A' },
  { value: 'free-first',   label: 'Free First' },
  { value: 'family-first', label: 'Family-Friendly First' },
];

// Attribute chip styles — each key maps to a distinct semantic color
const chipStyle = {
  free:       { backgroundColor: '#7F947820', color: '#3D5C38', border: '1.5px solid #7F947850' },
  paid:       { backgroundColor: '#ECE9E1',   color: '#6F756D', border: '1.5px solid #D9D7CF'   },
  indoor:     { backgroundColor: '#7A9BB520', color: '#2A5070', border: '1.5px solid #7A9BB550' },
  outdoor:    { backgroundColor: '#7A9B7820', color: '#2F5533', border: '1.5px solid #7A9B7850' },
  both:       { backgroundColor: '#7A9BB520', color: '#2A5070', border: '1.5px solid #7A9BB550' },
  family:     { backgroundColor: '#C4A45C20', color: '#6E5615', border: '1.5px solid #C4A45C50' },
  accessible: { backgroundColor: '#6B9B9620', color: '#1E5550', border: '1.5px solid #6B9B9650' },
  tag:        { backgroundColor: '#ECE9E1',   color: '#6F756D', border: '1.5px solid #D9D7CF'   },
} as const;

const CHIP_BASE = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap';

// Tags that duplicate structured attributes — filter them out from content tags
const ATTRIBUTE_TAGS = new Set([
  'free', 'paid', 'free to browse', 'indoor', 'outdoor', 'both',
  'family', 'family-friendly', 'accessible',
]);

function settingChipStyle(setting: Place['setting']) {
  if (setting === 'indoor') return chipStyle.indoor;
  if (setting === 'outdoor') return chipStyle.outdoor;
  return chipStyle.both;
}
function settingLabel(setting: Place['setting']) {
  if (setting === 'indoor') return 'Indoor';
  if (setting === 'outdoor') return 'Outdoor';
  return 'Indoor & Outdoor';
}

export function ResultsScreen() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { preferences, hasPreferences } = useSession();
  const [showPrefs, setShowPrefs] = useState(false);

  const [query, setQuery]             = useState('');
  const [sort, setSort]               = useState<SortOption>('name-az');
  const [showSort, setShowSort]       = useState(false);

  const allInCategory = categoryId ? getPlacesByCategory(categoryId) : [];
  const category      = categories.find(c => c.id === categoryId);
  const accent        = categoryId ? (categoryAccent[categoryId] ?? '#7F9478') : '#7F9478';

  const results = useMemo(() => {
    const filtered = applyFilters(allInCategory, {
      query:          query.trim() || undefined,
      isFree:         preferences.has('affordable') ? true : undefined,
      familyFriendly: preferences.has('family-friendly') || undefined,
      accessible:     preferences.has('accessible') || undefined,
    });
    return applySort(filtered, sort);
  }, [query, sort, allInCategory, preferences]);

  return (
    <div className="min-h-screen bg-kiosk-bg">

      {/* ── Sticky header ──────────────────────────────────── */}
      <div className="bg-kiosk-surface border-b-2 border-kiosk-border px-6 pt-4 pb-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto">

          {/* Nav row — back + title only */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/categories')}
              className="flex items-center gap-2 text-kiosk-text-secondary hover:text-kiosk-text text-lg px-4 py-2 rounded-2xl hover:bg-kiosk-surface-alt transition-all active:scale-95"
            >
              <ArrowLeft size={22} />
              Categories
            </button>
            <h1 className="text-2xl text-kiosk-text">{category?.name}</h1>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-kiosk-text-muted pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search within ${category?.name ?? 'results'}…`}
              className="w-full bg-kiosk-bg border-2 border-kiosk-border focus:border-kiosk-primary rounded-2xl pl-12 pr-10 py-3 text-lg text-kiosk-text placeholder:text-kiosk-text-muted outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-kiosk-text-muted hover:text-kiosk-text"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Control bar — Preferences + Sort + result count */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrefs(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                hasPreferences
                  ? 'bg-kiosk-primary border-kiosk-primary-dark text-white'
                  : 'bg-kiosk-bg border-kiosk-border text-kiosk-text-secondary hover:bg-kiosk-surface-alt'
              }`}
            >
              <Settings2 size={16} />
              {hasPreferences ? `${preferences.size} Active` : 'Preferences'}
            </button>

            <button
              onClick={() => setShowSort(p => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                showSort
                  ? 'bg-kiosk-primary border-kiosk-primary-dark text-white'
                  : 'bg-kiosk-bg border-kiosk-border text-kiosk-text-secondary hover:bg-kiosk-surface-alt'
              }`}
            >
              <SlidersHorizontal size={16} />
              Sort
              {showSort ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <span className="ml-auto text-sm text-kiosk-text-muted tabular-nums">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          {/* Expanded sort options */}
          {showSort && (
            <div className="mt-3 pt-3 border-t border-kiosk-border flex items-center gap-2 flex-wrap">
              <span className="text-sm text-kiosk-text-secondary mr-1">Sort by:</span>
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  onClick={() => setSort(o.value)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                    sort === o.value
                      ? 'bg-kiosk-primary border-kiosk-primary-dark text-white'
                      : 'bg-kiosk-bg border-kiosk-border text-kiosk-text-secondary hover:bg-kiosk-surface-alt'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Results list ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Empty state */}
        {results.length === 0 && (
          <div className="text-center py-20">
            <Search size={52} className="mx-auto mb-4 text-kiosk-text-muted" />
            <p className="text-2xl text-kiosk-text mb-2">No matches found</p>
            <p className="text-xl text-kiosk-text-secondary mb-8">
              {allInCategory.length === 0
                ? 'No entries in this category yet.'
                : 'Try a different search term or adjust your preferences.'}
            </p>
            {query.trim() && (
              <button
                onClick={() => setQuery('')}
                className="bg-kiosk-primary hover:bg-kiosk-primary-dark text-white text-lg px-8 py-4 rounded-2xl transition-all active:scale-95"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          {results.map(place => {
            const contentTags = place.tags
              .filter(t => !ATTRIBUTE_TAGS.has(t.toLowerCase()))
              .slice(0, 3);

            return (
              <button
                key={place.id}
                onClick={() => navigate(`/place/${place.id}`)}
                className="w-full bg-kiosk-surface hover:bg-kiosk-surface-alt border-2 border-kiosk-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] text-left"
                style={{ '--accent': accent } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.borderColor = accent + '80')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: accent }}
                  >
                    {place.type === 'event'
                      ? <Calendar size={30} className="text-white" />
                      : <MapPin size={30} className="text-white" />}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl text-kiosk-text mb-1 leading-snug">{place.name}</h2>

                    <p className="text-base text-kiosk-text-secondary mb-3 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    {/* Date / hours line */}
                    {(place.date || place.hours) && (
                      <p className="text-sm text-kiosk-text-secondary flex items-center gap-1.5 mb-3">
                        <Calendar size={13} />
                        {place.date
                          ? `${place.date}${place.time ? ` · ${place.time}` : ''}`
                          : place.hours}
                      </p>
                    )}

                    {/* Attribute chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {place.isFree
                        ? <span className={CHIP_BASE} style={chipStyle.free}>Free</span>
                        : <span className={CHIP_BASE} style={chipStyle.paid}>Paid</span>
                      }
                      <span className={CHIP_BASE} style={settingChipStyle(place.setting)}>
                        {settingLabel(place.setting)}
                      </span>
                      {place.familyFriendly && (
                        <span className={CHIP_BASE} style={chipStyle.family}>Family-Friendly</span>
                      )}
                      {place.accessible && (
                        <span className={CHIP_BASE} style={chipStyle.accessible}>Accessible</span>
                      )}
                    </div>

                    {/* Content tags */}
                    {contentTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {contentTags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs"
                            style={chipStyle.tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showPrefs && <PreferencesPanel onClose={() => setShowPrefs(false)} />}
    </div>
  );
}
