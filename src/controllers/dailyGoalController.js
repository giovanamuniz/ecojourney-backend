const db = require('../connection');

const createGoal = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ error: "Título e descrição são obrigatórios." });
  }

  try {
    const [id] = await db('daily_goals').insert({
      user_id: userId,
      title,
      description,
    });

    return res.status(201).json({ message: "Meta criada com sucesso!", id });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

const getGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    const goals = await db('daily_goals').where({ user_id: userId });
    return res.status(200).json(goals);
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const goal = await db('daily_goals').where({ id, user_id: userId }).first();

    if (!goal) {
      return res.status(404).json({ error: "Meta não encontrada." });
    }

    await db('daily_goals').where({ id }).update({
      title,
      description,
    });

    return res.status(200).json({ message: "Meta atualizada com sucesso." });
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

const deleteGoal = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const goal = await db('daily_goals').where({ id, user_id: userId }).first();

    if (!goal) {
      return res.status(404).json({ error: "Meta não encontrada." });
    }

    await db('daily_goals').where({ id }).delete();

    return res.status(200).json({ message: 'Meta deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar meta:', error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

const toggleGoalCompletion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const goal = await db('daily_goals').where({ id, user_id: userId }).first();

    if (!goal) {
      return res.status(404).json({ error: "Meta não encontrada." });
    }

    await db('daily_goals').where({ id }).update({
      completed: !goal.completed
    });

    return res.status(200).json({ message: "Status da meta alterado com sucesso." });
  } catch (error) {
    console.error('Erro ao alterar status da meta:', error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  toggleGoalCompletion
};
