import { useNavigate } from 'react-router';
import { Calendar, UtensilsCrossed, Palette, Users, TreePine, Home, PlusCircle } from 'lucide-react';
import { categories } from '../data/places';

const iconMap = {
  Calendar,
  UtensilsCrossed,
  Palette,
  Users,
  TreePine,
};

const categoryColors: Record<string, { borderColor: string; iconColor: string }> = {
  events:  { borderColor: '#A692BC', iconColor: '#A692BC' },
  food:    { borderColor: '#C4845C', iconColor: '#C4845C' },
  arts:    { borderColor: '#7A9BB5', iconColor: '#7A9BB5' },
  outdoor: { borderColor: '#7A9B78', iconColor: '#7A9B78' },
};

export function CategorySelectionScreen() {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent size={52} /> : null;
  };

  return (
    <div className="h-screen bg-kiosk-bg p-6 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="mb-3 text-kiosk-text-secondary hover:text-kiosk-text text-xl flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
          >
            <Home size={26} />
            Back to Home
          </button>
          <h1 className="text-4xl text-kiosk-text mb-1">Choose a Category</h1>
          <p className="text-xl text-kiosk-text-secondary">What would you like to explore today?</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          {categories.map((category) => {
            const colors = categoryColors[category.id] ?? { borderColor: '#D9D7CF', iconColor: '#7F9478' };
            return (
              <button
                key={category.id}
                onClick={() => navigate(`/results/${category.id}`)}
                style={{ borderColor: colors.borderColor }}
                className="bg-kiosk-surface hover:bg-kiosk-surface-alt border-2 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-3"
              >
                <div style={{ color: colors.iconColor }}>
                  {getIcon(category.icon)}
                </div>
                <span className="text-xl text-kiosk-text">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Suggest a Place */}
        <div className="mt-4">
          <button
            onClick={() => navigate('/suggest')}
            style={{ borderColor: '#6B9B96' }}
            className="w-full bg-kiosk-surface hover:bg-kiosk-surface-alt border-2 rounded-3xl px-8 py-5 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex items-center gap-6"
          >
            <PlusCircle size={44} style={{ color: '#6B9B96' }} className="shrink-0" />
            <div className="text-left">
              <div className="text-xl text-kiosk-text">Suggest a Community Place</div>
              <div className="text-base text-kiosk-text-secondary">Know a great local spot? Share it with the community.</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
