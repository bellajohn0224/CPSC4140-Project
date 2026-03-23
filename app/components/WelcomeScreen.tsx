import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kiosk-bg flex items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-12">
          <h1 className="text-6xl mb-6 text-kiosk-text">
            Community Discovery Board
          </h1>
          <p className="text-3xl text-kiosk-text-secondary">
            Explore local places recommended by your community
          </p>
        </div>

        <button
          onClick={() => navigate('/categories')}
          className="bg-kiosk-primary hover:bg-kiosk-primary-dark text-white text-3xl px-16 py-8 rounded-3xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 inline-flex items-center gap-4"
        >
          Start Exploring
          <ArrowRight size={40} />
        </button>

        <div className="mt-16 text-kiosk-text-muted text-xl">
          Touch the button above to begin
        </div>
      </div>
    </div>
  );
}
