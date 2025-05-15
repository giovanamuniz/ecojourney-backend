const request = require('supertest');
const app = require('../src/app');
const db = require('../src/connection');

beforeAll(async () => {
  await db('users').del();
});

afterAll(async () => {
  await db.destroy(); 
});

describe('Registro de usuário', () => {
  it('deve registrar um novo usuário com sucesso', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        name: 'Usuário Teste',
        email: 'teste@teste.com',
        password: '123456'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Usuário cadastrado com sucesso!');
  });

  it('não deve permitir registro com e-mail já existente', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        name: 'Outro Usuário',
        email: 'teste@teste.com',
        password: '654321'
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('error', 'Email já cadastrado');
  });

  it('deve validar campos obrigatórios', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        name: '',
        email: '',
        password: ''
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
