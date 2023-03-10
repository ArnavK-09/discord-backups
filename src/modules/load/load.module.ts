// imports
import type { Guild } from "discord.js";
import type { BackupData } from "~/typings";
import { flushGuildData } from "~/utils";
import * as loadHelpers from "./helpers";

/**
 * Load Backup Options
 * @description Type Interface for Config Options for loadBackup Function
 */
type loadBackupOptions = {
  flushGuild: boolean;
};

/**
 * Create Backup
 *
 * @description Creates backup of discord server
 *
 * @param {Guild} guild - Guild in which to backup
 * @param {BackupData} backupData - Backup data
 * @param {loadBackupOptions} options - Options to load backup
 * @returns {Promise<BackupData>} Backup Data
 */
export function loadBackup(
  guild: Guild,
  backup: BackupData,
  options: loadBackupOptions = { flushGuild: true }
) {
  // promise
  return new Promise<BackupData>(async (resolve, reject) => {
    // if guild there
    if (!guild) reject("Guild not found");

    // loading backup
    try {
      // clear guild
      if (options.flushGuild) flushGuildData(guild);

      // loading all data
      Promise.all([
        loadHelpers.loadServerConfig(guild, backup),
        loadHelpers.loadRoles(guild, backup),
        loadHelpers.loadChannels(guild, backup),
        loadHelpers.loadAfk(guild, backup),
        loadHelpers.loadEmojis(guild, backup),
        loadHelpers.loadBans(guild, backup),
        loadHelpers.loadWidget(guild, backup),
      ]);

      // return
      return resolve(backup);
    } catch (err) {
      // error
      reject(err);
    }
  });
}
