
export default function Footer({ onNavigate }) {

  return (
    <footer className="relative bg-[#020203] text-white/50 pt-5 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heritage Timeline Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#FF5E00] to-[#0050FF] flex items-center justify-center text-white font-black font-['Space_Grotesk'] text-lg shadow-lg">
              GT-R
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-wide">
                NISSAN PERFORMANCE HERITAGE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('scrolly-top')}
              className="px-4 py-2 rounded-full glass-panel border border-white/10 text-xs text-white hover:text-[#00D6FF] transition-colors"
            >
              Replay Exploded View
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
