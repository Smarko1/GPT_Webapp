require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const OpenAI = require('openai');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// NewsAPI lekérdezés
async function fetchNews(topic) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    topic
  )}&sortBy=publishedAt&language=hu&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;

  const response = await axios.get(url);
  return response.data.articles;
}

app.post('/', async (req, res) => {
  const { topic } = req.body;

  try {
    const articles = await fetchNews(topic);

    if (!articles.length) {
      return res.status(404).send('Nem található ilyen hír');
    }

    const formattedArticles = articles
      .map(
        (article, index) => `
${index + 1}. ${article.title}

${article.description || article.content || 'Nincs leírás hozzá'}

URL: ${article.url}
        `
      )
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Ezek a hírek a következő témában: "${topic}".
Kérlek foglald össze mind az 5 cikket ilyen módon:
- Sorszám
- Cím
- Egy 4-5 mondatos összefoglaló
- Az URL pontosan így: URL: https://...
Illetve, tailwind használatával formázd meg szépen. Egy HTML kódrészletet
várok el, kattintható linkkel, új oldalon nyíljon. Ne teljes HTML dokumentum legyen. A választ
raw text-ként küldd, chatben, semmilyen kiemeléssel, mivel másképp megjelenik
az oldalon feliratként a wrappered. Az oldalon van világos/sötét mód, ennek tudatában
formázd, az összefoglaló se legyen sötét. Letisztult, modern formázást szeretnék.
          `,
        },
        { role: 'user', content: formattedArticles },
      ],
      temperature: 0.7,
    });

    res.json({ articles: response.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Hiba történt a hírcikkek generálásakor.');
  }
});

app.listen(port, () => {
  console.log(`Backend fut a ${port} porton`);
});
