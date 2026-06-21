import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBasicAuth } from '@nestjs/swagger';
import { ROUTES } from '../../../../constants';
import { BasicAuthGuard } from '../../../user-accounts/users/guards/basic';
import {
  CreateQuestionInputDto,
  GetQuestionsQueryParamsInputDto,
  QuestionViewDto,
  UpdateQuestionInputDto,
  UpdateQuestionPublishedStatusInputDto,
} from './dto';
import { QuestionCreationFailedError } from '../../../../core/exceptions';
import { PaginatedViewDto } from '../../../../core/dto';
import {
  CreateQuestionCommand,
  DeleteQuestionCommand,
  UpdateQuestionCommand,
  UpdateQuestionPublishedStatusCommand,
} from '../application/use-cases';
import { QuestionsQueryRepository } from '../infrastructure/repositories/query/questions.query-repository';
import {
  CreateQuestionApi,
  DeleteQuestionApi,
  GetAllQuestionsApi,
  UpdateQuestionApi,
  UpdateQuestionPublishedStatusApi,
} from './swagger';

@Controller(`${ROUTES.SA}/${ROUTES.QUIZ}/${ROUTES.QUESTIONS}`)
@UseGuards(BasicAuthGuard)
export class QuizQuestionsController {
  constructor(
    private questionsQueryRepository: QuestionsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllQuestionsApi()
  async getAllQuestions(
    @Query() query: GetQuestionsQueryParamsInputDto,
  ): Promise<PaginatedViewDto<QuestionViewDto>> {
    const { items, totalCount } =
      await this.questionsQueryRepository.getAllQuestions(query);

    const mappedItems = items.map(QuestionViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @ApiBasicAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateQuestionApi()
  async createQuestion(
    @Body() body: CreateQuestionInputDto,
  ): Promise<QuestionViewDto> {
    const questionId = await this.commandBus.execute(
      new CreateQuestionCommand(body),
    );

    const createdQuestion =
      await this.questionsQueryRepository.getQuestionById(questionId);

    if (!createdQuestion) {
      throw new QuestionCreationFailedError();
    }

    return QuestionViewDto.mapToView(createdQuestion);
  }

  @ApiBasicAuth()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateQuestionApi()
  async updateQuestionById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateQuestionInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateQuestionCommand({ ...body, id }));
  }

  @ApiBasicAuth()
  @Put(`:id/${ROUTES.PUBLISH}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateQuestionPublishedStatusApi()
  async updateQuestionPublishedStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateQuestionPublishedStatusInputDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateQuestionPublishedStatusCommand({ ...body, id }),
    );
  }

  @ApiBasicAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteQuestionApi()
  async deleteQuestion(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.commandBus.execute(new DeleteQuestionCommand(id));
  }
}
