// imports
import { ChannelPermissions, TextChannelData, VoiceChannelData } from ".";

/**
 * Category Data
 * @description Type Interface for Guild Category
 */
export interface CategoryData {
    name: string;
    permissions: ChannelPermissions[];
    childeren: Array<TextChannelData | VoiceChannelData>;
}
