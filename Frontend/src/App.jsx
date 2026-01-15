import { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('https://sentiment-api.onrender.com/predict', { text });
      setResult(response.data);
    } catch (error) {
      alert("Backend not responding. Check Flask!");
    }
    setLoading(false);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  const getSentimentColor = () => {
    if (!result) return '#3b82f6';
    return result.sentiment === 'Positive' ? '#10b981' : result.sentiment === 'Negative' ? '#ef4444' : '#f59e0b';
  };

  return (
    <div style={styles.container}>
      {/* Modern Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>✨</div>
            <h2 style={styles.logo}>Sentix</h2>
          </div>
          
          <div style={styles.divider}></div>
          
          <div style={styles.statsSection}>
            <div style={styles.statBox}>
              <div style={styles.statIconBox}>🎯</div>
              <div>
                <span style={styles.statLabel}>Accuracy</span>
                <span style={styles.statValue}>87.2%</span>
              </div>
            </div>
            
            <div style={styles.statBox}>
              <div style={styles.statIconBox}>🧠</div>
              <div>
                <span style={styles.statLabel}>Model</span>
                <span style={styles.statValue}>LSTM RNN</span>
              </div>
            </div>
            
            <div style={styles.statBox}>
              <div style={styles.statIconBox}>📊</div>
              <div>
                <span style={styles.statLabel}>Trained On</span>
                <span style={styles.statValue}>50k+ Data</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>AI-Powered Sentiment Analysis</p>
        </div>
      </div>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Sentiment Analysis</h1>
            <p style={styles.subtitle}>Advanced NLP-powered sentiment detection in real-time</p>
          </div>
        </header>

        {/* Input Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>📝 Analyze Text</h2>
            <span style={styles.charCount}>{charCount} / 1000</span>
          </div>
          <textarea 
            style={styles.textarea}
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your text, review, or comment here..."
            maxLength={1000}
          />
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !text.trim()}
            style={loading ? {...styles.button, ...styles.buttonLoading} : styles.button}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner}>⚙️</span> Processing...
              </span>
            ) : (
              <span style={styles.buttonContent}>✨ Analyze Sentiment</span>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div style={{...styles.resultCard, borderTop: `4px solid ${getSentimentColor()}`}}>
            <div style={styles.resultGrid}>
              <div style={styles.sentimentResult}>
                <div style={{...styles.sentimentBadge, backgroundColor: getSentimentColor()}}>
                  {result.sentiment === 'Positive' ? '😊' : result.sentiment === 'Negative' ? '😞' : '😐'}
                </div>
                <div>
                  <p style={styles.sentimentLabel}>Sentiment</p>
                  <h3 style={{...styles.sentimentValue, color: getSentimentColor()}}>
                    {result.sentiment}
                  </h3>
                </div>
              </div>
              
              <div style={styles.confidenceBox}>
                <p style={styles.confidenceLabel}>Confidence Score</p>
                <div style={styles.confidenceContainer}>
                  <span style={styles.confidenceValue}>{result.confidence}%</span>
                  <div style={styles.progressBg}>
                    <div style={{
                      ...styles.progressFill, 
                      width: `${result.confidence}%`, 
                      backgroundColor: getSentimentColor()
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💭</div>
            <p style={styles.emptyText}>Analyze text to see sentiment results</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    minHeight: '100vh', 
    backgroundColor: '#f8fafc', 
    fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", 
    color: '#1e293b' 
  },
  
  // Sidebar Styles
  sidebar: { 
    width: '280px', 
    backgroundColor: '#0f172a',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '40px 24px', 
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
  },
  sidebarContent: { flex: 1 },
  logoContainer: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px',
    marginBottom: '40px',
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  logoIcon: { fontSize: '28px' },
  logo: { 
    fontSize: '28px', 
    fontWeight: 'bold', 
    margin: 0,
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #ec4899)', 
    WebkitBackgroundClip: 'text', 
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    marginBottom: '30px'
  },
  statsSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
  statBox: { 
    display: 'flex',
    gap: '12px',
    padding: '16px', 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease'
  },
  statIconBox: { fontSize: '24px', minWidth: '32px' },
  statLabel: { display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' },
  statValue: { display: 'block', fontSize: '18px', fontWeight: '700', color: '#ffffff' },
  footer: { paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' },
  footerText: { fontSize: '12px', color: '#94a3b8', margin: 0 },
  
  // Main Content
  main: { 
    flex: 1, 
    padding: '50px 60px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto'
  },
  header: { marginBottom: '50px' },
  title: { 
    fontSize: '48px', 
    fontWeight: '700', 
    margin: '0 0 12px 0',
    color: '#0f172a',
    background: 'linear-gradient(135deg, #0f172a, #334155)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: { 
    fontSize: '18px', 
    color: '#64748b', 
    margin: 0,
    fontWeight: 400
  },
  
  // Input Card
  card: { 
    backgroundColor: 'white', 
    padding: '40px', 
    borderRadius: '16px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  cardTitle: { fontSize: '20px', fontWeight: '600', margin: 0, color: '#1e293b' },
  charCount: { fontSize: '13px', color: '#94a3b8', fontWeight: 500 },
  textarea: { 
    width: '100%', 
    height: '180px', 
    border: '2px solid #e2e8f0', 
    borderRadius: '12px', 
    padding: '16px', 
    fontSize: '16px', 
    fontFamily: "inherit",
    outline: 'none', 
    transition: 'all 0.3s ease',
    resize: 'none',
    color: '#1e293b',
    backgroundColor: '#f8fafc'
  },
  button: { 
    marginTop: '24px', 
    width: '100%', 
    padding: '16px', 
    backgroundColor: '#3b82f6', 
    color: 'white', 
    borderRadius: '12px', 
    fontWeight: '600', 
    border: 'none', 
    cursor: 'pointer', 
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLoading: { 
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center'
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite'
  },
  
  // Result Card
  resultCard: { 
    marginTop: '40px', 
    backgroundColor: 'white', 
    padding: '40px', 
    borderRadius: '16px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    animation: 'slideUp 0.4s ease'
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px'
  },
  sentimentResult: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  sentimentBadge: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  sentimentLabel: { 
    fontSize: '13px', 
    color: '#94a3b8', 
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 8px 0',
    fontWeight: 600
  },
  sentimentValue: { 
    fontSize: '32px', 
    fontWeight: '700', 
    margin: 0
  },
  confidenceBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  confidenceLabel: { 
    fontSize: '13px', 
    color: '#94a3b8', 
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 16px 0',
    fontWeight: 600
  },
  confidenceContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  confidenceValue: { 
    fontSize: '36px', 
    fontWeight: '700', 
    color: '#3b82f6'
  },
  progressBg: { 
    width: '100%', 
    height: '12px', 
    backgroundColor: '#e2e8f0', 
    borderRadius: '10px', 
    overflow: 'hidden' 
  },
  progressFill: { 
    height: '100%', 
    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '10px'
  },
  
  // Empty State
  emptyState: {
    marginTop: '80px',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8'
  },
  emptyIcon: { fontSize: '64px', marginBottom: '20px' },
  emptyText: { fontSize: '18px', color: '#94a3b8', margin: 0 }
};

export default App;