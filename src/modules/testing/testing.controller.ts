import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingAllDataApi } from './swagger/testing-all-data.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TestingAllDataApi()
  async deleteAll() {
    const query = `
    TRUNCATE TABLE "users", "blogs", "questions", "games"
    RESTART IDENTITY CASCADE;
    `;
    await this.dataSource.query(query);
  }
}
