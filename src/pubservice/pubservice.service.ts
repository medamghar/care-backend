import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubserviceService {
  private static sharedPubSub: PubSub = new PubSub(); // Static shared instance

  constructor() {
    console.log('[PubserviceService] Using static shared PubSub instance');
  }

  async publish(triggerName: string, payload: any) {
    console.log(`[PubserviceService SHARED] Publishing to trigger: "${triggerName}"`);
    console.log(`[PubserviceService SHARED] Payload:`, JSON.stringify(payload, null, 2));
    
    try {
      const result = await PubserviceService.sharedPubSub.publish(triggerName, payload);
      console.log(`[PubserviceService SHARED] Published successfully, ${result} subscribers notified`);
      return result;
    } catch (error) {
      console.error(`[PubserviceService SHARED] Error publishing:`, error);
      throw error;
    }
  }

  asyncIterator(triggerName: string) {
    console.log(`[PubserviceService SHARED] Creating async iterator for trigger: "${triggerName}"`);
    const iterator = PubserviceService.sharedPubSub.asyncIterator(triggerName);
    console.log(`[PubserviceService SHARED] Iterator created successfully`);
    return iterator;
  }
}