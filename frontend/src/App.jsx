import { useState } from 'react';
import axios from 'axios';

function App() {
  const [topic, setTopic] = useState('');
  const [articles, setArticles] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/', { topic });
      setArticles(res.data.articles);
    } catch (err) {
      alert('Hiba a generálás során');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hírcikk Generátor</h1>
      <form onSubmit={handleGenerate}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ird be a cikk témáját..."
          style={{ padding: '0.5rem', marginRight: '1rem', width: '300px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Keresés
        </button>
      </form>

      {loading && <p>Hírek keresése...</p>}

      {articles && (
        <div style={{ marginTop: '2rem', whiteSpace: 'pre-line' }}>
          <h2>Eredmény:</h2>
          <p>{articles}</p>
        </div>
      )}
    </div>
  );
}

export default App;