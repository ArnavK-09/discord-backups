// imports
import type { Snowflake } from "discord.js";

/**
 * Ban Form
 * @description Type Interface for Banned Member of a guild
 */
export interface BanForm {
    id: Snowflake;
    reason?: string | null | undefined;
}
