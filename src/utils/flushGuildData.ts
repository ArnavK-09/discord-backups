// imports
import {
  Guild,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildFeature,
  GuildSystemChannelFlags,
  GuildVerificationLevel,
} from "discord.js";

/** 
 * Flush Guild Data
 *
 * @description Clears the guild data
 *
 * @param {Guild} guild - Guild to be flushed
 */
export async function flushGuildData(guild: Guild) {
  // clear roles
  guild.roles.cache.forEach((role) => {
    role.delete("Flushing Server Data").catch(() => {});
  });
  // clear channels
  guild.channels.cache.forEach((channel) => {
    channel.delete("Flushing Server Data").catch(() => {});
  });
  // clear roles
  guild.emojis.cache.forEach((emoji) => {
    emoji.delete("Flushing Server Data").catch(() => {});
  });
  // clear bans
  let bans = await guild.bans.fetch();
  bans.forEach((ban) => {
    guild.members
      .unban(ban.user, "Flushing Server Data")
      .catch(() => {});
  });
  // clear webhooks
  let webhooks = await guild.fetchWebhooks();
  webhooks.forEach((hook) => {
    hook.delete("Flushing Server Data").catch(() => {});
  });
  // clear afk channel
  guild.setAFKChannel(null, "Flushing Server Data");
  guild.setAFKTimeout(60 * 5, "Flushing Server Data");
  // clear icon
  guild.setIcon(null, "Flushing Server Data");
  // clear banner & splash
  guild.setBanner(null, "Flushing Server Data").catch(() => {});
  guild.setSplash(null, "Flushing Server Data").catch(() => {});
  // message notification
  guild.setDefaultMessageNotifications(
    GuildDefaultMessageNotifications.OnlyMentions,
    "Flushing Server Data"
  ).catch(() => {});
  // clear widget
  guild.setWidgetSettings(
    { enabled: false, channel: null },
    "Flushing Server Data"
  ).catch(() => {});
  // system channel
  guild.setSystemChannel(null, "Flushing Server Data").catch(() => {});
  guild.setSystemChannelFlags([
    GuildSystemChannelFlags.SuppressGuildReminderNotifications,
    GuildSystemChannelFlags.SuppressJoinNotifications,
    GuildSystemChannelFlags.SuppressPremiumSubscriptions,
  ]).catch(() => {});
  // clear filters
  if (!guild.features.includes(GuildFeature.Community)) {
    // clear explict filter
    guild.setExplicitContentFilter(
      GuildExplicitContentFilter.Disabled,
      "Flushing Server Data"
    ).catch(() => {});
    // clear verification level
    guild.setVerificationLevel(
      GuildVerificationLevel.None,
      "Flushing Server Data"
    ).catch(() => {});
  }
}
