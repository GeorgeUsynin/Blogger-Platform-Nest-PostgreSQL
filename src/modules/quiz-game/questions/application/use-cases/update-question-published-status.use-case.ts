import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionNotFoundError } from '../../../../../core/exceptions';
import { QuestionsRepository } from '../../infrastructure/repositories/questions.repository';
import { UpdateQuestionPublishedStatusDto } from '../dto';

export class UpdateQuestionPublishedStatusCommand {
  constructor(public readonly dto: UpdateQuestionPublishedStatusDto) {}
}

@CommandHandler(UpdateQuestionPublishedStatusCommand)
export class UpdateQuestionPublishedStatusUseCase implements ICommandHandler<UpdateQuestionPublishedStatusCommand> {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ dto }: UpdateQuestionPublishedStatusCommand): Promise<void> {
    const foundQuestion = await this.questionsRepository.findById(dto.id);

    if (!foundQuestion) throw new QuestionNotFoundError();

    foundQuestion.updatePublishedStatus(dto.published);

    await this.questionsRepository.saveQuestionAggregate(foundQuestion);
  }
}
