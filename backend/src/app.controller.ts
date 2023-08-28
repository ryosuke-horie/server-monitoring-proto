import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  is_working(): string {
    return "Hello I'm Working!";
  }
}
