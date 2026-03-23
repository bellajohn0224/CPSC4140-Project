import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Smartphone } from 'lucide-react';
import QRCode from 'react-qr-code';
import { getPlaceById } from '../data/places';

export function QRCodeScreen() {
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

  const placeUrl = `https://community-board.example.com/place/${place.id}`;

  return (
    <div className="min-h-screen bg-kiosk-bg p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-kiosk-text-secondary hover:text-kiosk-text text-2xl flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
        >
          <ArrowLeft size={32} />
          Back to Place Details
        </button>

        {/* QR Code Card */}
        <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-3xl p-12 shadow-sm text-center">
          <div className="mb-8">
            <h1 className="text-4xl text-kiosk-text mb-4">
              {place.name}
            </h1>
            <div className="flex items-center justify-center gap-3 text-2xl text-kiosk-primary">
              <Smartphone size={32} />
              <p>Scan to save this place on your phone</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-8 rounded-2xl inline-block mb-8 border-2 border-kiosk-border">
            <QRCode
              value={placeUrl}
              size={320}
              level="H"
              fgColor="#2F342F"
              bgColor="#ffffff"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-left max-w-xl mx-auto">
            <div className="bg-kiosk-surface-alt p-6 rounded-2xl border border-kiosk-border">
              <h2 className="text-2xl text-kiosk-text mb-3">How to scan:</h2>
              <ol className="text-xl text-kiosk-text-secondary space-y-2 list-decimal list-inside">
                <li>Open your phone's camera app</li>
                <li>Point it at the QR code above</li>
                <li>Tap the notification that appears</li>
                <li>The place details will open in your browser</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/categories')}
            className="text-kiosk-text-secondary hover:text-kiosk-text text-2xl px-8 py-4 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
          >
            Explore More Places
          </button>
        </div>
      </div>
    </div>
  );
}
