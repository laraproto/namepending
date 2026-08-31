import { z } from 'zod';

export const Permissions = [
	'KickingAndShortTermBanning',
	'BanningUpToDay',
	'LongTermBanning',
	'ForceclassSelf',
	'ForceclassToSpectator',
	'ForceclassWithoutRestrictions',
	'GivingItems',
	'WarheadEvents',
	'RespawnEvents',
	'RoundEvents',
	'SetGroup',
	'GameplayData',
	'Overwatch',
	'FacilityManagement',
	'PlayersManagement',
	'PermissionsManagement',
	'ServerConsoleCommands',
	'ViewHiddenBadges',
	'ServerConfigs',
	'Broadcasting',
	'PlayerSensitiveDataAccess',
	'Noclip',
	'AFKImmunity',
	'AdminChat',
	'ViewHiddenGlobalBadges',
	'Announcer',
	'Effects',
	'FriendlyFireDetectorImmunity',
	'FriendlyFireDetectorTempDisable',
	'ServerLogLiveFeed',
	'ExecuteAs',
	'Vanish'
] as const;

export const Colors = {
	pink: '#FF96DE',
	red: '#C50000',
	brown: '#944710',
	silver: '#A0A0A0',
	light_green: '#32CD32',
	crimson: '#DC143C',
	cyan: '#00B7EB',
	aqua: '#00FFFF',
	deep_pink: '#FF1493',
	tomato: '#FF6448',
	yellow: '#FAFF86',
	magenta: '#FF0090',
	blue_green: '#4DFFB8',
	orange: '#FF9966',
	lime: '#BFFF00',
	green: '#228B22',
	emerald: '#50C878',
	carmine: '#960018',
	nickel: '#727472',
	mint: '#98FB98',
	army_green: '#4B5320',
	pumpkin: '#EE7600'
} as const;

export const ColorKeys = [
	'pink',
	'red',
	'brown',
	'silver',
	'light_green',
	'crimson',
	'cyan',
	'aqua',
	'deep_pink',
	'tomato',
	'yellow',
	'magenta',
	'blue_green',
	'orange',
	'lime',
	'green',
	'emerald',
	'carmine',
	'nickel',
	'mint',
	'army_green',
	'pumpkin'
] as const;

export type Permission = (typeof Permissions)[number];
export type Color = (typeof Colors)[keyof typeof Colors];

export const permissionSchema = z.enum(Permissions);
export const colorSchema = z.enum(ColorKeys);
