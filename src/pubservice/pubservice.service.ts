import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';


@Injectable()
export class PubserviceService {
  private readonly pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  async publish(triggerName: string, payload: any) {
    return this.pubSub.publish(triggerName, payload);
  }

  asyncIterator(triggerName: string) {
    return this.pubSub.asyncIterator(triggerName);
  }
}
