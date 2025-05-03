import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class AppController {
  @Get()
  healtCheck(): string {
    return 'ok';
  }
}
