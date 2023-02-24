// imports
import { ThreadAutoArchiveDuration, ThreadChannelType } from "discord.js";
import { Message } from ".";

/**
 * Thread Channel Data
 * @description Type Interface for Guild Thread Channel
 */
export interface ThreadChannelData {
  archived: boolean;
  type: ThreadChannelType;
  rateLimitPerUser: number | null;
  autoArchiveDuration: ThreadAutoArchiveDuration;
  locked: boolean;
  messages: Message[];
  name: string;
}
