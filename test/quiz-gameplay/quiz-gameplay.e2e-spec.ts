import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateQuestionInputDto } from '../../src/modules/quiz-game/questions/api/dto';
import {
  createUserAndGetToken,
  runAfterAllSetup,
  runBeforeAllSetup,
} from '../helpers';

const QUESTIONS_URL = '/api/sa/quiz/questions';
const PAIRS_URL = '/api/pair-game-quiz/pairs';
const CONNECTION_URL = `${PAIRS_URL}/connection`;
const MY_CURRENT_GAME_URL = `${PAIRS_URL}/my-current`;
const ANSWERS_URL = `${MY_CURRENT_GAME_URL}/answers`;

type BasicAuthorization = {
  Authorization: string;
};

type AuthUser = {
  user: {
    id: string;
    login: string;
    email: string;
    createdAt: string;
  };
  token: string;
};

type AnswerView = {
  questionId: string;
  answerStatus: 'Correct' | 'Incorrect';
  addedAt: string;
};

type PlayerProgressView = {
  answers: AnswerView[];
  player: {
    id: string;
    login: string;
  };
  score: number;
};

type GameView = {
  id: string;
  firstPlayerProgress: PlayerProgressView;
  secondPlayerProgress: PlayerProgressView | null;
  questions: { id: string; body: string }[] | null;
  status: 'PendingSecondPlayer' | 'Active' | 'Finished';
  pairCreatedDate: string;
  startGameDate: string | null;
  finishGameDate: string | null;
};

type QuestionView = {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

const expectForbiddenError = (
  body: unknown,
  path: string,
  code: string,
  message: string,
) => {
  expect(body).toEqual({
    timestamp: expect.any(String),
    path,
    status: HttpStatus.FORBIDDEN,
    errorsMessages: [
      {
        message,
        code,
      },
    ],
  });
};

describe('QuizGameplayController (e2e) - /api/pair-game-quiz/pairs', () => {
  let app: INestApplication;
  let basicAuthorization: BasicAuthorization;

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

  const authHeader = (token: string) => ({
    Authorization: `Bearer ${token}`,
  });

  const createPublishedQuestions = async (count = 5) => {
    const questions: QuestionView[] = [];

    for (let i = 1; i <= count; i++) {
      const payload: CreateQuestionInputDto = {
        body: `Question ${i}: choose the valid answer for the game`,
        correctAnswers: ['correct'],
      };

      const { body: question } = await request(app.getHttpServer())
        .post(QUESTIONS_URL)
        .set(basicAuthorization)
        .send(payload)
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .put(`${QUESTIONS_URL}/${question.id}/publish`)
        .set(basicAuthorization)
        .send({ published: true })
        .expect(HttpStatus.NO_CONTENT);

      questions.push(question);
    }

    return questions;
  };

  const createPlayers = async () => {
    const firstPlayer = await createUserAndGetToken(app, basicAuthorization, {
      prefix: 'p1',
    });
    const secondPlayer = await createUserAndGetToken(app, basicAuthorization, {
      prefix: 'p2',
    });

    return { firstPlayer, secondPlayer };
  };

  const connectToGame = async (player: AuthUser) => {
    const { body } = await request(app.getHttpServer())
      .post(CONNECTION_URL)
      .set(authHeader(player.token))
      .expect(HttpStatus.OK);

    return body as GameView;
  };

  const getMyCurrentGame = async (player: AuthUser) => {
    const { body } = await request(app.getHttpServer())
      .get(MY_CURRENT_GAME_URL)
      .set(authHeader(player.token))
      .expect(HttpStatus.OK);

    return body as GameView;
  };

  const getGameById = async (player: AuthUser, gameId: string) => {
    const { body } = await request(app.getHttpServer())
      .get(`${PAIRS_URL}/${gameId}`)
      .set(authHeader(player.token))
      .expect(HttpStatus.OK);

    return body as GameView;
  };

  const answer = async (
    player: AuthUser,
    answerBody: 'correct' | 'wrong',
    expectedStatus: 'Correct' | 'Incorrect',
  ) => {
    const { body } = await request(app.getHttpServer())
      .post(ANSWERS_URL)
      .set(authHeader(player.token))
      .send({ answer: answerBody })
      .expect(HttpStatus.OK);

    expect(body).toEqual({
      questionId: expect.any(String),
      answerStatus: expectedStatus,
      addedAt: expect.any(String),
    });

    return body as AnswerView;
  };

  const answerMany = async (
    player: AuthUser,
    answers: ('correct' | 'wrong')[],
  ) => {
    for (const answerBody of answers) {
      await answer(
        player,
        answerBody,
        answerBody === 'correct' ? 'Correct' : 'Incorrect',
      );
    }
  };

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('creates a pending game for the first player and starts it with the same 5 questions after the second player joins', async () => {
    await createPublishedQuestions();
    const { firstPlayer, secondPlayer } = await createPlayers();

    const pendingGame = await connectToGame(firstPlayer);

    expect(pendingGame).toEqual({
      id: expect.any(String),
      firstPlayerProgress: {
        answers: [],
        player: {
          id: firstPlayer.user.id,
          login: firstPlayer.user.login,
        },
        score: 0,
      },
      secondPlayerProgress: null,
      questions: null,
      status: 'PendingSecondPlayer',
      pairCreatedDate: expect.any(String),
      startGameDate: null,
      finishGameDate: null,
    });

    const currentPendingGame = await getMyCurrentGame(firstPlayer);
    expect(currentPendingGame).toEqual(pendingGame);

    const activeGameForSecondPlayer = await connectToGame(secondPlayer);

    expect(activeGameForSecondPlayer).toEqual({
      id: pendingGame.id,
      firstPlayerProgress: pendingGame.firstPlayerProgress,
      secondPlayerProgress: {
        answers: [],
        player: {
          id: secondPlayer.user.id,
          login: secondPlayer.user.login,
        },
        score: 0,
      },
      questions: expect.arrayContaining([
        {
          id: expect.any(String),
          body: expect.any(String),
        },
      ]),
      status: 'Active',
      pairCreatedDate: pendingGame.pairCreatedDate,
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
    expect(activeGameForSecondPlayer.questions).toHaveLength(5);

    const currentGameForFirstPlayer = await getMyCurrentGame(firstPlayer);
    expect(currentGameForFirstPlayer).toEqual(activeGameForSecondPlayer);

    const currentGameForSecondPlayer = await getMyCurrentGame(secondPlayer);
    expect(currentGameForSecondPlayer).toEqual(activeGameForSecondPlayer);
  });

  it('finishes the game with a draw when the faster player receives a speed bonus and both players have equal scores', async () => {
    await createPublishedQuestions();
    const { firstPlayer, secondPlayer } = await createPlayers();
    const pendingGame = await connectToGame(firstPlayer);
    await connectToGame(secondPlayer);

    await answerMany(firstPlayer, [
      'correct',
      'wrong',
      'wrong',
      'correct',
      'wrong',
    ]);
    await wait(10);
    await answerMany(secondPlayer, [
      'correct',
      'correct',
      'wrong',
      'correct',
      'wrong',
    ]);

    const finishedGame = await getGameById(firstPlayer, pendingGame.id);

    expect(finishedGame.status).toBe('Finished');
    expect(finishedGame.finishGameDate).toEqual(expect.any(String));
    expect(finishedGame.firstPlayerProgress.answers).toHaveLength(5);
    expect(finishedGame.secondPlayerProgress?.answers).toHaveLength(5);
    expect(finishedGame.firstPlayerProgress.score).toBe(3);
    expect(finishedGame.secondPlayerProgress?.score).toBe(3);
  });

  it('does not add the speed bonus when the faster player has no correct answers', async () => {
    await createPublishedQuestions();
    const { firstPlayer, secondPlayer } = await createPlayers();
    const pendingGame = await connectToGame(firstPlayer);
    await connectToGame(secondPlayer);

    await answerMany(firstPlayer, [
      'wrong',
      'wrong',
      'wrong',
      'wrong',
      'wrong',
    ]);
    await wait(10);
    await answerMany(secondPlayer, [
      'wrong',
      'correct',
      'wrong',
      'wrong',
      'wrong',
    ]);

    const finishedGame = await getGameById(secondPlayer, pendingGame.id);

    expect(finishedGame.status).toBe('Finished');
    expect(finishedGame.finishGameDate).toEqual(expect.any(String));
    expect(finishedGame.firstPlayerProgress.score).toBe(0);
    expect(finishedGame.secondPlayerProgress?.score).toBe(1);
  });

  it('returns 403 when the current user is already participating in a pending or active game', async () => {
    await createPublishedQuestions();
    const { firstPlayer, secondPlayer } = await createPlayers();

    await connectToGame(firstPlayer);
    await connectToGame(secondPlayer);

    const { body } = await request(app.getHttpServer())
      .post(CONNECTION_URL)
      .set(authHeader(firstPlayer.token))
      .expect(HttpStatus.FORBIDDEN);

    expectForbiddenError(
      body,
      CONNECTION_URL,
      'USER_ALREADY_HAS_PENDING_OR_ACTIVE_GAME',
      'You are already participating in a pending or active game',
    );
  });

  it('returns 403 when the current user tries to connect to their own pending game', async () => {
    await createPublishedQuestions();
    const { firstPlayer } = await createPlayers();

    await connectToGame(firstPlayer);

    const { body } = await request(app.getHttpServer())
      .post(CONNECTION_URL)
      .set(authHeader(firstPlayer.token))
      .expect(HttpStatus.FORBIDDEN);

    expectForbiddenError(
      body,
      CONNECTION_URL,
      'USER_ALREADY_HAS_PENDING_OR_ACTIVE_GAME',
      'You are already participating in a pending or active game',
    );
  });

  it('returns 403 when the current user requests a game they do not participate in', async () => {
    await createPublishedQuestions();
    const { firstPlayer, secondPlayer } = await createPlayers();
    const thirdPlayer = await createUserAndGetToken(app, basicAuthorization, {
      prefix: 'p3',
    });
    const pendingGame = await connectToGame(firstPlayer);
    await connectToGame(secondPlayer);

    const { body } = await request(app.getHttpServer())
      .get(`${PAIRS_URL}/${pendingGame.id}`)
      .set(authHeader(thirdPlayer.token))
      .expect(HttpStatus.FORBIDDEN);

    expectForbiddenError(
      body,
      `${PAIRS_URL}/${pendingGame.id}`,
      'NOT_PARTICIPATING_IN_ACTIVE_GAME',
      'You are not participating in active game',
    );
  });

  it('returns 403 when the current user sends an answer without an active game', async () => {
    const player = await createUserAndGetToken(app, basicAuthorization, {
      prefix: 'p1',
    });

    const { body } = await request(app.getHttpServer())
      .post(ANSWERS_URL)
      .set(authHeader(player.token))
      .send({ answer: 'correct' })
      .expect(HttpStatus.FORBIDDEN);

    expectForbiddenError(
      body,
      ANSWERS_URL,
      'NOT_PARTICIPATING_IN_ACTIVE_GAME',
      'You are not participating in active game',
    );
  });

  it('returns 403 when a player has already answered all questions in an active game', async () => {
    await createPublishedQuestions();
    const { firstPlayer, secondPlayer } = await createPlayers();

    await connectToGame(firstPlayer);
    await connectToGame(secondPlayer);
    await answerMany(firstPlayer, [
      'correct',
      'wrong',
      'correct',
      'wrong',
      'correct',
    ]);

    const { body } = await request(app.getHttpServer())
      .post(ANSWERS_URL)
      .set(authHeader(firstPlayer.token))
      .send({ answer: 'correct' })
      .expect(HttpStatus.FORBIDDEN);

    expectForbiddenError(
      body,
      ANSWERS_URL,
      'ALL_QUESTIONS_ALREADY_ANSWERED',
      'All questions have already been answered',
    );
  });
});
