import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [currentZone, setCurrentZone] = useState('surface');
  const [activeModal, setActiveModal] = useState(null);
  
  const [settings, setSettings] = useState({
    sound: true,
    particles: true,
    intensity: 70
  });

  const [bubbles, setBubbles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [fishList, setFishList] = useState([]);
  const [jellyfish, setJellyfish] = useState([]);
  const [anglerfish, setAnglerfish] = useState([]);

  const zones = {
    surface: {
      name: 'Sunlight Zone',
      depth: '0 - 200m',
      bg: 'linear-gradient(180deg, #4da7db 0%, #11538c 100%)',
      color: '#ffffff',
      accent: '#00ffff'
    },
    twilight: {
      name: 'Twilight Zone',
      depth: '200m - 1000m',
      bg: 'linear-gradient(180deg, #11538c 0%, #062659 100%)',
      color: '#e0f2fe',
      accent: '#38bdf8'
    },
    midnight: {
      name: 'Midnight Zone',
      depth: '1000m - 4000m',
      bg: 'linear-gradient(180deg, #062659 0%, #020c24 100%)',
      color: '#93c5fd',
      accent: '#60a5fa'
    },
    abyss: {
      name: 'The Abyss',
      depth: '4000m+',
      bg: 'linear-gradient(180deg, #020c24 0%, #00030a 100%)',
      color: '#c7d2fe',
      accent: '#818cf8'
    }
  };

  const zoneOrder = ['surface', 'twilight', 'midnight', 'abyss'];

  useEffect(() => {
    if (!settings.particles) {
      setBubbles([]);
      setParticles([]);
      setFishList([]);
      setJellyfish([]);
      setAnglerfish([]);
      return;
    }

    const count = Math.floor(25 * (settings.intensity / 100));
    const generatedBubbles = Array.from({ length: count }, (_, i) => ({
      id: `b-${i}`,
      left: Math.random() * 100,
      size: Math.random() * 12 + 4,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 4,
      sway: Math.random() * 30 + 10
    }));

    const generatedParticles = Array.from({ length: count * 1.5 }, (_, i) => ({
      id: `p-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6
    }));

    const generatedFish = Array.from({ length: 7 }, (_, i) => {
      const roll = Math.random();
      const type = roll < 0.55 ? 'fish' : roll < 0.75 ? 'ray' : roll < 0.9 ? 'shark' : 'turtle';
      const baseSize = type === 'ray' ? Math.random() * 20 + 25
        : type === 'turtle' ? Math.random() * 14 + 18
        : type === 'shark' ? Math.random() * 20 + 30
        : Math.random() * 20 + 14;
      return {
        id: `f-${i}`,
        type,
        top: Math.random() * 70 + 15,
        size: baseSize,
        duration: type === 'shark' ? Math.random() * 10 + 14 : Math.random() * 15 + 10,
        delay: Math.random() * 10,
        direction: Math.random() > 0.5 ? 'left' : 'right',
        hue: Math.random() * 40 - 20
      };
    });

    const generatedJelly = Array.from({ length: 3 }, (_, i) => ({
      id: `j-${i}`,
      left: Math.random() * 80 + 10,
      size: Math.random() * 40 + 30,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 6
    }));

    const generatedAnglers = Array.from({ length: 2 }, (_, i) => ({
      id: `a-${i}`,
      top: Math.random() * 50 + 25,
      size: Math.random() * 20 + 30,
      duration: Math.random() * 20 + 22,
      delay: Math.random() * 12,
      direction: Math.random() > 0.5 ? 'left' : 'right'
    }));

    setBubbles(generatedBubbles);
    setParticles(generatedParticles);
    setFishList(generatedFish);
    setJellyfish(generatedJelly);
    setAnglerfish(generatedAnglers);
  }, [settings.particles, settings.intensity]);

  const cycleZone = () => {
    const nextIndex = (zoneOrder.indexOf(currentZone) + 1) % zoneOrder.length;
    setCurrentZone(zoneOrder[nextIndex]);
  };

  const menuButtons = [
    { label: 'Explore Ocean', action: cycleZone, primary: true },
    { label: 'Start Challenge', action: () => setActiveModal('challenge') },
    { label: 'Settings', action: () => setActiveModal('settings') }
  ];

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      background: zones[currentZone].bg,
      color: zones[currentZone].color,
      transition: 'background 2.5s cubic-bezier(0.25, 1, 0.5, 1), color 2s ease',
      position: 'relative',
      userSelect: 'none'
    }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap');
        @keyframes floatUp {
          0% { transform: translateY(110vh) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) translateX(var(--sway)); opacity: 0; }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; }
          50% { transform: translate(20px, -20px) rotate(5deg); opacity: 0.6; }
        }
        @keyframes swimLeft {
          0% { left: 110%; transform: scaleX(1); }
          100% { left: -20%; transform: scaleX(1); }
        }
        @keyframes swimRight {
          0% { left: -20%; transform: scaleX(-1); }
          100% { left: 110%; transform: scaleX(-1); }
        }
        @keyframes jellyDrift {
          0% { transform: translateY(105vh) scale(1); opacity: 0; }
          10% { opacity: 0.7; }
          50% { transform: translateY(50vh) scale(1.05); }
          90% { opacity: 0.7; }
          100% { transform: translateY(-10vh) scale(0.95); opacity: 0; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        @keyframes waveMove {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-25%) scaleY(1.1); }
          100% { transform: translateX(-50%) scaleY(1); }
        }
        @keyframes swayKelp {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes pulseLure {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .menu-btn:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 25px rgba(0,0,0,0.4), 0 0 15px var(--accent);
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: var(--accent) !important;
        }
        .menu-btn:active {
          transform: translateY(-1px);
        }
      `}</style>

      {currentZone === 'surface' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '15%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 60%, 85% 70%, 70% 55%, 55% 75%, 40% 60%, 25% 70%, 10% 50%, 0% 65%)',
          animation: 'waveMove 12s infinite linear',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />
      )}

      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        width: '70%',
        height: '100%',
        background: 'repeating-linear-gradient(95deg, transparent, rgba(255,255,255,0.03) 4%, rgba(255,255,255,0.07) 7%, transparent 12%)',
        clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
        opacity: currentZone === 'surface' ? 0.7 : currentZone === 'twilight' ? 0.4 : 0.1,
        animation: 'shimmer 8s infinite ease-in-out',
        pointerEvents: 'none',
        transition: 'opacity 2.5s ease'
      }} />

      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.left}%`,
          top: `${p.top}%`,
          width: p.size,
          height: p.size,
          backgroundColor: zones[currentZone].accent,
          borderRadius: '50%',
          opacity: 0.3,
          filter: 'blur(1px)',
          animation: `drift ${p.duration}s infinite ease-in-out`,
          animationDelay: `${p.delay}s`,
          pointerEvents: 'none'
        }} />
      ))}

      {bubbles.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          left: `${b.left}%`,
          bottom: '-20px',
          width: b.size,
          height: b.size,
          border: `1px solid rgba(255,255,255,0.4)`,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          animation: 'floatUp var(--dur) infinite linear',
          animationDelay: `${b.delay}s`,
          pointerEvents: 'none',
          '--dur': `${b.duration}s`,
          '--sway': `${b.sway}px`
        }} />
      ))}

      {fishList.map(f => (
        <div key={f.id} style={{
          position: 'absolute',
          top: `${f.top}%`,
          width: f.type === 'ray' ? f.size * 2.2 : f.size * 2,
          height: f.type === 'ray' ? f.size * 0.9 : f.size,
          animation: `${f.direction === 'left' ? 'swimLeft' : 'swimRight'} ${f.duration}s infinite linear`,
          animationDelay: `${f.delay}s`,
          opacity: currentZone === 'surface' || currentZone === 'twilight' ? 0.5 : 0.15,
          transition: 'opacity 2s ease',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {f.type === 'ray' && (
            <svg viewBox="0 0 120 60" style={{ width: '100%', height: '100%', fill: zones[currentZone].accent, filter: `hue-rotate(${f.hue}deg) drop-shadow(0 0 5px ${zones[currentZone].accent})` }}>
              <path d="M60,30 C40,5 10,10 0,30 C10,50 40,55 60,30 C80,55 110,50 120,30 C110,10 80,5 60,30 Z M60,30 L60,52 L52,44 M60,30 L60,52 L68,44" />
            </svg>
          )}
          {f.type === 'shark' && (
            <svg viewBox="0 0 120 50" style={{ width: '100%', height: '100%', fill: zones[currentZone].accent, filter: `hue-rotate(${f.hue}deg) drop-shadow(0 0 5px ${zones[currentZone].accent})` }}>
              <path d="M5,30 C25,10 70,8 110,22 L120,15 L112,28 L120,32 L108,32 C90,42 40,45 5,30 Z M35,10 L45,22 L28,22 Z" />
            </svg>
          )}
          {f.type === 'turtle' && (
            <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%', fill: zones[currentZone].accent, filter: `hue-rotate(${f.hue}deg) drop-shadow(0 0 5px ${zones[currentZone].accent})` }}>
              <ellipse cx="50" cy="32" rx="28" ry="20" />
              <path d="M22,20 C10,15 2,20 6,28 C10,26 18,26 24,30 Z M78,20 C90,15 98,20 94,28 C90,26 82,26 76,30 Z M22,44 C10,49 2,44 6,36 C10,38 18,38 24,34 Z M78,44 C90,49 98,44 94,36 C90,38 82,38 76,34 Z M50,12 C56,8 62,10 60,16 C57,14 53,14 50,17 Z" />
            </svg>
          )}
          {f.type === 'fish' && (
            <svg viewBox="0 0 100 50" style={{ width: '100%', height: '100%', fill: zones[currentZone].accent, filter: `hue-rotate(${f.hue}deg) drop-shadow(0 0 5px ${zones[currentZone].accent})` }}>
              <path d="M10,25 C30,5 70,10 85,25 C70,40 30,45 10,25 Z M85,25 L100,13 L95,25 L100,37 Z" />
            </svg>
          )}
        </div>
      ))}

      {(currentZone === 'midnight' || currentZone === 'abyss') && jellyfish.map(j => (
        <div key={j.id} style={{
          position: 'absolute',
          left: `${j.left}%`,
          width: j.size,
          height: j.size * 1.5,
          animation: `jellyDrift ${j.duration}s infinite ease-in-out`,
          animationDelay: `${j.delay}s`,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <svg viewBox="0 0 100 150" style={{ width: '100%', height: '100%', fill: 'none', stroke: zones[currentZone].accent, strokeWidth: 2, opacity: 0.6, filter: 'drop-shadow(0 0 8px #fff)' }}>
            <path d="M20,50 C20,10 80,10 80,50 C80,60 20,60 20,50 Z" fill={`${zones[currentZone].accent}33`} />
            <path d="M30,55 Q35,100 25,140 M42,58 Q40,95 45,135 M58,58 Q60,105 55,145 M70,55 Q65,95 75,138" strokeWidth={1.5} strokeDasharray="2,2" />
          </svg>
        </div>
      ))}

      {(currentZone === 'midnight' || currentZone === 'abyss') && anglerfish.map(a => (
        <div key={a.id} style={{
          position: 'absolute',
          top: `${a.top}%`,
          width: a.size * 1.8,
          height: a.size,
          animation: `${a.direction === 'left' ? 'swimLeft' : 'swimRight'} ${a.duration}s infinite linear`,
          animationDelay: `${a.delay}s`,
          opacity: 0.85,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <path d="M8,32 C8,15 30,8 50,14 C68,19 72,32 68,42 C58,52 25,52 12,42 C9,39 8,36 8,32 Z" fill="#1a1420" stroke={zones[currentZone].accent} strokeWidth="1" opacity="0.9" />
            <path d="M15,24 Q5,10 -5,4" fill="none" stroke="#1a1420" strokeWidth="2" />
            <circle cx="-5" cy="4" r="4" fill="#fffbe0" style={{ animation: 'pulseLure 2.4s infinite ease-in-out', filter: 'drop-shadow(0 0 6px #fffbe0)' }} />
          </svg>
        </div>
      ))}

      <div style={{
        position: 'absolute',
        bottom: -10,
        left: -20,
        right: -20,
        height: '14vh',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: currentZone === 'abyss' ? 0.8 : 0.4,
        transition: 'opacity 2s ease'
      }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            width: '6vw',
            height: `${5 + Math.random() * 15}vh`,
            background: `linear-gradient(0deg, #010814 20%, ${zones[currentZone].accent}22 100%)`,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            transformOrigin: 'bottom center',
            animation: `swayKelp ${4 + Math.random() * 3}s infinite ease-in-out`,
            animationDelay: `${Math.random() * -3}s`
          }} />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        textAlign: 'right',
        zIndex: 10,
        borderRight: `3px solid ${zones[currentZone].accent}`,
        paddingRight: 15
      }}>
        <div style={{ fontSize: '0.8rem', letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6 }}>Current Layer</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', fontFamily: "'Fraunces', Georgia, serif" }}>{zones[currentZone].name}</div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8, fontFamily: 'monospace', marginTop: 2 }}>{zones[currentZone].depth}</div>
      </div>

      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 20px',
        position: 'relative',
        zIndex: 5
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{
            fontSize: '0.85rem',
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: zones[currentZone].accent,
            fontWeight: 600,
            marginBottom: 10,
            transition: 'color 2s ease'
          }}>
            HACKATHON 2026
          </div>
          
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 600,
            fontStyle: 'italic',
            margin: 0,
            letterSpacing: 0,
            lineHeight: 0.95,
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            Under the Surface
          </h1>

          <p style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
            fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            letterSpacing: 1,
            opacity: 0.75,
            marginTop: 15,
            color: '#e0f2fe'
          }}>
            Discover the unknown
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: '100%',
          maxWidth: 340,
          '--accent': zones[currentZone].accent
        }}>
          {menuButtons.map((btn, index) => (
            <button
              key={index}
              onClick={btn.action}
              className="menu-btn"
              style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#ffffff',
                background: btn.primary ? `${zones[currentZone].accent}22` : 'rgba(0, 0, 0, 0.4)',
                border: `2px solid ${btn.primary ? zones[currentZone].accent : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                textAlign: 'center',
                outline: 'none'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 25,
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        opacity: 0.5,
        letterSpacing: 1
      }}>
        BROUGHT TO YOU BY <a href="https://bidaya.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>BIDAYA</a>
      </div>

      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 3, 15, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: '#081226',
            border: `1px solid ${zones[currentZone].accent}66`,
            borderRadius: 8,
            width: '100%',
            maxWidth: 550,
            padding: 35,
            position: 'relative',
            color: '#e2e8f0'
          }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.4rem',
                cursor: 'pointer',
                opacity: 0.7
              }}
            >
              ✕
            </button>

            {activeModal === 'settings' && (
              <div>
                <h3 style={{ margin: '0 0 25px 0', fontSize: '1.5rem', letterSpacing: 2, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>SYSTEM CONFIGURATION</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, letterSpacing: 1 }}>HYDRO-ACOUSTICS (SOUND)</span>
                    <input 
                      type="checkbox" 
                      checked={settings.sound} 
                      onChange={(e) => setSettings({ ...settings, sound: e.target.checked })}
                      style={{ width: 20, height: 20, accentColor: zones[currentZone].accent }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, letterSpacing: 1 }}>BIOLUMINESCENT PARTICLES</span>
                    <input 
                      type="checkbox" 
                      checked={settings.particles} 
                      onChange={(e) => setSettings({ ...settings, particles: e.target.checked })}
                      style={{ width: 20, height: 20, accentColor: zones[currentZone].accent }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, letterSpacing: 1 }}>OCEAN CURRENT INTENSITY</span>
                      <span style={{ fontFamily: 'monospace', color: zones[currentZone].accent }}>{settings.intensity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={settings.intensity} 
                      onChange={(e) => setSettings({ ...settings, intensity: Number(e.target.value) })}
                      style={{ width: '100%', accentColor: zones[currentZone].accent }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'challenge' && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', letterSpacing: 2, color: '#fff' }}>MISSION INITIATION</h3>
                <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: 25 }}>
                  Prepare your environment. The hackathon challenge requires deploying algorithms built to process telemetry from extreme deep-sea exploration vessels. Are you ready to dive?
                </p>
                <button
                  onClick={() => window.open('https://bidaya.dev', '_blank')}
                  style={{
                    padding: '12px 30px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    background: zones[currentZone].accent,
                    color: '#000',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    letterSpacing: 1
                  }}
                >
                  LAUNCH SIMULATOR
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
