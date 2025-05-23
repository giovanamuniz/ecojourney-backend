const db = require('../connection');

async function getHabits(req, res) {
  const userId = req.user.id;

  try {
    const habits = await db('habits').where({ user_id: userId });
    res.status(200).json(habits);
  } catch (error) {
    console.error('Erro ao buscar hábitos:', error);
    res.status(500).json({ error: 'Erro ao buscar hábitos.' });
  }
}

async function createHabit(req, res) {
  const { title, description, value, unit } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  try {
    const [id] = await db('habits').insert({
      title,
      description,
      user_id: userId,
      value,
      unit,
    });

    res.status(201).json({ id, title, description, value, unit });
  } catch (error) {
    console.error('Erro ao criar hábito:', error);
    res.status(500).json({ error: 'Erro ao criar hábito.' });
  }
}

async function updateHabit(req, res) {
  const { id } = req.params;
  const { title, description, value, unit } = req.body;
  const userId = req.user.id;

  try {
    await db('habits')
      .where({ id, user_id: userId })
      .update({ title, description, value, unit });

    res.status(200).json({ message: 'Hábito atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar hábito:', error);
    res.status(500).json({ error: 'Erro ao atualizar hábito.' });
  }
}

async function deleteHabit(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await db('habits')
      .where({ id, user_id: userId })
      .del();

    res.status(200).json({ message: 'Hábito excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir hábito:', error);
    res.status(500).json({ error: 'Erro ao excluir hábito.' });
  }
}

async function calcularPegadaCarbono(userId) {
  const habits = await db('habits').where({ user_id: userId });

  let total = 0;

  for (const habit of habits) {
    const title = habit.title.toLowerCase();
    const value = habit.value;

    if (title.includes('carne')) total += value * 27.0;
    else if (title.includes('gasolina')) total += value * 2.31;
    else if (title.includes('energia')) total += value * 0.5;
  }

  await db('users').where({ id: userId }).update({ carbon_footprint: total });

  return total;
}


module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit
};
