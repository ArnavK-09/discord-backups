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
  if (!backup || typeof backup === "undefined") throw new Error("Backup Data Not Provided");

  //console.log("Loading backup:", backup);

  // clear guild
  if (flushGuild) {
    await flushGuildData(guild);
    console.log("Guild data flushed.");
  }

  try {
    console.log("Loading server config...");
    await loadHelpers.loadServerConfig(guild, backup);
    console.log("Server config loaded successfully.");

    console.log("Loading roles...");
    await loadHelpers.loadRoles(guild, backup);
    console.log("Roles loaded successfully.");

    console.log("Loading channels...");
    await loadHelpers.loadChannels(guild, backup);
    console.log("Channels loaded successfully.");

    console.log("Loading AFK data...");
    await loadHelpers.loadAfk(guild, backup);
    console.log("AFK data loaded successfully.");

    console.log("Loading emojis...");
    await loadHelpers.loadEmojis(guild, backup);
    console.log("Emojis loaded successfully.");

    console.log("Loading bans...");
    await loadHelpers.loadBans(guild, backup);
    console.log("Bans loaded successfully.");

    console.log("Loading widget...");
    await loadHelpers.loadWidget(guild, backup);
    console.log("Widget loaded successfully.");

    console.log("All promises resolved successfully.");

    return backup;
  } catch (error) {
    console.error("One or more promises failed:");
    console.error(error);
    throw error;
  }
}
