// imports
import type {
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildVerificationLevel,
  Snowflake,
} from "discord.js";
import type {
  Widget as WidgetData,
  RoleData,
  ChannelData,
  EmojiData,
  BanForm,
  AfkData,
} from ".";

/**
 * Backup Data
 * @description Type Interface for backup info of a guild
 */
export interface BackupData {
  name: string;
  id: Snowflake;
  guildID: string;
  widget: WidgetData;
  createdTimestamp: number;
  iconURL?: string;
  description?: string;
  verificationLevel?: GuildVerificationLevel;
  defaultMessageNotifications: GuildDefaultMessageNotifications | number;
  explictContentFilter?: GuildExplicitContentFilter;
  ownerID?: Snowflake;
  splashURL?: string;
  bannerURL?: string;
  channels: ChannelData;
  roles: RoleData[];
  emojis: EmojiData[];
  bans: BanForm[];
  afk?: AfkData;
}
