// imports
import type {
    NewsChannel,
    VoiceChannel,
    TextChannel,
    CategoryChannel,
} from "discord.js";
import { OverwriteType } from "discord.js";
import { ChannelPermissions } from "~/typings";

/**
 * Get Channel Permissions
 *
 * @description Get permissions for a channel
 *
 * @param {NewsChannel | CategoryChannel | VoiceChannel | TextChannel} channel - Channel to get permissions from
 */
export function getChannelPermissions(
    channel: NewsChannel | CategoryChannel | VoiceChannel | TextChannel
) {
    // permissions
    let permissions: ChannelPermissions[] = [];

    // adding values
    channel.permissionOverwrites.cache
        .filter((c) => c.type == OverwriteType.Role)
        .forEach((_perm) => {
            // adding roles
            let role = channel.guild.roles.cache.get(_perm.id);
            if (role) {
                permissions.push({
                    role: role.name,
                    allow: _perm.allow.bitfield.toString(),
                    deny: _perm.deny.bitfield.toString(),
                });
            }
        });

    // return
    return permissions;
}
