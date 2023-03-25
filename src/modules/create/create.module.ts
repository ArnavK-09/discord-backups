


/// imports
import { Guild, SnowflakeUtil } from "discord.js";
import type { BackupData } from "~/typings";
import * as createHelpers from "./helpers";

/**
 * Create Backup Options
 * @description Type Interface for Config Options for createBackup Function
 */
type createBackupOptions = {
  customID?: string;
  exclude?: string[];
};

/**
 * Create Backup
 *
 * @description Creates backup of discord server
 *
 * @param {Guild} guild - Guild to backup
 * @param {createOptions} options - Options to create backup
 * @returns {Promise<BackupData>}
 */
export function createBackup(guild: Guild, options: createBackupOptions = {}) {
  // promise
  return new Promise<BackupData>(async (resolve, reject) => {
    // creating backup
    try {
      /* base data */
      let backup: BackupData = {
        name: guild.name,
        verificationLevel: guild.verificationLevel,
        explictContentFilter: guild.explicitContentFilter,
        defaultMessageNotifications: guild.defaultMessageNotifications,
        afk: guild.afkChannel
          ? { name: guild.afkChannel.name, timeout: guild.afkTimeout }
          : undefined,
        widget: {
          enabled: guild.widgetEnabled ?? false,
          channel: guild.widgetChannel ? guild.widgetChannel.name : undefined,
        },
        channels: { categories: [], others: [] },
        roles: [],
        bans: [],
        emojis: [],
        createdTimestamp: Date.now(),
        guildID: guild.id,
        id: options.customID ?? SnowflakeUtil.generate().toString(),
      };

      /* Creating Backup from helpers */

      // icon
      backup.iconURL = guild.iconURL() ?? undefined; //testing

      // splash url
      if (guild.splashURL()) backup.splashURL = guild.splashURL()!;

      // banner url
      if (guild.bannerURL()) backup.bannerURL = guild.bannerURL()!;

      // bans
      if (!options || !(options.exclude || []).includes("bans")) {
        backup.bans = await createHelpers.getBans(guild);
      }

      // roles
      if (!options || !(options.exclude || []).includes("roles")) {
        backup.roles = await createHelpers.getRoles(guild);
      }
     
      // channels
      if (!options || !(options.exclude || []).includes("channels")) {
        backup.channels = await createHelpers.getChannels(guild);
      }

      // emojis
      if (!options || !(options.exclude || []).includes("emojis")) {
        backup.emojis = await createHelpers.getEmojis(guild);
      }
      /* return */
      resolve(backup);
    } catch (err) {
      reject(err);
    }
  });
}
