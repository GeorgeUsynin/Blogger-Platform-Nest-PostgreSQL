import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionNotFoundError } from '../../../../../core/exceptions';
import { QuestionsRepository } from '../../infrastructure/repositories/questions.repository';
import { UpdateQuestionDto } from '../dto';

export class UpdateQuestionCommand {
  constructor(public readonly dto: UpdateQuestionDto) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ dto }: UpdateQuestionCommand): Promise<void> {
    const foundQuestion = await this.questionsRepository.findById(dto.id);

    if (!foundQuestion) throw new QuestionNotFoundError();

    foundQuestion.update({
      body: dto.body,
      correctAnswers: dto.correctAnswers,
    });

    await this.questionsRepository.saveQuestionAggregate(foundQuestion);
  }
}
