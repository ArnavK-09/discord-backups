// imports
import {
  ChannelType,
  VoiceChannel,
  NewsChannel,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";
import {
  VoiceChannelData,
  TextChannelData,
  ThreadChannelData,
} from "~/typings";
import { fetchChannelPermissions } from ".";

/**
 * Fetch Voice Channel
 *
 * @description Fetch Guild Voice Channel Data
 *
 * @param {VoiceChannel} channel - Channel to fetch
 */
export function fetchVoiceChannel(
  channel: VoiceChannel
): Promise<VoiceChannelData> {
  // promise
  return new Promise<VoiceChannelData>(async (resolve) => {
    // data
    let data: VoiceChannelData = {
      name: channel.name,
      parent: channel.parent ? channel.parent.name : null,
      bitrate: channel.bitrate,
      usersLimit: channel.userLimit,
      permissions: fetchChannelPermissions(channel),
      type: ChannelType.GuildVoice,
    };
    // return
    resolve(data);
  });
}

/**
 * Fetch Text Channel
 *
 * @description Fetch Guild Text Channel Data
 *
 * @param {TextChannel | NewsChannel} channel - Channel to fetch
 */
export function fetchTextChannel(
  channel: TextChannel | NewsChannel
): Promise<TextChannelData> {
  // promise
  return new Promise<TextChannelData>(async (resolve) => {
    // base data
    let data: TextChannelData = {
      messages: [],
      threads: [],
      parent: channel.parent ? channel.parent.name : undefined,
      name: channel.name,
      type: channel.type,
      topic: channel.topic!,
      nsfw: channel.nsfw,
      news: channel.type == ChannelType.GuildAnnouncement,
      rateLimitPerUser:
        channel.type == ChannelType.GuildText
          ? channel.rateLimitPerUser
          : undefined,
    };

    // get threads
    if (0 < channel.threads.cache.size) {
      // all promise
      return Promise.all(
        channel.threads.cache.map(async (thread) => {
          // data
          let threadData: ThreadChannelData = {
            messages: [],
            name: thread.name,
            archived: thread.archived!,
            locked: thread.locked!,
            rateLimitPerUser: thread.rateLimitPerUser,
            autoArchiveDuration:
              thread.autoArchiveDuration ?? ThreadAutoArchiveDuration.OneDay,
            type: thread.type,
          };

          // push
          data.threads.push(threadData);
        })
      );
    }

    // resolve
    resolve(data);
    return data;
  });
}
