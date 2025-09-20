export declare class PubserviceService {
    private static sharedPubSub;
    constructor();
    publish(triggerName: string, payload: any): Promise<void>;
    asyncIterator(triggerName: string): AsyncIterator<unknown, any, any>;
}
