const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/database/knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let token;
let userId;

beforeAll(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
});

beforeEach(async () => {
  await knex('daily_goals').del();
  await knex('users').del();

  
  const uniqueEmail = `test${Date.now()}@example.com`;
  const hashedPassword = await bcrypt.hash('123456', 8);

  const [id] = await knex('users').insert({
    email: uniqueEmail,
    name: 'Test User',
    password_hash: hashedPassword,
  });

  userId = id;

  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '10m'
  });
});

afterAll(async () => {
  await knex.destroy();
});

describe('Integração - Metas Diárias', () => {
  it('Deve criar uma nova meta', async () => {
    const res = await request(app)
      .post('/api/daily-goals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Meta Teste',
        description: 'Descrição da meta'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('Deve retornar as metas do usuário', async () => {
    await knex('daily_goals').insert({
      title: 'Meta Teste',
      description: 'Descrição da meta',
      user_id: userId,
    });

    const res = await request(app)
      .get('/api/daily-goals')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Deve editar uma meta existente', async () => {
    const [id] = await knex('daily_goals').insert({
      title: 'Meta Original',
      description: 'Descrição original',
      user_id: userId,
    });

    const res = await request(app)
      .put(`/api/daily-goals/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Meta Atualizada' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/atualizada/i);
  });

  it('Deve excluir uma meta', async () => {
    const [id] = await knex('daily_goals').insert({
      title: 'Meta para excluir',
      description: 'Será excluída',
      user_id: userId,
    });

    const res = await request(app)
      .delete(`/api/daily-goals/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deletada/i);
  });
});

