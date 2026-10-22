import React, { useState } from 'react';
import Navbar from './components/Navbar';
import GtrScrollyCanvas from './components/GtrScrollyCanvas';
import AudioLabSection from './components/AudioLabSection';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#0050FF] selection:text-white pb-16">
      {/* Apple-style translucent floating top navigation */}
      <Navbar 
        onNavigate={handleNavigate} 
        soundEnabled={soundEnabled} 
        setSoundEnabled={setSoundEnabled} 
      />

      {/* Main Scrollytelling Pinned Canvas Experience (Beats 1 through 5) */}
      <main>
        <GtrScrollyCanvas />

        {/* Acoustic Harmonics & VR38DETT Engine Rev Lab */}
        <AudioLabSection 
          soundEnabled={soundEnabled} 
          setSoundEnabled={setSoundEnabled} 
        />
      </main>
    </div>
  );
}
