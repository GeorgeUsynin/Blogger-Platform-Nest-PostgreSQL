import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/repositories/questions.repository';
import { QuestionNotFoundError } from '../../../../../core/exceptions';

export class DeleteQuestionCommand {
  constructor(public readonly id: number) {}
}
@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ id }: DeleteQuestionCommand): Promise<void> {
    const foundQuestion = await this.questionsRepository.findById(id);

    if (!foundQuestion) {
      throw new QuestionNotFoundError();
    }

    await this.questionsRepository.softDeleteQuestionById(foundQuestion.id);
  }
}
