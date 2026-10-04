import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Leaderboard() {
  const [performances, setPerformances] = useState([]);
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRuns: 0,
    perfectScores: 0,
    averageTime: 0
  });

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      const [perfRes, topicsRes] = await Promise.all([
        axios.get('/api/performancerecords'),
        axios.get('/api/topics')
      ]);

      const records = perfRes.data || [];
      const topicsList = topicsRes.data || [];

      // Sort by score (descending), then timeTaken (ascending)
      const sorted = [...records].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.timeTaken - b.timeTaken;
      });

      setPerformances(sorted);
      setTopics(topicsList);

      // Calculate snapshot stats
      const total = sorted.length;
      const perfects = sorted.filter(r => r.score >= 100 || r.correctAnswers === r.totalQuestions).length;
      const avgTime = total > 0 ? Math.round(sorted.reduce((acc, r) => acc + (r.timeTaken || 0), 0) / total) : 0;

      setStats({
        totalRuns: total,
        perfectScores: perfects,
        averageTime: avgTime
      });

    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter logic
  const filteredPerformances = performances.filter(p => {
    const matchesSearch = p.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopicId === 'all' || p.topicId === selectedTopicId;
    return matchesSearch && matchesTopic;
  });

  // Get topic info helper
  const getTopicInfo = (topicId) => {
    const found = topics.find(t => t._id === topicId);
    return found ? found : { name: 'General Arena', color: '#0077b6', icon: '⚡' };
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      
      {/* 1. COMPACT HERO SECTION */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--section-py) 0 4rem' }}>
        <img className="hero-bg" src="https://picsum.photos/seed/leaderboardhero/1600/900" alt="Leaderboard" style={{ opacity: 0.12 }} />
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--secondary)', letterSpacing: '2px', fontWeight: 'bold' }}>
            GLOBAL HALL OF FAME
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)' }}>
            The Absolute <span className="gradient-text">Legends</span> of Speed-Run Intellect.
          </h1>
          <p className="hero-subtitle" style={{ color: 'var(--text-muted)' }}>
            Rankings are real-time, ruthless, and dictated by milliseconds. Do you have the cognitive velocity to survive?
          </p>
        </div>
      </section>

      {/* 2. SYSTEM METRICS / STATS SUMMARY */}
      <section className="section" style={{ padding: '2rem 0', backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div className="grid-3">
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border)', boxShadow: '0 6px 0px 0px var(--border)' }}>
              <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {stats.totalRuns}
              </div>
              <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ⚡ Total Blitz Runs Logged
              </div>
            </div>

            <div className="card" style={{ padding: '24px', border: '1px solid var(--border)', boxShadow: '0 6px 0px 0px var(--border)' }}>
              <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                {stats.perfectScores}
              </div>
              <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                🎯 Perfect 100% Snap Runs
              </div>
            </div>

            <div className="card" style={{ padding: '24px', border: '1px solid var(--border)', boxShadow: '0 6px 0px 0px var(--border)' }}>
              <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                {stats.averageTime}s
              </div>
              <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ⏱️ Average Run Clearance Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PODIUM (Top 3 Visual Feature) */}
      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ color: 'var(--secondary)' }}>CURRENT REIGNING BRAINS</span>
            <h2 style={{ fontFamily: 'var(--font-display)' }}>The High-Velocity Apex Players</h2>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '24px',
            marginBottom: '4rem'
          }}>
            {/* 2nd Place */}
            {filteredPerformances[1] && (
              <div className="card" style={{
                width: '280px',
                padding: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 6px 0px 0px var(--border)',
                textAlign: 'center',
                backgroundColor: 'var(--surface-2)',
                order: 1
              }}>
                <span className="badge" style={{ backgroundColor: 'var(--text-muted)', color: '#fff', marginBottom: '16px' }}>
                  🥈 SILVER MEDAL
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '8px 0', color: 'var(--text)' }}>
                  {filteredPerformances[1].username}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {filteredPerformances[1].score} pts
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Cleared in {filteredPerformances[1].timeTaken}s
                </div>
                <div style={{ marginTop: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {getTopicInfo(filteredPerformances[1].topicId).name}
                </div>
              </div>
            )}

            {/* 1st Place */}
            {filteredPerformances[0] && (
              <div className="card" style={{
                width: '320px',
                padding: '32px 24px',
                border: '2px solid var(--primary)',
                boxShadow: '9px 9px 0px 0px var(--border)',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                transform: 'translateY(-15px)',
                order: 2,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--secondary)',
                  color: 'white',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  border: '1px solid var(--text)'
                }}>
                  👑 CURRENT SNAP LORD
                </div>
                <span className="badge" style={{ backgroundColor: '#ffd700', color: '#03045e', fontWeight: 'bold', marginBottom: '16px' }}>
                  🏆 CHAMPION
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '8px 0', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  {filteredPerformances[0].username}
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {filteredPerformances[0].score} pts
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Cleared in {filteredPerformances[0].timeTaken}s
                </div>
                <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                  🚀 {getTopicInfo(filteredPerformances[0].topicId).name}
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {filteredPerformances[2] && (
              <div className="card" style={{
                width: '280px',
                padding: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 6px 0px 0px var(--border)',
                textAlign: 'center',
                backgroundColor: 'var(--surface-2)',
                order: 3
              }}>
                <span className="badge" style={{ backgroundColor: '#cd7f32', color: '#fff', marginBottom: '16px' }}>
                  🥉 BRONZE MEDAL
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '8px 0', color: 'var(--text)' }}>
                  {filteredPerformances[2].username}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {filteredPerformances[2].score} pts
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Cleared in {filteredPerformances[2].timeTaken}s
                </div>
                <div style={{ marginTop: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {getTopicInfo(filteredPerformances[2].topicId).name}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. MAIN INTERACTIVE LEADERBOARD TABLE & FILTERS */}
      <section className="section" style={{ padding: '3rem 0', backgroundColor: 'var(--surface)' }}>
        <div className="container">
          
          {/* SEARCH & FILTER BAR */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 0px 0px var(--border)'
          }}>
            <div style={{ display: 'flex', gap: '12px', flex: '1', minWidth: '280px' }}>
              <input
                type="text"
                placeholder="🔍 Search Arena Challenger Tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedTopicId('all')}
                className={`btn ${selectedTopicId === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 16px', borderRadius: '6px' }}
              >
                All Battlegrounds
              </button>
              {topics.map(t => (
                <button
                  key={t._id}
                  onClick={() => setSelectedTopicId(t._id)}
                  className={`btn ${selectedTopicId === t._id ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '8px 16px', borderRadius: '6px' }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* RESULTS TABLE */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div className="skeleton" style={{ height: '60px', marginBottom: '12px', borderRadius: '8px' }}></div>
              <div className="skeleton" style={{ height: '60px', marginBottom: '12px', borderRadius: '8px' }}></div>
              <div className="skeleton" style={{ height: '60px', marginBottom: '12px', borderRadius: '8px' }}></div>
            </div>
          ) : filteredPerformances.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', backgroundColor: '#fff', border: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>No records fit the search matrix.</h3>
              <p>Launch the Arena now to set the first benchmark score!</p>
              <Link to="/" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>
                Ignite Your Timer
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 6px 0px 0px var(--border)', backgroundColor: '#ffffff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface-2)', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '16px', color: 'var(--text)', fontWeight: 'bold' }}>Rank</th>
                    <th style={{ padding: '16px', color: 'var(--text)', fontWeight: 'bold' }}>Challenger Tag</th>
                    <th style={{ padding: '16px', color: 'var(--text)', fontWeight: 'bold' }}>Battleground</th>
                    <th style={{ padding: '16px', color: 'var(--text)', fontWeight: 'bold' }}>Correct Rate</th>
                    <th style={{ padding: '16px', color: 'var(--text)', fontWeight: 'bold' }}>Total Score</th>
                    <th style={{ padding: '16px', color: 'var(--text)', fontWeight: 'bold' }}>Time Used</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPerformances.map((perf, idx) => {
                    const topic = getTopicInfo(perf.topicId);
                    return (
                      <tr key={perf._id || idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '16px', fontWeight: 'bold' }}>
                          {idx === 0 ? '👑 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                        </td>
                        <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text)' }}>
                          {perf.username || 'Anonymous Snap'}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'var(--surface)',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            border: `1px solid ${topic.color || 'var(--border)'}`
                          }}>
                            <span style={{ color: topic.color }}>●</span> {topic.name}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '80px', backgroundColor: 'var(--border)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${(perf.correctAnswers / (perf.totalQuestions || 10)) * 100}%`,
                                backgroundColor: 'var(--secondary)',
                                height: '100%'
                              }}></div>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                              {perf.correctAnswers || 0}/{perf.totalQuestions || 10}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>
                          {perf.score} pts
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                          ⏱️ {perf.timeTaken || 0}s
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 5. CALL TO ACTION BLOCK */}
      <section className="section" style={{ padding: '4rem 0', backgroundColor: 'var(--text)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '2px' }}>
            READY TO FLIP THE SYSTEM?
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', marginTop: '12px' }}>
            Stop Spectating. Begin the Snap.
          </h2>
          <p style={{ maxWidth: '600px', margin: '16px auto 24px', color: '#ddf0fa' }}>
            The leaders set benchmarks, but codes were made to be rewritten. Select your discipline and run the 15-second decay.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
              ⚡ Enter the Arena
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}