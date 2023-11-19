import { Module } from '@nestjs/common';
import { EnhancementService } from './enhancement.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EnhancementService],
  exports: [EnhancementService],
})
export class EnhancementModule {}
