import { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import {
  CreateQuestionInputDto,
  UpdateQuestionInputDto,
  UpdateQuestionPublishedStatusInputDto,
} from '../../src/modules/quiz-game/questions/api/dto';
import { runAfterAllSetup, runBeforeAllSetup } from '../helpers';

const QUESTIONS_URL = '/api/sa/quiz/questions';

type QuestionView = {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

describe('QuizQuestionsController (e2e) - /api/sa/quiz/questions', () => {
  let app: INestApplication;
  let basicAuthorization: {
    Authorization: string;
  };

  beforeAll(async () => {
    ({ app, basicAuthorization } = await runBeforeAllSetup());
  });

  afterEach(async () => {
    await request(app.getHttpServer())
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NO_CONTENT);
  });

  afterAll(async () => {
    if (app) {
      await runAfterAllSetup(app);
    }
  });

  const getQuestionPayload = (
    body = 'What is the capital city of France?',
  ): CreateQuestionInputDto => ({
    body,
    correctAnswers: ['Paris', 'paris'],
  });

  const createQuestion = async (
    payload: CreateQuestionInputDto = getQuestionPayload(),
  ) => {
    const { body } = await request(app.getHttpServer())
      .post(QUESTIONS_URL)
      .set(basicAuthorization)
      .send(payload)
      .expect(HttpStatus.CREATED);

    return body as QuestionView;
  };

  it('creates a new question and returns it in get all questions response', async () => {
    const newQuestion = getQuestionPayload();

    const createdQuestion = await createQuestion(newQuestion);

    expect(createdQuestion).toEqual({
      id: expect.any(String),
      ...newQuestion,
      published: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    const { body } = await request(app.getHttpServer())
      .get(QUESTIONS_URL)
      .set(basicAuthorization)
      .expect(HttpStatus.OK);

    expect(body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [createdQuestion],
    });
  });

  it('returns paginated questions filtered by body search term and published status', async () => {
    const firstQuestion = await createQuestion(
      getQuestionPayload('Alpha topic has a published answer?'),
    );
    await createQuestion(getQuestionPayload('Beta topic has draft answer?'));
    const thirdQuestion = await createQuestion(
      getQuestionPayload('Another alpha topic is published?'),
    );

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${firstQuestion.id}/publish`)
      .set(basicAuthorization)
      .send({ published: true } satisfies UpdateQuestionPublishedStatusInputDto)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${thirdQuestion.id}/publish`)
      .set(basicAuthorization)
      .send({ published: true } satisfies UpdateQuestionPublishedStatusInputDto)
      .expect(HttpStatus.NO_CONTENT);

    const { body } = await request(app.getHttpServer())
      .get(QUESTIONS_URL)
      .set(basicAuthorization)
      .query({
        bodySearchTerm: 'alpha',
        publishedStatus: 'published',
        pageNumber: 1,
        pageSize: 1,
      })
      .expect(HttpStatus.OK);

    expect(body.pagesCount).toBe(2);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(1);
    expect(body.totalCount).toBe(2);
    expect(body.items).toHaveLength(1);
    expect(body.items[0].published).toBe(true);
    expect(body.items[0].body.toLowerCase()).toContain('alpha');
  });

  it('updates question by id', async () => {
    const createdQuestion = await createQuestion();
    const updatedQuestion: UpdateQuestionInputDto = {
      body: 'What city is the capital of Germany?',
      correctAnswers: ['Berlin', 'berlin'],
    };

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${createdQuestion.id}`)
      .set(basicAuthorization)
      .send(updatedQuestion)
      .expect(HttpStatus.NO_CONTENT);

    const { body } = await request(app.getHttpServer())
      .get(QUESTIONS_URL)
      .set(basicAuthorization)
      .expect(HttpStatus.OK);

    expect(body.items).toHaveLength(1);
    expect(body.items[0]).toEqual({
      id: createdQuestion.id,
      ...updatedQuestion,
      published: false,
      createdAt: createdQuestion.createdAt,
      updatedAt: expect.any(String),
    });
  });

  it('updates question published status by id', async () => {
    const createdQuestion = await createQuestion();

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${createdQuestion.id}/publish`)
      .set(basicAuthorization)
      .send({ published: true } satisfies UpdateQuestionPublishedStatusInputDto)
      .expect(HttpStatus.NO_CONTENT);

    const { body: publishedQuestions } = await request(app.getHttpServer())
      .get(QUESTIONS_URL)
      .set(basicAuthorization)
      .query({ publishedStatus: 'published' })
      .expect(HttpStatus.OK);

    expect(publishedQuestions.totalCount).toBe(1);
    expect(publishedQuestions.items[0]).toEqual({
      ...createdQuestion,
      published: true,
      updatedAt: expect.any(String),
    });

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${createdQuestion.id}/publish`)
      .set(basicAuthorization)
      .send({
        published: false,
      } satisfies UpdateQuestionPublishedStatusInputDto)
      .expect(HttpStatus.NO_CONTENT);

    const { body: notPublishedQuestions } = await request(app.getHttpServer())
      .get(QUESTIONS_URL)
      .set(basicAuthorization)
      .query({ publishedStatus: 'notPublished' })
      .expect(HttpStatus.OK);

    expect(notPublishedQuestions.totalCount).toBe(1);
    expect(notPublishedQuestions.items[0].id).toBe(createdQuestion.id);
    expect(notPublishedQuestions.items[0].published).toBe(false);
  });

  it('deletes question by id', async () => {
    const createdQuestion = await createQuestion();

    await request(app.getHttpServer())
      .delete(`${QUESTIONS_URL}/${createdQuestion.id}`)
      .set(basicAuthorization)
      .expect(HttpStatus.NO_CONTENT);

    const { body } = await request(app.getHttpServer())
      .get(QUESTIONS_URL)
      .set(basicAuthorization)
      .expect(HttpStatus.OK);

    expect(body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('returns 400 for invalid create and update question payloads', async () => {
    const invalidQuestion = {
      body: 'short',
      correctAnswers: [],
    };

    const { body: createErrorBody } = await request(app.getHttpServer())
      .post(QUESTIONS_URL)
      .set(basicAuthorization)
      .send(invalidQuestion)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createErrorBody.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'body' }),
        expect.objectContaining({ field: 'correctAnswers' }),
      ]),
    );

    const createdQuestion = await createQuestion();

    const { body: updateErrorBody } = await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${createdQuestion.id}`)
      .set(basicAuthorization)
      .send({
        body: 'What city is the capital of Germany?',
        correctAnswers: [''],
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(updateErrorBody.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'correctAnswers' }),
      ]),
    );
  });

  it('returns 400 for invalid published status and query params', async () => {
    const createdQuestion = await createQuestion();

    const { body: publishErrorBody } = await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${createdQuestion.id}/publish`)
      .set(basicAuthorization)
      .send({ published: 'true' })
      .expect(HttpStatus.BAD_REQUEST);

    expect(publishErrorBody.errorsMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'published' })]),
    );

    const { body: queryErrorBody } = await request(app.getHttpServer())
      .get(QUESTIONS_URL)
      .set(basicAuthorization)
      .query({
        pageNumber: 'invalid',
        pageSize: 0,
        sortBy: 'body',
        sortDirection: 'invalid',
        publishedStatus: 'invalid',
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(queryErrorBody.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'pageNumber' }),
        expect.objectContaining({ field: 'pageSize' }),
        expect.objectContaining({ field: 'sortBy' }),
        expect.objectContaining({ field: 'sortDirection' }),
        expect.objectContaining({ field: 'publishedStatus' }),
      ]),
    );
  });

  it('returns 400 for invalid route id', async () => {
    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/not-a-number`)
      .set(basicAuthorization)
      .send(getQuestionPayload())
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/not-a-number/publish`)
      .set(basicAuthorization)
      .send({ published: true } satisfies UpdateQuestionPublishedStatusInputDto)
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .delete(`${QUESTIONS_URL}/not-a-number`)
      .set(basicAuthorization)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('returns 404 for modifying unknown question', async () => {
    const unknownQuestionId = '999';

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${unknownQuestionId}`)
      .set(basicAuthorization)
      .send(getQuestionPayload())
      .expect(HttpStatus.NOT_FOUND);

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/${unknownQuestionId}/publish`)
      .set(basicAuthorization)
      .send({ published: true } satisfies UpdateQuestionPublishedStatusInputDto)
      .expect(HttpStatus.NOT_FOUND);

    await request(app.getHttpServer())
      .delete(`${QUESTIONS_URL}/${unknownQuestionId}`)
      .set(basicAuthorization)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('returns 401 if authorization header is missing', async () => {
    await request(app.getHttpServer())
      .get(QUESTIONS_URL)
      .expect(HttpStatus.UNAUTHORIZED);

    await request(app.getHttpServer())
      .post(QUESTIONS_URL)
      .send(getQuestionPayload())
      .expect(HttpStatus.UNAUTHORIZED);

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/1`)
      .send(getQuestionPayload())
      .expect(HttpStatus.UNAUTHORIZED);

    await request(app.getHttpServer())
      .put(`${QUESTIONS_URL}/1/publish`)
      .send({ published: true } satisfies UpdateQuestionPublishedStatusInputDto)
      .expect(HttpStatus.UNAUTHORIZED);

    await request(app.getHttpServer())
      .delete(`${QUESTIONS_URL}/1`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
