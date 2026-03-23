import { useNavigate } from 'react-router';
import { Calendar, UtensilsCrossed, Palette, Users, TreePine, Home } from 'lucide-react';
import { categories } from '../data/places';

const iconMap = {
  Calendar,
  UtensilsCrossed,
  Palette,
  Users,
  TreePine,
};

export function CategorySelectionScreen() {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent size={56} /> : null;
  };

  return (
    <div className="min-h-screen bg-kiosk-bg p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-kiosk-text-secondary hover:text-kiosk-text text-2xl flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
          >
            <Home size={32} />
            Back to Home
          </button>
          <h1 className="text-5xl text-kiosk-text mb-4">
            Choose a Category
          </h1>
          <p className="text-2xl text-kiosk-text-secondary">
            What would you like to explore today?
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/results/${category.id}`)}
              className="bg-kiosk-surface hover:bg-kiosk-surface-alt border-2 border-kiosk-border hover:border-kiosk-primary rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex flex-col items-center gap-6"
            >
              <div className="text-kiosk-primary">
                {getIcon(category.icon)}
              </div>
              <span className="text-3xl text-kiosk-text">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
