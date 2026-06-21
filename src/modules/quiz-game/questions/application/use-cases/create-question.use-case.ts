import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/repositories/questions.repository';
import { CreateQuestionDto } from '../dto';
import { QuestionCreationFailedError } from '../../../../../core/exceptions';
import { Question } from '../../domain/question.aggregate';

export class CreateQuestionCommand extends Command<number> {
  constructor(public readonly dto: CreateQuestionDto) {
    super();
  }
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<
  CreateQuestionCommand,
  number
> {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ dto }: CreateQuestionCommand): Promise<number> {
    const question = Question.create(dto);
    const questionId =
      await this.questionsRepository.saveQuestionAggregate(question);

    if (!questionId) {
      throw new QuestionCreationFailedError();
    }

    return questionId;
  }
}
