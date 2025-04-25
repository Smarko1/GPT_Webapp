require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/', async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `
          Kérlek keress rövid 5 cikket a megadott témában.
          Mindegyik cikk tartalmazza és pontosan így nézzen ki:
          - Egy rövid címet (1 sor és tartalmazza hogy hanyadik cím: pl. 1. Cím)
          - Egy 4-5 mondatos összefoglalót (külön bekezdésben)
          - Egy valódi, létező híroldal pontos (pl. CNN,) linkjét, amely pontosan leírja a cikket amit te megadtál.
          (pl. URL: https://www.example.com ezt is egy külön bekezdésben)

          FONTOS: Az URL-ek valósághű, létező híroldalak cikkeire mutassanak, ne kitalált címek legyenek.
        ` },
        { role: 'user', content: topic },
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
  console.log(`Backend fut`);
});
