import { Controller, Post, Body } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Post()
  createReport(@Body() body: CreateReportDto) {
    return 'This action creates a new report';
  }
}
