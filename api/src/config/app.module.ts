import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CsvModule } from 'nest-csv-parser';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { EnhancementModule } from '../util/enhancement/enhancement.module';
import { ProductModule } from '../product/product.module';
import { ParserModule } from '../util/parser/parser.module';
import { EnhancementService } from '../util/enhancement/enhancement.service';
import { ParserService } from 'src/util/parser/parser.service';
import { ProductService } from 'src/product/product.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './dev.env',
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DBURL),

    ProductModule,
    CsvModule,
    ScheduleModule.forRoot(),
    EnhancementModule,
    ParserModule,
  ],
  providers: [ProductService, EnhancementService, ParserService],
})
export class AppModule {}
