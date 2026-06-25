import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { QuestionEntity } from '../../entities/question.entity';
import { QuestionQueryModel } from './model/QuestionQueryModel';
import { GetQuestionsQueryParamsInputDto } from '../../../api/dto';
import { QuestionSortByFields } from '../../../api/dto/input-dto/question-sort-by-fields';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { QuestionPublishedStatus } from '../../../api/dto/input-dto/question-published-status';

@Injectable()
export class QuestionsQueryRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionsRepo: Repository<QuestionEntity>,
  ) {}

  async getAllQuestions(
    query: GetQuestionsQueryParamsInputDto,
  ): Promise<{ items: QuestionQueryModel[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize, bodySearchTerm, publishedStatus } =
      query;

    const safeSortBy = Object.values(QuestionSortByFields).includes(sortBy)
      ? sortBy
      : QuestionSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Desc.toUpperCase();

    const where: FindOptionsWhere<QuestionEntity> = {};

    if (bodySearchTerm) {
      where.body = ILike(`%${bodySearchTerm}%`);
    }

    switch (publishedStatus) {
      case QuestionPublishedStatus.Published:
        where.isPublished = true;
        break;
      case QuestionPublishedStatus.NotPublished:
        where.isPublished = false;
        break;
      case QuestionPublishedStatus.All:
      default:
        break;
    }

    const [items, totalCount] = await this.questionsRepo.findAndCount({
      where,
      select: {
        id: true,
        body: true,
        correctAnswers: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        [safeSortBy]: safeSortDirection as 'ASC' | 'DESC',
      },
      skip: query.calculateSkip(),
      take: pageSize,
    });

    return {
      items: items.map((question) => ({
        id: question.id,
        body: question.body,
        correctAnswers: question.correctAnswers,
        isPublished: question.isPublished,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      })),
      totalCount,
    };
  }

  async getQuestionById(id: number): Promise<QuestionQueryModel | null> {
    const question = await this.questionsRepo.findOne({
      where: { id },
      select: {
        id: true,
        body: true,
        correctAnswers: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!question) return null;

    return {
      id: question.id,
      body: question.body,
      correctAnswers: question.correctAnswers,
      isPublished: question.isPublished,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
