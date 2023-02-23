/**
 * Role Data
 * @description Type Interface for Guild Role Data
 */
export interface RoleData {
    name: string;
    color: string;
    hoist: boolean;
    permissions: string;
    position: number;
    mentionable: boolean;
    everyone: boolean;
}
