import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  // Topics & Questions State
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Active sub-tab for dashboard navigation
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'topics'

  // New Question Form State
  const [questionText, setQuestionText] = useState('');
  const [qTopicId, setQTopicId] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0); // 0, 1, 2, 3
  const [explanation, setExplanation] = useState('');
  const [timeLimit, setTimeLimit] = useState(15);

  // New Topic Form State
  const [topicName, setTopicName] = useState('');
  const [topicIcon, setTopicIcon] = useState('🔬');
  const [topicColor, setTopicColor] = useState('#0077b6');
  const [topicDifficulty, setTopicDifficulty] = useState('Novice');

  // Stats Counters
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalTopics: 0,
    averageTime: 15
  });

  // Fetch all necessary administrative data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsRes, questionsRes] = await Promise.all([
        axios.get('/api/topics'),
        axios.get('/api/questions')
      ]);
      
      const loadedTopics = topicsRes.data || [];
      const loadedQuestions = questionsRes.data || [];
      
      setTopics(loadedTopics);
      setQuestions(loadedQuestions);
      
      if (loadedTopics.length > 0) {
        setQTopicId(loadedTopics[0]._id);
      }

      setStats({
        totalQuestions: loadedQuestions.length,
        totalTopics: loadedTopics.length,
        averageTime: loadedQuestions.length > 0 
          ? Math.round(loadedQuestions.reduce((acc, cur) => acc + (cur.timeLimit || 15), 0) / loadedQuestions.length)
          : 15
      });
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Question Creation Form Submit
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!questionText || !optionA || !optionB || !optionC || !optionD || !qTopicId) {
      setFormError('Please fill out all required fields, including all 4 multiple choice options.');
      return;
    }

    setFormLoading(true);
    setFormError('');

    const formattedOptions = [
      { text: optionA, isCorrect: correctIndex === 0 },
      { text: optionB, isCorrect: correctIndex === 1 },
      { text: optionC, isCorrect: correctIndex === 2 },
      { text: optionD, isCorrect: correctIndex === 3 }
    ];

    try {
      await axios.post('/api/questions', {
        topicId: qTopicId,
        text: questionText,
        options: formattedOptions,
        explanation: explanation || 'Speed-run knowledge absolute verified answer.',
        timeLimit: Number(timeLimit) || 15
      });

      setFormSuccess(true);
      // Reset form
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectIndex(0);
      setExplanation('');
      
      // Refresh list
      await fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to publish question to the arena database.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Topic Creation Form Submit
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!topicName) {
      setFormError('Please enter a topic name.');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const slug = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await axios.post('/api/topics', {
        name: topicName,
        slug,
        icon: topicIcon,
        color: topicColor,
        difficulty: topicDifficulty
      });

      setFormSuccess(true);
      setTopicName('');
      setTopicIcon('🔬');
      setTopicColor('#0077b6');
      setTopicDifficulty('Novice');
      
      await fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to forge new topic.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Question Deletion
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this question from the active arena database?')) return;
    try {
      await axios.delete(`/api/questions/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting question. Please check server logs.');
    }
  };

  // Handle Topic Deletion
  const handleDeleteTopic = async (id) => {
    if (!window.confirm('Warning: Deleting this topic may leave orphaned questions. Proceed?')) return;
    try {
      await axios.delete(`/api/topics/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting topic.');
    }
  };

  // Filtered Questions by selected topic filter
  const filteredQuestions = selectedTopicId 
    ? questions.filter(q => q.topicId === selectedTopicId)
    : questions;

  return (
    <div className="admin-dashboard-page" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      
      {/* 1. COMPACT HERO SECTION */}
      <section className="hero" style={{ 
        padding: '3rem 0 2rem 0', 
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="eyebrow" style={{ 
            background: 'var(--secondary)', 
            color: '#fff', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            System Terminal
          </span>
          <h1 style={{ marginTop: '0.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            Control <span className="gradient-text" style={{ background: 'linear-gradient(45deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deck</span>
          </h1>
          <p className="hero-subtitle" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
            Curate disciplines, deploy challenges, and maintain absolute authority over the high-velocity leaderboard.
          </p>
        </div>
      </section>

      {/* 2. SYSTEM DIAGNOSTICS STATS */}
      <section className="section" style={{ padding: '2rem 0 1rem 0' }}>
        <div className="container">
          <div className="grid-3" style={{ display: 'grid', gap: '20px' }}>
            
            <div className="card card-bordered" style={{ 
              padding: '24px', 
              background: '#fff', 
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 6px 0px 0px var(--border)',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '2rem' }}>🔋</span>
              <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                {stats.totalTopics}
              </div>
              <div className="stat-label" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--text-muted)' }}>
                Active Battlegrounds
              </div>
            </div>

            <div className="card card-bordered" style={{ 
              padding: '24px', 
              background: '#fff', 
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 6px 0px 0px var(--border)',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '2rem' }}>🧠</span>
              <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--secondary)', fontFamily: 'var(--font-display)' }}>
                {stats.totalQuestions}
              </div>
              <div className="stat-label" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--text-muted)' }}>
                Brain Database Size
              </div>
            </div>

            <div className="card card-bordered" style={{ 
              padding: '24px', 
              background: '#fff', 
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 6px 0px 0px var(--border)',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '2rem' }}>⏱️</span>
              <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                {stats.averageTime}s
              </div>
              <div className="stat-label" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--text-muted)' }}>
                Average Time Decay
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TAB SELECTOR FOR ADMINISTRATIVE WORKSPACE */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container">
          <div className="filters" style={{ 
            display: 'flex', 
            gap: '12px', 
            borderBottom: '2px solid var(--border)', 
            paddingBottom: '12px',
            marginBottom: '2rem'
          }}>
            <button 
              className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => { setActiveTab('questions'); setFormSuccess(false); setFormError(''); }}
              style={{ padding: '10px 24px', fontWeight: '700' }}
            >
              📝 Forge Questions
            </button>
            <button 
              className={`btn ${activeTab === 'topics' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => { setActiveTab('topics'); setFormSuccess(false); setFormError(''); }}
              style={{ padding: '10px 24px', fontWeight: '700' }}
            >
              🎯 Manage Topics
            </button>
          </div>
        </div>
      </section>

      {/* 3. SUBSTANTIAL SECTION: CREATION DRAWER FORM */}
      <section className="section" style={{ padding: '0 0 3rem 0' }}>
        <div className="container">
          
          {activeTab === 'questions' && (
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
              
              {/* Creator Form */}
              <div className="card" style={{ 
                background: 'var(--surface)', 
                padding: '30px', 
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: '0 6px 0px 0px var(--border)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>⚡</span> Forge a New Brain Teaser
                </h3>

                {formSuccess ? (
                  <div className="alert alert-success" style={{ 
                    background: '#d4edda', 
                    color: '#155724', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    border: '1px solid #c3e6cb',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>✓ Question Deployed Successfully!</h4>
                    <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem' }}>The new crucible is primed. Players will now encounter this question in live rotation.</p>
                    <button className="btn btn-primary" onClick={() => setFormSuccess(false)} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                      Add Another Question
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Target Topic Discipline *</label>
                      <select 
                        value={qTopicId} 
                        onChange={(e) => setQTopicId(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        required
                      >
                        <option value="">-- Choose Arena --</option>
                        {topics.map(t => (
                          <option key={t._id} value={t._id}>{t.icon} {t.name} ({t.difficulty})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Question Body Text *</label>
                      <textarea 
                        rows="3"
                        placeholder="In quantum mechanics, what principle states that certain pairs of physical properties cannot be simultaneously known..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                        required
                      />
                    </div>

                    <div style={{ background: 'var(--surface-2)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ display: 'block', fontWeight: '700', marginBottom: '10px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Multiple Choice & Correct Answer Selection
                      </span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="radio" 
                            name="correctAnswer" 
                            checked={correctIndex === 0} 
                            onChange={() => setCorrectIndex(0)} 
                            style={{ cursor: 'pointer' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Option A (Required)" 
                            value={optionA} 
                            onChange={(e) => setOptionA(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                            required
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="radio" 
                            name="correctAnswer" 
                            checked={correctIndex === 1} 
                            onChange={() => setCorrectIndex(1)} 
                            style={{ cursor: 'pointer' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Option B (Required)" 
                            value={optionB} 
                            onChange={(e) => setOptionB(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                            required
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="radio" 
                            name="correctAnswer" 
                            checked={correctIndex === 2} 
                            onChange={() => setCorrectIndex(2)} 
                            style={{ cursor: 'pointer' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Option C (Required)" 
                            value={optionC} 
                            onChange={(e) => setOptionC(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                            required
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="radio" 
                            name="correctAnswer" 
                            checked={correctIndex === 3} 
                            onChange={() => setCorrectIndex(3)} 
                            style={{ cursor: 'pointer' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Option D (Required)" 
                            value={optionD} 
                            onChange={(e) => setOptionD(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                            required
                          />
                        </div>
                      </div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                        * Select the radial button next to the absolute correct answer option.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Explanation / Contextual Backdrop</label>
                      <input 
                        type="text" 
                        placeholder="This principle was introduced by Werner Heisenberg in 1927."
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Time Limit Countdown (Seconds)</label>
                      <input 
                        type="number" 
                        min="5" 
                        max="60" 
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        style={{ width: '100px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                      />
                    </div>

                    {formError && (
                      <div className="alert alert-error" style={{ color: 'red', fontSize: '0.85rem', background: '#fdf2f2', padding: '8px', borderRadius: '6px' }}>
                        ⚠ {formError}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={formLoading}
                      style={{ 
                        marginTop: '10px', 
                        padding: '12px 24px', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {formLoading ? 'Forging Question...' : 'Publish to Arena'}
                    </button>

                  </form>
                )}
              </div>

              {/* Dynamic Crucible Preview Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card" style={{ 
                  background: '#111', 
                  color: '#fff', 
                  padding: '24px', 
                  borderRadius: '16px',
                  border: '3px solid var(--secondary)',
                  boxShadow: '6px 6px 0px 0px var(--text)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: '700' }}>
                      ⚡ Preview Screen
                    </span>
                    <span style={{ background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      Timer: {timeLimit}s
                    </span>
                  </div>

                  <h4 style={{ color: '#fff', margin: '0 0 15px 0', fontFamily: 'var(--font-display)', minHeight: '40px' }}>
                    {questionText || 'Your question body text preview will construct dynamically here...'}
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ 
                      background: correctIndex === 0 ? '#155724' : '#222', 
                      border: correctIndex === 0 ? '1px solid #28a745' : '1px solid #444', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem' 
                    }}>
                      A. {optionA || 'Empty'}
                    </div>
                    <div style={{ 
                      background: correctIndex === 1 ? '#155724' : '#222', 
                      border: correctIndex === 1 ? '1px solid #28a745' : '1px solid #444', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem' 
                    }}>
                      B. {optionB || 'Empty'}
                    </div>
                    <div style={{ 
                      background: correctIndex === 2 ? '#155724' : '#222', 
                      border: correctIndex === 2 ? '1px solid #28a745' : '1px solid #444', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem' 
                    }}>
                      C. {optionC || 'Empty'}
                    </div>
                    <div style={{ 
                      background: correctIndex === 3 ? '#155724' : '#222', 
                      border: correctIndex === 3 ? '1px solid #28a745' : '1px solid #444', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem' 
                    }}>
                      D. {optionD || 'Empty'}
                    </div>
                  </div>
                </div>

                <div className="card" style={{ background: 'var(--surface-2)', padding: '20px', borderRadius: '12px' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-display)' }}>💡 Speed Tip</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Keep question prompts punchy. At 15 seconds, long block paragraphs slow down user cognitive processing. Keep options under 4 words if possible.
                  </p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'topics' && (
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
              
              {/* Manage Topics Form */}
              <div className="card" style={{ 
                background: 'var(--surface)', 
                padding: '30px', 
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: '0 6px 0px 0px var(--border)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>🎯</span> Curate the Arena Disciplines
                </h3>

                {formSuccess ? (
                  <div className="alert alert-success" style={{ 
                    background: '#d4edda', 
                    color: '#155724', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    border: '1px solid #c3e6cb',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>✓ Topic Generated!</h4>
                    <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem' }}>A new visual theme arena is active.</p>
                    <button className="btn btn-primary" onClick={() => setFormSuccess(false)} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                      Create Another Topic
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateTopic} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Topic Name *</label>
                      <input 
                        type="text" 
                        placeholder="Pop Culture, Quantum physics, Geopolitics..."
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Visual Sticker Emoji *</label>
                      <select 
                        value={topicIcon} 
                        onChange={(e) => setTopicIcon(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                      >
                        <option value="🔬">🔬 Science / Research</option>
                        <option value="📜">📜 History / Chronicles</option>
                        <option value="🎬">🎬 Film / Pop Culture</option>
                        <option value="💻">💻 Tech / Algorithms</option>
                        <option value="⚡">⚡ General / Electric</option>
                        <option value="🧠">🧠 Neuroscience</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Arena Hex Theme Color *</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={topicColor} 
                          onChange={(e) => setTopicColor(e.target.value)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', width: '50px', height: '50px' }}
                        />
                        <input 
                          type="text" 
                          value={topicColor} 
                          onChange={(e) => setTopicColor(e.target.value)}
                          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Default Difficulty Tier</label>
                      <select 
                        value={topicDifficulty} 
                        onChange={(e) => setTopicDifficulty(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                      >
                        <option value="Novice">Novice (Simple Trivia)</option>
                        <option value="Veteran">Veteran (Speed + Skill)</option>
                        <option value="Expert">Expert (Unforgiving Mechanics)</option>
                      </select>
                    </div>

                    {formError && (
                      <div className="alert alert-error" style={{ color: 'red', fontSize: '0.85rem' }}>
                        ⚠ {formError}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={formLoading}
                      style={{ 
                        marginTop: '10px', 
                        padding: '12px 24px', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {formLoading ? 'Forging...' : 'Deploy Theme Arena'}
                    </button>

                  </form>
                )}
              </div>

              {/* Topic Cards Side-By-Side Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ 
                  background: topicColor, 
                  color: '#fff', 
                  padding: '30px', 
                  borderRadius: '16px',
                  border: '2px solid var(--text)',
                  boxShadow: '9px 9px 0px 0px var(--text)',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{topicIcon}</div>
                    <h3 style={{ margin: '0 0 5px 0', fontFamily: 'var(--font-display)', color: '#fff', fontSize: '2rem' }}>
                      {topicName || 'Theme Sandbox'}
                    </h3>
                    <span style={{ 
                      background: 'rgba(255, 255, 255, 0.2)', 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {topicDifficulty}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    🔥 Live Multiplayer Score Multipliers Active
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 4. SUBSTANTIAL SECTION: QUESTION INVENTORY TABLE */}
      <section className="section" style={{ padding: '2rem 0 5rem 0', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>The Question Vault</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Query, audit, and clean the current pool database.</p>
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Filter Topic:</label>
              <select 
                value={selectedTopicId} 
                onChange={(e) => setSelectedTopicId(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff' }}
              >
                <option value="">All Topics ({questions.length})</option>
                {topics.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="skeleton skeleton-card" style={{ height: '300px', borderRadius: '12px' }}></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="card" style={{ padding: '40px', background: '#fff', textAlign: 'center', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h4 style={{ margin: '15px 0 10px 0', fontFamily: 'var(--font-display)' }}>No Questions Found</h4>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>This topic doesn't have any challenges published yet. Use the forge form above to deploy some!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 6px 0px 0px var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 18px', fontWeight: '700' }}>Topic</th>
                    <th style={{ padding: '14px 18px', fontWeight: '700' }}>Question Details</th>
                    <th style={{ padding: '14px 18px', fontWeight: '700' }}>Correct Answer Option</th>
                    <th style={{ padding: '14px 18px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q) => {
                    const topicInfo = topics.find(t => t._id === q.topicId);
                    const correctOption = q.options?.find(opt => opt.isCorrect);

                    return (
                      <tr key={q._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                          <span style={{ 
                            background: topicInfo?.color || 'var(--primary)', 
                            color: '#fff', 
                            padding: '4px 10px', 
                            borderRadius: '20px', 
                            fontSize: '0.75rem', 
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            {topicInfo ? `${topicInfo.icon} ${topicInfo.name}` : 'Unknown Topic'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', maxWidth: '400px' }}>
                          <strong style={{ display: 'block', color: 'var(--text)', marginBottom: '4px' }}>{q.text}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explanation: {q.explanation}</span>
                        </td>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                          {correctOption ? (
                            <span style={{ color: '#155724', background: '#d4edda', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700' }}>
                              ✓ {correctOption.text}
                            </span>
                          ) : (
                            <span style={{ color: '#721c24', background: '#f8d7da', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                              Missing Correct State
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDeleteQuestion(q._id)} 
                            className="btn"
                            style={{ 
                              background: '#f8d7da', 
                              color: '#721c24', 
                              padding: '6px 12px', 
                              border: '1px solid #f5c6cb', 
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '700',
                              fontSize: '0.8rem'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TOPIC INVENTORY LIST (if topics tab) */}
          {activeTab === 'topics' && (
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Active Arena Themes ({topics.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                {topics.map(t => {
                  const topicCount = questions.filter(q => q.topicId === t._id).length;
                  return (
                    <div key={t._id} style={{ 
                      background: '#fff', 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{t.icon}</span>
                        <strong>{t.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {topicCount} active questions • {t.difficulty}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTopic(t._id)}
                        className="btn"
                        style={{ background: 'transparent', color: '#dc3545', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}