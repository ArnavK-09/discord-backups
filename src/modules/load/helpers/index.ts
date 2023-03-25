// imports
import {
  ChannelType,
  Emoji,
  Guild,
  GuildFeature,
  Role,
  VoiceChannel,
} from "discord.js";
import type {
  GuildExplicitContentFilter,
  GuildVerificationLevel,
} from "discord.js";
import type { BackupData } from "~/typings";
import { loadCategory, loadChannel } from "~/utils";

interface ServerConfig {
  name?: string;
  iconURL?: string;
  splashURL?: string;
  bannerURL?: string;
  verificationLevel?: GuildVerificationLevel;
  explictContentFilter?: GuildExplicitContentFilter;
}

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
export async function loadChannels(guild: Guild, backup: BackupData): Promise<unknown> {
  const channelPromises: Promise<unknown>[] = [];

  // Load category channels
  for (const category of backup.channels.categories) {
    const newCategory = await loadCategory(category, guild);
    for (const channelData of category.children) {
      channelPromises.push(loadChannel(channelData, guild, newCategory));
    }
  }
  // Load other channels
  for (const channel of backup.channels.others) {
    channelPromises.push(loadChannel(channel, guild));
  }
  // Wait for all promises to resolve
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
export async function loadServerConfig(
  guild: Guild,
  backup: BackupData
): Promise<void> {
  const config: ServerConfig = {
    name: backup.name,
    iconURL: backup.iconURL,
    splashURL: backup.splashURL,
    bannerURL: backup.bannerURL,
    verificationLevel: backup.verificationLevel,
    explictContentFilter: backup.explictContentFilter,
  };

  const configProps = [
    { prop: 'name', method: 'setName' },
    { prop: 'iconURL', method: 'setIcon' },
    { prop: 'splashURL', method: 'setSplash' },
    { prop: 'bannerURL', method: 'setBanner' },
    { prop: 'verificationLevel', method: 'setVerificationLevel' },
    { prop: 'explicitContentFilter', method: 'setExplicitContentFilter' },
  ];

  const serverConfigPromises = configProps
    // @ts-ignore
    .filter(({ prop }) => config[prop] !== undefined)
    .map(({ prop, method }) => {
      if (prop === 'explicitContentFilter' && !guild.features.includes(GuildFeature.Community)) {
        return Promise.resolve();
      }
      // @ts-ignore
      return guild[method](config[prop]!, 'Loading Backup Config');
    });

  await Promise.allSettled(serverConfigPromises);
  //return results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value as Guild);
}





/*
export function loadServerConfig(
  guild: Guild,
  backup: BackupData
): Promise<Guild[]> {
  // promises list
  let serverconfigPromises: Promise<Guild>[] = [];

  // loading config 
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
*/ 