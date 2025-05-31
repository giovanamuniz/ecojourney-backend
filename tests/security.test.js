const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

test('Verifica que senhas estão com hash seguro', async () => {
  const user = await db('users').where({ email: 'usera@example.com' }).first();
  const isValid = await bcrypt.compare('@Usuario123', user.password_hash);
  expect(isValid).toBe(true);
});

jest.setTimeout(20000);

let tokenA;
let tokenB;
let goalId;

beforeAll(async () => {
  await db.migrate.rollback(null, true);
  await db.migrate.latest();

  // Usuário A
  const passwordA = await bcrypt.hash('@Usuario123', 8);
  await db('users').insert({
    name: 'User A',
    email: 'usera@example.com',
    password_hash: passwordA,
  });
  const userA = await db('users').where({ email: 'usera@example.com' }).first();
  const userAId = userA.id;
  tokenA = jwt.sign({ id: userAId }, process.env.JWT_SECRET, { expiresIn: '10m' });

  // Usuário B
  const passwordB = await bcrypt.hash('@Usuario456', 8);
  await db('users').insert({
    name: 'User B',
    email: 'userb@example.com',
    password_hash: passwordB,
  });
  const userB = await db('users').where({ email: 'userb@example.com' }).first();
  const userBId = userB.id;
  tokenB = jwt.sign({ id: userBId }, process.env.JWT_SECRET, { expiresIn: '10m' });

  // Meta criada pelo usuário A
  const [id] = await db('daily_goals').insert({
    title: 'Meta Segura',
    description: 'Meta criada pelo user A',
    user_id: userAId,
  });

  goalId = id;
});

afterAll(async () => {
  await db.destroy();
});

describe('Segurança da API - Testes com Supertest', () => {
  test('Rejeita acesso a rotas protegidas sem token', async () => {
    const res = await request(app).get('/api/daily-goals');
    expect(res.statusCode).toBe(403);
  });

  test('Rejeita acesso com token inválido', async () => {
    const res = await request(app)
      .get('/api/daily-goals')
      .set('Authorization', 'Bearer token_invalido');

    expect(res.statusCode).toBe(401);
  });

  test('Impede edição de metas de outro usuário', async () => {
    const res = await request(app)
      .put(`/api/daily-goals/${goalId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Tentativa de invasão' });

    expect(res.statusCode).toBe(404); // A meta não é do usuário B
    expect(res.body).toHaveProperty('error', 'Meta não encontrada');
  });

  test('Previne SQL Injection no login', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: "' OR '1'='1",
        password: 'injection',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });


});
