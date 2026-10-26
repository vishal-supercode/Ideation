import { useState } from 'react';
import { Check, ChevronRight, Car } from 'lucide-react';

const COLORS = [
  {
    id: 'katsura',
    name: 'Katsura Orange',
    hex: '#FF5E00',
    type: 'Signature Quad-Coat Metallic',
    price: 1000,
    desc: 'The defining launch color. Saturated orange with gold-flake clear coat reflecting ambient light with intense depth.',
  },
  {
    id: 'bayside',
    name: 'Bayside Blue',
    hex: '#0050FF',
    type: 'Heritage Heritage Metallic',
    price: 1000,
    desc: 'Iconic heritage shade paying homage to the legendary R34 Skyline GT-R.',
  },
  {
    id: 'silver',
    name: 'Super Silver',
    hex: '#D1D5DB',
    type: 'Multi-Coat Hand-Polished',
    price: 3000,
    desc: 'Hand-buffed three times between each clear coat for a liquid mercury sheen.',
  },
  {
    id: 'purple',
    name: 'Midnight Purple',
    hex: '#581C87',
    type: 'Iridescent Pearl Flake',
    price: 1500,
    desc: 'Dynamic color-shifting pigments that flip from deep violet to emerald under varying lighting.',
  },
  {
    id: 'black',
    name: 'Solid Jet Black',
    hex: '#111827',
    type: 'Obsidian Clear Gloss',
    price: 0,
    desc: 'Deep monolithic obsidian highlighting the GT-R silhouette and quad taillight rings.',
  },
  {
    id: 'white',
    name: 'Pearl White',
    hex: '#F9FAFB',
    type: 'Tri-Coat Crystal Metallic',
    price: 0,
    desc: 'Ultra-bright luminescent pearl contrasting sharply against raw carbon aerodynamic elements.',
  },
];

const TRIMS = [
  {
    id: 'premium',
    name: 'GT-R Premium',
    basePrice: 121090,
    hp: 565,
    highlights: ['565 HP VR38DETT V6', 'RAYS® 20" Forged Wheels', 'Bose® 11-Speaker Audio', 'Titanium Quad Exhaust'],
  },
  {
    id: 'tspec',
    name: 'GT-R T-Spec',
    basePrice: 141090,
    hp: 565,
    highlights: ['Carbon Ceramic Brembo Brakes', 'Gold Forged RAYS® Wheels', 'Exclusive Mori Green Interior', 'Carbon Fiber Rear Spoiler'],
  },
  {
    id: 'nismo',
    name: 'GT-R NISMO',
    basePrice: 221090,
    hp: 600,
    highlights: ['600 HP GT3-Spec Turbos', 'Dry Carbon Roof & Hood', 'Swan-Neck Carbon Wing', 'NISMO Recaro® Carbon Seats'],
  },
];

const WHEELS = [
  { id: 'rays-silver', name: '20" RAYS® Machine-Finish Alloy', price: 0 },
  { id: 'rays-gold', name: '20" RAYS® T-Spec Ultra-Light Gold', price: 2200 },
  { id: 'nismo-black', name: '20" NISMO Forged Satin Black', price: 3500 },
];

export default function ConfiguratorSection() {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedTrim, setSelectedTrim] = useState(TRIMS[0]);
  const [selectedWheel, setSelectedWheel] = useState(WHEELS[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', zip: '' });

  const totalPrice = selectedTrim.basePrice + selectedColor.price + selectedWheel.price;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="configurator-section" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070709] text-white border-t border-white/5">
      {/* Background radial glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-200 h-200 blur-[160px] pointer-events-none transition-colors duration-700 opacity-20"
        style={{ backgroundColor: selectedColor.hex }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/4 border border-white/10 text-[11px] font-mono tracking-widest uppercase text-[#00D6FF] mb-3">
            <Car className="w-3.5 h-3.5 text-[#00D6FF]" />
            CUSTOM SPECIFICATION STUDIO
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Tailor your <br />
            <span className="text-gradient-cyan">Flagship Machine.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed font-light">
            Select authentic Nissan heritage paint finishes, performance packages, and forged alloy options to configure your custom GT-R allocation.
          </p>
        </div>

        {/* Configurator Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Preview Card */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            {/* Swatch Aura */}
            <div className="relative aspect-video w-full rounded-2xl bg-black/60 border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6">
              
              {/* Dynamic Color Ring */}
              <div 
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-[70px] opacity-40 transition-all duration-700"
                style={{ backgroundColor: selectedColor.hex }}
              />

              {/* Visualized GT-R Badge & Silhouette Silhouette */}
              <div className="relative z-10 text-center space-y-2">
                <div 
                  className="w-16 h-1.5 mx-auto rounded-full transition-all duration-500 shadow-lg"
                  style={{ backgroundColor: selectedColor.hex, boxShadow: `0 0 20px ${selectedColor.hex}` }}
                />
                <div className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] tracking-wider text-white">
                  NISSAN GT-R
                </div>
                <div className="text-sm font-semibold tracking-wide text-white/80">
                  {selectedTrim.name} . {selectedColor.name}
                </div>
                <div className="text-xs font-mono text-[#00D6FF]">
                  {selectedWheel.name}
                </div>
              </div>

              {/* Corner Watermarks */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-white/40">
                PAINT CODE: {selectedColor.id.toUpperCase()}
              </div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-white/40">
                565-600 HP ALLOCATION
              </div>
              <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/40">
                TAKUMI CERTIFIED
              </div>
              <div className="absolute bottom-4 right-4 text-xs font-mono font-bold text-white">
                MSRP: ${totalPrice.toLocaleString()}*
              </div>
            </div>

            {/* Selected Color Description */}
            <div className="mt-6 p-4 rounded-xl bg-white/2 border border-white/5 flex items-start gap-4">
              <div 
                className="w-8 h-8 rounded-full shrink-0 shadow-md border border-white/20 mt-0.5"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{selectedColor.name}</span>
                  <span className="text-[10px] font-mono text-white/40">({selectedColor.type})</span>
                  {selectedColor.price > 0 && (
                    <span className="text-[10px] font-mono text-[#00D6FF]">+${selectedColor.price}</span>
                  )}
                </div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">{selectedColor.desc}</p>
              </div>
            </div>
          </div>

          {/* Right: Selection Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Trim Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-[#00D6FF] tracking-wider block">
                01. SELECT MODEL GRADE
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TRIMS.map((trim) => {
                  const isSelected = selectedTrim.id === trim.id;
                  return (
                    <button
                      key={trim.id}
                      onClick={() => setSelectedTrim(trim)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'glass-panel border-[#00D6FF] bg-white/8 shadow-[0_0_15px_rgba(0,214,255,0.2)]'
                          : 'bg-white/2 border-white/5 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <div className="text-xs font-bold text-white truncate">{trim.name}</div>
                      <div className="text-[10px] font-mono text-white/50 mt-1">${(trim.basePrice / 1000).toFixed(0)}k</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Paint Color Swatches */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase text-[#00D6FF] tracking-wider block">
                  02. EXTERIOR PAINTWORK
                </label>
                <span className="text-xs text-white/60 font-mono">{selectedColor.name}</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {COLORS.map((col) => {
                  const isSelected = selectedColor.id === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColor(col)}
                      title={col.name}
                      className={`relative aspect-square rounded-xl transition-all duration-200 border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10' 
                          : 'border-white/10 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    >
                      {isSelected && <Check className={`w-3.5 h-3.5 ${col.id === 'white' ? 'text-black' : 'text-white'}`} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Forged Wheel Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-[#00D6FF] tracking-wider block">
                03. WHEELS & CALIPERS
              </label>
              <div className="space-y-2">
                {WHEELS.map((wheel) => {
                  const isSelected = selectedWheel.id === wheel.id;
                  return (
                    <button
                      key={wheel.id}
                      onClick={() => setSelectedWheel(wheel)}
                      className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'glass-panel border-[#00D6FF]/50 bg-white/8'
                          : 'bg-white/2 border-white/5 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <span className="text-xs font-medium text-white">{wheel.name}</span>
                      <span className="text-xs font-mono text-[#00D6FF]">
                        {wheel.price === 0 ? 'Included' : `+$${wheel.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Breakdown & CTA */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-mono text-white/50 block">ESTIMATED TOTAL MSRP</span>
                  <span className="text-3xl font-black text-white font-mono">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/40">*Excludes destination & tax</span>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 rounded-full font-semibold text-sm bg-linear-to-r from-[#0050FF] to-[#00D6FF] text-white hover:shadow-[0_0_25px_rgba(0,214,255,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Request Custom Allocation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Allocation Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => {
                setModalOpen(false);
                setSubmitted(false);
              }}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-sm font-mono"
            >
              ✕ CLOSE
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-[10px] font-mono text-[#00D6FF] uppercase tracking-wider">
                  OFFICIAL ORDER REQUEST
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Reserve Your GT-R
                </h3>
                <p className="text-xs text-white/60">
                  Spec: <span className="text-white font-semibold">{selectedTrim.name}</span> in <span className="text-[#FF5E00] font-semibold">{selectedColor.name}</span> (${totalPrice.toLocaleString()}).
                </p>

                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Legal Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#00D6FF]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#00D6FF]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#00D6FF]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="ZIP / Postal Code"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#00D6FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded-full font-bold text-xs bg-linear-to-r from-[#0050FF] to-[#00D6FF] text-white hover:shadow-[0_0_20px_rgba(0,214,255,0.4)] transition-all"
                >
                  Submit Allocation Request
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white">Allocation Priority Reserved</h4>
                <p className="text-xs text-white/70 max-w-sm mx-auto">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. A Nissan Performance Specialist will contact you within 24 hours regarding delivery timelines and Takumi engine plaque assignment.
                </p>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setSubmitted(false);
                  }}
                  className="px-6 py-2 rounded-full glass-panel border border-white/15 text-xs text-white hover:bg-white/10 transition-colors"
                >
                  Return to Showcase
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
