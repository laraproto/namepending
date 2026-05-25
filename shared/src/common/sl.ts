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

export type Permission = (typeof Permissions)[number];

export const permissionSchema = z.enum(Permissions);
