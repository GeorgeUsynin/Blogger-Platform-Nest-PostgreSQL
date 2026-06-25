import { BaseDomainException } from './BaseDomainException';
import { LoginAlreadyExistsError } from './LoginAlreadyExistsError';
import { UserNotFoundError } from './UserNotFoundError';
import { BlogNotFoundError } from './BlogNotFoundError';
import { GameNotFoundError } from './GameNotFoundError';
import { PostNotFoundError } from './PostNotFoundError';
import { DeviceNotFoundError } from './DeviceNotFoundError';
import { CommentNotFoundError } from './CommentNotFoundError';
import { QuestionNotFoundError } from './QuestionNotFoundError';
import { LikeNotFoundError } from './LikeNotFoundError';
import { EmailAlreadyConfirmedByCode } from './EmailAlreadyConfirmedByCode';
import { InvalidConfirmationCode } from './InvalidConfirmationCode';
import { ConfirmationCodeExpired } from './ConfirmationCodeExpired';
import { InvalidPasswordRecoveryCode } from './InvalidPasswordRecoveryCode';
import { PasswordRecoveryCodeExpired } from './PasswordRecoveryCodeExpired';
import { EmailAlreadyExistsError } from './EmailAlreadyExistsError';
import { NotAnOwnerOfThisDevice } from './NotAnOwnerOfThisDevice';
import { NotAnOwnerOfThisComment } from './NotAnOwnerOfThisComment';
import { UserCreationFailedError } from './UserCreationFailedError';
import { PostCreationFailedError } from './PostCreationFailedError';
import { BlogCreationFailedError } from './BlogCreationFailedError';
import { GameConnectionCreationFailedError } from './GameConnectionCreationFailedError';
import { QuestionCreationFailedError } from './QuestionCreationFailedError';
import { CommentCreationFailedError } from './CommentCreationFailedError';
import { AnswerCreationFailedError } from './AnswerCreationFailedError';
import { BlogAlreadyDeleted } from './BlogAlreadyDeleted';
import { PostAlreadyDeleted } from './PostAlreadyDeleted';
import { CommentAlreadyDeleted } from './CommentAlreadyDeleted';
import { UserAlreadyDeleted } from './UserAlreadyDeleted';
import { EmailNotConfirmedError } from './EmailNotConfirmed';
import { PasswordRecoveryNotInitiated } from './PasswordRecoveryNotInitiated';
import { AlreadyParticipatingInActiveGame } from './AlreadyParticipatingInActiveGame';
import { NotParticipatingInGameError } from './NotParticipatingInGameError';
import { PlayerNotInGameError } from './PlayerNotInGameError';
import { GameIsNotActiveError } from './GameIsNotActiveError';
import { GameNotAcceptingPlayersError } from './GameNotAcceptingPlayersError';
import { AllQuestionsAlreadyAnsweredError } from './AllQuestionsAlreadyAnsweredError';
import { QuestionNotFoundDomainError } from './QuestionNotFoundDomainError';
import { CorrectAnswersNotDefinedDomainError } from './CorrectAnswersNotDefinedDomainError';
import { QuestionIdNotDefinedDomainError } from './QuestionIdNotDefinedDomainError';
import { NotEnoughPublishedQuestions } from './NotEnoughPublishedQuestions';

export {
  BaseDomainException,
  LoginAlreadyExistsError,
  UserNotFoundError,
  BlogNotFoundError,
  GameNotFoundError,
  PostNotFoundError,
  QuestionNotFoundError,
  EmailAlreadyConfirmedByCode,
  InvalidConfirmationCode,
  ConfirmationCodeExpired,
  InvalidPasswordRecoveryCode,
  PasswordRecoveryCodeExpired,
  EmailAlreadyExistsError,
  DeviceNotFoundError,
  NotAnOwnerOfThisDevice,
  NotAnOwnerOfThisComment,
  CommentNotFoundError,
  LikeNotFoundError,
  UserCreationFailedError,
  PostCreationFailedError,
  BlogCreationFailedError,
  QuestionCreationFailedError,
  CommentCreationFailedError,
  AnswerCreationFailedError,
  GameConnectionCreationFailedError,
  BlogAlreadyDeleted,
  PostAlreadyDeleted,
  CommentAlreadyDeleted,
  UserAlreadyDeleted,
  EmailNotConfirmedError,
  PasswordRecoveryNotInitiated,
  AlreadyParticipatingInActiveGame,
  NotParticipatingInGameError,
  PlayerNotInGameError,
  GameIsNotActiveError,
  GameNotAcceptingPlayersError,
  AllQuestionsAlreadyAnsweredError,
  QuestionNotFoundDomainError,
  CorrectAnswersNotDefinedDomainError,
  QuestionIdNotDefinedDomainError,
  NotEnoughPublishedQuestions,
};
