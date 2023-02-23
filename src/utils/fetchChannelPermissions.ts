// imports
import {
    CategoryChannel,
    VoiceChannel,
    NewsChannel,
    TextChannel,
    OverwriteType,
} from "discord.js";
import { ChannelPermissions } from "~/typings";

/**
 * Fetch Channel Permissions
 *
 * @description Fetch Permissions Of Channel
 *
 * @param {TextChannel | NewsChannel | VoiceChannel | CategoryChannel} channel - Channel to fetch
 */
export function fetchChannelPermissions(
    channel: TextChannel | NewsChannel | VoiceChannel | CategoryChannel
) {
    // permissions data
    let permissions: ChannelPermissions[] = [];

    // append perms
    channel.permissionOverwrites.cache
        .filter((x) => x.type == OverwriteType.Role)
        .forEach((overwrite) => {
            // role
            let role = channel.guild.roles.cache.get(overwrite.id);
            // push
            if (role) {
                permissions.push({
                    role: role.name,
                    allow: overwrite.allow.bitfield.toString(),
                    deny: overwrite.deny.bitfield.toString(),
                });
            }
        });

    // return
    return permissions;
}
