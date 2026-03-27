import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin } from 'lucide-react';
import { getPlacesByCategory, categories } from '../data/places';

const categoryAccent: Record<string, string> = {
  events:   '#A692BC',
  food:     '#C4845C',
  arts:     '#7A9BB5',
  outdoor:  '#7A9B78',
  shopping: '#C4A45C',
  other:    '#9B9B8A',
};

export function ResultsScreen() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const places = categoryId ? getPlacesByCategory(categoryId) : [];
  const category = categories.find(c => c.id === categoryId);
  const accent = categoryId ? (categoryAccent[categoryId] ?? '#7F9478') : '#7F9478';

  return (
    <div className="min-h-screen bg-kiosk-bg p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/categories')}
            className="mb-6 text-kiosk-text-secondary hover:text-kiosk-text text-2xl flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
          >
            <ArrowLeft size={32} />
            Back to Categories
          </button>
          <h1 className="text-5xl text-kiosk-text mb-4">
            {category?.name}
          </h1>
          <p className="text-2xl text-kiosk-text-secondary">
            Tap a place to learn more
          </p>
        </div>

        {/* Places List */}
        <div className="space-y-6">
          {places.map((place) => (
            <button
              key={place.id}
              onClick={() => navigate(`/place/${place.id}`)}
              style={{ borderColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
              className="w-full bg-kiosk-surface hover:bg-kiosk-surface-alt border-2 border-kiosk-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] text-left"
            >
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
                  <MapPin size={40} className="text-white" />
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl text-kiosk-text mb-3">
                    {place.name}
                  </h2>
                  <p className="text-xl text-kiosk-text-secondary mb-4">
                    {place.description}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-kiosk-surface-alt px-4 py-2 rounded-full text-lg border border-kiosk-border" style={{ color: accent }}>
                    <span>✓</span>
                    <span>Curated by local library volunteers</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {places.length === 0 && (
          <div className="text-center text-kiosk-text-muted text-2xl mt-20">
            No places found in this category
          </div>
        )}
      </div>
    </div>
  );
}
