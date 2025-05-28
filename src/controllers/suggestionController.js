const axios = require('axios');
require('dotenv').config();

async function generateSuggestions(req, res) {
  const { habits = [], carbonFootprint = 120.0 } = req.body;

  const prompt = `O usuário possui uma pegada de carbono de aproximadamente ${carbonFootprint} kg de CO₂ por mês. Seus hábitos incluem: ${habits.join(', ')}. Com base nisso, sugira 3 hábitos sustentáveis realistas que ele pode adotar para reduzir a emissão de carbono. Seja objetivo e direto.`;


  try {
const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {

        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );


    const fullText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const suggestions = fullText
      .split('\n')
      .filter(line => line.trim() !== '' && /\w/.test(line));

    res.json({ suggestions });
  } catch (error) {
    console.error('Erro IA:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao gerar sugestões com IA' });
  }
}

module.exports = { generateSuggestions };
