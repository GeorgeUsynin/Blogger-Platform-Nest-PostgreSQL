export const ErrorCodes = {
  LOGIN_ALREADY_EXISTS: 'LOGIN_ALREADY_EXISTS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  EMAIL_ALREADY_CONFIRMED_BY_CODE: 'EMAIL_ALREADY_CONFIRMED_BY_CODE',
  INVALID_CONFIRMATION_CODE: 'INVALID_CONFIRMATION_CODE',
  INVALID_PASSWORD_RECOVERY_CODE: 'INVALID_PASSWORD_RECOVERY_CODE',
  CONFIRMATION_CODE_EXPIRED: 'CONFIRMATION_CODE_EXPIRED',
  PASSWORD_RECOVERY_CODE_EXPIRED: 'PASSWORD_RECOVERY_CODE_EXPIRED',
  NOT_AN_OWNER_OF_THIS_DEVICE: 'NOT_AN_OWNER_OF_THIS_DEVICE',
  NOT_AN_OWNER_OF_THIS_COMMENT: 'NOT_AN_OWNER_OF_THIS_COMMENT',
  BLOG_ALREADY_DELETED: 'BLOG_ALREADY_DELETED',
  POST_ALREADY_DELETED: 'POST_ALREADY_DELETED',
  COMMENT_ALREADY_DELETED: 'COMMENT_ALREADY_DELETED',
  USER_ALREADY_DELETED: 'USER_ALREADY_DELETED',
  BLOG_NOT_FOUND: 'BLOG_NOT_FOUND',
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  LIKE_NOT_FOUND: 'LIKE_NOT_FOUND',
  BLOG_CREATION_FAILED: 'BLOG_CREATION_FAILED',
  GAME_CONNECTION_CREATION_FAILED: 'GAME_CONNECTION_CREATION_FAILED',
  POST_CREATION_FAILED: 'POST_CREATION_FAILED',
  QUESTION_CREATION_FAILED: 'QUESTION_CREATION_FAILED',
  COMMENT_CREATION_FAILED: 'COMMENT_CREATION_FAILED',
  ANSWER_CREATION_FAILED: 'ANSWER_CREATION_FAILED',
  USER_CREATION_FAILED: 'USER_CREATION_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED: 'EMAIL_NOT_CONFIRMED',
  PASSWORD_RECOVERY_NOT_INITIATED: 'PASSWORD_RECOVERY_NOT_INITIATED',
  USER_ALREADY_HAS_ACTIVE_GAME: 'USER_ALREADY_HAS_ACTIVE_GAME',
  NOT_PARTICIPATING_IN_ACTIVE_GAME: 'NOT_PARTICIPATING_IN_ACTIVE_GAME',
  PLAYER_NOT_IN_GAME: 'PLAYER_NOT_IN_GAME',
  GAME_IS_NOT_ACTIVE: 'GAME_IS_NOT_ACTIVE',
  GAME_NOT_ACCEPTING_PLAYERS: 'GAME_NOT_ACCEPTING_PLAYERS',
  ALL_QUESTIONS_ALREADY_ANSWERED: 'ALL_QUESTIONS_ALREADY_ANSWERED',
  QUESTION_NOT_FOUND_DOMAIN_ERROR: 'QUESTION_NOT_FOUND_DOMAIN_ERROR',
  CORRECT_ANSWERS_NOT_DEFINED_DOMAIN_ERROR:
    'CORRECT_ANSWERS_NOT_DEFINED_DOMAIN_ERROR',
  QUESTION_ID_NOT_DEFINED_DOMAIN_ERROR: 'QUESTION_ID_NOT_DEFINED_DOMAIN_ERROR',
  NOT_ENOUGH_PUBLISHED_QUESTIONS: 'NOT_ENOUGH_PUBLISHED_QUESTIONS',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCodes.LOGIN_ALREADY_EXISTS]: 'The login is not unique',
  [ErrorCodes.EMAIL_ALREADY_EXISTS]: 'The email address is not unique',
  [ErrorCodes.EMAIL_ALREADY_CONFIRMED_BY_CODE]:
    'Confirmation code already been applied',
  [ErrorCodes.INVALID_CONFIRMATION_CODE]: 'Invalid confirmation code',
  [ErrorCodes.INVALID_PASSWORD_RECOVERY_CODE]: 'Invalid password recovery code',
  [ErrorCodes.CONFIRMATION_CODE_EXPIRED]: 'Confirmation code expired',
  [ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED]: 'Password recovery code expired',
  [ErrorCodes.NOT_AN_OWNER_OF_THIS_DEVICE]: 'You can not modify this device',
  [ErrorCodes.NOT_AN_OWNER_OF_THIS_COMMENT]: 'You can not modify this comment',
  [ErrorCodes.BLOG_ALREADY_DELETED]: 'Blog already deleted',
  [ErrorCodes.POST_ALREADY_DELETED]: 'Post already deleted',
  [ErrorCodes.COMMENT_ALREADY_DELETED]: 'Comment already deleted',
  [ErrorCodes.USER_ALREADY_DELETED]: 'User already deleted',
  [ErrorCodes.BLOG_NOT_FOUND]: "Blog doesn't exist",
  [ErrorCodes.GAME_NOT_FOUND]: "Game doesn't exist",
  [ErrorCodes.POST_NOT_FOUND]: "Post doesn't exist",
  [ErrorCodes.COMMENT_NOT_FOUND]: "Comment doesn't exist",
  [ErrorCodes.DEVICE_NOT_FOUND]: "Device doesn't exist",
  [ErrorCodes.QUESTION_NOT_FOUND]: "Question doesn't exist",
  [ErrorCodes.USER_NOT_FOUND]: "User doesn't exist",
  [ErrorCodes.LIKE_NOT_FOUND]: "Like doesn't exist",
  [ErrorCodes.BLOG_CREATION_FAILED]: 'Blog creation failed',
  [ErrorCodes.GAME_CONNECTION_CREATION_FAILED]:
    'Game connection creation failed',
  [ErrorCodes.POST_CREATION_FAILED]: 'Post creation failed',
  [ErrorCodes.COMMENT_CREATION_FAILED]: 'Comment creation failed',
  [ErrorCodes.ANSWER_CREATION_FAILED]: 'Answer creation failed',
  [ErrorCodes.QUESTION_CREATION_FAILED]: 'Question creation failed',
  [ErrorCodes.USER_CREATION_FAILED]: 'User creation failed',
  [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ErrorCodes.EMAIL_NOT_CONFIRMED]: 'Email address is not confirmed',
  [ErrorCodes.PASSWORD_RECOVERY_NOT_INITIATED]:
    'Password recovery was not initiated',
  [ErrorCodes.USER_ALREADY_HAS_ACTIVE_GAME]:
    'You are already participating in an active game',
  [ErrorCodes.NOT_PARTICIPATING_IN_ACTIVE_GAME]:
    'You are not participating in active game',
  [ErrorCodes.PLAYER_NOT_IN_GAME]: 'Player is not in this game',
  [ErrorCodes.GAME_IS_NOT_ACTIVE]: 'Game is not active',
  [ErrorCodes.GAME_NOT_ACCEPTING_PLAYERS]: 'Game is not accepting players',
  [ErrorCodes.ALL_QUESTIONS_ALREADY_ANSWERED]:
    'All questions have already been answered',
  [ErrorCodes.QUESTION_NOT_FOUND_DOMAIN_ERROR]:
    'Question was not found in the game',
  [ErrorCodes.CORRECT_ANSWERS_NOT_DEFINED_DOMAIN_ERROR]:
    'Correct answers are not defined',
  [ErrorCodes.QUESTION_ID_NOT_DEFINED_DOMAIN_ERROR]:
    'Question id is not defined',
  [ErrorCodes.NOT_ENOUGH_PUBLISHED_QUESTIONS]:
    'Not enough published questions. Please add more or publish existed ones',
};

export const ErrorFields = {
  LOGIN: 'login',
  EMAIL: 'email',
  CODE: 'code',
  RECOVERY_CODE: 'recoveryCode',
} as const;

export type ErrorField = (typeof ErrorFields)[keyof typeof ErrorFields];
