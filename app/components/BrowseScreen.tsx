import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Search, X, ArrowLeft, SlidersHorizontal,
  MapPin, Calendar, ChevronDown, ChevronUp, Settings2,
} from 'lucide-react';
import {
  places,
  categories,
  applyFilters,
  applySort,
  type FilterOptions,
  type SortOption,
  type Setting,
  type DateBucket,
  type Place,
} from '../data/places';
import { useSession, PREFERENCE_CONFIG } from '../context/SessionContext';
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

const DATE_BUCKET_OPTIONS: { value: DateBucket; label: string }[] = [
  { value: 'today',     label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'weekend',   label: 'This Weekend' },
  { value: 'upcoming',  label: 'Coming Up' },
  { value: 'recurring', label: 'Recurring' },
];

// Semantic attribute chip styles
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

// Active filter chip — used inside the filter panel header
const filterChipClass = (active: boolean) =>
  `px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
    active
      ? 'bg-kiosk-primary border-kiosk-primary-dark text-white'
      : 'bg-kiosk-bg border-kiosk-border text-kiosk-text-secondary hover:bg-kiosk-surface-alt'
  }`;

export function BrowseScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences, hasPreferences } = useSession();
  const [showPrefs, setShowPrefs] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const seed = (location.state ?? {}) as Partial<FilterOptions & { sort: SortOption }>;

  const [query, setQuery]                   = useState(seed.query ?? '');
  const [selCategories, setSelCategories]   = useState<string[]>(seed.categories ?? []);
  const [isFree, setIsFree]                 = useState<boolean | undefined>(seed.isFree);
  const [selSettings, setSelSettings]       = useState<Setting[]>(seed.settings ?? []);
  const [selDates, setSelDates]             = useState<DateBucket[]>(seed.dateBuckets ?? []);
  const [familyOnly, setFamilyOnly]         = useState(seed.familyFriendly ?? false);
  const [accessibleOnly, setAccessibleOnly] = useState(seed.accessible ?? false);
  const [sort, setSort]                     = useState<SortOption>('name-az');

  const hasActiveFilters =
    query.trim() !== '' ||
    selCategories.length > 0 ||
    isFree !== undefined ||
    selSettings.length > 0 ||
    selDates.length > 0 ||
    familyOnly ||
    accessibleOnly;

  const activeFilterCount = [
    selCategories.length > 0,
    isFree !== undefined,
    selSettings.length > 0,
    selDates.length > 0,
    familyOnly,
    accessibleOnly,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setQuery('');
    setSelCategories([]);
    setIsFree(undefined);
    setSelSettings([]);
    setSelDates([]);
    setFamilyOnly(false);
    setAccessibleOnly(false);
  };

  const filterOpts = useMemo((): FilterOptions => {
    const opts: FilterOptions = {
      query: query.trim() || undefined,
      categories: selCategories.length ? selCategories : undefined,
      isFree,
      settings: selSettings.length ? selSettings : undefined,
      dateBuckets: selDates.length ? selDates : undefined,
      familyFriendly: familyOnly || preferences.has('family-friendly') || undefined,
      accessible: accessibleOnly || preferences.has('accessible') || undefined,
    };
    if (preferences.has('affordable')) opts.isFree = true;
    if (preferences.has('outdoor') && !selSettings.length) opts.settings = ['outdoor', 'both'];
    return opts;
  }, [query, selCategories, isFree, selSettings, selDates, familyOnly, accessibleOnly, preferences]);

  const results = useMemo(() => {
    return applySort(applyFilters(places, filterOpts), sort);
  }, [filterOpts, sort]);

  const toggleCategory = (id: string) =>
    setSelCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const toggleSetting = (s: Setting) =>
    setSelSettings(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleDate = (d: DateBucket) =>
    setSelDates(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div className="min-h-screen bg-kiosk-bg flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="bg-kiosk-surface border-b-2 border-kiosk-border px-6 pt-4 pb-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto">

          {/* Nav row */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/categories')}
              className="p-3 rounded-2xl hover:bg-kiosk-surface-alt text-kiosk-text-secondary hover:text-kiosk-text transition-all active:scale-95"
            >
              <ArrowLeft size={26} />
            </button>
            <h1 className="text-2xl text-kiosk-text flex-1">Search Everything</h1>

            <button
              onClick={() => setShowPrefs(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-base transition-all active:scale-95 ${
                hasPreferences
                  ? 'bg-kiosk-primary border-kiosk-primary-dark text-white'
                  : 'bg-kiosk-bg border-kiosk-border text-kiosk-text-secondary hover:bg-kiosk-surface-alt'
              }`}
            >
              <Settings2 size={17} />
              {hasPreferences ? `${preferences.size} Active` : 'Preferences'}
            </button>
          </div>

          {/* Search input */}
          <div className="relative mb-3">
            <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-kiosk-text-muted pointer-events-none" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search places, events, activities, keywords…"
              className="w-full bg-kiosk-bg border-2 border-kiosk-border focus:border-kiosk-primary rounded-2xl pl-14 pr-12 py-4 text-xl text-kiosk-text placeholder:text-kiosk-text-muted outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-kiosk-text-muted hover:text-kiosk-text"
                aria-label="Clear search"
              >
                <X size={22} />
              </button>
            )}
          </div>

          {/* Filter toggle row */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(p => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-base font-medium transition-all active:scale-95 ${
                showFilters
                  ? 'bg-kiosk-primary border-kiosk-primary-dark text-white'
                  : 'bg-kiosk-bg border-kiosk-border text-kiosk-text-secondary hover:bg-kiosk-surface-alt'
              }`}
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFilterCount > 0 && !showFilters && (
                <span className="bg-kiosk-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ml-0.5">
                  {activeFilterCount}
                </span>
              )}
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Sort selector */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-base text-kiosk-text-secondary">Sort:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="bg-kiosk-bg border-2 border-kiosk-border rounded-xl px-3 py-2 text-base text-kiosk-text outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl text-kiosk-text-secondary hover:text-kiosk-text text-base font-medium hover:bg-kiosk-surface-alt active:scale-95 transition-all"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Expanded filter panel */}
          {showFilters && (
            <div className="mt-4 space-y-5 border-t border-kiosk-border pt-4">

              {/* Category */}
              <div>
                <p className="text-sm font-medium text-kiosk-text-secondary uppercase tracking-wide mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={filterChipClass(selCategories.includes(cat.id))}
                      style={selCategories.includes(cat.id) ? { backgroundColor: categoryAccent[cat.id], borderColor: 'transparent' } : {}}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost & Setting */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm font-medium text-kiosk-text-secondary uppercase tracking-wide mb-2">Cost</p>
                  <div className="flex gap-2">
                    {([['Free', true], ['Paid', false]] as [string, boolean][]).map(([label, val]) => (
                      <button
                        key={label}
                        onClick={() => setIsFree(isFree === val ? undefined : val)}
                        className={filterChipClass(isFree === val)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-kiosk-text-secondary uppercase tracking-wide mb-2">Setting</p>
                  <div className="flex gap-2">
                    {([['indoor', 'Indoor'], ['outdoor', 'Outdoor'], ['both', 'Indoor & Outdoor']] as [Setting, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => toggleSetting(val)}
                        className={filterChipClass(selSettings.includes(val))}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* When */}
              <div>
                <p className="text-sm font-medium text-kiosk-text-secondary uppercase tracking-wide mb-2">When (Events)</p>
                <div className="flex flex-wrap gap-2">
                  {DATE_BUCKET_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleDate(value)}
                      className={filterChipClass(selDates.includes(value))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility toggles */}
              <div>
                <p className="text-sm font-medium text-kiosk-text-secondary uppercase tracking-wide mb-2">Accessibility</p>
                <div className="flex gap-2">
                  <button onClick={() => setFamilyOnly(p => !p)} className={filterChipClass(familyOnly)}>
                    Family-Friendly
                  </button>
                  <button onClick={() => setAccessibleOnly(p => !p)} className={filterChipClass(accessibleOnly)}>
                    Accessible
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active preferences notice */}
          {hasPreferences && (
            <div className="mt-3 pt-3 border-t border-kiosk-border flex items-center gap-2 flex-wrap">
              <span className="text-sm text-kiosk-text-muted">Filtered by preferences:</span>
              {[...preferences].map(p => (
                <span
                  key={p}
                  className="text-sm px-3 py-1 rounded-full bg-kiosk-primary/15 text-kiosk-primary-dark border border-kiosk-primary/30"
                >
                  {PREFERENCE_CONFIG[p].label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────── */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-5xl mx-auto">

          {/* Result count */}
          <p className="text-base text-kiosk-text-secondary mb-5">
            {results.length === 0
              ? 'No results'
              : `${results.length} result${results.length !== 1 ? 's' : ''}`}
            {query.trim() && (
              <span> for <span className="text-kiosk-text font-medium">"{query.trim()}"</span></span>
            )}
          </p>

          {/* Empty state */}
          {results.length === 0 && (
            <div className="text-center py-20">
              <Search size={52} className="mx-auto mb-4 text-kiosk-text-muted" />
              <p className="text-2xl text-kiosk-text mb-2">No matches found</p>
              <p className="text-xl text-kiosk-text-secondary mb-8">
                Try a different search term or adjust your filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-kiosk-primary hover:bg-kiosk-primary-dark text-white text-lg px-8 py-4 rounded-2xl transition-all active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Cards */}
          <div className="space-y-4">
            {results.map(place => {
              const accent = categoryAccent[place.category] ?? '#7F9478';
              const cat = categories.find(c => c.id === place.category);
              const contentTags = place.tags
                .filter(t => !ATTRIBUTE_TAGS.has(t.toLowerCase()))
                .slice(0, 3);

              return (
                <button
                  key={place.id}
                  onClick={() => navigate(`/place/${place.id}`)}
                  className="w-full bg-kiosk-surface hover:bg-kiosk-surface-alt border-2 border-kiosk-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] text-left"
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
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h2 className="text-xl text-kiosk-text leading-snug">{place.name}</h2>
                        {/* Category label */}
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0 mt-0.5"
                          style={{ backgroundColor: accent + '25', color: accent }}
                        >
                          {cat?.name}
                        </span>
                      </div>

                      <p className="text-base text-kiosk-text-secondary mb-3 line-clamp-2 leading-relaxed">
                        {place.description}
                      </p>

                      {/* Date for events */}
                      {place.date && (
                        <p className="text-sm text-kiosk-text-secondary flex items-center gap-1.5 mb-3">
                          <Calendar size={13} />
                          {place.date}{place.time ? ` · ${place.time}` : ''}
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
      </div>

      {showPrefs && <PreferencesPanel onClose={() => setShowPrefs(false)} />}
    </div>
  );
}
