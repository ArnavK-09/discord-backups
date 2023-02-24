// imports
import { ColorResolvable } from "discord.js";

/**
 * Role Data
 * @description Type Interface for Guild Role Data
 */
export interface RoleData {
  name: string;
  color: ColorResolvable;
  hoist: boolean;
  permissions: string;
  position: number;
  mentionable: boolean;
  everyone: boolean;
}
