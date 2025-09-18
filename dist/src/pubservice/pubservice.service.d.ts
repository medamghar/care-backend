export declare class PubserviceService {
    private readonly pubSub;
    constructor();
    publish(triggerName: string, payload: any): Promise<void>;
    asyncIterator(triggerName: string): AsyncIterator<unknown, any, any>;
}
