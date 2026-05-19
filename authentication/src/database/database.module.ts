import { Global, Module } from '@nestjs/common';
import { DatabseService } from './database.service.js';

@Global()
@Module({
  providers: [DatabseService],
  exports: [DatabseService],
})
export class DatabaseModule {}
