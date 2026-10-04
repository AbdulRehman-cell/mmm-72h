import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  // Quick launch username state
  const [username, setUsername] = useState('');
  const [selectedTopicSlug, setSelectedTopicSlug] = useState('');
  const [launchError, setLaunchError] = useState('');

  // Simulated animated timer live counter
  const [countdownPreview, setCountdownPreview] = useState(15);

  useEffect(() => {
    // 15s decrement cycle simulation for high-energy hero feel
    const interval = setInterval(() => {
      setCountdownPreview((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get('/api/topics');
        setTopics(res.data || []);
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoadingTopics(false);
      }
    };

    const fetchRecords = async () => {
      try {
        const res = await axios.get('/api/performancerecords');
        // Sort and display top 5 high scores
        const sorted = (res.data || []).sort((a, b) => b.score - a.score).slice(0, 5);
        setRecentRecords(sorted);
      } catch (err) {
        console.error('Error fetching leaderboards:', err);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchTopics();
    fetchRecords();
  }, []);

  const handleQuickLaunch = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setLaunchError('Claim your callsign first!');
      return;
    }
    if (!selectedTopicSlug) {
      setLaunchError('Select your arena discipline to start!');
      return;
    }
    setLaunchError('');
    // Store username in localStorage for continuous game use
    localStorage.setItem('brainsnap_username', username.trim());
    navigate(`/quiz/${selectedTopicSlug}`);
  };

  const handleScrollToArena = (e) => {
    e.preventDefault();
    const arenaElement = document.getElementById('arena-lobby');
    if (arenaElement) {
      arenaElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-wrapper" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* 1. THE IGNITION HERO SECTION */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          className="hero-bg" 
          src="https://picsum.photos/seed/brainsnaphero/1600/900" 
          alt="High energy mental stadium background" 
          style={{ opacity: 0.15, filter: 'grayscale(30%)' }}
        />
        <div className="container">
          <span className="eyebrow" style={{ 
            background: 'var(--secondary)', 
            color: '#fff', 
            padding: '6px 12px', 
            borderRadius: '4px',
            textTransform: 'uppercase', 
            fontWeight: 'bold',
            boxShadow: '2px 2px 0px var(--border)'
          }}>
            ⚡ 10 Questions. 15 Seconds. Zero Safety Nets.
          </span>
          <h1 style={{ marginTop: '16px' }}>
            Speed-run your intellect. <span className="gradient-text">Snap</span> your limits.
          </h1>
          <p className="hero-subtitle">
            The hyper-caffeinated, high-velocity trivia arena where mental stamina meets the 15-second decay. Pick fast, score massive, survive the clock.
          </p>

          {/* Quick Launch Console (Dynamic form overlay in hero) */}
          <div className="card" style={{ 
            maxWidth: '650px', 
            margin: '32px 0 0 0', 
            padding: '24px',
            background: 'var(--surface)', 
            border: '2px solid var(--text)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            boxShadow: '0 8px 0px 0px var(--border)',
            position: 'relative',
            zIndex: 10
          }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>LIVE</span> 
              Fast Arena Dispatch
            </h3>
            
            <form onSubmit={handleQuickLaunch} style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '6px', color: 'var(--text)' }}>
                    1. CHOOSE YOUR CALLSIGN
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. SpeedDemon88" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      border: '2px solid var(--text)',
                      fontWeight: 'bold'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '6px', color: 'var(--text)' }}>
                    2. DEPLOY DISCIPLINE
                  </label>
                  <select 
                    value={selectedTopicSlug} 
                    onChange={(e) => setSelectedTopicSlug(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      border: '2px solid var(--text)',
                      fontWeight: 'bold',
                      background: 'var(--bg)'
                    }}
                  >
                    <option value="">-- Choose Arena --</option>
                    {topics.map(t => (
                      <option key={t._id} value={t.slug}>{t.name} ({t.difficulty || 'Expert'})</option>
                    ))}
                  </select>
                </div>
              </div>

              {launchError && (
                <div className="alert alert-error" style={{ padding: '8px 12px', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid var(--text)' }}>
                  ⚠️ {launchError}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '1.1rem', 
                  textTransform: 'uppercase',
                  border: '2px solid var(--text)',
                  boxShadow: '3px 3px 0px var(--text)'
                }}
              >
                Ignite Your Timer ({countdownPreview}s) ⚡
              </button>
            </form>
          </div>

          <div className="hero-actions" style={{ marginTop: '24px' }}>
            <a href="#arena-lobby" onClick={handleScrollToArena} className="btn btn-secondary" style={{ border: '1px solid var(--text)' }}>
              Browse Arena Lobby
            </a>
            <Link to="/leaderboard" className="btn btn-ghost" style={{ textDecoration: 'underline' }}>
              View Today's Hall of Fame
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS OVERVIEW BAND */}
      <section className="section" style={{ background: 'var(--surface-2)', borderTop: '2px solid var(--text)', borderBottom: '2px solid var(--text)' }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div className="card" style={{ padding: '24px', background: 'var(--bg)', border: '2px solid var(--text)', boxShadow: '4px 4px 0px var(--text)' }}>
              <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>15s</div>
              <div className="stat-label" style={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Decaying Multiplier Clock</div>
            </div>
            <div className="card" style={{ padding: '24px', background: 'var(--bg)', border: '2px solid var(--text)', boxShadow: '4px 4px 0px var(--text)' }}>
              <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>340+</div>
              <div className="stat-label" style={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)' }}>High-Octane Question Pools</div>
            </div>
            <div className="card" style={{ padding: '24px', background: 'var(--bg)', border: '2px solid var(--text)', boxShadow: '4px 4px 0px var(--text)' }}>
              <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent)' }}>100%</div>
              <div className="stat-label" style={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pure Cognitive Velocity</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE ARENA LOBBY (TOPIC SELECTOR) */}
      <section className="section" id="arena-lobby">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow" style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--primary)' }}>DISCIPLINE PORTALS</span>
            <h2>Pick your battleground. The clock doesn't wait.</h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0 auto', color: 'var(--text-muted)' }}>
              Select a category to play immediately. Each quiz challenges you with 10 random questions with high score tracking.
            </p>
          </div>

          {loadingTopics ? (
            <div className="grid-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton skeleton-card" style={{ height: '240px', borderRadius: '12px' }}></div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {topics.map((topic) => {
                const colors = ['#0077b6', '#00b4d8', '#48cae4', '#e63946', '#f1faee'];
                const cardBorderColor = topic.color || 'var(--primary)';
                return (
                  <div 
                    key={topic._id} 
                    className="card" 
                    style={{ 
                      padding: '32px 24px', 
                      background: 'var(--surface)', 
                      border: `3px solid var(--text)`,
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '6px 6px 0px 0px var(--border)',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '8px', 
                        background: cardBorderColor, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '1.8rem', 
                        color: '#fff',
                        marginBottom: '16px',
                        border: '2px solid var(--text)',
                        boxShadow: '2px 2px 0px var(--text)'
                      }}>
                        {topic.icon === 'Science' ? '🔬' : topic.icon === 'History' ? '🏛️' : topic.icon === 'Film' ? '🎬' : '⭐'}
                      </div>
                      
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{topic.name}</h3>
                      <span className="badge" style={{ 
                        background: 'var(--surface-2)', 
                        color: 'var(--text)', 
                        border: '1px solid var(--text)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}>
                        {topic.difficulty || 'Expert'}
                      </span>
                      <p style={{ marginTop: '12px', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        Hyper-velocity questions testing your core response times and accuracy in {topic.name}.
                      </p>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <Link 
                        to={`/quiz/${topic.slug}`} 
                        className="btn btn-primary" 
                        style={{ 
                          width: '100%', 
                          textAlign: 'center', 
                          border: '2px solid var(--text)',
                          boxShadow: '3px 3px 0px var(--text)'
                        }}
                      >
                        Enter Arena ⚡
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. MECHANICS BREAKDOWN SECTION */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="feature-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="eyebrow" style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--secondary)' }}>THE CRUCIBLE ALGORITHM</span>
              <h2 style={{ margin: '12px 0 20px 0' }}>How the BrainSnap Decay System works</h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ 
                    flexShrink: 0, 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)', 
                    color: '#fff', 
                    fontWeight: 'bold', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px solid var(--text)'
                  }}>1</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>The Time Decay Curve</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Every question starts with a 15-second pool. Your maximum point potential decreases with every microsecond that slips away.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ 
                    flexShrink: 0, 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: 'var(--secondary)', 
                    color: '#fff', 
                    fontWeight: 'bold', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px solid var(--text)'
                  }}>2</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>Velocity Multipliers</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Locking in an answer within the first 3 seconds triggers a "Snap Streak" bonus, tripling your earned score multiplier.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ 
                    flexShrink: 0, 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: 'var(--accent)', 
                    color: '#fff', 
                    fontWeight: 'bold', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px solid var(--text)'
                  }}>3</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>Zero Cushion Mode</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Run out of time entirely, and you receive an automatic strike. Three strikes and your speed-run halts immediately.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <img 
                src="https://picsum.photos/seed/deskcoffee/800/600" 
                alt="Tactile desk setup with coffee and study notes" 
                style={{ 
                  width: '100%', 
                  borderRadius: '12px', 
                  border: '3px solid var(--text)', 
                  boxShadow: '8px 8px 0px var(--border)' 
                }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: '20px', 
                right: '20px', 
                background: 'var(--bg)', 
                border: '2px solid var(--text)', 
                padding: '12px 20px', 
                borderRadius: '8px',
                boxShadow: '4px 4px 0px var(--text)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🎯</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>AGGREGATE TIME BONUS</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>+42.8 Seconds Remaining</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE HALL OF FAME / LEADERBOARD SUMMARY */}
      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow" style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--primary)' }}>HALL OF FAME</span>
            <h2>Today's Absolute Legends</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              These high-performance minds snapped the limits, scoring near-perfect totals under maximum gravity.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '24px' }}>
            <div className="card" style={{ padding: '24px', background: 'var(--surface-2)', border: '2px solid var(--text)', borderRadius: '12px', boxShadow: '5px 5px 0px var(--text)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏆 Top Active Speedrunners
              </h3>
              
              {loadingRecords ? (
                <div className="skeleton skeleton-text" style={{ height: '120px' }}></div>
              ) : recentRecords.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No records stored in this Arena yet. Be the first to build history!
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {recentRecords.map((rec, index) => (
                    <div 
                      key={rec._id} 
                      style={{ 
                        background: 'var(--bg)', 
                        padding: '12px 16px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--text)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: index === 0 ? 'var(--primary)' : 'var(--text)', 
                          fontSize: '1.2rem' 
                        }}>
                          #{index + 1}
                        </span>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text)' }}>{rec.username || 'Anonymous'}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time consumed: {rec.timeTaken || 0}s</span>
                        </div>
                      </div>
                      <span style={{ 
                        background: 'var(--surface-2)', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold',
                        border: '1px solid var(--text)'
                      }}>
                        {rec.score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/leaderboard" className="btn btn-ghost" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                  Open Master Leaderboards →
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
              <div className="card" style={{ padding: '24px', border: '2px solid var(--text)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img 
                  src="https://i.pravatar.cc/300?img=11" 
                  alt="Reviewer Portrait" 
                  className="avatar avatar-md" 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--text)' }} 
                />
                <div>
                  <p style={{ margin: '0 0 8px 0', fontStyle: 'italic', color: 'var(--text)' }}>
                    "The 15-second decay timer gives you an absolute rush of dopamine. It’s like Kahoot but built with a massive caffeine boost."
                  </p>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Sarah Jenkins, Senior Quiz Architect</strong>
                </div>
              </div>

              <div className="card" style={{ padding: '24px', border: '2px solid var(--text)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img 
                  src="https://i.pravatar.cc/300?img=33" 
                  alt="Reviewer Portrait" 
                  className="avatar avatar-md" 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--text)' }} 
                />
                <div>
                  <p style={{ margin: '0 0 8px 0', fontStyle: 'italic', color: 'var(--text)' }}>
                    "I play the science arena during my morning espresso routine. Literally starts the brain gears instantly."
                  </p>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Marcus Cole, Tech Lead</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SYSTEM STAMP / VIDEO PREVIEW */}
      <section className="section" style={{ background: 'var(--surface-2)', borderTop: '2px solid var(--text)' }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="eyebrow" style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--primary)' }}>SNEAK PREVIEW</span>
            <h2>Get inside the cognitive loop</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', border: '3px solid var(--text)', borderRadius: '12px', overflow: 'hidden', boxShadow: '8px 8px 0px var(--text)' }}>
            <div className="video-embed">
              <iframe 
                src="https://www.youtube.com/embed/9o7W_44kPbc" 
                title="Cognitive game loop preview" 
                allowFullScreen
                style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HIGH CONVERSION CALL TO ACTION BANNER */}
      <section className="section">
        <div className="container">
          <div className="cta-section" style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
            padding: '60px 40px', 
            borderRadius: '16px', 
            border: '3px solid var(--text)', 
            boxShadow: '10px 10px 0px var(--text)',
            color: '#fff',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '16px' }}>Don't just stand there with your gears turning. Let's ride.</h2>
            <p style={{ maxWidth: '700px', margin: '0 auto 32px auto', fontSize: '1.2rem', opacity: 0.95 }}>
              Choose a discipline, configure your speedrun settings, and test your response limits. Your aggregate records will enter the global leaderboard automatically.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#arena-lobby" onClick={handleScrollToArena} className="btn btn-secondary" style={{ 
                background: '#fff', 
                color: 'var(--text)', 
                border: '2px solid var(--text)',
                fontWeight: 'bold',
                boxShadow: '4px 4px 0px var(--text)',
                padding: '16px 32px'
              }}>
                Pick An Arena Now 🚀
              </a>
              <Link to="/admin" className="btn btn-ghost" style={{ 
                color: '#fff', 
                textDecoration: 'underline', 
                fontWeight: 'bold' 
              }}>
                Curate custom questions →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--text)', color: '#fff', padding: '60px 0', marginTop: '60px', borderTop: '4px solid var(--secondary)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.8rem' }}>⚡</span>
              <strong style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>BrainSnap</strong>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              Speed-run your intellect. The intellectual coliseum built with high precision timer mechanics.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '16px' }}>Arena Discipline Portals</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {topics.map(t => (
                <li key={t._id}>
                  <Link to={`/quiz/${t.slug}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    🧬 {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '16px' }}>Quick Shortcuts</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>Lobby Hub</Link></li>
              <li><Link to="/leaderboard" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>Leaderboard Index</Link></li>
              <li><Link to="/admin" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>Question Forge Control</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '16px' }}>Disclaimer</h4>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
              Warning: BrainSnap contains elements of rapid timers and competitive cognitive feedback loops. Play responsibly and make sure to stay caffeinated.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}