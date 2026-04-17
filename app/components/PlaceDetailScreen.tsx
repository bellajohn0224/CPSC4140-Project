import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, Heart, QrCode, Printer, Clock, Calendar } from 'lucide-react';
import { getPlaceById, categories, type Place } from '../data/places';

const categoryAccent: Record<string, string> = {
  events:   '#A692BC',
  food:     '#C4845C',
  arts:     '#7A9BB5',
  outdoor:  '#7A9B78',
  shopping: '#C4A45C',
  other:    '#9B9B8A',
};

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

const CHIP_BASE = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';

// Tags that duplicate structured attributes — filter from the content tags display
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

export function PlaceDetailScreen() {
  const navigate    = useNavigate();
  const { placeId } = useParams<{ placeId: string }>();

  const place  = placeId ? getPlaceById(placeId) : undefined;
  const accent = place ? (categoryAccent[place.category] ?? '#7F9478') : '#7F9478';
  const cat    = place ? categories.find(c => c.id === place.category) : undefined;

  if (!place) {
    return (
      <div className="min-h-screen bg-kiosk-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl text-kiosk-text-secondary mb-8">Place not found</p>
          <button
            onClick={() => navigate('/categories')}
            className="bg-kiosk-primary hover:bg-kiosk-primary-dark text-white text-2xl px-8 py-4 rounded-2xl transition-all duration-200"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const contentTags = place.tags.filter(t => !ATTRIBUTE_TAGS.has(t.toLowerCase()));

  return (
    <div className="min-h-screen bg-kiosk-bg p-6">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-kiosk-text-secondary hover:text-kiosk-text text-xl flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
        >
          <ArrowLeft size={26} />
          Back to Results
        </button>

        {/* ── Main card ──────────────────────────────────── */}
        <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-3xl p-8 shadow-sm mb-6">

          {/* Header row */}
          <div className="flex items-start gap-5 mb-6">
            {/* Category icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: accent }}
            >
              {place.type === 'event'
                ? <Calendar size={40} className="text-white" />
                : <MapPin size={40} className="text-white" />}
            </div>

            <div className="flex-1">
              {/* Category label */}
              <div className="mb-2">
                <span
                  className="text-sm px-3 py-1 rounded-full font-medium"
                  style={{ backgroundColor: accent + '22', color: accent }}
                >
                  {cat?.name}
                </span>
              </div>

              <h1 className="text-4xl text-kiosk-text mb-3 leading-tight">{place.name}</h1>
              <p className="text-xl text-kiosk-text-secondary leading-relaxed">
                {place.description}
              </p>
            </div>
          </div>

          {/* ── Attribute chips ─────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-kiosk-border">
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

          {/* ── Info rows ───────────────────────────────── */}
          <div className="space-y-3">

            {/* Address */}
            <div className="flex items-start gap-3 p-5 bg-kiosk-surface-alt rounded-2xl border border-kiosk-border">
              <MapPin size={22} style={{ color: accent }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-kiosk-text-secondary mb-0.5 uppercase tracking-wide font-medium">Address</p>
                <p className="text-xl text-kiosk-text">{place.address}</p>
              </div>
            </div>

            {/* Hours or Date/Time */}
            {(place.hours || place.date) && (
              <div className="flex items-start gap-3 p-5 bg-kiosk-surface-alt rounded-2xl border border-kiosk-border">
                {place.type === 'event'
                  ? <Calendar size={22} style={{ color: accent }} className="mt-0.5 shrink-0" />
                  : <Clock    size={22} style={{ color: accent }} className="mt-0.5 shrink-0" />
                }
                <div>
                  <p className="text-sm text-kiosk-text-secondary mb-0.5 uppercase tracking-wide font-medium">
                    {place.type === 'event' ? 'When' : 'Hours'}
                  </p>
                  <p className="text-xl text-kiosk-text">
                    {place.type === 'event'
                      ? `${place.date ?? ''}${place.time ? ` · ${place.time}` : ''}`
                      : place.hours}
                  </p>
                </div>
              </div>
            )}

            {/* Community recommendation */}
            <div className="flex items-start gap-3 p-5 bg-kiosk-surface-alt rounded-2xl border border-kiosk-border">
              <Heart size={22} style={{ color: accent }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-kiosk-text-secondary mb-1 uppercase tracking-wide font-medium">
                  Why the Community Recommends It
                </p>
                <p className="text-xl text-kiosk-text leading-relaxed">{place.recommendation}</p>
              </div>
            </div>

            {/* Content tags */}
            {contentTags.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-kiosk-text-secondary mb-2 uppercase tracking-wide font-medium">
                  Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {contentTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                      style={chipStyle.tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Action buttons ─────────────────────────────── */}
        <div className="grid grid-cols-2 gap-5">
          <button
            onClick={() => navigate(`/qr/${place.id}`)}
            style={{ backgroundColor: accent }}
            className="text-white text-xl px-6 py-7 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-4"
          >
            <QrCode size={32} />
            Scan QR Code to Save
          </button>

          <button
            onClick={() => alert('Printing guide… (Mock functionality for demo)')}
            className="bg-kiosk-surface hover:bg-kiosk-surface-alt text-kiosk-text border-2 border-kiosk-border hover:border-kiosk-text-muted text-xl px-6 py-7 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-4"
          >
            <Printer size={32} />
            Print Guide
          </button>
        </div>

        {/* Back to categories link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/categories')}
            className="text-kiosk-text-secondary hover:text-kiosk-text text-lg px-6 py-3 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
          >
            Back to All Categories
          </button>
        </div>

      </div>
    </div>
  );
}
