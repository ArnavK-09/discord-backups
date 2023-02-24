// imports
import {
  ChannelType,
  Emoji,
  Guild,
  GuildFeature,
  Role,
  VoiceChannel,
} from "discord.js";
import type { BackupData } from "~/typings";
import { loadCategory, loadChannel } from "~/utils";

/**
 * Load Bans
 *
 * @description Loads all bans of server
 *
 * @param {Guild} guild - Discord Guild
 * @param {BackupData} backup - Backup data
 * @returns {Promise<String[]>} Banned Members of server
 */
export function loadBans(guild: Guild, backup: BackupData): Promise<String[]> {
  // promises list
  let banPromises: Promise<string>[] = [];
  // appending
  backup.bans.forEach((bannedUser) => {
    // push
    banPromises.push(
      guild.members.ban(bannedUser.id, {
        reason: bannedUser.reason,
      }) as Promise<string>
    );
  });
  // loading promises
  return Promise.all(banPromises);
}

/**
 * Load Roles
 *
 * @description Loads all roles of server
 *
 * @param {Guild} guild - Discord Guild
 * @param {BackupData} backup - Backup data
 * @returns {Promise<Role[]>} Roles of server
 */
export function loadRoles(guild: Guild, backup: BackupData): Promise<Role[]> {
  // promises list
  let rolePromises: Promise<Role>[] = [];
  // appending
  backup.roles.forEach((role) => {
    // check if everyone
    if (role.everyone) {
      rolePromises.push(
        guild.roles.cache.get(guild.id)!.edit({
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          mentionable: role.mentionable,
          permissions: BigInt(role.permissions),
        })
      );
    } else {
      rolePromises.push(
        guild.roles.create({
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          mentionable: role.mentionable,
          permissions: BigInt(role.permissions),
        })
      );
    }
  });
  // loading promises
  return Promise.all(rolePromises);
}

/**
 * Load AFK
 *
 * @description Loads afk config of server
 *
 * @param {Guild} guild - Discord Guild
 * @param {BackupData} backup - Backup data
 * @returns {Promise<Guild[]>} Guild Info
 */
export function loadAfk(guild: Guild, backup: BackupData): Promise<Guild[]> {
  // promises list
  let afkPromises: Promise<Guild>[] = [];
  // appending
  if (backup.afk) {
    // channel
    afkPromises.push(
      guild.setAFKChannel(
        guild.channels.cache.find(
          (x) => x.name == backup.afk?.name && x.type == ChannelType.GuildVoice
        ) as VoiceChannel
      )
    );

    // time out
    afkPromises.push(guild.setAFKTimeout(backup.afk.timeout, "Backup"));
  }
  // loading promises
  return Promise.all(afkPromises);
}

/**
 * Load Emojis
 *
 * @description Loads all emojis of server
 *
 * @param {Guild} guild - Discord Guild
 * @param {BackupData} backup - Backup data
 * @returns {Promise<Emoji[]>} Emojis of server
 */
export function loadEmojis(guild: Guild, backup: BackupData): Promise<Emoji[]> {
  // promises list
  let emojisPromises: Promise<Emoji>[] = [];
  // appending
  backup.emojis.forEach((emoji) => {
    // push
    emojisPromises.push(
      guild.emojis.create({
        name: emoji.name,
        attachment: emoji.url,
      })
    );
  });
  // loading promises
  return Promise.all(emojisPromises);
}

/**
 * Load Widget
 *
 * @description Loads widget config of server
 *
 * @param {Guild} guild - Discord Guild
 * @param {BackupData} backup - Backup data
 * @returns {Promise<Guild[]>} Guild Info
 */
export function loadWidget(guild: Guild, backup: BackupData): Promise<Guild[]> {
  // promises list
  let widgetPromises: Promise<Guild>[] = [];
  // check
  if (backup.widget.channel) {
    // push
    widgetPromises.push(
      guild.setWidgetSettings({
        enabled: backup.widget.enabled,
        channel: backup.widget.channel,
      })
    );
  }
  // loading promises
  return Promise.all(widgetPromises);
}

/**
 * Load Channels
 *
 * @description Loads all channels & categories of server
 *
 * @param {Guild} guild - Discord Guild
 * @param {BackupData} backup - Backup data
 * @returns {Promise<unknown[]>} unkown
 */
export function loadChannels(
  guild: Guild,
  backup: BackupData
): Promise<unknown[]> {
  // promises list
  let channelPromises: Promise<void | unknown>[] = [];

  // categories
  backup.channels.categories.forEach((c) => {
    channelPromises.push(
      new Promise<void | unknown>((resolve) => {
        // create category
        loadCategory(c, guild).then((newCategory) => {
          c.childeren.forEach((channelData) => {
            loadChannel(channelData, guild, newCategory);
            resolve(true);
          });
        });
      })
    );
  });

  // other channels
  backup.channels.others.forEach((channel) => {
    // push
    channelPromises.push(loadChannel(channel, guild));
  });

  // loading promises
  return Promise.all(channelPromises);
}

/**
 * Load Server Config
 *
 * @description Loads all basic configuration of server
 *
 * @param {Guild} guild - Discord Guild
 * @param {BackupData} backup - Backup data
 * @returns {Promise<Guild[]>} guildinfo
 */
export function loadServerConfig(
  guild: Guild,
  backup: BackupData
): Promise<Guild[]> {
  // promises list
  let serverconfigPromises: Promise<Guild>[] = [];

  /* loading config */

  // name
  if (backup.name) {
    // push
    serverconfigPromises.push(
      guild.setName(backup.name, "Loading Backup Config")
    );
  }
  // icon
  if (backup.iconURL) {
    // push
    serverconfigPromises.push(
      guild.setIcon(backup.iconURL, "Loading Backup Config")
    );
  }
  // splash
  if (backup.splashURL) {
    // push
    serverconfigPromises.push(
      guild.setSplash(backup.splashURL, "Loading Backup Config")
    );
  }
  // banner
  if (backup.bannerURL) {
    // push
    serverconfigPromises.push(
      guild.setBanner(backup.bannerURL, "Loading Backup Config")
    );
  }
  // verification level
  if (backup.verificationLevel) {
    // push
    serverconfigPromises.push(
      guild.setVerificationLevel(
        backup.verificationLevel,
        "Loading Backup Config"
      )
    );
  }
  // explict filter
  if (
    backup.explictContentFilter &&
    guild.features.includes(GuildFeature.Community)
  ) {
    serverconfigPromises.push(
      guild.setExplicitContentFilter(backup.explictContentFilter)
    );
  }
  // loading promises
  return Promise.all(serverconfigPromises);
}
