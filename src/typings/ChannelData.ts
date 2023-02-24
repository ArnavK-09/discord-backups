// imports
import { CategoryData, VoiceChannelData, TextChannelData } from ".";

/**
 * Channel Data
 * @description Type Interface for Channels & Categories Present In Guild
 */
export interface ChannelData {
  categories: CategoryData[];
  others: Array<TextChannelData | VoiceChannelData>;
}
