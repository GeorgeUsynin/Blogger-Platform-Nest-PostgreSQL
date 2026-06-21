import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { QuestionSortByFields } from './question-sort-by-fields';
import { QuestionPublishedStatus } from './question-published-status';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetQuestionsQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: QuestionSortByFields,
    required: false,
    default: QuestionSortByFields.CreatedAt,
  })
  @IsEnum(QuestionSortByFields)
  sortBy: QuestionSortByFields = QuestionSortByFields.CreatedAt;

  @ApiProperty({
    enum: QuestionPublishedStatus,
    required: false,
    default: QuestionPublishedStatus.All,
  })
  @IsEnum(QuestionPublishedStatus)
  publishedStatus: QuestionPublishedStatus = QuestionPublishedStatus.All;

  @ApiProperty({
    type: String,
    description:
      'Search term for question body: Body should contains this term in any position',
    required: false,
  })
  @IsString()
  @IsOptional()
  bodySearchTerm: string = '';
}
