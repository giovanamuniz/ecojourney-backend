const axios = require('axios');

async function generateSuggestions(req, res) {
  const { habits = [], carbonFootprint = 120.0 } = req.body;

  const prompt = `
O usuário possui uma pegada de carbono de aproximadamente ${carbonFootprint} kg de CO₂ por mês.
Seus hábitos incluem: ${habits.join(', ')}.
Com base nisso, sugira 3 hábitos sustentáveis realistas que ele pode adotar para reduzir a emissão de carbono. Seja objetivo.
  `;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const text = response.data.choices[0].message.content;
    const suggestions = text.split('\n').filter(item => item.trim() !== '');

    res.json({ suggestions });
  } catch (error) {
    console.error('Erro IA:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao gerar sugestões com IA' });
  }
}

module.exports = { generateSuggestions };
