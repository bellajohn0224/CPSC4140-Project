import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, Heart, QrCode, Printer } from 'lucide-react';
import { getPlaceById } from '../data/places';

export function PlaceDetailScreen() {
  const navigate = useNavigate();
  const { placeId } = useParams<{ placeId: string }>();

  const place = placeId ? getPlaceById(placeId) : undefined;

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

  const handlePrint = () => {
    alert('Printing guide... (Mock functionality for demo)');
  };

  return (
    <div className="min-h-screen bg-kiosk-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-kiosk-text-secondary hover:text-kiosk-text text-2xl flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
        >
          <ArrowLeft size={32} />
          Back to Results
        </button>

        {/* Place Detail Card */}
        <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-3xl p-10 shadow-sm mb-8">
          {/* Icon Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 bg-kiosk-primary rounded-2xl flex items-center justify-center shrink-0">
              <MapPin size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-5xl text-kiosk-text mb-3">
                {place.name}
              </h1>
              <p className="text-2xl text-kiosk-text-secondary">
                {place.description}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mb-8 p-6 bg-kiosk-surface-alt rounded-2xl border border-kiosk-border">
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={28} className="text-kiosk-primary" />
              <h2 className="text-2xl text-kiosk-text-secondary">Address</h2>
            </div>
            <p className="text-2xl text-kiosk-text ml-10">
              {place.address}
            </p>
          </div>

          {/* Community Recommendation */}
          <div className="p-6 bg-kiosk-surface-alt rounded-2xl border border-kiosk-border">
            <div className="flex items-center gap-3 mb-4">
              <Heart size={28} className="text-kiosk-primary" />
              <h2 className="text-2xl text-kiosk-text-secondary">Why the Community Recommends It</h2>
            </div>
            <p className="text-2xl text-kiosk-text leading-relaxed ml-10">
              {place.recommendation}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate(`/qr/${place.id}`)}
            className="bg-kiosk-primary hover:bg-kiosk-primary-dark text-white text-2xl px-8 py-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-4"
          >
            <QrCode size={36} />
            Scan QR Code to Save
          </button>

          <button
            onClick={handlePrint}
            className="bg-kiosk-surface hover:bg-kiosk-surface-alt text-kiosk-text border-2 border-kiosk-border hover:border-kiosk-text-muted text-2xl px-8 py-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-4"
          >
            <Printer size={36} />
            Print Guide
          </button>
        </div>
      </div>
    </div>
  );
}
