import { ApiProperty } from '@nestjs/swagger';
import { TBlogDB } from '../../../infrastructure/types';

export class BlogViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  websiteUrl: string;

  @ApiProperty({
    default: false,
    description: 'True if user has not expired membership subscription to blog',
  })
  isMembership: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  public static mapToView(blog: TBlogDB): BlogViewDto {
    const dto = new BlogViewDto();

    dto.id = blog.id.toString();
    dto.name = blog.name;
    dto.description = blog.description;
    dto.websiteUrl = blog.websiteUrl;
    dto.isMembership = blog.isMembership;
    dto.createdAt = blog.createdAt;

    return dto;
  }
}
