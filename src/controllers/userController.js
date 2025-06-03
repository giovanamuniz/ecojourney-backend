const bcrypt = require('bcryptjs');
const db = require('../connection');
const jwt = require('jsonwebtoken');

const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db('users').where({ id: userId }).first();


    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ points: user.points });
  } catch (error) {
    console.error('Erro ao buscar pontos do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar pontos do usuário' });
  }
}

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  try {
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [id] = await db('users').insert({
    name,
    email,
    password_hash,
  });

  return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id });

  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await db('users').where({ email }).first();

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
      }
    });


  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db('users').where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      points: user.points
    });
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
  }
};

async function addPoints(req, res) {
  const userId = req.user.id;
  const { points } = req.body;

  if (typeof points !== 'number' || points <= 0) {
    return res.status(400).json({ error: 'Quantidade de pontos inválida' });
  }

  try {
    await db('users')
      .where({ id: userId })
      .increment('points', points);

    res.json({ message: `${points} pontos adicionados com sucesso.` });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar pontos' });
  }
}
async function redeemPoints(req, res) {
  const userId = req.user.id;
  const { points } = req.body;

  if (typeof points !== 'number' || points <= 0) {
    return res.status(400).json({ error: 'Pontos inválidos' });
  }

  try {
    const user = await db('users').where({ id: userId }).first();

    if (user.points < points) {
      return res.status(400).json({ error: 'Pontos insuficientes' });
    }

    await db('users')
      .where({ id: userId })
      .decrement('points', points);

    res.json({ message: 'Pontos resgatados com sucesso.', updatedPoints: user.points - points });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao resgatar pontos' });
  }
}


module.exports = {
  register,
  login,
  getUserPoints,
  getUserInfo,
  addPoints,          
  redeemPoints  
};