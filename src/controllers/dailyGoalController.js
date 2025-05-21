const db = require('../connection');

async function createGoal(req, res) {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  try {
    const [id] = await db('daily_goals').insert({
      title,
      description,
      user_id: userId,
      completed: false,
    });

    res.status(201).json({ id, title, description, completed: false });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({ error: 'Erro interno ao criar a meta.' });
  }
}

async function getGoalsByUser(req, res) {
  const userId = req.user.id;

  try {
    const goals = await db('daily_goals')
      .where({ user_id: userId })
      .select('id', 'title', 'description', 'completed');

    res.status(200).json(goals);
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    res.status(500).json({ error: 'Erro ao buscar metas do usuário.' });
  }
}

module.exports = {
  createGoal,
  getGoalsByUser
};


