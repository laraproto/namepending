export interface LookupOutput {
	key: string;
	expires: Date;
}

export interface LinkOutput {
	key: string;
	expires: Date;
}

export enum BanType {
	Temporary = 'temporary',
	Permanent = 'permanent'
}

export enum WarnType {
	TemporaryMinor = 'tempminor',
	TemporaryMajor = 'tempmajor',
	PermanentMinor = 'minor',
	PermanentMajor = 'major'
}
