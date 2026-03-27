import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { categories } from '../data/places';

export function SuggestPlaceScreen() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    address: '',
    description: '',
    recommendation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isValid = form.name && form.category && form.address && form.description && form.recommendation;

  if (submitted) {
    return (
      <div className="min-h-screen bg-kiosk-bg flex items-center justify-center p-8 screen-enter">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-3xl p-12 shadow-sm">
            <div className="flex justify-center mb-6">
              <CheckCircle size={80} className="text-kiosk-primary" />
            </div>
            <h1 className="text-5xl text-kiosk-text mb-4">Thank You!</h1>
            <p className="text-2xl text-kiosk-text-secondary mb-2">
              <span className="text-kiosk-text font-medium">{form.name}</span> has been submitted.
            </p>
            <p className="text-xl text-kiosk-text-muted mb-12">
              Our volunteers will review your suggestion and add it to the board soon.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/categories')}
                className="bg-kiosk-primary hover:bg-kiosk-primary-dark text-white text-2xl px-10 py-6 rounded-2xl transition-all duration-200 active:scale-95"
              >
                Explore Places
              </button>
              <button
                onClick={() => { setForm({ name: '', category: '', address: '', description: '', recommendation: '' }); setSubmitted(false); }}
                className="text-kiosk-text-secondary hover:text-kiosk-text text-xl px-10 py-4 rounded-2xl hover:bg-kiosk-surface-alt transition-all active:scale-95"
              >
                Suggest Another Place
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kiosk-bg p-8 screen-enter">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-kiosk-text-secondary hover:text-kiosk-text text-2xl flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-kiosk-surface transition-all active:scale-95"
          >
            <ArrowLeft size={32} />
            Back to Home
          </button>
          <h1 className="text-5xl text-kiosk-text mb-4">Suggest a Place</h1>
          <p className="text-2xl text-kiosk-text-secondary">
            Know a great local spot? Share it with the community.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-2xl p-6">
            <label className="block text-xl text-kiosk-text-secondary mb-3">
              Place Name <span className="text-kiosk-primary">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Café on Main"
              className="w-full bg-kiosk-bg border-2 border-kiosk-border focus:border-kiosk-primary rounded-xl px-5 py-4 text-2xl text-kiosk-text placeholder:text-kiosk-text-muted outline-none transition-colors"
            />
          </div>

          {/* Category */}
          <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-2xl p-6">
            <label className="block text-xl text-kiosk-text-secondary mb-3">
              Category <span className="text-kiosk-primary">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-kiosk-bg border-2 border-kiosk-border focus:border-kiosk-primary rounded-xl px-5 py-4 text-2xl text-kiosk-text outline-none transition-colors"
            >
              <option value="" disabled>Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-2xl p-6">
            <label className="block text-xl text-kiosk-text-secondary mb-3">
              Address <span className="text-kiosk-primary">*</span>
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Clemson, SC"
              className="w-full bg-kiosk-bg border-2 border-kiosk-border focus:border-kiosk-primary rounded-xl px-5 py-4 text-2xl text-kiosk-text placeholder:text-kiosk-text-muted outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-2xl p-6">
            <label className="block text-xl text-kiosk-text-secondary mb-3">
              Brief Description <span className="text-kiosk-primary">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is this place? What do they offer?"
              rows={3}
              className="w-full bg-kiosk-bg border-2 border-kiosk-border focus:border-kiosk-primary rounded-xl px-5 py-4 text-2xl text-kiosk-text placeholder:text-kiosk-text-muted outline-none transition-colors resize-none"
            />
          </div>

          {/* Recommendation */}
          <div className="bg-kiosk-surface border-2 border-kiosk-border rounded-2xl p-6">
            <label className="block text-xl text-kiosk-text-secondary mb-3">
              Why do you recommend it? <span className="text-kiosk-primary">*</span>
            </label>
            <textarea
              name="recommendation"
              value={form.recommendation}
              onChange={handleChange}
              placeholder="Why should the community know about this place?"
              rows={3}
              className="w-full bg-kiosk-bg border-2 border-kiosk-border focus:border-kiosk-primary rounded-xl px-5 py-4 text-2xl text-kiosk-text placeholder:text-kiosk-text-muted outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-kiosk-primary hover:bg-kiosk-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-2xl px-10 py-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            Submit Suggestion
          </button>
        </form>
      </div>
    </div>
  );
}
