// imports
import { BaseChannelData } from ".";

/**
 * Voice Channel Data
 * @description Type Interface for Guild Voice Channel
 * @extends {BaseChannelData}
 */
export interface VoiceChannelData extends BaseChannelData {
  usersLimit: number;
  bitrate: number;
}
