// imports
import {
    TextBasedChannelTypes,
    ThreadChannelType,
    VoiceBasedChannelTypes,
} from "discord.js";
import { ChannelPermissions } from ".";

/**
 * Base Channel Data
 * @description Type Interface for Base Data Of Any Channel of Guild
 */
export interface BaseChannelData {
    name: string;
    parent?: string | null;
    type: TextBasedChannelTypes | VoiceBasedChannelTypes | ThreadChannelType;
    permissions?: ChannelPermissions[];
}
