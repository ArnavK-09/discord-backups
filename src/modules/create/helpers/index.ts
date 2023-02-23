/*
 * Helper functions for create module
 */

// imports
import type {
    CategoryChannel,
    Collection,
    Guild,
    GuildBan,
    GuildChannel,
    GuildEmoji,
    Role,
    Snowflake,
    TextChannel,
    ThreadChannel,
    VoiceChannel,
} from "discord.js";
import { ChannelType } from "discord.js";
import type {
    BanForm,
    RoleData,
    EmojiData,
    ChannelData,
    CategoryData,
    TextChannelData,
    VoiceChannelData,
} from "~/typings";
import {
    fetchTextChannel,
    fetchVoiceChannel,
    getChannelPermissions,
} from "../../../utils";

/**
 * Get Bans
 *
 * @description Get all bans of server
 *
 * @param {Guild} guild - Discord Guild
 * @returns {Promise<BanForm[]>} Banned Members of server
 */
export async function getBans(guild: Guild): Promise<BanForm[]> {
    // all bans
    let bans: BanForm[] = [];
    // guild bans
    let guildBans = await guild.bans.fetch();

    // adding guild bans to bans array
    guildBans.forEach((guildBan: GuildBan) => {
        bans.push({
            id: guildBan.user.id,
            reason: guildBan.reason,
        });
    });

    // return
    return bans;
}

/**
 * Get Roles
 *
 * @description Get roles of server
 *
 * @param {Guild} guild - Discord Guild
 * @returns {Promise<RoleData[]>} roles of server
 */
export async function getRoles(guild: Guild): Promise<RoleData[]> {
    // all roles
    let roles: RoleData[] = [];
    // guild roles
    let guildRoles = guild.roles.cache.sort(
        (x: any, y: any) => x.position - y.position
    );

    // adding guild roles to roles array
    guildRoles.forEach((role: Role) => {
        roles.push({
            name: role.name,
            color: role.hexColor,
            hoist: role.hoist,
            position: role.position,
            everyone: role.id == guild.id,
            mentionable: role.mentionable,
            permissions: role.permissions.bitfield.toString(),
        });
    });

    // return
    return roles;
}

/**
 * Get Emojis
 *
 * @description Get emojis of server
 *
 * @param {Guild} guild - Discord Guild
 * @returns {Promise<EmojiData[]>} emojis of server
 */
export async function getEmojis(guild: Guild): Promise<EmojiData[]> {
    // all emojis
    let emojis: EmojiData[] = [];
    // guild emojis
    let guildEmojis = guild.emojis.cache;

    // adding guild roles to roles array
    guildEmojis.forEach((emoji: GuildEmoji) => {
        emojis.push({
            name: emoji.name!,
            url: emoji.url,
        });
    });

    // return
    return emojis;
}

/**
 * Get Channels
 *
 * @description Get channels of server
 *
 * @param {Guild} guild - Discord Guild
 * @returns {Promise<ChannelData[]>} channels of server
 */
export async function getChannels(guild: Guild): Promise<ChannelData> {
    // promise
    return new Promise<ChannelData>(async (resolve) => {
        // all channels
        let channels: ChannelData = {
            categories: [],
            others: [],
        };

        // categories
        let categories = guild.channels.cache
            .filter((x) => x.type === ChannelType.GuildCategory)
            .sort((x: any, y: any) => x.position - y.position)
            .toJSON() as CategoryChannel[];

        // adding categories to channels array
        for (let category of categories) {
            // base data
            var data: CategoryData = {
                name: category.name,
                childeren: [],
                permissions: getChannelPermissions(category),
            };
            // appends children of category
            let childrenOfCategory = category.children.cache
                .sort((x, y) => x.position - y.position)
                .toJSON();
            for (let child of childrenOfCategory) {
                // check wheter text or voice
                if (child.type === ChannelType.GuildText) {
                    // text channel
                    let textChannel = await fetchTextChannel(child);
                    // push
                    data.childeren.push(textChannel);
                } else if (child.type === ChannelType.GuildVoice) {
                    // voice channel
                    let voiceChannel = await fetchVoiceChannel(child);
                    // push
                    data.childeren.push(voiceChannel);
                } else {
                    throw Error("Invalid Channel Type ~ TEST");
                }
            }

            // push
            channels.categories.push(data);

            // appends other children
            let otherChannels = (
                guild.channels.cache.filter((x) => {
                    return (
                        !x.parent &&
                        x.type !== ChannelType.GuildCategory &&
                        x.type !== ChannelType.PublicThread &&
                        x.type !== ChannelType.PrivateThread &&
                        x.type !== ChannelType.AnnouncementThread
                    );
                }) as Collection<
                    Snowflake,
                    Exclude<GuildChannel, ThreadChannel>
                >
            )
                .sort((x, y) => x.position - y.position)
                .toJSON();

            // adding
            for (let otherChannel of otherChannels) {
                // check wheter text or voice
                if (
                    otherChannel.type === ChannelType.GuildText ||
                    otherChannel.type === ChannelType.GuildAnnouncement ||
                    otherChannel.type === ChannelType.GuildForum
                ) {
                    // text channel
                    let textChannel: TextChannelData = await fetchTextChannel(
                        otherChannel as TextChannel
                    );
                    // push
                    channels.others.push(textChannel);
                } else if (otherChannel.type === ChannelType.GuildVoice) {
                    // voice channel
                    let voiceChannel: VoiceChannelData =
                        await fetchVoiceChannel(otherChannel as VoiceChannel);
                    // push
                    channels.others.push(voiceChannel);
                } else {
                    throw Error("Invalid Channel Type ~ TEST");
                }
            }

            // return
            resolve(channels);
        }
    });
}
