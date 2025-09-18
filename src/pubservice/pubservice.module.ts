import { Module } from '@nestjs/common';
import { PubserviceService } from './pubservice.service';

@Module({
  providers: [PubserviceService]
})
export class PubserviceModule {}
