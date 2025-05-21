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


async function updateGoal(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const goal = await db('daily_goals').where({ id, user_id: userId }).first();
    if (!goal) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    await db('daily_goals')
      .where({ id, user_id: userId })
      .update({ title, description, completed });

    res.json({ message: 'Meta atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar meta.' });
  }
}

async function deleteGoal(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const goal = await db('daily_goals').where({ id, user_id: userId }).first();
    if (!goal) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    await db('daily_goals').where({ id, user_id: userId }).del();
    res.json({ message: 'Meta excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir meta:', error);
    res.status(500).json({ error: 'Erro interno ao excluir meta.' });
  }
}

module.exports = {
  createGoal,
  getGoalsByUser,
  updateGoal,
  deleteGoal,
};


