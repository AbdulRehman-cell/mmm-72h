import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import QuizArena from './pages/QuizArena';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Load basic global config or topics shared across views
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axios.get('/api/topics');
        setTopics(res.data || []);
      } catch (err) {
        console.error('Error fetching initial topics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [location.pathname]);

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Design Brief Compliant Sticky Header Nav */}
      <header className="site-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand/Logo */}
          <Link to="/" className="brand" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              background: 'var(--primary)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '1.4rem',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '3px 3px 0px 0px var(--border)',
              border: '1px solid var(--text)'
            }}>
              ⚡
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: '700',
                color: 'var(--text)',
                letterSpacing: '-1px'
              }}>
                Brain<span style={{ color: 'var(--secondary)' }}>Snap</span>
              </span>
              <span style={{
                fontSize: '0.7rem',
                display: 'block',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                marginTop: '-4px'
              }}>
                mmm.run
              </span>
            </div>
          </Link>

          {/* Navigation Links - Admin links explicitly removed */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "btn btn-ghost active" : "btn btn-ghost"}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                color: isActive ? 'var(--primary)' : 'var(--text)',
                borderBottom: isActive ? '3px solid var(--secondary)' : '3px solid transparent',
                borderRadius: '0',
                padding: '8px 12px'
              })}
            >
              Arena Lobby
            </NavLink>
            <NavLink 
              to="/leaderboard" 
              className={({ isActive }) => isActive ? "btn btn-ghost active" : "btn btn-ghost"}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                color: isActive ? 'var(--primary)' : 'var(--text)',
                borderBottom: isActive ? '3px solid var(--secondary)' : '3px solid transparent',
                borderRadius: '0',
                padding: '8px 12px'
              })}
            >
              🏆 Hall of Fame
            </NavLink>
          </nav>

          {/* Rapid Play CTA */}
          <div>
            <Link 
              to="/#arena-lobby"
              className="btn btn-primary"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '4px 4px 0px 0px var(--text)'
              }}
              onClick={() => {
                const element = document.getElementById('arena-lobby');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              ⚡ Enter Arena
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: '1 0 auto' }}>
        <Routes>
          <Route path="/" element={<Home topics={topics} isLoading={isLoading} />} />
          <Route path="/quiz/:slug" element={<QuizArena />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Dynamic Footer with Comic Neo-brutalist flair - Admin links removed */}
      <footer style={{
        backgroundColor: 'var(--surface-2)',
        borderTop: '2px solid var(--text)',
        padding: '48px 0 24px 0',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div className="grid-3" style={{ gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>🧠</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.5rem', color: 'var(--text)' }}>
                  BrainSnap
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                The hyper-caffeinated, high-velocity trivia arena where mental stamina meets the 15-second countdown. Run the clock. Rule the board.
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '16px', color: 'var(--text)' }}>
                ⚡ Quick Snaps
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500' }}>
                    🎮 Arena Lobby
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500' }}>
                    🏆 Live Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '16px', color: 'var(--text)' }}>
                🔥 Mental Fuel
              </h3>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--text)',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '4px 4px 0px 0px var(--text)'
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', fontWeight: '600' }}>
                  "Got 15 seconds? Prove it. The intellectual coliseum is always open."
                </p>
                <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                  <span className="badge badge-primary">STAY SHARP</span>
                  <span className="badge badge-secondary" style={{ background: 'var(--accent)', color: 'var(--text)' }}>KINETIC</span>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

          <div style={{
            display: 'flex',
            justifyContent: 'between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              © {new Date().getFullYear()} BrainSnap. Speed-run your intellect. Snap your limits.
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontWeight: '700', color: 'var(--text)' }}>[ HIGH-VELOCITY EDITION ]</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}