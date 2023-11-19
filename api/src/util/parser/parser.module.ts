import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
// import { ModelModule } from 'src/models/model.module';

@Module({
  imports: [],
  providers: [ParserService],
  exports: [ParserService],
})
export class ParserModule {}
