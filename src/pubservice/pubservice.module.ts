import { Global, Module } from '@nestjs/common';
import { PubserviceService } from './pubservice.service';
export const SHARED_PUB_SUB = 'SHARED_PUB_SUB';

@Global()
@Module({
 providers: [

    PubserviceService, // Your existing service, now using shared PubSub
  ],
  exports: [
    PubserviceService,
  ],
})
export class PubserviceModule {}
