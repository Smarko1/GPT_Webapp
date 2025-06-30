import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [topic, setTopic] = useState('');
  const [articles, setArticles] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return alert('Kérlek adj meg egy témát!');
    setLoading(true);
    setArticles('');
    try {
      const res = await axios.post('/', { topic });
      setArticles(res.data.articles);
    } catch {
      alert('Hiba történt a lekérés során');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Add/remove `dark` class from html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 p-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2965/2965567.png"
              alt="news icon"
              className="w-10 h-10 opacity-80"
            />
            <h1 className="text-2xl font-bold text-sky-700 dark:text-sky-300">Hírcikk Generátor</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-100 px-3 py-1 rounded-md shadow-sm hover:opacity-80 transition"
          >
            {darkMode ? '🌞 Világos mód' : '🌙 Sötét mód'}
          </button>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 items-stretch mb-6">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Pl.: Mesterséges intelligencia"
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-800"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Keresés...' : 'Generálás'}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {articles && !loading && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-sky-800 dark:text-sky-300">Összefoglaló:</h2>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-4 rounded-lg shadow-inner text-gray-800 dark:text-gray-100 whitespace-pre-line max-h-[500px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: articles }}>
            </div>
          </div>
        )}

        {!articles && !loading && (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-sm">Várjuk a keresési témát...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
