import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

interface ExamResponse {
  id: string;
  examName: string;
  examDate: string;
  examDescription: string;
  examImage: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

import { StorageService } from './../src/exams/storage.service';

describe('Exams (e2e)', () => {
  let app: INestApplication<App>;
  let userId: string;
  let examId: string;
  let accessToken: string;

  beforeAll(async () => {
    const mockStorageService = {
      uploadFile: jest
        .fn()
        .mockResolvedValue('https://exemplo.com/imagens/exam_mock.jpg'),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageService)
      .useValue(mockStorageService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const uniqueEmail = `jane.doe.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;

    // Create a user to use in the tests
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Jane Doe',
        email: uniqueEmail,
        password: 'Password123',
        confirmPassword: 'Password123',
        birthdate: '1995-10-25',
      });

    const userBody = userResponse.body as UserResponse;
    userId = userBody.id;

    // Log in to obtain access token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail,
        password: 'Password123',
      });
    const loginBody = loginResponse.body as { accessToken: string };
    accessToken = loginBody.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /exams (Cadastro de Exame)', () => {
    it('deve retornar 401 ao cadastrar exame sem autenticação', async () => {
      await request(app.getHttpServer()).post('/exams').send({}).expect(401);
    });

    it('deve cadastrar um novo exame com sucesso', async () => {
      const examData = {
        examName: 'Ressonância Magnética',
        examDate: '2026-06-24T10:00:00.000Z',
        examDescription: 'Exame de imagem do joelho esquerdo.',
        examImage: 'https://exemplo.com/imagens/ressonancia1.jpg',
        userId,
      };

      const response = await request(app.getHttpServer())
        .post('/exams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(examData)
        .expect(201);

      const examBody = response.body as ExamResponse;
      expect(examBody).toHaveProperty('id');
      expect(examBody.examName).toBe(examData.examName);
      expect(examBody.examDescription).toBe(examData.examDescription);
      expect(examBody.examImage).toBe(examData.examImage);
      expect(examBody.userId).toBe(userId);

      examId = examBody.id;
    });

    it('deve cadastrar um novo exame enviando um arquivo multipart com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/exams')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', Buffer.from('mock image data'), 'test_image.jpg')
        .field('examName', 'Ultrassom Abdominal')
        .field('examDate', '2026-06-24T12:00:00.000Z')
        .field('examDescription', 'Exame de rotina do abdômen.')
        .field('userId', userId)
        .expect(201);

      const examBody = response.body as ExamResponse;
      expect(examBody).toHaveProperty('id');
      expect(examBody.examName).toBe('Ultrassom Abdominal');
      expect(examBody.examImage).toBe(
        'https://exemplo.com/imagens/exam_mock.jpg',
      );
    });

    it('deve retornar 404 ao cadastrar exame com userId inexistente', async () => {
      const examData = {
        examName: 'Hemograma',
        examDate: '2026-06-24T10:00:00.000Z',
        examDescription: 'Exame de sangue de rotina.',
        examImage: 'https://exemplo.com/imagens/hemograma.jpg',
        userId: '00000000-0000-0000-0000-000000000000',
      };

      const response = await request(app.getHttpServer())
        .post('/exams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(examData)
        .expect(404);

      const errorBody = response.body as ErrorResponse;
      expect(errorBody.message).toBe('Usuário não encontrado.');
    });

    it('deve retornar 400 ao tentar cadastrar sem campos obrigatórios', async () => {
      const examData = {
        examName: 'Exame Incompleto',
        // missing examDate, examDescription, examImage, userId
      };

      await request(app.getHttpServer())
        .post('/exams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(examData)
        .expect(400);
    });
  });

  describe('GET /exams (Listagem de Exames)', () => {
    it('deve retornar 401 ao listar exames sem autenticação', async () => {
      await request(app.getHttpServer()).get('/exams').expect(401);
    });

    it('deve listar os exames do usuário com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .get(`/exams?userId=${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const examsList = response.body as ExamResponse[];
      expect(Array.isArray(examsList)).toBe(true);
      expect(examsList.length).toBeGreaterThanOrEqual(1);

      const exam = examsList.find((e) => e.id === examId);
      expect(exam).toBeDefined();
      expect(exam?.examName).toBe('Ressonância Magnética');
    });

    it('deve retornar 400 se userId não for fornecido na query', async () => {
      const response = await request(app.getHttpServer())
        .get('/exams')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      const errorBody = response.body as ErrorResponse;
      expect(errorBody.message).toBe('O ID do usuário (userId) é obrigatório.');
    });

    it('deve retornar 404 se userId fornecido não existir', async () => {
      const response = await request(app.getHttpServer())
        .get('/exams?userId=00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      const errorBody = response.body as ErrorResponse;
      expect(errorBody.message).toBe('Usuário não encontrado.');
    });
  });

  describe('GET /exams/:id (Detalhamento de Exame)', () => {
    it('deve retornar 401 ao detalhar exame sem autenticação', async () => {
      await request(app.getHttpServer()).get('/exams/some-id').expect(401);
    });

    it('deve retornar os detalhes de um exame específico', async () => {
      const response = await request(app.getHttpServer())
        .get(`/exams/${examId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const examBody = response.body as ExamResponse;
      expect(examBody).toHaveProperty('id', examId);
      expect(examBody.examName).toBe('Ressonância Magnética');
      expect(examBody.examDescription).toBe(
        'Exame de imagem do joelho esquerdo.',
      );
      expect(examBody.examImage).toBe(
        'https://exemplo.com/imagens/ressonancia1.jpg',
      );
      expect(examBody).toHaveProperty('user');
      expect(examBody.user).toHaveProperty('id', userId);
    });

    it('deve retornar 404 para exame não existente', async () => {
      const response = await request(app.getHttpServer())
        .get('/exams/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      const errorBody = response.body as ErrorResponse;
      expect(errorBody.message).toBe('Exame não encontrado.');
    });
  });
});
