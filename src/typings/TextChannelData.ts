// imports
import { BaseChannelData, ThreadChannelData, Message } from ".";

/**
 * Text Channel Data
 * @description Type Interface for Guild Any Text Channel
 * @extends {BaseChannelData}
 */
export interface TextChannelData extends BaseChannelData {
    parent?: string;
    topic: string | null;
    rateLimitPerUser?: number;
    nsfw?: boolean;
    threads: ThreadChannelData[];
    messages: Message[];
    news: boolean;
}
