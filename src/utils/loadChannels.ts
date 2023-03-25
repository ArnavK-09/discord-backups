// imports
import {
  CategoryChannel,
  ChannelType,
  Guild,
  GuildChannelCreateOptions,
  GuildFeature,
  GuildPremiumTier,
  OverwriteData,
} from "discord.js";
import type {
  TextChannelData,
  CategoryData,
  VoiceChannelData,
} from "~/typings";

// bit rate data
const MAX_BITRATE_PER_TIER: Record<GuildPremiumTier, number> = {
  [GuildPremiumTier.None]: 64000,
  [GuildPremiumTier.Tier1]: 128000,
  [GuildPremiumTier.Tier2]: 256000,
  [GuildPremiumTier.Tier3]: 384000,
};

/**
 * Load Category
 *
 * @description Load Category data
 *
 * @param {CategoryData} categoryData - Category Data to load
 * @param {Guild} guild - Guild in which to load
 *
 * @returns {Promise<CategoryChannel>} Category Channel
 */
export function loadCategory(
  categoryData: CategoryData,
  guild: Guild
): Promise<CategoryChannel> {
  // promise
  return new Promise<CategoryChannel>((resolve) => {
    // create channel
    guild.channels
      .create({
        type: ChannelType.GuildCategory,
        name: categoryData.name,
      })
      .then(async (c) => {
        // edit role permissions
        let allPerms: OverwriteData[] = [];

        // appending
        categoryData.permissions.forEach((perm) => {
          // get role
          let role = guild.roles.cache.find((x) => x.name === perm.role);
          // if role
          if (role) {
            // push
            allPerms.push({
              allow: BigInt(perm.allow),
              deny: BigInt(perm.deny),
              id: role.id,
            });
          }
        });
        // set override
        await c.permissionOverwrites.set(allPerms);
        // resolve
        resolve(c);
      });
  });
}

/**
 * Load Channel
 *
 * @description Load Channel data
 *
 * @param {TextChannelData | VoiceChannelData} channelData - Channel Data to load
 * @param {Guild} guild - Guild in which to load
 * @param {CategoryChannel} parentCategory - Parent of channel to create
 *
 */
export function loadChannel(
  channelData: TextChannelData | VoiceChannelData,
  guild: Guild,
  parentCategory: CategoryChannel | null = null
) {
  // promise
  return new Promise((resolve) => {
    /* Set Options */
    // options
    let createChanneloptions: GuildChannelCreateOptions = {
      name: channelData.name,
      parent: parentCategory,
      type: undefined,
    };

    // if text or announcement channel
    if (
      channelData.type === ChannelType.GuildText ||
      channelData.type === ChannelType.GuildAnnouncement
    ) {
      // channel
      let channel = channelData as TextChannelData;

      // channel topic
      createChanneloptions.topic = channel.topic;
      // rate limit
      createChanneloptions.rateLimitPerUser = channel.rateLimitPerUser;
      // nsfw check
      createChanneloptions.nsfw = channel.nsfw;
      // type
      createChanneloptions.type =
        channel.news && guild.features.includes(GuildFeature.News)
          ? ChannelType.GuildAnnouncement
          : ChannelType.GuildText;
    }
    // if voice channel
    else if (channelData.type === ChannelType.GuildVoice) {
      // voice channel
      let voiceChannel = channelData as VoiceChannelData;

      // set bitrate
      let bitrate = voiceChannel.bitrate;
      let bitrates = Object.values(MAX_BITRATE_PER_TIER);
      while (bitrate > MAX_BITRATE_PER_TIER[guild.premiumTier]) {
        bitrate = bitrates[guild.premiumTier];
      }

      // options set
      createChanneloptions.bitrate = bitrate;
      createChanneloptions.type = ChannelType.GuildVoice;
      createChanneloptions.userLimit = voiceChannel.usersLimit;
    }

    /* Creating Channels */
    guild.channels.create(createChanneloptions).then(async (channel) => {
      /* set channel perms */
      let channelOverwritePerms: OverwriteData[] = [];
      channelData.permissions?.forEach((permission) => {
        // get role
        let role = guild.roles.cache.find(
          (x) => x.name === PermissionStatus.name
        );
        if (role) {
          // push
          channelOverwritePerms.push({
            id: role.id,
            allow: BigInt(permission.allow),
            deny: BigInt(permission.deny),
          });
        }
      });
      // over write perms
      await channel.permissionOverwrites.set(channelOverwritePerms);

      /* if text channel */
      if (channel.type === ChannelType.GuildText) {
        // channel
        let textChannel = channelData as TextChannelData;

        // load threads
        if (textChannel.threads.length > 0) {
          // promise
          await Promise.all(
            textChannel.threads.map((threadData) => {
              // create thread
              return channel.threads.create({
                name: threadData.name,
                autoArchiveDuration: threadData.autoArchiveDuration,
              });
            })
          );
        }

        // return
        resolve(channel);
        return channel
      } else {
        // return
        resolve(channel);
        return channel;
      }
    });
  });
}
