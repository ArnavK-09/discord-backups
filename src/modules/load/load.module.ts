// imports
import type { Guild } from "discord.js";
import type { BackupData } from "~/typings";
import { flushGuildData } from "~/utils";
import * as loadHelpers from "./helpers";

/**
 * Load Backup Options
 * @description Type Interface for Config Options for loadBackup Function
 */
interface LoadBackupOptions {
  flushGuild?: boolean;
}

/**
 * Load Backup
 * @description Loads a backup of a Discord server
 *
 * @param {Guild} guild - The guild to load the backup into
 * @param {BackupData} backup - The backup data to load
 * @param {LoadBackupOptions} [options={ flushGuild: true }] - The options for loading the backup
 * @returns {Promise<BackupData>} - The loaded backup data
 */
export async function loadBackup(
  guild: Guild,
  backup: BackupData,
  { flushGuild = true }: LoadBackupOptions = {}
): Promise<BackupData> {
  // if guild | backup not there
  if (!guild) throw new Error("Guild not found");
  if (!backup || typeof backup === "undefined")
    throw new Error("Backup Data Not Provided");

  //console.log("Loading backup:", backup);

  // clear guild
  if (flushGuild) {
    await flushGuildData(guild);
  }

  try {
    await loadHelpers.loadServerConfig(guild, backup);
    await loadHelpers.loadRoles(guild, backup);
    await loadHelpers.loadChannels(guild, backup);
    await loadHelpers.loadAfk(guild, backup);
    await loadHelpers.loadEmojis(guild, backup);
    await loadHelpers.loadBans(guild, backup);
    await loadHelpers.loadWidget(guild, backup);

    return backup;
  } catch (error) {
    throw error;
  }
}
