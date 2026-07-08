import { createRequire as JU } from 'node:module';
var kU = Object.create;
var { getPrototypeOf: DU, defineProperty: hv, getOwnPropertyNames: cU } = Object;
var SU = Object.prototype.hasOwnProperty;
function wU(r) {
	return this[r];
}
var zU,
	NU,
	Ii = (r, i, v) => {
		var u = r != null && typeof r === 'object';
		if (u) {
			var n = i ? (zU ??= new WeakMap()) : (NU ??= new WeakMap()),
				$ = n.get(r);
			if ($) return $;
		}
		v = r != null ? kU(DU(r)) : {};
		let g = i || !r || !r.__esModule ? hv(v, 'default', { value: r, enumerable: !0 }) : v;
		for (let I of cU(r)) if (!SU.call(g, I)) hv(g, I, { get: wU.bind(r, I), enumerable: !0 });
		if (u) n.set(r, g);
		return g;
	};
var kr = (r, i) => () => (i || r((i = { exports: {} }).exports, i), i.exports);
var PU = (r) => r;
function jU(r, i) {
	this[r] = PU.bind(null, i);
}
var Dr = (r, i) => {
	for (var v in i) hv(r, v, { get: i[v], enumerable: !0, configurable: !0, set: jU.bind(i, v) });
};
var jn = JU(import.meta.url);
var Jn = kr((LU) => {
	class ev extends Error {
		constructor(r, i, v) {
			super(v);
			(Error.captureStackTrace(this, this.constructor),
				(this.name = this.constructor.name),
				(this.code = i),
				(this.exitCode = r),
				(this.nestedError = void 0));
		}
	}
	class No extends ev {
		constructor(r) {
			super(1, 'commander.invalidArgument', r);
			(Error.captureStackTrace(this, this.constructor), (this.name = this.constructor.name));
		}
	}
	LU.CommanderError = ev;
	LU.InvalidArgumentError = No;
});
var oi = kr((WU) => {
	var { InvalidArgumentError: OU } = Jn();
	class Po {
		constructor(r, i) {
			switch (
				((this.description = i || ''),
				(this.variadic = !1),
				(this.parseArg = void 0),
				(this.defaultValue = void 0),
				(this.defaultValueDescription = void 0),
				(this.argChoices = void 0),
				r[0])
			) {
				case '<':
					((this.required = !0), (this._name = r.slice(1, -1)));
					break;
				case '[':
					((this.required = !1), (this._name = r.slice(1, -1)));
					break;
				default:
					((this.required = !0), (this._name = r));
					break;
			}
			if (this._name.endsWith('...'))
				((this.variadic = !0), (this._name = this._name.slice(0, -3)));
		}
		name() {
			return this._name;
		}
		_collectValue(r, i) {
			if (i === this.defaultValue || !Array.isArray(i)) return [r];
			return (i.push(r), i);
		}
		default(r, i) {
			return ((this.defaultValue = r), (this.defaultValueDescription = i), this);
		}
		argParser(r) {
			return ((this.parseArg = r), this);
		}
		choices(r) {
			return (
				(this.argChoices = r.slice()),
				(this.parseArg = (i, v) => {
					if (!this.argChoices.includes(i))
						throw new OU(`Allowed choices are ${this.argChoices.join(', ')}.`);
					if (this.variadic) return this._collectValue(i, v);
					return i;
				}),
				this
			);
		}
		argRequired() {
			return ((this.required = !0), this);
		}
		argOptional() {
			return ((this.required = !1), this);
		}
	}
	function qU(r) {
		let i = r.name() + (r.variadic === !0 ? '...' : '');
		return r.required ? '<' + i + '>' : '[' + i + ']';
	}
	WU.Argument = Po;
	WU.humanReadableArgName = qU;
});
var av = kr((KU) => {
	var { humanReadableArgName: EU } = oi();
	class jo {
		constructor() {
			((this.helpWidth = void 0),
				(this.minWidthToWrap = 40),
				(this.sortSubcommands = !1),
				(this.sortOptions = !1),
				(this.showGlobalOptions = !1));
		}
		prepareContext(r) {
			this.helpWidth = this.helpWidth ?? r.helpWidth ?? 80;
		}
		visibleCommands(r) {
			let i = r.commands.filter((u) => !u._hidden),
				v = r._getHelpCommand();
			if (v && !v._hidden) i.push(v);
			if (this.sortSubcommands)
				i.sort((u, n) => {
					return u.name().localeCompare(n.name());
				});
			return i;
		}
		compareOptions(r, i) {
			let v = (u) => {
				return u.short ? u.short.replace(/^-/, '') : u.long.replace(/^--/, '');
			};
			return v(r).localeCompare(v(i));
		}
		visibleOptions(r) {
			let i = r.options.filter((u) => !u.hidden),
				v = r._getHelpOption();
			if (v && !v.hidden) {
				let u = v.short && r._findOption(v.short),
					n = v.long && r._findOption(v.long);
				if (!u && !n) i.push(v);
				else if (v.long && !n) i.push(r.createOption(v.long, v.description));
				else if (v.short && !u) i.push(r.createOption(v.short, v.description));
			}
			if (this.sortOptions) i.sort(this.compareOptions);
			return i;
		}
		visibleGlobalOptions(r) {
			if (!this.showGlobalOptions) return [];
			let i = [];
			for (let v = r.parent; v; v = v.parent) {
				let u = v.options.filter((n) => !n.hidden);
				i.push(...u);
			}
			if (this.sortOptions) i.sort(this.compareOptions);
			return i;
		}
		visibleArguments(r) {
			if (r._argsDescription)
				r.registeredArguments.forEach((i) => {
					i.description = i.description || r._argsDescription[i.name()] || '';
				});
			if (r.registeredArguments.find((i) => i.description)) return r.registeredArguments;
			return [];
		}
		subcommandTerm(r) {
			let i = r.registeredArguments.map((v) => EU(v)).join(' ');
			return (
				r._name +
				(r._aliases[0] ? '|' + r._aliases[0] : '') +
				(r.options.length ? ' [options]' : '') +
				(i ? ' ' + i : '')
			);
		}
		optionTerm(r) {
			return r.flags;
		}
		argumentTerm(r) {
			return r.name();
		}
		longestSubcommandTermLength(r, i) {
			return i.visibleCommands(r).reduce((v, u) => {
				return Math.max(v, this.displayWidth(i.styleSubcommandTerm(i.subcommandTerm(u))));
			}, 0);
		}
		longestOptionTermLength(r, i) {
			return i.visibleOptions(r).reduce((v, u) => {
				return Math.max(v, this.displayWidth(i.styleOptionTerm(i.optionTerm(u))));
			}, 0);
		}
		longestGlobalOptionTermLength(r, i) {
			return i.visibleGlobalOptions(r).reduce((v, u) => {
				return Math.max(v, this.displayWidth(i.styleOptionTerm(i.optionTerm(u))));
			}, 0);
		}
		longestArgumentTermLength(r, i) {
			return i.visibleArguments(r).reduce((v, u) => {
				return Math.max(v, this.displayWidth(i.styleArgumentTerm(i.argumentTerm(u))));
			}, 0);
		}
		commandUsage(r) {
			let i = r._name;
			if (r._aliases[0]) i = i + '|' + r._aliases[0];
			let v = '';
			for (let u = r.parent; u; u = u.parent) v = u.name() + ' ' + v;
			return v + i + ' ' + r.usage();
		}
		commandDescription(r) {
			return r.description();
		}
		subcommandDescription(r) {
			return r.summary() || r.description();
		}
		optionDescription(r) {
			let i = [];
			if (r.argChoices) i.push(`choices: ${r.argChoices.map((v) => JSON.stringify(v)).join(', ')}`);
			if (r.defaultValue !== void 0) {
				if (r.required || r.optional || (r.isBoolean() && typeof r.defaultValue === 'boolean'))
					i.push(`default: ${r.defaultValueDescription || JSON.stringify(r.defaultValue)}`);
			}
			if (r.presetArg !== void 0 && r.optional) i.push(`preset: ${JSON.stringify(r.presetArg)}`);
			if (r.envVar !== void 0) i.push(`env: ${r.envVar}`);
			if (i.length > 0) {
				let v = `(${i.join(', ')})`;
				if (r.description) return `${r.description} ${v}`;
				return v;
			}
			return r.description;
		}
		argumentDescription(r) {
			let i = [];
			if (r.argChoices) i.push(`choices: ${r.argChoices.map((v) => JSON.stringify(v)).join(', ')}`);
			if (r.defaultValue !== void 0)
				i.push(`default: ${r.defaultValueDescription || JSON.stringify(r.defaultValue)}`);
			if (i.length > 0) {
				let v = `(${i.join(', ')})`;
				if (r.description) return `${r.description} ${v}`;
				return v;
			}
			return r.description;
		}
		formatItemList(r, i, v) {
			if (i.length === 0) return [];
			return [v.styleTitle(r), ...i, ''];
		}
		groupItems(r, i, v) {
			let u = new Map();
			return (
				r.forEach((n) => {
					let $ = v(n);
					if (!u.has($)) u.set($, []);
				}),
				i.forEach((n) => {
					let $ = v(n);
					if (!u.has($)) u.set($, []);
					u.get($).push(n);
				}),
				u
			);
		}
		formatHelp(r, i) {
			let v = i.padWidth(r, i),
				u = i.helpWidth ?? 80;
			function n(_, l) {
				return i.formatItem(_, v, l, i);
			}
			let $ = [`${i.styleTitle('Usage:')} ${i.styleUsage(i.commandUsage(r))}`, ''],
				g = i.commandDescription(r);
			if (g.length > 0) $ = $.concat([i.boxWrap(i.styleCommandDescription(g), u), '']);
			let I = i.visibleArguments(r).map((_) => {
				return n(
					i.styleArgumentTerm(i.argumentTerm(_)),
					i.styleArgumentDescription(i.argumentDescription(_))
				);
			});
			if (
				(($ = $.concat(this.formatItemList('Arguments:', I, i))),
				this.groupItems(
					r.options,
					i.visibleOptions(r),
					(_) => _.helpGroupHeading ?? 'Options:'
				).forEach((_, l) => {
					let D = _.map((c) => {
						return n(
							i.styleOptionTerm(i.optionTerm(c)),
							i.styleOptionDescription(i.optionDescription(c))
						);
					});
					$ = $.concat(this.formatItemList(l, D, i));
				}),
				i.showGlobalOptions)
			) {
				let _ = i.visibleGlobalOptions(r).map((l) => {
					return n(
						i.styleOptionTerm(i.optionTerm(l)),
						i.styleOptionDescription(i.optionDescription(l))
					);
				});
				$ = $.concat(this.formatItemList('Global Options:', _, i));
			}
			return (
				this.groupItems(
					r.commands,
					i.visibleCommands(r),
					(_) => _.helpGroup() || 'Commands:'
				).forEach((_, l) => {
					let D = _.map((c) => {
						return n(
							i.styleSubcommandTerm(i.subcommandTerm(c)),
							i.styleSubcommandDescription(i.subcommandDescription(c))
						);
					});
					$ = $.concat(this.formatItemList(l, D, i));
				}),
				$.join(`
`)
			);
		}
		displayWidth(r) {
			return Jo(r).length;
		}
		styleTitle(r) {
			return r;
		}
		styleUsage(r) {
			return r
				.split(' ')
				.map((i) => {
					if (i === '[options]') return this.styleOptionText(i);
					if (i === '[command]') return this.styleSubcommandText(i);
					if (i[0] === '[' || i[0] === '<') return this.styleArgumentText(i);
					return this.styleCommandText(i);
				})
				.join(' ');
		}
		styleCommandDescription(r) {
			return this.styleDescriptionText(r);
		}
		styleOptionDescription(r) {
			return this.styleDescriptionText(r);
		}
		styleSubcommandDescription(r) {
			return this.styleDescriptionText(r);
		}
		styleArgumentDescription(r) {
			return this.styleDescriptionText(r);
		}
		styleDescriptionText(r) {
			return r;
		}
		styleOptionTerm(r) {
			return this.styleOptionText(r);
		}
		styleSubcommandTerm(r) {
			return r
				.split(' ')
				.map((i) => {
					if (i === '[options]') return this.styleOptionText(i);
					if (i[0] === '[' || i[0] === '<') return this.styleArgumentText(i);
					return this.styleSubcommandText(i);
				})
				.join(' ');
		}
		styleArgumentTerm(r) {
			return this.styleArgumentText(r);
		}
		styleOptionText(r) {
			return r;
		}
		styleArgumentText(r) {
			return r;
		}
		styleSubcommandText(r) {
			return r;
		}
		styleCommandText(r) {
			return r;
		}
		padWidth(r, i) {
			return Math.max(
				i.longestOptionTermLength(r, i),
				i.longestGlobalOptionTermLength(r, i),
				i.longestSubcommandTermLength(r, i),
				i.longestArgumentTermLength(r, i)
			);
		}
		preformatted(r) {
			return /\n[^\S\r\n]/.test(r);
		}
		formatItem(r, i, v, u) {
			let $ = ' '.repeat(2);
			if (!v) return $ + r;
			let g = r.padEnd(i + r.length - u.displayWidth(r)),
				I = 2,
				o = (this.helpWidth ?? 80) - i - I - 2,
				_;
			if (o < this.minWidthToWrap || u.preformatted(v)) _ = v;
			else
				_ = u.boxWrap(v, o).replace(
					/\n/g,
					`
` + ' '.repeat(i + I)
				);
			return (
				$ +
				g +
				' '.repeat(I) +
				_.replace(
					/\n/g,
					`
${$}`
				)
			);
		}
		boxWrap(r, i) {
			if (i < this.minWidthToWrap) return r;
			let v = r.split(/\r\n|\n/),
				u = /[\s]*[^\s]+/g,
				n = [];
			return (
				v.forEach(($) => {
					let g = $.match(u);
					if (g === null) {
						n.push('');
						return;
					}
					let I = [g.shift()],
						b = this.displayWidth(I[0]);
					(g.forEach((o) => {
						let _ = this.displayWidth(o);
						if (b + _ <= i) {
							(I.push(o), (b += _));
							return;
						}
						n.push(I.join(''));
						let l = o.trimStart();
						((I = [l]), (b = this.displayWidth(l)));
					}),
						n.push(I.join('')));
				}),
				n.join(`
`)
			);
		}
	}
	function Jo(r) {
		let i = /\x1b\[\d*(;\d*)*m/g;
		return r.replace(i, '');
	}
	KU.Help = jo;
	KU.stripColor = Jo;
});
var pv = kr((tU) => {
	var { InvalidArgumentError: HU } = Jn();
	class Go {
		constructor(r, i) {
			((this.flags = r),
				(this.description = i || ''),
				(this.required = r.includes('<')),
				(this.optional = r.includes('[')),
				(this.variadic = /\w\.\.\.[>\]]$/.test(r)),
				(this.mandatory = !1));
			let v = BU(r);
			if (((this.short = v.shortFlag), (this.long = v.longFlag), (this.negate = !1), this.long))
				this.negate = this.long.startsWith('--no-');
			((this.defaultValue = void 0),
				(this.defaultValueDescription = void 0),
				(this.presetArg = void 0),
				(this.envVar = void 0),
				(this.parseArg = void 0),
				(this.hidden = !1),
				(this.argChoices = void 0),
				(this.conflictsWith = []),
				(this.implied = void 0),
				(this.helpGroupHeading = void 0));
		}
		default(r, i) {
			return ((this.defaultValue = r), (this.defaultValueDescription = i), this);
		}
		preset(r) {
			return ((this.presetArg = r), this);
		}
		conflicts(r) {
			return ((this.conflictsWith = this.conflictsWith.concat(r)), this);
		}
		implies(r) {
			let i = r;
			if (typeof r === 'string') i = { [r]: !0 };
			return ((this.implied = Object.assign(this.implied || {}, i)), this);
		}
		env(r) {
			return ((this.envVar = r), this);
		}
		argParser(r) {
			return ((this.parseArg = r), this);
		}
		makeOptionMandatory(r = !0) {
			return ((this.mandatory = !!r), this);
		}
		hideHelp(r = !0) {
			return ((this.hidden = !!r), this);
		}
		_collectValue(r, i) {
			if (i === this.defaultValue || !Array.isArray(i)) return [r];
			return (i.push(r), i);
		}
		choices(r) {
			return (
				(this.argChoices = r.slice()),
				(this.parseArg = (i, v) => {
					if (!this.argChoices.includes(i))
						throw new HU(`Allowed choices are ${this.argChoices.join(', ')}.`);
					if (this.variadic) return this._collectValue(i, v);
					return i;
				}),
				this
			);
		}
		name() {
			if (this.long) return this.long.replace(/^--/, '');
			return this.short.replace(/^-/, '');
		}
		attributeName() {
			if (this.negate) return Lo(this.name().replace(/^no-/, ''));
			return Lo(this.name());
		}
		helpGroup(r) {
			return ((this.helpGroupHeading = r), this);
		}
		is(r) {
			return this.short === r || this.long === r;
		}
		isBoolean() {
			return !this.required && !this.optional && !this.negate;
		}
	}
	class Xo {
		constructor(r) {
			((this.positiveOptions = new Map()),
				(this.negativeOptions = new Map()),
				(this.dualOptions = new Set()),
				r.forEach((i) => {
					if (i.negate) this.negativeOptions.set(i.attributeName(), i);
					else this.positiveOptions.set(i.attributeName(), i);
				}),
				this.negativeOptions.forEach((i, v) => {
					if (this.positiveOptions.has(v)) this.dualOptions.add(v);
				}));
		}
		valueFromOption(r, i) {
			let v = i.attributeName();
			if (!this.dualOptions.has(v)) return !0;
			let u = this.negativeOptions.get(v).presetArg,
				n = u !== void 0 ? u : !1;
			return i.negate === (n === r);
		}
	}
	function Lo(r) {
		return r.split('-').reduce((i, v) => {
			return i + v[0].toUpperCase() + v.slice(1);
		});
	}
	function BU(r) {
		let i,
			v,
			u = /^-[^-]$/,
			n = /^--[^-]/,
			$ = r.split(/[ |,]+/).concat('guard');
		if (u.test($[0])) i = $.shift();
		if (n.test($[0])) v = $.shift();
		if (!i && u.test($[0])) i = $.shift();
		if (!i && n.test($[0])) ((i = v), (v = $.shift()));
		if ($[0].startsWith('-')) {
			let g = $[0],
				I = `option creation failed due to '${g}' in option flags '${r}'`;
			if (/^-[^-][^-]/.test(g))
				throw Error(`${I}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`);
			if (u.test(g))
				throw Error(`${I}
- too many short flags`);
			if (n.test(g))
				throw Error(`${I}
- too many long flags`);
			throw Error(`${I}
- unrecognised flag format`);
		}
		if (i === void 0 && v === void 0)
			throw Error(`option creation failed due to no flags found in '${r}'.`);
		return { shortFlag: i, longFlag: v };
	}
	tU.Option = Go;
	tU.DualOptions = Xo;
});
var Oo = kr((xU) => {
	function RU(r, i) {
		if (Math.abs(r.length - i.length) > 3) return Math.max(r.length, i.length);
		let v = [];
		for (let u = 0; u <= r.length; u++) v[u] = [u];
		for (let u = 0; u <= i.length; u++) v[0][u] = u;
		for (let u = 1; u <= i.length; u++)
			for (let n = 1; n <= r.length; n++) {
				let $ = 1;
				if (r[n - 1] === i[u - 1]) $ = 0;
				else $ = 1;
				if (
					((v[n][u] = Math.min(v[n - 1][u] + 1, v[n][u - 1] + 1, v[n - 1][u - 1] + $)),
					n > 1 && u > 1 && r[n - 1] === i[u - 2] && r[n - 2] === i[u - 1])
				)
					v[n][u] = Math.min(v[n][u], v[n - 2][u - 2] + 1);
			}
		return v[r.length][i.length];
	}
	function FU(r, i) {
		if (!i || i.length === 0) return '';
		i = Array.from(new Set(i));
		let v = r.startsWith('--');
		if (v) ((r = r.slice(2)), (i = i.map((g) => g.slice(2))));
		let u = [],
			n = 3,
			$ = 0.4;
		if (
			(i.forEach((g) => {
				if (g.length <= 1) return;
				let I = RU(r, g),
					b = Math.max(r.length, g.length);
				if ((b - I) / b > $) {
					if (I < n) ((n = I), (u = [g]));
					else if (I === n) u.push(g);
				}
			}),
			u.sort((g, I) => g.localeCompare(I)),
			v)
		)
			u = u.map((g) => `--${g}`);
		if (u.length > 1)
			return `
(Did you mean one of ${u.join(', ')}?)`;
		if (u.length === 1)
			return `
(Did you mean ${u[0]}?)`;
		return '';
	}
	xU.suggestSimilar = FU;
});
var Yo = kr((eU) => {
	var fU = jn('node:events').EventEmitter,
		sv = jn('node:child_process'),
		cr = jn('node:path'),
		bi = jn('node:fs'),
		V = jn('node:process'),
		{ Argument: CU, humanReadableArgName: mU } = oi(),
		{ CommanderError: r$ } = Jn(),
		{ Help: yU, stripColor: dU } = av(),
		{ Option: qo, DualOptions: hU } = pv(),
		{ suggestSimilar: Wo } = Oo();
	class i$ extends fU {
		constructor(r) {
			super();
			((this.commands = []),
				(this.options = []),
				(this.parent = null),
				(this._allowUnknownOption = !1),
				(this._allowExcessArguments = !1),
				(this.registeredArguments = []),
				(this._args = this.registeredArguments),
				(this.args = []),
				(this.rawArgs = []),
				(this.processedArgs = []),
				(this._scriptPath = null),
				(this._name = r || ''),
				(this._optionValues = {}),
				(this._optionValueSources = {}),
				(this._storeOptionsAsProperties = !1),
				(this._actionHandler = null),
				(this._executableHandler = !1),
				(this._executableFile = null),
				(this._executableDir = null),
				(this._defaultCommandName = null),
				(this._exitCallback = null),
				(this._aliases = []),
				(this._combineFlagAndOptionalValue = !0),
				(this._description = ''),
				(this._summary = ''),
				(this._argsDescription = void 0),
				(this._enablePositionalOptions = !1),
				(this._passThroughOptions = !1),
				(this._lifeCycleHooks = {}),
				(this._showHelpAfterError = !1),
				(this._showSuggestionAfterError = !0),
				(this._savedState = null),
				(this._outputConfiguration = {
					writeOut: (i) => V.stdout.write(i),
					writeErr: (i) => V.stderr.write(i),
					outputError: (i, v) => v(i),
					getOutHelpWidth: () => (V.stdout.isTTY ? V.stdout.columns : void 0),
					getErrHelpWidth: () => (V.stderr.isTTY ? V.stderr.columns : void 0),
					getOutHasColors: () => n$() ?? (V.stdout.isTTY && V.stdout.hasColors?.()),
					getErrHasColors: () => n$() ?? (V.stderr.isTTY && V.stderr.hasColors?.()),
					stripColor: (i) => dU(i)
				}),
				(this._hidden = !1),
				(this._helpOption = void 0),
				(this._addImplicitHelpCommand = void 0),
				(this._helpCommand = void 0),
				(this._helpConfiguration = {}),
				(this._helpGroupHeading = void 0),
				(this._defaultCommandGroup = void 0),
				(this._defaultOptionGroup = void 0));
		}
		copyInheritedSettings(r) {
			return (
				(this._outputConfiguration = r._outputConfiguration),
				(this._helpOption = r._helpOption),
				(this._helpCommand = r._helpCommand),
				(this._helpConfiguration = r._helpConfiguration),
				(this._exitCallback = r._exitCallback),
				(this._storeOptionsAsProperties = r._storeOptionsAsProperties),
				(this._combineFlagAndOptionalValue = r._combineFlagAndOptionalValue),
				(this._allowExcessArguments = r._allowExcessArguments),
				(this._enablePositionalOptions = r._enablePositionalOptions),
				(this._showHelpAfterError = r._showHelpAfterError),
				(this._showSuggestionAfterError = r._showSuggestionAfterError),
				this
			);
		}
		_getCommandAndAncestors() {
			let r = [];
			for (let i = this; i; i = i.parent) r.push(i);
			return r;
		}
		command(r, i, v) {
			let u = i,
				n = v;
			if (typeof u === 'object' && u !== null) ((n = u), (u = null));
			n = n || {};
			let [, $, g] = r.match(/([^ ]+) *(.*)/),
				I = this.createCommand($);
			if (u) (I.description(u), (I._executableHandler = !0));
			if (n.isDefault) this._defaultCommandName = I._name;
			if (
				((I._hidden = !!(n.noHelp || n.hidden)), (I._executableFile = n.executableFile || null), g)
			)
				I.arguments(g);
			if ((this._registerCommand(I), (I.parent = this), I.copyInheritedSettings(this), u))
				return this;
			return I;
		}
		createCommand(r) {
			return new i$(r);
		}
		createHelp() {
			return Object.assign(new yU(), this.configureHelp());
		}
		configureHelp(r) {
			if (r === void 0) return this._helpConfiguration;
			return ((this._helpConfiguration = r), this);
		}
		configureOutput(r) {
			if (r === void 0) return this._outputConfiguration;
			return ((this._outputConfiguration = { ...this._outputConfiguration, ...r }), this);
		}
		showHelpAfterError(r = !0) {
			if (typeof r !== 'string') r = !!r;
			return ((this._showHelpAfterError = r), this);
		}
		showSuggestionAfterError(r = !0) {
			return ((this._showSuggestionAfterError = !!r), this);
		}
		addCommand(r, i) {
			if (!r._name)
				throw Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
			if (((i = i || {}), i.isDefault)) this._defaultCommandName = r._name;
			if (i.noHelp || i.hidden) r._hidden = !0;
			return (this._registerCommand(r), (r.parent = this), r._checkForBrokenPassThrough(), this);
		}
		createArgument(r, i) {
			return new CU(r, i);
		}
		argument(r, i, v, u) {
			let n = this.createArgument(r, i);
			if (typeof v === 'function') n.default(u).argParser(v);
			else n.default(v);
			return (this.addArgument(n), this);
		}
		arguments(r) {
			return (
				r
					.trim()
					.split(/ +/)
					.forEach((i) => {
						this.argument(i);
					}),
				this
			);
		}
		addArgument(r) {
			let i = this.registeredArguments.slice(-1)[0];
			if (i?.variadic) throw Error(`only the last argument can be variadic '${i.name()}'`);
			if (r.required && r.defaultValue !== void 0 && r.parseArg === void 0)
				throw Error(`a default value for a required argument is never used: '${r.name()}'`);
			return (this.registeredArguments.push(r), this);
		}
		helpCommand(r, i) {
			if (typeof r === 'boolean') {
				if (((this._addImplicitHelpCommand = r), r && this._defaultCommandGroup))
					this._initCommandGroup(this._getHelpCommand());
				return this;
			}
			let v = r ?? 'help [command]',
				[, u, n] = v.match(/([^ ]+) *(.*)/),
				$ = i ?? 'display help for command',
				g = this.createCommand(u);
			if ((g.helpOption(!1), n)) g.arguments(n);
			if ($) g.description($);
			if (((this._addImplicitHelpCommand = !0), (this._helpCommand = g), r || i))
				this._initCommandGroup(g);
			return this;
		}
		addHelpCommand(r, i) {
			if (typeof r !== 'object') return (this.helpCommand(r, i), this);
			return (
				(this._addImplicitHelpCommand = !0),
				(this._helpCommand = r),
				this._initCommandGroup(r),
				this
			);
		}
		_getHelpCommand() {
			if (
				this._addImplicitHelpCommand ??
				(this.commands.length && !this._actionHandler && !this._findCommand('help'))
			) {
				if (this._helpCommand === void 0) this.helpCommand(void 0, void 0);
				return this._helpCommand;
			}
			return null;
		}
		hook(r, i) {
			let v = ['preSubcommand', 'preAction', 'postAction'];
			if (!v.includes(r))
				throw Error(`Unexpected value for event passed to hook : '${r}'.
Expecting one of '${v.join("', '")}'`);
			if (this._lifeCycleHooks[r]) this._lifeCycleHooks[r].push(i);
			else this._lifeCycleHooks[r] = [i];
			return this;
		}
		exitOverride(r) {
			if (r) this._exitCallback = r;
			else
				this._exitCallback = (i) => {
					if (i.code !== 'commander.executeSubCommandAsync') throw i;
				};
			return this;
		}
		_exit(r, i, v) {
			if (this._exitCallback) this._exitCallback(new r$(r, i, v));
			V.exit(r);
		}
		action(r) {
			let i = (v) => {
				let u = this.registeredArguments.length,
					n = v.slice(0, u);
				if (this._storeOptionsAsProperties) n[u] = this;
				else n[u] = this.opts();
				return (n.push(this), r.apply(this, n));
			};
			return ((this._actionHandler = i), this);
		}
		createOption(r, i) {
			return new qo(r, i);
		}
		_callParseArg(r, i, v, u) {
			try {
				return r.parseArg(i, v);
			} catch (n) {
				if (n.code === 'commander.invalidArgument') {
					let $ = `${u} ${n.message}`;
					this.error($, { exitCode: n.exitCode, code: n.code });
				}
				throw n;
			}
		}
		_registerOption(r) {
			let i = (r.short && this._findOption(r.short)) || (r.long && this._findOption(r.long));
			if (i) {
				let v = r.long && this._findOption(r.long) ? r.long : r.short;
				throw Error(`Cannot add option '${r.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${v}'
-  already used by option '${i.flags}'`);
			}
			(this._initOptionGroup(r), this.options.push(r));
		}
		_registerCommand(r) {
			let i = (u) => {
					return [u.name()].concat(u.aliases());
				},
				v = i(r).find((u) => this._findCommand(u));
			if (v) {
				let u = i(this._findCommand(v)).join('|'),
					n = i(r).join('|');
				throw Error(`cannot add command '${n}' as already have command '${u}'`);
			}
			(this._initCommandGroup(r), this.commands.push(r));
		}
		addOption(r) {
			this._registerOption(r);
			let i = r.name(),
				v = r.attributeName();
			if (r.negate) {
				let n = r.long.replace(/^--no-/, '--');
				if (!this._findOption(n))
					this.setOptionValueWithSource(
						v,
						r.defaultValue === void 0 ? !0 : r.defaultValue,
						'default'
					);
			} else if (r.defaultValue !== void 0)
				this.setOptionValueWithSource(v, r.defaultValue, 'default');
			let u = (n, $, g) => {
				if (n == null && r.presetArg !== void 0) n = r.presetArg;
				let I = this.getOptionValue(v);
				if (n !== null && r.parseArg) n = this._callParseArg(r, n, I, $);
				else if (n !== null && r.variadic) n = r._collectValue(n, I);
				if (n == null)
					if (r.negate) n = !1;
					else if (r.isBoolean() || r.optional) n = !0;
					else n = '';
				this.setOptionValueWithSource(v, n, g);
			};
			if (
				(this.on('option:' + i, (n) => {
					let $ = `error: option '${r.flags}' argument '${n}' is invalid.`;
					u(n, $, 'cli');
				}),
				r.envVar)
			)
				this.on('optionEnv:' + i, (n) => {
					let $ = `error: option '${r.flags}' value '${n}' from env '${r.envVar}' is invalid.`;
					u(n, $, 'env');
				});
			return this;
		}
		_optionEx(r, i, v, u, n) {
			if (typeof i === 'object' && i instanceof qo)
				throw Error(
					'To add an Option object use addOption() instead of option() or requiredOption()'
				);
			let $ = this.createOption(i, v);
			if (($.makeOptionMandatory(!!r.mandatory), typeof u === 'function'))
				$.default(n).argParser(u);
			else if (u instanceof RegExp) {
				let g = u;
				((u = (I, b) => {
					let o = g.exec(I);
					return o ? o[0] : b;
				}),
					$.default(n).argParser(u));
			} else $.default(u);
			return this.addOption($);
		}
		option(r, i, v, u) {
			return this._optionEx({}, r, i, v, u);
		}
		requiredOption(r, i, v, u) {
			return this._optionEx({ mandatory: !0 }, r, i, v, u);
		}
		combineFlagAndOptionalValue(r = !0) {
			return ((this._combineFlagAndOptionalValue = !!r), this);
		}
		allowUnknownOption(r = !0) {
			return ((this._allowUnknownOption = !!r), this);
		}
		allowExcessArguments(r = !0) {
			return ((this._allowExcessArguments = !!r), this);
		}
		enablePositionalOptions(r = !0) {
			return ((this._enablePositionalOptions = !!r), this);
		}
		passThroughOptions(r = !0) {
			return ((this._passThroughOptions = !!r), this._checkForBrokenPassThrough(), this);
		}
		_checkForBrokenPassThrough() {
			if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions)
				throw Error(
					`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
				);
		}
		storeOptionsAsProperties(r = !0) {
			if (this.options.length)
				throw Error('call .storeOptionsAsProperties() before adding options');
			if (Object.keys(this._optionValues).length)
				throw Error('call .storeOptionsAsProperties() before setting option values');
			return ((this._storeOptionsAsProperties = !!r), this);
		}
		getOptionValue(r) {
			if (this._storeOptionsAsProperties) return this[r];
			return this._optionValues[r];
		}
		setOptionValue(r, i) {
			return this.setOptionValueWithSource(r, i, void 0);
		}
		setOptionValueWithSource(r, i, v) {
			if (this._storeOptionsAsProperties) this[r] = i;
			else this._optionValues[r] = i;
			return ((this._optionValueSources[r] = v), this);
		}
		getOptionValueSource(r) {
			return this._optionValueSources[r];
		}
		getOptionValueSourceWithGlobals(r) {
			let i;
			return (
				this._getCommandAndAncestors().forEach((v) => {
					if (v.getOptionValueSource(r) !== void 0) i = v.getOptionValueSource(r);
				}),
				i
			);
		}
		_prepareUserArgs(r, i) {
			if (r !== void 0 && !Array.isArray(r))
				throw Error('first parameter to parse must be array or undefined');
			if (((i = i || {}), r === void 0 && i.from === void 0)) {
				if (V.versions?.electron) i.from = 'electron';
				let u = V.execArgv ?? [];
				if (u.includes('-e') || u.includes('--eval') || u.includes('-p') || u.includes('--print'))
					i.from = 'eval';
			}
			if (r === void 0) r = V.argv;
			this.rawArgs = r.slice();
			let v;
			switch (i.from) {
				case void 0:
				case 'node':
					((this._scriptPath = r[1]), (v = r.slice(2)));
					break;
				case 'electron':
					if (V.defaultApp) ((this._scriptPath = r[1]), (v = r.slice(2)));
					else v = r.slice(1);
					break;
				case 'user':
					v = r.slice(0);
					break;
				case 'eval':
					v = r.slice(1);
					break;
				default:
					throw Error(`unexpected parse option { from: '${i.from}' }`);
			}
			if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
			return ((this._name = this._name || 'program'), v);
		}
		parse(r, i) {
			this._prepareForParse();
			let v = this._prepareUserArgs(r, i);
			return (this._parseCommand([], v), this);
		}
		async parseAsync(r, i) {
			this._prepareForParse();
			let v = this._prepareUserArgs(r, i);
			return (await this._parseCommand([], v), this);
		}
		_prepareForParse() {
			if (this._savedState === null) this.saveStateBeforeParse();
			else this.restoreStateBeforeParse();
		}
		saveStateBeforeParse() {
			this._savedState = {
				_name: this._name,
				_optionValues: { ...this._optionValues },
				_optionValueSources: { ...this._optionValueSources }
			};
		}
		restoreStateBeforeParse() {
			if (this._storeOptionsAsProperties)
				throw Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
			((this._name = this._savedState._name),
				(this._scriptPath = null),
				(this.rawArgs = []),
				(this._optionValues = { ...this._savedState._optionValues }),
				(this._optionValueSources = { ...this._savedState._optionValueSources }),
				(this.args = []),
				(this.processedArgs = []));
		}
		_checkForMissingExecutable(r, i, v) {
			if (bi.existsSync(r)) return;
			let u = i
					? `searched for local subcommand relative to directory '${i}'`
					: 'no directory for search for local subcommand, use .executableDir() to supply a custom directory',
				n = `'${r}' does not exist
 - if '${v}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${u}`;
			throw Error(n);
		}
		_executeSubCommand(r, i) {
			i = i.slice();
			let v = !1,
				u = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
			function n(o, _) {
				let l = cr.resolve(o, _);
				if (bi.existsSync(l)) return l;
				if (u.includes(cr.extname(_))) return;
				let D = u.find((c) => bi.existsSync(`${l}${c}`));
				if (D) return `${l}${D}`;
				return;
			}
			(this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions());
			let $ = r._executableFile || `${this._name}-${r._name}`,
				g = this._executableDir || '';
			if (this._scriptPath) {
				let o;
				try {
					o = bi.realpathSync(this._scriptPath);
				} catch {
					o = this._scriptPath;
				}
				g = cr.resolve(cr.dirname(o), g);
			}
			if (g) {
				let o = n(g, $);
				if (!o && !r._executableFile && this._scriptPath) {
					let _ = cr.basename(this._scriptPath, cr.extname(this._scriptPath));
					if (_ !== this._name) o = n(g, `${_}-${r._name}`);
				}
				$ = o || $;
			}
			v = u.includes(cr.extname($));
			let I;
			if (V.platform !== 'win32')
				if (v)
					(i.unshift($),
						(i = Vo(V.execArgv).concat(i)),
						(I = sv.spawn(V.argv[0], i, { stdio: 'inherit' })));
				else I = sv.spawn($, i, { stdio: 'inherit' });
			else
				(this._checkForMissingExecutable($, g, r._name),
					i.unshift($),
					(i = Vo(V.execArgv).concat(i)),
					(I = sv.spawn(V.execPath, i, { stdio: 'inherit' })));
			if (!I.killed)
				['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'].forEach((_) => {
					V.on(_, () => {
						if (I.killed === !1 && I.exitCode === null) I.kill(_);
					});
				});
			let b = this._exitCallback;
			(I.on('close', (o) => {
				if (((o = o ?? 1), !b)) V.exit(o);
				else b(new r$(o, 'commander.executeSubCommandAsync', '(close)'));
			}),
				I.on('error', (o) => {
					if (o.code === 'ENOENT') this._checkForMissingExecutable($, g, r._name);
					else if (o.code === 'EACCES') throw Error(`'${$}' not executable`);
					if (!b) V.exit(1);
					else {
						let _ = new r$(1, 'commander.executeSubCommandAsync', '(error)');
						((_.nestedError = o), b(_));
					}
				}),
				(this.runningCommand = I));
		}
		_dispatchSubcommand(r, i, v) {
			let u = this._findCommand(r);
			if (!u) this.help({ error: !0 });
			u._prepareForParse();
			let n;
			return (
				(n = this._chainOrCallSubCommandHook(n, u, 'preSubcommand')),
				(n = this._chainOrCall(n, () => {
					if (u._executableHandler) this._executeSubCommand(u, i.concat(v));
					else return u._parseCommand(i, v);
				})),
				n
			);
		}
		_dispatchHelpCommand(r) {
			if (!r) this.help();
			let i = this._findCommand(r);
			if (i && !i._executableHandler) i.help();
			return this._dispatchSubcommand(
				r,
				[],
				[this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? '--help']
			);
		}
		_checkNumberOfArguments() {
			if (
				(this.registeredArguments.forEach((r, i) => {
					if (r.required && this.args[i] == null) this.missingArgument(r.name());
				}),
				this.registeredArguments.length > 0 &&
					this.registeredArguments[this.registeredArguments.length - 1].variadic)
			)
				return;
			if (this.args.length > this.registeredArguments.length) this._excessArguments(this.args);
		}
		_processArguments() {
			let r = (v, u, n) => {
				let $ = u;
				if (u !== null && v.parseArg) {
					let g = `error: command-argument value '${u}' is invalid for argument '${v.name()}'.`;
					$ = this._callParseArg(v, u, n, g);
				}
				return $;
			};
			this._checkNumberOfArguments();
			let i = [];
			(this.registeredArguments.forEach((v, u) => {
				let n = v.defaultValue;
				if (v.variadic) {
					if (u < this.args.length) {
						if (((n = this.args.slice(u)), v.parseArg))
							n = n.reduce(($, g) => {
								return r(v, g, $);
							}, v.defaultValue);
					} else if (n === void 0) n = [];
				} else if (u < this.args.length) {
					if (((n = this.args[u]), v.parseArg)) n = r(v, n, v.defaultValue);
				}
				i[u] = n;
			}),
				(this.processedArgs = i));
		}
		_chainOrCall(r, i) {
			if (r?.then && typeof r.then === 'function') return r.then(() => i());
			return i();
		}
		_chainOrCallHooks(r, i) {
			let v = r,
				u = [];
			if (
				(this._getCommandAndAncestors()
					.reverse()
					.filter((n) => n._lifeCycleHooks[i] !== void 0)
					.forEach((n) => {
						n._lifeCycleHooks[i].forEach(($) => {
							u.push({ hookedCommand: n, callback: $ });
						});
					}),
				i === 'postAction')
			)
				u.reverse();
			return (
				u.forEach((n) => {
					v = this._chainOrCall(v, () => {
						return n.callback(n.hookedCommand, this);
					});
				}),
				v
			);
		}
		_chainOrCallSubCommandHook(r, i, v) {
			let u = r;
			if (this._lifeCycleHooks[v] !== void 0)
				this._lifeCycleHooks[v].forEach((n) => {
					u = this._chainOrCall(u, () => {
						return n(this, i);
					});
				});
			return u;
		}
		_parseCommand(r, i) {
			let v = this.parseOptions(i);
			if (
				(this._parseOptionsEnv(),
				this._parseOptionsImplied(),
				(r = r.concat(v.operands)),
				(i = v.unknown),
				(this.args = r.concat(i)),
				r && this._findCommand(r[0]))
			)
				return this._dispatchSubcommand(r[0], r.slice(1), i);
			if (this._getHelpCommand() && r[0] === this._getHelpCommand().name())
				return this._dispatchHelpCommand(r[1]);
			if (this._defaultCommandName)
				return (
					this._outputHelpIfRequested(i),
					this._dispatchSubcommand(this._defaultCommandName, r, i)
				);
			if (
				this.commands.length &&
				this.args.length === 0 &&
				!this._actionHandler &&
				!this._defaultCommandName
			)
				this.help({ error: !0 });
			(this._outputHelpIfRequested(v.unknown),
				this._checkForMissingMandatoryOptions(),
				this._checkForConflictingOptions());
			let u = () => {
					if (v.unknown.length > 0) this.unknownOption(v.unknown[0]);
				},
				n = `command:${this.name()}`;
			if (this._actionHandler) {
				(u(), this._processArguments());
				let $;
				if (
					(($ = this._chainOrCallHooks($, 'preAction')),
					($ = this._chainOrCall($, () => this._actionHandler(this.processedArgs))),
					this.parent)
				)
					$ = this._chainOrCall($, () => {
						this.parent.emit(n, r, i);
					});
				return (($ = this._chainOrCallHooks($, 'postAction')), $);
			}
			if (this.parent?.listenerCount(n)) (u(), this._processArguments(), this.parent.emit(n, r, i));
			else if (r.length) {
				if (this._findCommand('*')) return this._dispatchSubcommand('*', r, i);
				if (this.listenerCount('command:*')) this.emit('command:*', r, i);
				else if (this.commands.length) this.unknownCommand();
				else (u(), this._processArguments());
			} else if (this.commands.length) (u(), this.help({ error: !0 }));
			else (u(), this._processArguments());
		}
		_findCommand(r) {
			if (!r) return;
			return this.commands.find((i) => i._name === r || i._aliases.includes(r));
		}
		_findOption(r) {
			return this.options.find((i) => i.is(r));
		}
		_checkForMissingMandatoryOptions() {
			this._getCommandAndAncestors().forEach((r) => {
				r.options.forEach((i) => {
					if (i.mandatory && r.getOptionValue(i.attributeName()) === void 0)
						r.missingMandatoryOptionValue(i);
				});
			});
		}
		_checkForConflictingLocalOptions() {
			let r = this.options.filter((v) => {
				let u = v.attributeName();
				if (this.getOptionValue(u) === void 0) return !1;
				return this.getOptionValueSource(u) !== 'default';
			});
			r.filter((v) => v.conflictsWith.length > 0).forEach((v) => {
				let u = r.find((n) => v.conflictsWith.includes(n.attributeName()));
				if (u) this._conflictingOption(v, u);
			});
		}
		_checkForConflictingOptions() {
			this._getCommandAndAncestors().forEach((r) => {
				r._checkForConflictingLocalOptions();
			});
		}
		parseOptions(r) {
			let i = [],
				v = [],
				u = i;
			function n(o) {
				return o.length > 1 && o[0] === '-';
			}
			let $ = (o) => {
					if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(o)) return !1;
					return !this._getCommandAndAncestors().some((_) =>
						_.options.map((l) => l.short).some((l) => /^-\d$/.test(l))
					);
				},
				g = null,
				I = null,
				b = 0;
			while (b < r.length || I) {
				let o = I ?? r[b++];
				if (((I = null), o === '--')) {
					if (u === v) u.push(o);
					u.push(...r.slice(b));
					break;
				}
				if (g && (!n(o) || $(o))) {
					this.emit(`option:${g.name()}`, o);
					continue;
				}
				if (((g = null), n(o))) {
					let _ = this._findOption(o);
					if (_) {
						if (_.required) {
							let l = r[b++];
							if (l === void 0) this.optionMissingArgument(_);
							this.emit(`option:${_.name()}`, l);
						} else if (_.optional) {
							let l = null;
							if (b < r.length && (!n(r[b]) || $(r[b]))) l = r[b++];
							this.emit(`option:${_.name()}`, l);
						} else this.emit(`option:${_.name()}`);
						g = _.variadic ? _ : null;
						continue;
					}
				}
				if (o.length > 2 && o[0] === '-' && o[1] !== '-') {
					let _ = this._findOption(`-${o[1]}`);
					if (_) {
						if (_.required || (_.optional && this._combineFlagAndOptionalValue))
							this.emit(`option:${_.name()}`, o.slice(2));
						else (this.emit(`option:${_.name()}`), (I = `-${o.slice(2)}`));
						continue;
					}
				}
				if (/^--[^=]+=/.test(o)) {
					let _ = o.indexOf('='),
						l = this._findOption(o.slice(0, _));
					if (l && (l.required || l.optional)) {
						this.emit(`option:${l.name()}`, o.slice(_ + 1));
						continue;
					}
				}
				if (u === i && n(o) && !(this.commands.length === 0 && $(o))) u = v;
				if (
					(this._enablePositionalOptions || this._passThroughOptions) &&
					i.length === 0 &&
					v.length === 0
				) {
					if (this._findCommand(o)) {
						(i.push(o), v.push(...r.slice(b)));
						break;
					} else if (this._getHelpCommand() && o === this._getHelpCommand().name()) {
						i.push(o, ...r.slice(b));
						break;
					} else if (this._defaultCommandName) {
						v.push(o, ...r.slice(b));
						break;
					}
				}
				if (this._passThroughOptions) {
					u.push(o, ...r.slice(b));
					break;
				}
				u.push(o);
			}
			return { operands: i, unknown: v };
		}
		opts() {
			if (this._storeOptionsAsProperties) {
				let r = {},
					i = this.options.length;
				for (let v = 0; v < i; v++) {
					let u = this.options[v].attributeName();
					r[u] = u === this._versionOptionName ? this._version : this[u];
				}
				return r;
			}
			return this._optionValues;
		}
		optsWithGlobals() {
			return this._getCommandAndAncestors().reduce((r, i) => Object.assign(r, i.opts()), {});
		}
		error(r, i) {
			if (
				(this._outputConfiguration.outputError(
					`${r}
`,
					this._outputConfiguration.writeErr
				),
				typeof this._showHelpAfterError === 'string')
			)
				this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
			else if (this._showHelpAfterError)
				(this._outputConfiguration.writeErr(`
`),
					this.outputHelp({ error: !0 }));
			let v = i || {},
				u = v.exitCode || 1,
				n = v.code || 'commander.error';
			this._exit(u, n, r);
		}
		_parseOptionsEnv() {
			this.options.forEach((r) => {
				if (r.envVar && r.envVar in V.env) {
					let i = r.attributeName();
					if (
						this.getOptionValue(i) === void 0 ||
						['default', 'config', 'env'].includes(this.getOptionValueSource(i))
					)
						if (r.required || r.optional) this.emit(`optionEnv:${r.name()}`, V.env[r.envVar]);
						else this.emit(`optionEnv:${r.name()}`);
				}
			});
		}
		_parseOptionsImplied() {
			let r = new hU(this.options),
				i = (v) => {
					return (
						this.getOptionValue(v) !== void 0 &&
						!['default', 'implied'].includes(this.getOptionValueSource(v))
					);
				};
			this.options
				.filter(
					(v) =>
						v.implied !== void 0 &&
						i(v.attributeName()) &&
						r.valueFromOption(this.getOptionValue(v.attributeName()), v)
				)
				.forEach((v) => {
					Object.keys(v.implied)
						.filter((u) => !i(u))
						.forEach((u) => {
							this.setOptionValueWithSource(u, v.implied[u], 'implied');
						});
				});
		}
		missingArgument(r) {
			let i = `error: missing required argument '${r}'`;
			this.error(i, { code: 'commander.missingArgument' });
		}
		optionMissingArgument(r) {
			let i = `error: option '${r.flags}' argument missing`;
			this.error(i, { code: 'commander.optionMissingArgument' });
		}
		missingMandatoryOptionValue(r) {
			let i = `error: required option '${r.flags}' not specified`;
			this.error(i, { code: 'commander.missingMandatoryOptionValue' });
		}
		_conflictingOption(r, i) {
			let v = ($) => {
					let g = $.attributeName(),
						I = this.getOptionValue(g),
						b = this.options.find((_) => _.negate && g === _.attributeName()),
						o = this.options.find((_) => !_.negate && g === _.attributeName());
					if (
						b &&
						((b.presetArg === void 0 && I === !1) || (b.presetArg !== void 0 && I === b.presetArg))
					)
						return b;
					return o || $;
				},
				u = ($) => {
					let g = v($),
						I = g.attributeName();
					if (this.getOptionValueSource(I) === 'env') return `environment variable '${g.envVar}'`;
					return `option '${g.flags}'`;
				},
				n = `error: ${u(r)} cannot be used with ${u(i)}`;
			this.error(n, { code: 'commander.conflictingOption' });
		}
		unknownOption(r) {
			if (this._allowUnknownOption) return;
			let i = '';
			if (r.startsWith('--') && this._showSuggestionAfterError) {
				let u = [],
					n = this;
				do {
					let $ = n
						.createHelp()
						.visibleOptions(n)
						.filter((g) => g.long)
						.map((g) => g.long);
					((u = u.concat($)), (n = n.parent));
				} while (n && !n._enablePositionalOptions);
				i = Wo(r, u);
			}
			let v = `error: unknown option '${r}'${i}`;
			this.error(v, { code: 'commander.unknownOption' });
		}
		_excessArguments(r) {
			if (this._allowExcessArguments) return;
			let i = this.registeredArguments.length,
				v = i === 1 ? '' : 's',
				n = `error: too many arguments${this.parent ? ` for '${this.name()}'` : ''}. Expected ${i} argument${v} but got ${r.length}.`;
			this.error(n, { code: 'commander.excessArguments' });
		}
		unknownCommand() {
			let r = this.args[0],
				i = '';
			if (this._showSuggestionAfterError) {
				let u = [];
				(this.createHelp()
					.visibleCommands(this)
					.forEach((n) => {
						if ((u.push(n.name()), n.alias())) u.push(n.alias());
					}),
					(i = Wo(r, u)));
			}
			let v = `error: unknown command '${r}'${i}`;
			this.error(v, { code: 'commander.unknownCommand' });
		}
		version(r, i, v) {
			if (r === void 0) return this._version;
			((this._version = r), (i = i || '-V, --version'), (v = v || 'output the version number'));
			let u = this.createOption(i, v);
			return (
				(this._versionOptionName = u.attributeName()),
				this._registerOption(u),
				this.on('option:' + u.name(), () => {
					(this._outputConfiguration.writeOut(`${r}
`),
						this._exit(0, 'commander.version', r));
				}),
				this
			);
		}
		description(r, i) {
			if (r === void 0 && i === void 0) return this._description;
			if (((this._description = r), i)) this._argsDescription = i;
			return this;
		}
		summary(r) {
			if (r === void 0) return this._summary;
			return ((this._summary = r), this);
		}
		alias(r) {
			if (r === void 0) return this._aliases[0];
			let i = this;
			if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler)
				i = this.commands[this.commands.length - 1];
			if (r === i._name) throw Error("Command alias can't be the same as its name");
			let v = this.parent?._findCommand(r);
			if (v) {
				let u = [v.name()].concat(v.aliases()).join('|');
				throw Error(
					`cannot add alias '${r}' to command '${this.name()}' as already have command '${u}'`
				);
			}
			return (i._aliases.push(r), this);
		}
		aliases(r) {
			if (r === void 0) return this._aliases;
			return (r.forEach((i) => this.alias(i)), this);
		}
		usage(r) {
			if (r === void 0) {
				if (this._usage) return this._usage;
				let i = this.registeredArguments.map((v) => {
					return mU(v);
				});
				return []
					.concat(
						this.options.length || this._helpOption !== null ? '[options]' : [],
						this.commands.length ? '[command]' : [],
						this.registeredArguments.length ? i : []
					)
					.join(' ');
			}
			return ((this._usage = r), this);
		}
		name(r) {
			if (r === void 0) return this._name;
			return ((this._name = r), this);
		}
		helpGroup(r) {
			if (r === void 0) return this._helpGroupHeading ?? '';
			return ((this._helpGroupHeading = r), this);
		}
		commandsGroup(r) {
			if (r === void 0) return this._defaultCommandGroup ?? '';
			return ((this._defaultCommandGroup = r), this);
		}
		optionsGroup(r) {
			if (r === void 0) return this._defaultOptionGroup ?? '';
			return ((this._defaultOptionGroup = r), this);
		}
		_initOptionGroup(r) {
			if (this._defaultOptionGroup && !r.helpGroupHeading) r.helpGroup(this._defaultOptionGroup);
		}
		_initCommandGroup(r) {
			if (this._defaultCommandGroup && !r.helpGroup()) r.helpGroup(this._defaultCommandGroup);
		}
		nameFromFilename(r) {
			return ((this._name = cr.basename(r, cr.extname(r))), this);
		}
		executableDir(r) {
			if (r === void 0) return this._executableDir;
			return ((this._executableDir = r), this);
		}
		helpInformation(r) {
			let i = this.createHelp(),
				v = this._getOutputContext(r);
			i.prepareContext({ error: v.error, helpWidth: v.helpWidth, outputHasColors: v.hasColors });
			let u = i.formatHelp(this, i);
			if (v.hasColors) return u;
			return this._outputConfiguration.stripColor(u);
		}
		_getOutputContext(r) {
			r = r || {};
			let i = !!r.error,
				v,
				u,
				n;
			if (i)
				((v = (g) => this._outputConfiguration.writeErr(g)),
					(u = this._outputConfiguration.getErrHasColors()),
					(n = this._outputConfiguration.getErrHelpWidth()));
			else
				((v = (g) => this._outputConfiguration.writeOut(g)),
					(u = this._outputConfiguration.getOutHasColors()),
					(n = this._outputConfiguration.getOutHelpWidth()));
			return {
				error: i,
				write: (g) => {
					if (!u) g = this._outputConfiguration.stripColor(g);
					return v(g);
				},
				hasColors: u,
				helpWidth: n
			};
		}
		outputHelp(r) {
			let i;
			if (typeof r === 'function') ((i = r), (r = void 0));
			let v = this._getOutputContext(r),
				u = { error: v.error, write: v.write, command: this };
			(this._getCommandAndAncestors()
				.reverse()
				.forEach(($) => $.emit('beforeAllHelp', u)),
				this.emit('beforeHelp', u));
			let n = this.helpInformation({ error: v.error });
			if (i) {
				if (((n = i(n)), typeof n !== 'string' && !Buffer.isBuffer(n)))
					throw Error('outputHelp callback must return a string or a Buffer');
			}
			if ((v.write(n), this._getHelpOption()?.long)) this.emit(this._getHelpOption().long);
			(this.emit('afterHelp', u),
				this._getCommandAndAncestors().forEach(($) => $.emit('afterAllHelp', u)));
		}
		helpOption(r, i) {
			if (typeof r === 'boolean') {
				if (r) {
					if (this._helpOption === null) this._helpOption = void 0;
					if (this._defaultOptionGroup) this._initOptionGroup(this._getHelpOption());
				} else this._helpOption = null;
				return this;
			}
			if (
				((this._helpOption = this.createOption(r ?? '-h, --help', i ?? 'display help for command')),
				r || i)
			)
				this._initOptionGroup(this._helpOption);
			return this;
		}
		_getHelpOption() {
			if (this._helpOption === void 0) this.helpOption(void 0, void 0);
			return this._helpOption;
		}
		addHelpOption(r) {
			return ((this._helpOption = r), this._initOptionGroup(r), this);
		}
		help(r) {
			this.outputHelp(r);
			let i = Number(V.exitCode ?? 0);
			if (i === 0 && r && typeof r !== 'function' && r.error) i = 1;
			this._exit(i, 'commander.help', '(outputHelp)');
		}
		addHelpText(r, i) {
			let v = ['beforeAll', 'before', 'after', 'afterAll'];
			if (!v.includes(r))
				throw Error(`Unexpected value for position to addHelpText.
Expecting one of '${v.join("', '")}'`);
			let u = `${r}Help`;
			return (
				this.on(u, (n) => {
					let $;
					if (typeof i === 'function') $ = i({ error: n.error, command: n.command });
					else $ = i;
					if ($)
						n.write(`${$}
`);
				}),
				this
			);
		}
		_outputHelpIfRequested(r) {
			let i = this._getHelpOption();
			if (i && r.find((u) => i.is(u)))
				(this.outputHelp(), this._exit(0, 'commander.helpDisplayed', '(outputHelp)'));
		}
	}
	function Vo(r) {
		return r.map((i) => {
			if (!i.startsWith('--inspect')) return i;
			let v,
				u = '127.0.0.1',
				n = '9229',
				$;
			if (($ = i.match(/^(--inspect(-brk)?)$/)) !== null) v = $[1];
			else if (($ = i.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null)
				if (((v = $[1]), /^\d+$/.test($[3]))) n = $[3];
				else u = $[3];
			else if (($ = i.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null)
				((v = $[1]), (u = $[3]), (n = $[4]));
			if (v && n !== '0') return `${v}=${u}:${parseInt(n) + 1}`;
			return i;
		});
	}
	function n$() {
		if (V.env.NO_COLOR || V.env.FORCE_COLOR === '0' || V.env.FORCE_COLOR === 'false') return !1;
		if (V.env.FORCE_COLOR || V.env.CLICOLOR_FORCE !== void 0) return !0;
		return;
	}
	eU.Command = i$;
	eU.useColor = n$;
});
var To = kr((nl) => {
	var { Argument: Eo } = oi(),
		{ Command: v$ } = Yo(),
		{ CommanderError: sU, InvalidArgumentError: Ko } = Jn(),
		{ Help: rl } = av(),
		{ Option: Qo } = pv();
	nl.program = new v$();
	nl.createCommand = (r) => new v$(r);
	nl.createOption = (r, i) => new Qo(r, i);
	nl.createArgument = (r, i) => new Eo(r, i);
	nl.Command = v$;
	nl.Option = Qo;
	nl.Argument = Eo;
	nl.Help = rl;
	nl.CommanderError = sU;
	nl.InvalidArgumentError = Ko;
	nl.InvalidOptionArgumentError = Ko;
});
var Ao = kr((Ic, $$) => {
	var Ui = process || {},
		to = Ui.argv || [],
		_i = Ui.env || {},
		Dl =
			!(!!_i.NO_COLOR || to.includes('--no-color')) &&
			(!!_i.FORCE_COLOR ||
				to.includes('--color') ||
				Ui.platform === 'win32' ||
				((Ui.stdout || {}).isTTY && _i.TERM !== 'dumb') ||
				!!_i.CI),
		cl =
			(r, i, v = r) =>
			(u) => {
				let n = '' + u,
					$ = n.indexOf(i, r.length);
				return ~$ ? r + Sl(n, i, v, $) + i : r + n + i;
			},
		Sl = (r, i, v, u) => {
			let n = '',
				$ = 0;
			do ((n += r.substring($, u) + v), ($ = u + i.length), (u = r.indexOf(i, $)));
			while (~u);
			return n + r.substring($);
		},
		Mo = (r = Dl) => {
			let i = r ? cl : () => String;
			return {
				isColorSupported: r,
				reset: i('\x1B[0m', '\x1B[0m'),
				bold: i('\x1B[1m', '\x1B[22m', '\x1B[22m\x1B[1m'),
				dim: i('\x1B[2m', '\x1B[22m', '\x1B[22m\x1B[2m'),
				italic: i('\x1B[3m', '\x1B[23m'),
				underline: i('\x1B[4m', '\x1B[24m'),
				inverse: i('\x1B[7m', '\x1B[27m'),
				hidden: i('\x1B[8m', '\x1B[28m'),
				strikethrough: i('\x1B[9m', '\x1B[29m'),
				black: i('\x1B[30m', '\x1B[39m'),
				red: i('\x1B[31m', '\x1B[39m'),
				green: i('\x1B[32m', '\x1B[39m'),
				yellow: i('\x1B[33m', '\x1B[39m'),
				blue: i('\x1B[34m', '\x1B[39m'),
				magenta: i('\x1B[35m', '\x1B[39m'),
				cyan: i('\x1B[36m', '\x1B[39m'),
				white: i('\x1B[37m', '\x1B[39m'),
				gray: i('\x1B[90m', '\x1B[39m'),
				bgBlack: i('\x1B[40m', '\x1B[49m'),
				bgRed: i('\x1B[41m', '\x1B[49m'),
				bgGreen: i('\x1B[42m', '\x1B[49m'),
				bgYellow: i('\x1B[43m', '\x1B[49m'),
				bgBlue: i('\x1B[44m', '\x1B[49m'),
				bgMagenta: i('\x1B[45m', '\x1B[49m'),
				bgCyan: i('\x1B[46m', '\x1B[49m'),
				bgWhite: i('\x1B[47m', '\x1B[49m'),
				blackBright: i('\x1B[90m', '\x1B[39m'),
				redBright: i('\x1B[91m', '\x1B[39m'),
				greenBright: i('\x1B[92m', '\x1B[39m'),
				yellowBright: i('\x1B[93m', '\x1B[39m'),
				blueBright: i('\x1B[94m', '\x1B[39m'),
				magentaBright: i('\x1B[95m', '\x1B[39m'),
				cyanBright: i('\x1B[96m', '\x1B[39m'),
				whiteBright: i('\x1B[97m', '\x1B[39m'),
				bgBlackBright: i('\x1B[100m', '\x1B[49m'),
				bgRedBright: i('\x1B[101m', '\x1B[49m'),
				bgGreenBright: i('\x1B[102m', '\x1B[49m'),
				bgYellowBright: i('\x1B[103m', '\x1B[49m'),
				bgBlueBright: i('\x1B[104m', '\x1B[49m'),
				bgMagentaBright: i('\x1B[105m', '\x1B[49m'),
				bgCyanBright: i('\x1B[106m', '\x1B[49m'),
				bgWhiteBright: i('\x1B[107m', '\x1B[49m')
			};
		};
	$$.exports = Mo();
	$$.exports.createColors = Mo;
});
var $o = kr((vz, C_) => {
	var vo = {
			to(r, i) {
				if (!i) return `\x1B[${r + 1}G`;
				return `\x1B[${i + 1};${r + 1}H`;
			},
			move(r, i) {
				let v = '';
				if (r < 0) v += `\x1B[${-r}D`;
				else if (r > 0) v += `\x1B[${r}C`;
				if (i < 0) v += `\x1B[${-i}A`;
				else if (i > 0) v += `\x1B[${i}B`;
				return v;
			},
			up: (r = 1) => `\x1B[${r}A`,
			down: (r = 1) => `\x1B[${r}B`,
			forward: (r = 1) => `\x1B[${r}C`,
			backward: (r = 1) => `\x1B[${r}D`,
			nextLine: (r = 1) => '\x1B[E'.repeat(r),
			prevLine: (r = 1) => '\x1B[F'.repeat(r),
			left: '\x1B[G',
			hide: '\x1B[?25l',
			show: '\x1B[?25h',
			save: '\x1B7',
			restore: '\x1B8'
		},
		gD = { up: (r = 1) => '\x1B[S'.repeat(r), down: (r = 1) => '\x1B[T'.repeat(r) },
		ID = {
			screen: '\x1B[2J',
			up: (r = 1) => '\x1B[1J'.repeat(r),
			down: (r = 1) => '\x1B[J'.repeat(r),
			line: '\x1B[2K',
			lineEnd: '\x1B[K',
			lineStart: '\x1B[1K',
			lines(r) {
				let i = '';
				for (let v = 0; v < r; v++) i += this.line + (v < r - 1 ? vo.up() : '');
				if (r) i += vo.left;
				return i;
			}
		};
	C_.exports = { cursor: vo, scroll: gD, erase: ID, beep: '\x07' };
});
var Ho = Ii(To(), 1),
	{
		program: aD,
		createCommand: pD,
		createArgument: sD,
		createOption: rc,
		CommanderError: nc,
		InvalidArgumentError: ic,
		InvalidOptionArgumentError: vc,
		Command: Bo,
		Argument: $c,
		Option: uc,
		Help: gc
	} = Ho.default;
var wo = Ii(Ao(), 1);
var io = {};
Dr(io, {
	xor: () => z_,
	xid: () => Fb,
	void: () => l_,
	uuidv7: () => Qb,
	uuidv6: () => Kb,
	uuidv4: () => Eb,
	uuid: () => Yb,
	util: () => z,
	url: () => Tb,
	uppercase: () => pr,
	unknown: () => Mr,
	union: () => tv,
	undefined: () => __,
	ulid: () => Rb,
	uint64: () => o_,
	uint32: () => u_,
	tuple: () => O6,
	trim: () => un,
	treeifyError: () => w$,
	transform: () => Av,
	toUpperCase: () => In,
	toLowerCase: () => gn,
	toJSONSchema: () => Uv,
	templateLiteral: () => K_,
	symbol: () => b_,
	superRefine: () => s6,
	success: () => W_,
	stringbool: () => R_,
	stringFormat: () => pb,
	string: () => mn,
	strictObject: () => S_,
	startsWith: () => rn,
	slugify: () => on,
	size: () => Hr,
	setErrorMap: () => ek,
	set: () => L_,
	safeParseAsync: () => r6,
	safeParse: () => sI,
	safeEncodeAsync: () => I6,
	safeEncode: () => u6,
	safeDecodeAsync: () => o6,
	safeDecode: () => g6,
	registry: () => Bi,
	regexes: () => s,
	regex: () => er,
	refine: () => p6,
	record: () => q6,
	readonly: () => m6,
	property: () => Iv,
	promise: () => Q_,
	prettifyError: () => z$,
	preprocess: () => x_,
	prefault: () => A6,
	positive: () => vv,
	pipe: () => en,
	partialRecord: () => P_,
	parseAsync: () => pI,
	parse: () => aI,
	overwrite: () => ur,
	optional: () => dn,
	object: () => c_,
	number: () => _6,
	nullish: () => q_,
	nullable: () => hn,
	null: () => c6,
	normalize: () => $n,
	nonpositive: () => uv,
	nonoptional: () => R6,
	nonnegative: () => gv,
	never: () => Bv,
	negative: () => $v,
	nativeEnum: () => G_,
	nanoid: () => tb,
	nan: () => V_,
	multipleOf: () => Gr,
	minSize: () => Ur,
	minLength: () => wr,
	mime: () => vn,
	meta: () => M_,
	maxSize: () => Xr,
	maxLength: () => Br,
	map: () => J_,
	mac: () => fb,
	lte: () => rr,
	lt: () => br,
	lowercase: () => ar,
	looseRecord: () => j_,
	looseObject: () => w_,
	locales: () => xn,
	literal: () => X_,
	length: () => tr,
	lazy: () => h6,
	ksuid: () => xb,
	keyof: () => D_,
	jwt: () => ab,
	json: () => F_,
	iso: () => Un,
	ipv6: () => Cb,
	ipv4: () => Zb,
	invertCodec: () => E_,
	intersection: () => G6,
	int64: () => I_,
	int32: () => $_,
	int: () => wv,
	instanceof: () => A_,
	includes: () => sr,
	httpUrl: () => Hb,
	hostname: () => sb,
	hex: () => r_,
	hash: () => n_,
	guid: () => Vb,
	gte: () => d,
	gt: () => _r,
	globalRegistry: () => f,
	getErrorMap: () => ak,
	function: () => T_,
	fromJSONSchema: () => f_,
	formatError: () => En,
	float64: () => v_,
	float32: () => i_,
	flattenError: () => Yn,
	file: () => O_,
	exactOptional: () => T6,
	enum: () => Mv,
	endsWith: () => nn,
	encodeAsync: () => v6,
	encode: () => n6,
	emoji: () => Bb,
	email: () => Wb,
	e164: () => eb,
	discriminatedUnion: () => N_,
	describe: () => t_,
	decodeAsync: () => $6,
	decode: () => i6,
	date: () => k_,
	custom: () => B_,
	cuid2: () => Ab,
	cuid: () => Mb,
	core: () => zr,
	config: () => M,
	coerce: () => no,
	codec: () => Y_,
	clone: () => m,
	cidrv6: () => yb,
	cidrv4: () => mb,
	check: () => H_,
	catch: () => Z6,
	boolean: () => U6,
	bigint: () => g_,
	base64url: () => hb,
	base64: () => db,
	array: () => ri,
	any: () => U_,
	_function: () => T_,
	_default: () => t6,
	_ZodString: () => zv,
	ZodXor: () => j6,
	ZodXID: () => Xv,
	ZodVoid: () => N6,
	ZodUnknown: () => w6,
	ZodUnion: () => ii,
	ZodUndefined: () => k6,
	ZodUUID: () => lr,
	ZodURL: () => pn,
	ZodULID: () => Gv,
	ZodType: () => X,
	ZodTuple: () => X6,
	ZodTransform: () => K6,
	ZodTemplateLiteral: () => y6,
	ZodSymbol: () => l6,
	ZodSuccess: () => F6,
	ZodStringFormat: () => K,
	ZodString: () => Dn,
	ZodSet: () => V6,
	ZodRecord: () => ln,
	ZodRealError: () => p,
	ZodReadonly: () => C6,
	ZodPromise: () => e6,
	ZodPrefault: () => M6,
	ZodPipe: () => xv,
	ZodOptional: () => Rv,
	ZodObject: () => ni,
	ZodNumberFormat: () => Ar,
	ZodNumber: () => Sn,
	ZodNullable: () => H6,
	ZodNull: () => D6,
	ZodNonOptional: () => Fv,
	ZodNever: () => z6,
	ZodNanoID: () => jv,
	ZodNaN: () => f6,
	ZodMap: () => W6,
	ZodMAC: () => b6,
	ZodLiteral: () => Y6,
	ZodLazy: () => d6,
	ZodKSUID: () => Ov,
	ZodJWT: () => Tv,
	ZodIssueCode: () => hk,
	ZodIntersection: () => L6,
	ZodISOTime: () => cv,
	ZodISODuration: () => Sv,
	ZodISODateTime: () => kv,
	ZodISODate: () => Dv,
	ZodIPv6: () => Wv,
	ZodIPv4: () => qv,
	ZodGUID: () => yn,
	ZodFunction: () => a6,
	ZodFirstPartyTypeKind: () => ro,
	ZodFile: () => E6,
	ZodExactOptional: () => Q6,
	ZodError: () => yk,
	ZodEnum: () => kn,
	ZodEmoji: () => Pv,
	ZodEmail: () => Nv,
	ZodE164: () => Qv,
	ZodDiscriminatedUnion: () => J6,
	ZodDefault: () => B6,
	ZodDate: () => sn,
	ZodCustomStringFormat: () => cn,
	ZodCustom: () => $i,
	ZodCodec: () => vi,
	ZodCatch: () => x6,
	ZodCUID2: () => Lv,
	ZodCUID: () => Jv,
	ZodCIDRv6: () => Yv,
	ZodCIDRv4: () => Vv,
	ZodBoolean: () => wn,
	ZodBigIntFormat: () => Hv,
	ZodBigInt: () => zn,
	ZodBase64URL: () => Kv,
	ZodBase64: () => Ev,
	ZodArray: () => P6,
	ZodAny: () => S6,
	TimePrecision: () => O4,
	NEVER: () => u$,
	$output: () => P4,
	$input: () => j4,
	$brand: () => g$
});
var zr = {};
Dr(zr, {
	version: () => Du,
	util: () => z,
	treeifyError: () => w$,
	toJSONSchema: () => Uv,
	toDotPath: () => mo,
	safeParseAsync: () => P$,
	safeParse: () => N$,
	safeEncodeAsync: () => hl,
	safeEncode: () => yl,
	safeDecodeAsync: () => el,
	safeDecode: () => dl,
	registry: () => Bi,
	regexes: () => s,
	process: () => Y,
	prettifyError: () => z$,
	parseAsync: () => ci,
	parse: () => Di,
	meta: () => gI,
	locales: () => xn,
	isValidJWT: () => cb,
	isValidBase64URL: () => Db,
	isValidBase64: () => Bu,
	initializeContext: () => Or,
	globalRegistry: () => f,
	globalConfig: () => Yr,
	formatError: () => En,
	flattenError: () => Yn,
	finalize: () => Wr,
	extractDefs: () => qr,
	encodeAsync: () => Cl,
	encode: () => Zl,
	describe: () => uI,
	decodeAsync: () => ml,
	decode: () => fl,
	createToJSONSchemaMethod: () => oI,
	createStandardJSONSchemaMethod: () => _n,
	config: () => M,
	clone: () => m,
	_xor: () => Lk,
	_xid: () => yi,
	_void: () => e4,
	_uuidv7: () => Fi,
	_uuidv6: () => Ri,
	_uuidv4: () => Ai,
	_uuid: () => Mi,
	_url: () => fn,
	_uppercase: () => pr,
	_unknown: () => d4,
	_union: () => Jk,
	_undefined: () => C4,
	_ulid: () => mi,
	_uint64: () => Z4,
	_uint32: () => t4,
	_tuple: () => Ok,
	_trim: () => un,
	_transform: () => Qk,
	_toUpperCase: () => In,
	_toLowerCase: () => gn,
	_templateLiteral: () => xk,
	_symbol: () => f4,
	_superRefine: () => $I,
	_success: () => Mk,
	_stringbool: () => II,
	_stringFormat: () => bn,
	_string: () => L4,
	_startsWith: () => rn,
	_slugify: () => on,
	_size: () => Hr,
	_set: () => Vk,
	_safeParseAsync: () => yr,
	_safeParse: () => mr,
	_safeEncodeAsync: () => Ji,
	_safeEncode: () => Pi,
	_safeDecodeAsync: () => Li,
	_safeDecode: () => ji,
	_regex: () => er,
	_refine: () => vI,
	_record: () => qk,
	_readonly: () => Fk,
	_property: () => Iv,
	_promise: () => fk,
	_positive: () => vv,
	_pipe: () => Rk,
	_parseAsync: () => Cr,
	_parse: () => fr,
	_overwrite: () => ur,
	_optional: () => Tk,
	_number: () => E4,
	_nullable: () => Hk,
	_null: () => m4,
	_normalize: () => $n,
	_nonpositive: () => uv,
	_nonoptional: () => tk,
	_nonnegative: () => gv,
	_never: () => h4,
	_negative: () => $v,
	_nativeEnum: () => Ek,
	_nanoid: () => Zi,
	_nan: () => s4,
	_multipleOf: () => Gr,
	_minSize: () => Ur,
	_minLength: () => wr,
	_min: () => d,
	_mime: () => vn,
	_maxSize: () => Xr,
	_maxLength: () => Br,
	_max: () => rr,
	_map: () => Wk,
	_mac: () => X4,
	_lte: () => rr,
	_lt: () => br,
	_lowercase: () => ar,
	_literal: () => Kk,
	_length: () => tr,
	_lazy: () => Zk,
	_ksuid: () => di,
	_jwt: () => iv,
	_isoTime: () => V4,
	_isoDuration: () => Y4,
	_isoDateTime: () => q4,
	_isoDate: () => W4,
	_ipv6: () => ei,
	_ipv4: () => hi,
	_intersection: () => Xk,
	_int64: () => x4,
	_int32: () => B4,
	_int: () => Q4,
	_includes: () => sr,
	_guid: () => Zn,
	_gte: () => d,
	_gt: () => _r,
	_float64: () => H4,
	_float32: () => T4,
	_file: () => nI,
	_enum: () => Yk,
	_endsWith: () => nn,
	_encodeAsync: () => zi,
	_encode: () => Si,
	_emoji: () => xi,
	_email: () => ti,
	_e164: () => nv,
	_discriminatedUnion: () => Gk,
	_default: () => Bk,
	_decodeAsync: () => Ni,
	_decode: () => wi,
	_date: () => a4,
	_custom: () => iI,
	_cuid2: () => Ci,
	_cuid: () => fi,
	_coercedString: () => G4,
	_coercedNumber: () => K4,
	_coercedDate: () => p4,
	_coercedBoolean: () => A4,
	_coercedBigint: () => F4,
	_cidrv6: () => pi,
	_cidrv4: () => ai,
	_check: () => Gb,
	_catch: () => Ak,
	_boolean: () => M4,
	_bigint: () => R4,
	_base64url: () => rv,
	_base64: () => si,
	_array: () => rI,
	_any: () => y4,
	TimePrecision: () => O4,
	NEVER: () => u$,
	JSONSchemaGenerator: () => mI,
	JSONSchema: () => Xb,
	Doc: () => qi,
	$output: () => P4,
	$input: () => j4,
	$constructor: () => U,
	$brand: () => g$,
	$ZodXor: () => rg,
	$ZodXID: () => Xu,
	$ZodVoid: () => eu,
	$ZodUnknown: () => du,
	$ZodUnion: () => Bn,
	$ZodUndefined: () => Cu,
	$ZodUUID: () => wu,
	$ZodURL: () => Nu,
	$ZodULID: () => Gu,
	$ZodType: () => G,
	$ZodTuple: () => Ti,
	$ZodTransform: () => bg,
	$ZodTemplateLiteral: () => Pg,
	$ZodSymbol: () => fu,
	$ZodSuccess: () => cg,
	$ZodStringFormat: () => E,
	$ZodString: () => Tr,
	$ZodSet: () => ug,
	$ZodRegistry: () => J4,
	$ZodRecord: () => vg,
	$ZodRealError: () => a,
	$ZodReadonly: () => Ng,
	$ZodPromise: () => Jg,
	$ZodPrefault: () => kg,
	$ZodPipe: () => zg,
	$ZodOptional: () => Hi,
	$ZodObjectJIT: () => su,
	$ZodObject: () => zb,
	$ZodNumberFormat: () => xu,
	$ZodNumber: () => Ki,
	$ZodNullable: () => Ug,
	$ZodNull: () => mu,
	$ZodNonOptional: () => Dg,
	$ZodNever: () => hu,
	$ZodNanoID: () => ju,
	$ZodNaN: () => wg,
	$ZodMap: () => $g,
	$ZodMAC: () => Qu,
	$ZodLiteral: () => Ig,
	$ZodLazy: () => Lg,
	$ZodKSUID: () => Ou,
	$ZodJWT: () => Ru,
	$ZodIntersection: () => ig,
	$ZodISOTime: () => Vu,
	$ZodISODuration: () => Yu,
	$ZodISODateTime: () => qu,
	$ZodISODate: () => Wu,
	$ZodIPv6: () => Ku,
	$ZodIPv4: () => Eu,
	$ZodGUID: () => Su,
	$ZodFunction: () => jg,
	$ZodFile: () => og,
	$ZodExactOptional: () => _g,
	$ZodError: () => Vn,
	$ZodEnum: () => gg,
	$ZodEncodeError: () => Er,
	$ZodEmoji: () => Pu,
	$ZodEmail: () => zu,
	$ZodE164: () => Au,
	$ZodDiscriminatedUnion: () => ng,
	$ZodDefault: () => lg,
	$ZodDate: () => au,
	$ZodCustomStringFormat: () => Fu,
	$ZodCustom: () => Gg,
	$ZodCodec: () => tn,
	$ZodCheckUpperCase: () => Iu,
	$ZodCheckStringFormat: () => dr,
	$ZodCheckStartsWith: () => bu,
	$ZodCheckSizeEquals: () => nu,
	$ZodCheckRegex: () => uu,
	$ZodCheckProperty: () => Uu,
	$ZodCheckOverwrite: () => ku,
	$ZodCheckNumberFormat: () => a$,
	$ZodCheckMultipleOf: () => e$,
	$ZodCheckMinSize: () => ru,
	$ZodCheckMinLength: () => vu,
	$ZodCheckMimeType: () => lu,
	$ZodCheckMaxSize: () => s$,
	$ZodCheckMaxLength: () => iu,
	$ZodCheckLowerCase: () => gu,
	$ZodCheckLessThan: () => Xi,
	$ZodCheckLengthEquals: () => $u,
	$ZodCheckIncludes: () => ou,
	$ZodCheckGreaterThan: () => Oi,
	$ZodCheckEndsWith: () => _u,
	$ZodCheckBigIntFormat: () => p$,
	$ZodCheck: () => H,
	$ZodCatch: () => Sg,
	$ZodCUID2: () => Lu,
	$ZodCUID: () => Ju,
	$ZodCIDRv6: () => Hu,
	$ZodCIDRv4: () => Tu,
	$ZodBoolean: () => Hn,
	$ZodBigIntFormat: () => Zu,
	$ZodBigInt: () => Qi,
	$ZodBase64URL: () => Mu,
	$ZodBase64: () => tu,
	$ZodAsyncError: () => or,
	$ZodArray: () => pu,
	$ZodAny: () => yu
});
var Ro,
	u$ = Object.freeze({ status: 'aborted' });
function U(r, i, v) {
	function u(I, b) {
		if (!I._zod)
			Object.defineProperty(I, '_zod', {
				value: { def: b, constr: g, traits: new Set() },
				enumerable: !1
			});
		if (I._zod.traits.has(r)) return;
		(I._zod.traits.add(r), i(I, b));
		let o = g.prototype,
			_ = Object.keys(o);
		for (let l = 0; l < _.length; l++) {
			let D = _[l];
			if (!(D in I)) I[D] = o[D].bind(I);
		}
	}
	let n = v?.Parent ?? Object;
	class $ extends n {}
	Object.defineProperty($, 'name', { value: r });
	function g(I) {
		var b;
		let o = v?.Parent ? new $() : this;
		(u(o, I), (b = o._zod).deferred ?? (b.deferred = []));
		for (let _ of o._zod.deferred) _();
		return o;
	}
	return (
		Object.defineProperty(g, 'init', { value: u }),
		Object.defineProperty(g, Symbol.hasInstance, {
			value: (I) => {
				if (v?.Parent && I instanceof v.Parent) return !0;
				return I?._zod?.traits?.has(r);
			}
		}),
		Object.defineProperty(g, 'name', { value: r }),
		g
	);
}
var g$ = Symbol('zod_brand');
class or extends Error {
	constructor() {
		super('Encountered Promise during synchronous parse. Use .parseAsync() instead.');
	}
}
class Er extends Error {
	constructor(r) {
		super(`Encountered unidirectional transform during encode: ${r}`);
		this.name = 'ZodEncodeError';
	}
}
(Ro = globalThis).__zod_globalConfig ?? (Ro.__zod_globalConfig = {});
var Yr = globalThis.__zod_globalConfig;
function M(r) {
	if (r) Object.assign(Yr, r);
	return Yr;
}
var z = {};
Dr(z, {
	unwrapMessage: () => Ln,
	uint8ArrayToHex: () => Fl,
	uint8ArrayToBase64url: () => Al,
	uint8ArrayToBase64: () => Zo,
	stringifyPrimitive: () => S,
	slugify: () => b$,
	shallowClone: () => U$,
	safeExtend: () => Ql,
	required: () => Bl,
	randomString: () => Ol,
	propertyKeyTypes: () => On,
	promiseAllObject: () => Xl,
	primitiveTypes: () => l$,
	prefixIssues: () => e,
	pick: () => Yl,
	partial: () => Hl,
	parsedType: () => w,
	optionalKeys: () => k$,
	omit: () => El,
	objectClone: () => Jl,
	numKeys: () => ql,
	nullish: () => Pr,
	normalizeParams: () => N,
	mergeDefs: () => Sr,
	merge: () => Tl,
	jsonStringifyReplacer: () => Fr,
	joinValues: () => k,
	issue: () => Zr,
	isPlainObject: () => Jr,
	isObject: () => Kr,
	hexToUint8Array: () => Rl,
	getSizableOrigin: () => qn,
	getParsedType: () => Wl,
	getLengthableOrigin: () => Wn,
	getEnumValues: () => Gn,
	getElementAtPath: () => Gl,
	floatSafeRemainder: () => o$,
	finalizeIssue: () => y,
	extend: () => Kl,
	explicitlyAborted: () => S$,
	escapeRegex: () => ir,
	esc: () => li,
	defineLazy: () => O,
	createTransparentProxy: () => Vl,
	cloneDef: () => Ll,
	clone: () => m,
	cleanRegex: () => Xn,
	cleanEnum: () => tl,
	captureStackTrace: () => ki,
	cached: () => xr,
	base64urlToUint8Array: () => Ml,
	base64ToUint8Array: () => xo,
	assignProp: () => jr,
	assertNotEqual: () => zl,
	assertNever: () => Pl,
	assertIs: () => Nl,
	assertEqual: () => wl,
	assert: () => jl,
	allowsEval: () => _$,
	aborted: () => Lr,
	NUMBER_FORMAT_RANGES: () => D$,
	Class: () => fo,
	BIGINT_FORMAT_RANGES: () => c$
});
function wl(r) {
	return r;
}
function zl(r) {
	return r;
}
function Nl(r) {}
function Pl(r) {
	throw Error('Unexpected value in exhaustive check');
}
function jl(r) {}
function Gn(r) {
	let i = Object.values(r).filter((u) => typeof u === 'number');
	return Object.entries(r)
		.filter(([u, n]) => i.indexOf(+u) === -1)
		.map(([u, n]) => n);
}
function k(r, i = '|') {
	return r.map((v) => S(v)).join(i);
}
function Fr(r, i) {
	if (typeof i === 'bigint') return i.toString();
	return i;
}
function xr(r) {
	return {
		get value() {
			{
				let v = r();
				return (Object.defineProperty(this, 'value', { value: v }), v);
			}
			throw Error('cached value already set');
		}
	};
}
function Pr(r) {
	return r === null || r === void 0;
}
function Xn(r) {
	let i = r.startsWith('^') ? 1 : 0,
		v = r.endsWith('$') ? r.length - 1 : r.length;
	return r.slice(i, v);
}
function o$(r, i) {
	let v = r / i,
		u = Math.round(v),
		n = Number.EPSILON * Math.max(Math.abs(v), 1);
	if (Math.abs(v - u) < n) return 0;
	return v - u;
}
var Fo = Symbol('evaluating');
function O(r, i, v) {
	let u = void 0;
	Object.defineProperty(r, i, {
		get() {
			if (u === Fo) return;
			if (u === void 0) ((u = Fo), (u = v()));
			return u;
		},
		set(n) {
			Object.defineProperty(r, i, { value: n });
		},
		configurable: !0
	});
}
function Jl(r) {
	return Object.create(Object.getPrototypeOf(r), Object.getOwnPropertyDescriptors(r));
}
function jr(r, i, v) {
	Object.defineProperty(r, i, { value: v, writable: !0, enumerable: !0, configurable: !0 });
}
function Sr(...r) {
	let i = {};
	for (let v of r) {
		let u = Object.getOwnPropertyDescriptors(v);
		Object.assign(i, u);
	}
	return Object.defineProperties({}, i);
}
function Ll(r) {
	return Sr(r._zod.def);
}
function Gl(r, i) {
	if (!i) return r;
	return i.reduce((v, u) => v?.[u], r);
}
function Xl(r) {
	let i = Object.keys(r),
		v = i.map((u) => r[u]);
	return Promise.all(v).then((u) => {
		let n = {};
		for (let $ = 0; $ < i.length; $++) n[i[$]] = u[$];
		return n;
	});
}
function Ol(r = 10) {
	let v = '';
	for (let u = 0; u < r; u++) v += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
	return v;
}
function li(r) {
	return JSON.stringify(r);
}
function b$(r) {
	return r
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
var ki = 'captureStackTrace' in Error ? Error.captureStackTrace : (...r) => {};
function Kr(r) {
	return typeof r === 'object' && r !== null && !Array.isArray(r);
}
var _$ = xr(() => {
	if (Yr.jitless) return !1;
	if (typeof navigator < 'u' && navigator?.userAgent?.includes('Cloudflare')) return !1;
	try {
		return (new Function(''), !0);
	} catch (r) {
		return !1;
	}
});
function Jr(r) {
	if (Kr(r) === !1) return !1;
	let i = r.constructor;
	if (i === void 0) return !0;
	if (typeof i !== 'function') return !0;
	let v = i.prototype;
	if (Kr(v) === !1) return !1;
	if (Object.prototype.hasOwnProperty.call(v, 'isPrototypeOf') === !1) return !1;
	return !0;
}
function U$(r) {
	if (Jr(r)) return { ...r };
	if (Array.isArray(r)) return [...r];
	if (r instanceof Map) return new Map(r);
	if (r instanceof Set) return new Set(r);
	return r;
}
function ql(r) {
	let i = 0;
	for (let v in r) if (Object.prototype.hasOwnProperty.call(r, v)) i++;
	return i;
}
var Wl = (r) => {
		let i = typeof r;
		switch (i) {
			case 'undefined':
				return 'undefined';
			case 'string':
				return 'string';
			case 'number':
				return Number.isNaN(r) ? 'nan' : 'number';
			case 'boolean':
				return 'boolean';
			case 'function':
				return 'function';
			case 'bigint':
				return 'bigint';
			case 'symbol':
				return 'symbol';
			case 'object':
				if (Array.isArray(r)) return 'array';
				if (r === null) return 'null';
				if (r.then && typeof r.then === 'function' && r.catch && typeof r.catch === 'function')
					return 'promise';
				if (typeof Map < 'u' && r instanceof Map) return 'map';
				if (typeof Set < 'u' && r instanceof Set) return 'set';
				if (typeof Date < 'u' && r instanceof Date) return 'date';
				if (typeof File < 'u' && r instanceof File) return 'file';
				return 'object';
			default:
				throw Error(`Unknown data type: ${i}`);
		}
	},
	On = new Set(['string', 'number', 'symbol']),
	l$ = new Set(['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined']);
function ir(r) {
	return r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function m(r, i, v) {
	let u = new r._zod.constr(i ?? r._zod.def);
	if (!i || v?.parent) u._zod.parent = r;
	return u;
}
function N(r) {
	let i = r;
	if (!i) return {};
	if (typeof i === 'string') return { error: () => i };
	if (i?.message !== void 0) {
		if (i?.error !== void 0) throw Error('Cannot specify both `message` and `error` params');
		i.error = i.message;
	}
	if ((delete i.message, typeof i.error === 'string')) return { ...i, error: () => i.error };
	return i;
}
function Vl(r) {
	let i;
	return new Proxy(
		{},
		{
			get(v, u, n) {
				return (i ?? (i = r()), Reflect.get(i, u, n));
			},
			set(v, u, n, $) {
				return (i ?? (i = r()), Reflect.set(i, u, n, $));
			},
			has(v, u) {
				return (i ?? (i = r()), Reflect.has(i, u));
			},
			deleteProperty(v, u) {
				return (i ?? (i = r()), Reflect.deleteProperty(i, u));
			},
			ownKeys(v) {
				return (i ?? (i = r()), Reflect.ownKeys(i));
			},
			getOwnPropertyDescriptor(v, u) {
				return (i ?? (i = r()), Reflect.getOwnPropertyDescriptor(i, u));
			},
			defineProperty(v, u, n) {
				return (i ?? (i = r()), Reflect.defineProperty(i, u, n));
			}
		}
	);
}
function S(r) {
	if (typeof r === 'bigint') return r.toString() + 'n';
	if (typeof r === 'string') return `"${r}"`;
	return `${r}`;
}
function k$(r) {
	return Object.keys(r).filter((i) => {
		return r[i]._zod.optin === 'optional' && r[i]._zod.optout === 'optional';
	});
}
var D$ = {
		safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
		int32: [-2147483648, 2147483647],
		uint32: [0, 4294967295],
		float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
		float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
	},
	c$ = {
		int64: [BigInt('-9223372036854775808'), BigInt('9223372036854775807')],
		uint64: [BigInt(0), BigInt('18446744073709551615')]
	};
function Yl(r, i) {
	let v = r._zod.def,
		u = v.checks;
	if (u && u.length > 0)
		throw Error('.pick() cannot be used on object schemas containing refinements');
	let $ = Sr(r._zod.def, {
		get shape() {
			let g = {};
			for (let I in i) {
				if (!(I in v.shape)) throw Error(`Unrecognized key: "${I}"`);
				if (!i[I]) continue;
				g[I] = v.shape[I];
			}
			return (jr(this, 'shape', g), g);
		},
		checks: []
	});
	return m(r, $);
}
function El(r, i) {
	let v = r._zod.def,
		u = v.checks;
	if (u && u.length > 0)
		throw Error('.omit() cannot be used on object schemas containing refinements');
	let $ = Sr(r._zod.def, {
		get shape() {
			let g = { ...r._zod.def.shape };
			for (let I in i) {
				if (!(I in v.shape)) throw Error(`Unrecognized key: "${I}"`);
				if (!i[I]) continue;
				delete g[I];
			}
			return (jr(this, 'shape', g), g);
		},
		checks: []
	});
	return m(r, $);
}
function Kl(r, i) {
	if (!Jr(i)) throw Error('Invalid input to extend: expected a plain object');
	let v = r._zod.def.checks;
	if (v && v.length > 0) {
		let $ = r._zod.def.shape;
		for (let g in i)
			if (Object.getOwnPropertyDescriptor($, g) !== void 0)
				throw Error(
					'Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.'
				);
	}
	let n = Sr(r._zod.def, {
		get shape() {
			let $ = { ...r._zod.def.shape, ...i };
			return (jr(this, 'shape', $), $);
		}
	});
	return m(r, n);
}
function Ql(r, i) {
	if (!Jr(i)) throw Error('Invalid input to safeExtend: expected a plain object');
	let v = Sr(r._zod.def, {
		get shape() {
			let u = { ...r._zod.def.shape, ...i };
			return (jr(this, 'shape', u), u);
		}
	});
	return m(r, v);
}
function Tl(r, i) {
	if (r._zod.def.checks?.length)
		throw Error(
			'.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.'
		);
	let v = Sr(r._zod.def, {
		get shape() {
			let u = { ...r._zod.def.shape, ...i._zod.def.shape };
			return (jr(this, 'shape', u), u);
		},
		get catchall() {
			return i._zod.def.catchall;
		},
		checks: i._zod.def.checks ?? []
	});
	return m(r, v);
}
function Hl(r, i, v) {
	let n = i._zod.def.checks;
	if (n && n.length > 0)
		throw Error('.partial() cannot be used on object schemas containing refinements');
	let g = Sr(i._zod.def, {
		get shape() {
			let I = i._zod.def.shape,
				b = { ...I };
			if (v)
				for (let o in v) {
					if (!(o in I)) throw Error(`Unrecognized key: "${o}"`);
					if (!v[o]) continue;
					b[o] = r ? new r({ type: 'optional', innerType: I[o] }) : I[o];
				}
			else for (let o in I) b[o] = r ? new r({ type: 'optional', innerType: I[o] }) : I[o];
			return (jr(this, 'shape', b), b);
		},
		checks: []
	});
	return m(i, g);
}
function Bl(r, i, v) {
	let u = Sr(i._zod.def, {
		get shape() {
			let n = i._zod.def.shape,
				$ = { ...n };
			if (v)
				for (let g in v) {
					if (!(g in $)) throw Error(`Unrecognized key: "${g}"`);
					if (!v[g]) continue;
					$[g] = new r({ type: 'nonoptional', innerType: n[g] });
				}
			else for (let g in n) $[g] = new r({ type: 'nonoptional', innerType: n[g] });
			return (jr(this, 'shape', $), $);
		}
	});
	return m(i, u);
}
function Lr(r, i = 0) {
	if (r.aborted === !0) return !0;
	for (let v = i; v < r.issues.length; v++) if (r.issues[v]?.continue !== !0) return !0;
	return !1;
}
function S$(r, i = 0) {
	if (r.aborted === !0) return !0;
	for (let v = i; v < r.issues.length; v++) if (r.issues[v]?.continue === !1) return !0;
	return !1;
}
function e(r, i) {
	return i.map((v) => {
		var u;
		return ((u = v).path ?? (u.path = []), v.path.unshift(r), v);
	});
}
function Ln(r) {
	return typeof r === 'string' ? r : r?.message;
}
function y(r, i, v) {
	let u = r.message
			? r.message
			: (Ln(r.inst?._zod.def?.error?.(r)) ??
				Ln(i?.error?.(r)) ??
				Ln(v.customError?.(r)) ??
				Ln(v.localeError?.(r)) ??
				'Invalid input'),
		{ inst: n, continue: $, input: g, ...I } = r;
	if ((I.path ?? (I.path = []), (I.message = u), i?.reportInput)) I.input = g;
	return I;
}
function qn(r) {
	if (r instanceof Set) return 'set';
	if (r instanceof Map) return 'map';
	if (r instanceof File) return 'file';
	return 'unknown';
}
function Wn(r) {
	if (Array.isArray(r)) return 'array';
	if (typeof r === 'string') return 'string';
	return 'unknown';
}
function w(r) {
	let i = typeof r;
	switch (i) {
		case 'number':
			return Number.isNaN(r) ? 'nan' : 'number';
		case 'object': {
			if (r === null) return 'null';
			if (Array.isArray(r)) return 'array';
			let v = r;
			if (v && Object.getPrototypeOf(v) !== Object.prototype && 'constructor' in v && v.constructor)
				return v.constructor.name;
		}
	}
	return i;
}
function Zr(...r) {
	let [i, v, u] = r;
	if (typeof i === 'string') return { message: i, code: 'custom', input: v, inst: u };
	return { ...i };
}
function tl(r) {
	return Object.entries(r)
		.filter(([i, v]) => {
			return Number.isNaN(Number.parseInt(i, 10));
		})
		.map((i) => i[1]);
}
function xo(r) {
	let i = atob(r),
		v = new Uint8Array(i.length);
	for (let u = 0; u < i.length; u++) v[u] = i.charCodeAt(u);
	return v;
}
function Zo(r) {
	let i = '';
	for (let v = 0; v < r.length; v++) i += String.fromCharCode(r[v]);
	return btoa(i);
}
function Ml(r) {
	let i = r.replace(/-/g, '+').replace(/_/g, '/'),
		v = '='.repeat((4 - (i.length % 4)) % 4);
	return xo(i + v);
}
function Al(r) {
	return Zo(r).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function Rl(r) {
	let i = r.replace(/^0x/, '');
	if (i.length % 2 !== 0) throw Error('Invalid hex string length');
	let v = new Uint8Array(i.length / 2);
	for (let u = 0; u < i.length; u += 2) v[u / 2] = Number.parseInt(i.slice(u, u + 2), 16);
	return v;
}
function Fl(r) {
	return Array.from(r)
		.map((i) => i.toString(16).padStart(2, '0'))
		.join('');
}
class fo {
	constructor(...r) {}
}
var Co = (r, i) => {
		((r.name = '$ZodError'),
			Object.defineProperty(r, '_zod', { value: r._zod, enumerable: !1 }),
			Object.defineProperty(r, 'issues', { value: i, enumerable: !1 }),
			(r.message = JSON.stringify(i, Fr, 2)),
			Object.defineProperty(r, 'toString', { value: () => r.message, enumerable: !1 }));
	},
	Vn = U('$ZodError', Co),
	a = U('$ZodError', Co, { Parent: Error });
function Yn(r, i = (v) => v.message) {
	let v = {},
		u = [];
	for (let n of r.issues)
		if (n.path.length > 0) ((v[n.path[0]] = v[n.path[0]] || []), v[n.path[0]].push(i(n)));
		else u.push(i(n));
	return { formErrors: u, fieldErrors: v };
}
function En(r, i = (v) => v.message) {
	let v = { _errors: [] },
		u = (n, $ = []) => {
			for (let g of n.issues)
				if (g.code === 'invalid_union' && g.errors.length)
					g.errors.map((I) => u({ issues: I }, [...$, ...g.path]));
				else if (g.code === 'invalid_key') u({ issues: g.issues }, [...$, ...g.path]);
				else if (g.code === 'invalid_element') u({ issues: g.issues }, [...$, ...g.path]);
				else {
					let I = [...$, ...g.path];
					if (I.length === 0) v._errors.push(i(g));
					else {
						let b = v,
							o = 0;
						while (o < I.length) {
							let _ = I[o];
							if (o !== I.length - 1) b[_] = b[_] || { _errors: [] };
							else ((b[_] = b[_] || { _errors: [] }), b[_]._errors.push(i(g)));
							((b = b[_]), o++);
						}
					}
				}
		};
	return (u(r), v);
}
function w$(r, i = (v) => v.message) {
	let v = { errors: [] },
		u = (n, $ = []) => {
			var g, I;
			for (let b of n.issues)
				if (b.code === 'invalid_union' && b.errors.length)
					b.errors.map((o) => u({ issues: o }, [...$, ...b.path]));
				else if (b.code === 'invalid_key') u({ issues: b.issues }, [...$, ...b.path]);
				else if (b.code === 'invalid_element') u({ issues: b.issues }, [...$, ...b.path]);
				else {
					let o = [...$, ...b.path];
					if (o.length === 0) {
						v.errors.push(i(b));
						continue;
					}
					let _ = v,
						l = 0;
					while (l < o.length) {
						let D = o[l],
							c = l === o.length - 1;
						if (typeof D === 'string')
							(_.properties ?? (_.properties = {}),
								(g = _.properties)[D] ?? (g[D] = { errors: [] }),
								(_ = _.properties[D]));
						else
							(_.items ?? (_.items = []),
								(I = _.items)[D] ?? (I[D] = { errors: [] }),
								(_ = _.items[D]));
						if (c) _.errors.push(i(b));
						l++;
					}
				}
		};
	return (u(r), v);
}
function mo(r) {
	let i = [],
		v = r.map((u) => (typeof u === 'object' ? u.key : u));
	for (let u of v)
		if (typeof u === 'number') i.push(`[${u}]`);
		else if (typeof u === 'symbol') i.push(`[${JSON.stringify(String(u))}]`);
		else if (/[^\w$]/.test(u)) i.push(`[${JSON.stringify(u)}]`);
		else {
			if (i.length) i.push('.');
			i.push(u);
		}
	return i.join('');
}
function z$(r) {
	let i = [],
		v = [...r.issues].sort((u, n) => (u.path ?? []).length - (n.path ?? []).length);
	for (let u of v) if ((i.push(`✖ ${u.message}`), u.path?.length)) i.push(`  → at ${mo(u.path)}`);
	return i.join(`
`);
}
var fr = (r) => (i, v, u, n) => {
		let $ = u ? { ...u, async: !1 } : { async: !1 },
			g = i._zod.run({ value: v, issues: [] }, $);
		if (g instanceof Promise) throw new or();
		if (g.issues.length) {
			let I = new (n?.Err ?? r)(g.issues.map((b) => y(b, $, M())));
			throw (ki(I, n?.callee), I);
		}
		return g.value;
	},
	Di = fr(a),
	Cr = (r) => async (i, v, u, n) => {
		let $ = u ? { ...u, async: !0 } : { async: !0 },
			g = i._zod.run({ value: v, issues: [] }, $);
		if (g instanceof Promise) g = await g;
		if (g.issues.length) {
			let I = new (n?.Err ?? r)(g.issues.map((b) => y(b, $, M())));
			throw (ki(I, n?.callee), I);
		}
		return g.value;
	},
	ci = Cr(a),
	mr = (r) => (i, v, u) => {
		let n = u ? { ...u, async: !1 } : { async: !1 },
			$ = i._zod.run({ value: v, issues: [] }, n);
		if ($ instanceof Promise) throw new or();
		return $.issues.length
			? { success: !1, error: new (r ?? Vn)($.issues.map((g) => y(g, n, M()))) }
			: { success: !0, data: $.value };
	},
	N$ = mr(a),
	yr = (r) => async (i, v, u) => {
		let n = u ? { ...u, async: !0 } : { async: !0 },
			$ = i._zod.run({ value: v, issues: [] }, n);
		if ($ instanceof Promise) $ = await $;
		return $.issues.length
			? { success: !1, error: new r($.issues.map((g) => y(g, n, M()))) }
			: { success: !0, data: $.value };
	},
	P$ = yr(a),
	Si = (r) => (i, v, u) => {
		let n = u ? { ...u, direction: 'backward' } : { direction: 'backward' };
		return fr(r)(i, v, n);
	},
	Zl = Si(a),
	wi = (r) => (i, v, u) => {
		return fr(r)(i, v, u);
	},
	fl = wi(a),
	zi = (r) => async (i, v, u) => {
		let n = u ? { ...u, direction: 'backward' } : { direction: 'backward' };
		return Cr(r)(i, v, n);
	},
	Cl = zi(a),
	Ni = (r) => async (i, v, u) => {
		return Cr(r)(i, v, u);
	},
	ml = Ni(a),
	Pi = (r) => (i, v, u) => {
		let n = u ? { ...u, direction: 'backward' } : { direction: 'backward' };
		return mr(r)(i, v, n);
	},
	yl = Pi(a),
	ji = (r) => (i, v, u) => {
		return mr(r)(i, v, u);
	},
	dl = ji(a),
	Ji = (r) => async (i, v, u) => {
		let n = u ? { ...u, direction: 'backward' } : { direction: 'backward' };
		return yr(r)(i, v, n);
	},
	hl = Ji(a),
	Li = (r) => async (i, v, u) => {
		return yr(r)(i, v, u);
	},
	el = Li(a);
var s = {};
Dr(s, {
	xid: () => G$,
	uuid7: () => r1,
	uuid6: () => sl,
	uuid4: () => pl,
	uuid: () => Qr,
	uppercase: () => h$,
	unicodeEmail: () => yo,
	undefined: () => y$,
	ulid: () => L$,
	time: () => R$,
	string: () => x$,
	sha512_hex: () => j1,
	sha512_base64url: () => L1,
	sha512_base64: () => J1,
	sha384_hex: () => z1,
	sha384_base64url: () => P1,
	sha384_base64: () => N1,
	sha256_hex: () => c1,
	sha256_base64url: () => w1,
	sha256_base64: () => S1,
	sha1_hex: () => l1,
	sha1_base64url: () => D1,
	sha1_base64: () => k1,
	rfc5322Email: () => i1,
	number: () => Kn,
	null: () => m$,
	nanoid: () => O$,
	md5_hex: () => b1,
	md5_base64url: () => U1,
	md5_base64: () => _1,
	mac: () => Q$,
	lowercase: () => d$,
	ksuid: () => X$,
	ipv6: () => K$,
	ipv4: () => E$,
	integer: () => f$,
	idnEmail: () => v1,
	httpProtocol: () => t$,
	html5Email: () => n1,
	hostname: () => g1,
	hex: () => o1,
	guid: () => W$,
	extendedDuration: () => al,
	emoji: () => Y$,
	email: () => V$,
	e164: () => M$,
	duration: () => q$,
	domain: () => I1,
	datetime: () => F$,
	date: () => A$,
	cuid2: () => J$,
	cuid: () => j$,
	cidrv6: () => H$,
	cidrv4: () => T$,
	browserEmail: () => $1,
	boolean: () => C$,
	bigint: () => Z$,
	base64url: () => Gi,
	base64: () => B$
});
var j$ = /^[cC][0-9a-z]{6,}$/,
	J$ = /^[0-9a-z]+$/,
	L$ = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,
	G$ = /^[0-9a-vA-V]{20}$/,
	X$ = /^[A-Za-z0-9]{27}$/,
	O$ = /^[a-zA-Z0-9_-]{21}$/,
	q$ =
		/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,
	al =
		/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
	W$ = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
	Qr = (r) => {
		if (!r)
			return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
		return new RegExp(
			`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${r}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`
		);
	},
	pl = Qr(4),
	sl = Qr(6),
	r1 = Qr(7),
	V$ =
		/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
	n1 =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
	i1 =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	yo = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u,
	v1 = yo,
	$1 =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
	u1 = '^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$';
function Y$() {
	return new RegExp(u1, 'u');
}
var E$ =
		/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
	K$ =
		/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
	Q$ = (r) => {
		let i = ir(r ?? ':');
		return new RegExp(`^(?:[0-9A-F]{2}${i}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${i}){5}[0-9a-f]{2}$`);
	},
	T$ =
		/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
	H$ =
		/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
	B$ = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,
	Gi = /^[A-Za-z0-9_-]*$/,
	g1 =
		/^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/,
	I1 = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
	t$ = /^https?$/,
	M$ = /^\+[1-9]\d{6,14}$/,
	ho =
		'(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))',
	A$ = new RegExp(`^${ho}$`);
function eo(r) {
	return typeof r.precision === 'number'
		? r.precision === -1
			? '(?:[01]\\d|2[0-3]):[0-5]\\d'
			: r.precision === 0
				? '(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d'
				: `(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{${r.precision}}`
		: '(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?';
}
function R$(r) {
	return new RegExp(`^${eo(r)}$`);
}
function F$(r) {
	let i = eo({ precision: r.precision }),
		v = ['Z'];
	if (r.local) v.push('');
	if (r.offset) v.push('([+-](?:[01]\\d|2[0-3]):[0-5]\\d)');
	let u = `${i}(?:${v.join('|')})`;
	return new RegExp(`^${ho}T(?:${u})$`);
}
var x$ = (r) => {
		let i = r ? `[\\s\\S]{${r?.minimum ?? 0},${r?.maximum ?? ''}}` : '[\\s\\S]*';
		return new RegExp(`^${i}$`);
	},
	Z$ = /^-?\d+n?$/,
	f$ = /^-?\d+$/,
	Kn = /^-?\d+(?:\.\d+)?$/,
	C$ = /^(?:true|false)$/i,
	m$ = /^null$/i;
var y$ = /^undefined$/i;
var d$ = /^[^A-Z]*$/,
	h$ = /^[^a-z]*$/,
	o1 = /^[0-9a-fA-F]*$/;
function Qn(r, i) {
	return new RegExp(`^[A-Za-z0-9+/]{${r}}${i}$`);
}
function Tn(r) {
	return new RegExp(`^[A-Za-z0-9_-]{${r}}$`);
}
var b1 = /^[0-9a-fA-F]{32}$/,
	_1 = Qn(22, '=='),
	U1 = Tn(22),
	l1 = /^[0-9a-fA-F]{40}$/,
	k1 = Qn(27, '='),
	D1 = Tn(27),
	c1 = /^[0-9a-fA-F]{64}$/,
	S1 = Qn(43, '='),
	w1 = Tn(43),
	z1 = /^[0-9a-fA-F]{96}$/,
	N1 = Qn(64, ''),
	P1 = Tn(64),
	j1 = /^[0-9a-fA-F]{128}$/,
	J1 = Qn(86, '=='),
	L1 = Tn(86);
var H = U('$ZodCheck', (r, i) => {
		var v;
		(r._zod ?? (r._zod = {}), (r._zod.def = i), (v = r._zod).onattach ?? (v.onattach = []));
	}),
	po = { number: 'number', bigint: 'bigint', object: 'date' },
	Xi = U('$ZodCheckLessThan', (r, i) => {
		H.init(r, i);
		let v = po[typeof i.value];
		(r._zod.onattach.push((u) => {
			let n = u._zod.bag,
				$ = (i.inclusive ? n.maximum : n.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
			if (i.value < $)
				if (i.inclusive) n.maximum = i.value;
				else n.exclusiveMaximum = i.value;
		}),
			(r._zod.check = (u) => {
				if (i.inclusive ? u.value <= i.value : u.value < i.value) return;
				u.issues.push({
					origin: v,
					code: 'too_big',
					maximum: typeof i.value === 'object' ? i.value.getTime() : i.value,
					input: u.value,
					inclusive: i.inclusive,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	Oi = U('$ZodCheckGreaterThan', (r, i) => {
		H.init(r, i);
		let v = po[typeof i.value];
		(r._zod.onattach.push((u) => {
			let n = u._zod.bag,
				$ = (i.inclusive ? n.minimum : n.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
			if (i.value > $)
				if (i.inclusive) n.minimum = i.value;
				else n.exclusiveMinimum = i.value;
		}),
			(r._zod.check = (u) => {
				if (i.inclusive ? u.value >= i.value : u.value > i.value) return;
				u.issues.push({
					origin: v,
					code: 'too_small',
					minimum: typeof i.value === 'object' ? i.value.getTime() : i.value,
					input: u.value,
					inclusive: i.inclusive,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	e$ = U('$ZodCheckMultipleOf', (r, i) => {
		(H.init(r, i),
			r._zod.onattach.push((v) => {
				var u;
				(u = v._zod.bag).multipleOf ?? (u.multipleOf = i.value);
			}),
			(r._zod.check = (v) => {
				if (typeof v.value !== typeof i.value)
					throw Error('Cannot mix number and bigint in multiple_of check.');
				if (
					typeof v.value === 'bigint' ? v.value % i.value === BigInt(0) : o$(v.value, i.value) === 0
				)
					return;
				v.issues.push({
					origin: typeof v.value,
					code: 'not_multiple_of',
					divisor: i.value,
					input: v.value,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	a$ = U('$ZodCheckNumberFormat', (r, i) => {
		(H.init(r, i), (i.format = i.format || 'float64'));
		let v = i.format?.includes('int'),
			u = v ? 'int' : 'number',
			[n, $] = D$[i.format];
		(r._zod.onattach.push((g) => {
			let I = g._zod.bag;
			if (((I.format = i.format), (I.minimum = n), (I.maximum = $), v)) I.pattern = f$;
		}),
			(r._zod.check = (g) => {
				let I = g.value;
				if (v) {
					if (!Number.isInteger(I)) {
						g.issues.push({
							expected: u,
							format: i.format,
							code: 'invalid_type',
							continue: !1,
							input: I,
							inst: r
						});
						return;
					}
					if (!Number.isSafeInteger(I)) {
						if (I > 0)
							g.issues.push({
								input: I,
								code: 'too_big',
								maximum: Number.MAX_SAFE_INTEGER,
								note: 'Integers must be within the safe integer range.',
								inst: r,
								origin: u,
								inclusive: !0,
								continue: !i.abort
							});
						else
							g.issues.push({
								input: I,
								code: 'too_small',
								minimum: Number.MIN_SAFE_INTEGER,
								note: 'Integers must be within the safe integer range.',
								inst: r,
								origin: u,
								inclusive: !0,
								continue: !i.abort
							});
						return;
					}
				}
				if (I < n)
					g.issues.push({
						origin: 'number',
						input: I,
						code: 'too_small',
						minimum: n,
						inclusive: !0,
						inst: r,
						continue: !i.abort
					});
				if (I > $)
					g.issues.push({
						origin: 'number',
						input: I,
						code: 'too_big',
						maximum: $,
						inclusive: !0,
						inst: r,
						continue: !i.abort
					});
			}));
	}),
	p$ = U('$ZodCheckBigIntFormat', (r, i) => {
		H.init(r, i);
		let [v, u] = c$[i.format];
		(r._zod.onattach.push((n) => {
			let $ = n._zod.bag;
			(($.format = i.format), ($.minimum = v), ($.maximum = u));
		}),
			(r._zod.check = (n) => {
				let $ = n.value;
				if ($ < v)
					n.issues.push({
						origin: 'bigint',
						input: $,
						code: 'too_small',
						minimum: v,
						inclusive: !0,
						inst: r,
						continue: !i.abort
					});
				if ($ > u)
					n.issues.push({
						origin: 'bigint',
						input: $,
						code: 'too_big',
						maximum: u,
						inclusive: !0,
						inst: r,
						continue: !i.abort
					});
			}));
	}),
	s$ = U('$ZodCheckMaxSize', (r, i) => {
		var v;
		(H.init(r, i),
			(v = r._zod.def).when ??
				(v.when = (u) => {
					let n = u.value;
					return !Pr(n) && n.size !== void 0;
				}),
			r._zod.onattach.push((u) => {
				let n = u._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (i.maximum < n) u._zod.bag.maximum = i.maximum;
			}),
			(r._zod.check = (u) => {
				let n = u.value;
				if (n.size <= i.maximum) return;
				u.issues.push({
					origin: qn(n),
					code: 'too_big',
					maximum: i.maximum,
					inclusive: !0,
					input: n,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	ru = U('$ZodCheckMinSize', (r, i) => {
		var v;
		(H.init(r, i),
			(v = r._zod.def).when ??
				(v.when = (u) => {
					let n = u.value;
					return !Pr(n) && n.size !== void 0;
				}),
			r._zod.onattach.push((u) => {
				let n = u._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (i.minimum > n) u._zod.bag.minimum = i.minimum;
			}),
			(r._zod.check = (u) => {
				let n = u.value;
				if (n.size >= i.minimum) return;
				u.issues.push({
					origin: qn(n),
					code: 'too_small',
					minimum: i.minimum,
					inclusive: !0,
					input: n,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	nu = U('$ZodCheckSizeEquals', (r, i) => {
		var v;
		(H.init(r, i),
			(v = r._zod.def).when ??
				(v.when = (u) => {
					let n = u.value;
					return !Pr(n) && n.size !== void 0;
				}),
			r._zod.onattach.push((u) => {
				let n = u._zod.bag;
				((n.minimum = i.size), (n.maximum = i.size), (n.size = i.size));
			}),
			(r._zod.check = (u) => {
				let n = u.value,
					$ = n.size;
				if ($ === i.size) return;
				let g = $ > i.size;
				u.issues.push({
					origin: qn(n),
					...(g ? { code: 'too_big', maximum: i.size } : { code: 'too_small', minimum: i.size }),
					inclusive: !0,
					exact: !0,
					input: u.value,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	iu = U('$ZodCheckMaxLength', (r, i) => {
		var v;
		(H.init(r, i),
			(v = r._zod.def).when ??
				(v.when = (u) => {
					let n = u.value;
					return !Pr(n) && n.length !== void 0;
				}),
			r._zod.onattach.push((u) => {
				let n = u._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (i.maximum < n) u._zod.bag.maximum = i.maximum;
			}),
			(r._zod.check = (u) => {
				let n = u.value;
				if (n.length <= i.maximum) return;
				let g = Wn(n);
				u.issues.push({
					origin: g,
					code: 'too_big',
					maximum: i.maximum,
					inclusive: !0,
					input: n,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	vu = U('$ZodCheckMinLength', (r, i) => {
		var v;
		(H.init(r, i),
			(v = r._zod.def).when ??
				(v.when = (u) => {
					let n = u.value;
					return !Pr(n) && n.length !== void 0;
				}),
			r._zod.onattach.push((u) => {
				let n = u._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (i.minimum > n) u._zod.bag.minimum = i.minimum;
			}),
			(r._zod.check = (u) => {
				let n = u.value;
				if (n.length >= i.minimum) return;
				let g = Wn(n);
				u.issues.push({
					origin: g,
					code: 'too_small',
					minimum: i.minimum,
					inclusive: !0,
					input: n,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	$u = U('$ZodCheckLengthEquals', (r, i) => {
		var v;
		(H.init(r, i),
			(v = r._zod.def).when ??
				(v.when = (u) => {
					let n = u.value;
					return !Pr(n) && n.length !== void 0;
				}),
			r._zod.onattach.push((u) => {
				let n = u._zod.bag;
				((n.minimum = i.length), (n.maximum = i.length), (n.length = i.length));
			}),
			(r._zod.check = (u) => {
				let n = u.value,
					$ = n.length;
				if ($ === i.length) return;
				let g = Wn(n),
					I = $ > i.length;
				u.issues.push({
					origin: g,
					...(I
						? { code: 'too_big', maximum: i.length }
						: { code: 'too_small', minimum: i.length }),
					inclusive: !0,
					exact: !0,
					input: u.value,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	dr = U('$ZodCheckStringFormat', (r, i) => {
		var v, u;
		if (
			(H.init(r, i),
			r._zod.onattach.push((n) => {
				let $ = n._zod.bag;
				if ((($.format = i.format), i.pattern))
					($.patterns ?? ($.patterns = new Set()), $.patterns.add(i.pattern));
			}),
			i.pattern)
		)
			(v = r._zod).check ??
				(v.check = (n) => {
					if (((i.pattern.lastIndex = 0), i.pattern.test(n.value))) return;
					n.issues.push({
						origin: 'string',
						code: 'invalid_format',
						format: i.format,
						input: n.value,
						...(i.pattern ? { pattern: i.pattern.toString() } : {}),
						inst: r,
						continue: !i.abort
					});
				});
		else (u = r._zod).check ?? (u.check = () => {});
	}),
	uu = U('$ZodCheckRegex', (r, i) => {
		(dr.init(r, i),
			(r._zod.check = (v) => {
				if (((i.pattern.lastIndex = 0), i.pattern.test(v.value))) return;
				v.issues.push({
					origin: 'string',
					code: 'invalid_format',
					format: 'regex',
					input: v.value,
					pattern: i.pattern.toString(),
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	gu = U('$ZodCheckLowerCase', (r, i) => {
		(i.pattern ?? (i.pattern = d$), dr.init(r, i));
	}),
	Iu = U('$ZodCheckUpperCase', (r, i) => {
		(i.pattern ?? (i.pattern = h$), dr.init(r, i));
	}),
	ou = U('$ZodCheckIncludes', (r, i) => {
		H.init(r, i);
		let v = ir(i.includes),
			u = new RegExp(typeof i.position === 'number' ? `^.{${i.position}}${v}` : v);
		((i.pattern = u),
			r._zod.onattach.push((n) => {
				let $ = n._zod.bag;
				($.patterns ?? ($.patterns = new Set()), $.patterns.add(u));
			}),
			(r._zod.check = (n) => {
				if (n.value.includes(i.includes, i.position)) return;
				n.issues.push({
					origin: 'string',
					code: 'invalid_format',
					format: 'includes',
					includes: i.includes,
					input: n.value,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	bu = U('$ZodCheckStartsWith', (r, i) => {
		H.init(r, i);
		let v = new RegExp(`^${ir(i.prefix)}.*`);
		(i.pattern ?? (i.pattern = v),
			r._zod.onattach.push((u) => {
				let n = u._zod.bag;
				(n.patterns ?? (n.patterns = new Set()), n.patterns.add(v));
			}),
			(r._zod.check = (u) => {
				if (u.value.startsWith(i.prefix)) return;
				u.issues.push({
					origin: 'string',
					code: 'invalid_format',
					format: 'starts_with',
					prefix: i.prefix,
					input: u.value,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	_u = U('$ZodCheckEndsWith', (r, i) => {
		H.init(r, i);
		let v = new RegExp(`.*${ir(i.suffix)}$`);
		(i.pattern ?? (i.pattern = v),
			r._zod.onattach.push((u) => {
				let n = u._zod.bag;
				(n.patterns ?? (n.patterns = new Set()), n.patterns.add(v));
			}),
			(r._zod.check = (u) => {
				if (u.value.endsWith(i.suffix)) return;
				u.issues.push({
					origin: 'string',
					code: 'invalid_format',
					format: 'ends_with',
					suffix: i.suffix,
					input: u.value,
					inst: r,
					continue: !i.abort
				});
			}));
	});
function ao(r, i, v) {
	if (r.issues.length) i.issues.push(...e(v, r.issues));
}
var Uu = U('$ZodCheckProperty', (r, i) => {
		(H.init(r, i),
			(r._zod.check = (v) => {
				let u = i.schema._zod.run({ value: v.value[i.property], issues: [] }, {});
				if (u instanceof Promise) return u.then((n) => ao(n, v, i.property));
				ao(u, v, i.property);
				return;
			}));
	}),
	lu = U('$ZodCheckMimeType', (r, i) => {
		H.init(r, i);
		let v = new Set(i.mime);
		(r._zod.onattach.push((u) => {
			u._zod.bag.mime = i.mime;
		}),
			(r._zod.check = (u) => {
				if (v.has(u.value.type)) return;
				u.issues.push({
					code: 'invalid_value',
					values: i.mime,
					input: u.value.type,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	ku = U('$ZodCheckOverwrite', (r, i) => {
		(H.init(r, i),
			(r._zod.check = (v) => {
				v.value = i.tx(v.value);
			}));
	});
class qi {
	constructor(r = []) {
		if (((this.content = []), (this.indent = 0), this)) this.args = r;
	}
	indented(r) {
		((this.indent += 1), r(this), (this.indent -= 1));
	}
	write(r) {
		if (typeof r === 'function') {
			(r(this, { execution: 'sync' }), r(this, { execution: 'async' }));
			return;
		}
		let v = r
				.split(
					`
`
				)
				.filter(($) => $),
			u = Math.min(...v.map(($) => $.length - $.trimStart().length)),
			n = v.map(($) => $.slice(u)).map(($) => ' '.repeat(this.indent * 2) + $);
		for (let $ of n) this.content.push($);
	}
	compile() {
		let r = Function,
			i = this?.args,
			u = [...(this?.content ?? ['']).map((n) => `  ${n}`)];
		return new r(
			...i,
			u.join(`
`)
		);
	}
}
var Du = { major: 4, minor: 4, patch: 1 };
var G = U('$ZodType', (r, i) => {
		var v;
		(r ?? (r = {}), (r._zod.def = i), (r._zod.bag = r._zod.bag || {}), (r._zod.version = Du));
		let u = [...(r._zod.def.checks ?? [])];
		if (r._zod.traits.has('$ZodCheck')) u.unshift(r);
		for (let n of u) for (let $ of n._zod.onattach) $(r);
		if (u.length === 0)
			((v = r._zod).deferred ?? (v.deferred = []),
				r._zod.deferred?.push(() => {
					r._zod.run = r._zod.parse;
				}));
		else {
			let n = (g, I, b) => {
					let o = Lr(g),
						_;
					for (let l of I) {
						if (l._zod.def.when) {
							if (S$(g)) continue;
							if (!l._zod.def.when(g)) continue;
						} else if (o) continue;
						let D = g.issues.length,
							c = l._zod.check(g);
						if (c instanceof Promise && b?.async === !1) throw new or();
						if (_ || c instanceof Promise)
							_ = (_ ?? Promise.resolve()).then(async () => {
								if ((await c, g.issues.length === D)) return;
								if (!o) o = Lr(g, D);
							});
						else {
							if (g.issues.length === D) continue;
							if (!o) o = Lr(g, D);
						}
					}
					if (_)
						return _.then(() => {
							return g;
						});
					return g;
				},
				$ = (g, I, b) => {
					if (Lr(g)) return ((g.aborted = !0), g);
					let o = n(I, u, b);
					if (o instanceof Promise) {
						if (b.async === !1) throw new or();
						return o.then((_) => r._zod.parse(_, b));
					}
					return r._zod.parse(o, b);
				};
			r._zod.run = (g, I) => {
				if (I.skipChecks) return r._zod.parse(g, I);
				if (I.direction === 'backward') {
					let o = r._zod.parse({ value: g.value, issues: [] }, { ...I, skipChecks: !0 });
					if (o instanceof Promise)
						return o.then((_) => {
							return $(_, g, I);
						});
					return $(o, g, I);
				}
				let b = r._zod.parse(g, I);
				if (b instanceof Promise) {
					if (I.async === !1) throw new or();
					return b.then((o) => n(o, u, I));
				}
				return n(b, u, I);
			};
		}
		O(r, '~standard', () => ({
			validate: (n) => {
				try {
					let $ = N$(r, n);
					return $.success ? { value: $.data } : { issues: $.error?.issues };
				} catch ($) {
					return P$(r, n).then((g) =>
						g.success ? { value: g.data } : { issues: g.error?.issues }
					);
				}
			},
			vendor: 'zod',
			version: 1
		}));
	}),
	Tr = U('$ZodString', (r, i) => {
		(G.init(r, i),
			(r._zod.pattern = [...(r?._zod.bag?.patterns ?? [])].pop() ?? x$(r._zod.bag)),
			(r._zod.parse = (v, u) => {
				if (i.coerce)
					try {
						v.value = String(v.value);
					} catch (n) {}
				if (typeof v.value === 'string') return v;
				return (
					v.issues.push({ expected: 'string', code: 'invalid_type', input: v.value, inst: r }),
					v
				);
			}));
	}),
	E = U('$ZodStringFormat', (r, i) => {
		(dr.init(r, i), Tr.init(r, i));
	}),
	Su = U('$ZodGUID', (r, i) => {
		(i.pattern ?? (i.pattern = W$), E.init(r, i));
	}),
	wu = U('$ZodUUID', (r, i) => {
		if (i.version) {
			let u = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[i.version];
			if (u === void 0) throw Error(`Invalid UUID version: "${i.version}"`);
			i.pattern ?? (i.pattern = Qr(u));
		} else i.pattern ?? (i.pattern = Qr());
		E.init(r, i);
	}),
	zu = U('$ZodEmail', (r, i) => {
		(i.pattern ?? (i.pattern = V$), E.init(r, i));
	}),
	Nu = U('$ZodURL', (r, i) => {
		(E.init(r, i),
			(r._zod.check = (v) => {
				try {
					let u = v.value.trim();
					if (!i.normalize && i.protocol?.source === t$.source) {
						if (!/^https?:\/\//i.test(u)) {
							v.issues.push({
								code: 'invalid_format',
								format: 'url',
								note: 'Invalid URL format',
								input: v.value,
								inst: r,
								continue: !i.abort
							});
							return;
						}
					}
					let n = new URL(u);
					if (i.hostname) {
						if (((i.hostname.lastIndex = 0), !i.hostname.test(n.hostname)))
							v.issues.push({
								code: 'invalid_format',
								format: 'url',
								note: 'Invalid hostname',
								pattern: i.hostname.source,
								input: v.value,
								inst: r,
								continue: !i.abort
							});
					}
					if (i.protocol) {
						if (
							((i.protocol.lastIndex = 0),
							!i.protocol.test(n.protocol.endsWith(':') ? n.protocol.slice(0, -1) : n.protocol))
						)
							v.issues.push({
								code: 'invalid_format',
								format: 'url',
								note: 'Invalid protocol',
								pattern: i.protocol.source,
								input: v.value,
								inst: r,
								continue: !i.abort
							});
					}
					if (i.normalize) v.value = n.href;
					else v.value = u;
					return;
				} catch (u) {
					v.issues.push({
						code: 'invalid_format',
						format: 'url',
						input: v.value,
						inst: r,
						continue: !i.abort
					});
				}
			}));
	}),
	Pu = U('$ZodEmoji', (r, i) => {
		(i.pattern ?? (i.pattern = Y$()), E.init(r, i));
	}),
	ju = U('$ZodNanoID', (r, i) => {
		(i.pattern ?? (i.pattern = O$), E.init(r, i));
	}),
	Ju = U('$ZodCUID', (r, i) => {
		(i.pattern ?? (i.pattern = j$), E.init(r, i));
	}),
	Lu = U('$ZodCUID2', (r, i) => {
		(i.pattern ?? (i.pattern = J$), E.init(r, i));
	}),
	Gu = U('$ZodULID', (r, i) => {
		(i.pattern ?? (i.pattern = L$), E.init(r, i));
	}),
	Xu = U('$ZodXID', (r, i) => {
		(i.pattern ?? (i.pattern = G$), E.init(r, i));
	}),
	Ou = U('$ZodKSUID', (r, i) => {
		(i.pattern ?? (i.pattern = X$), E.init(r, i));
	}),
	qu = U('$ZodISODateTime', (r, i) => {
		(i.pattern ?? (i.pattern = F$(i)), E.init(r, i));
	}),
	Wu = U('$ZodISODate', (r, i) => {
		(i.pattern ?? (i.pattern = A$), E.init(r, i));
	}),
	Vu = U('$ZodISOTime', (r, i) => {
		(i.pattern ?? (i.pattern = R$(i)), E.init(r, i));
	}),
	Yu = U('$ZodISODuration', (r, i) => {
		(i.pattern ?? (i.pattern = q$), E.init(r, i));
	}),
	Eu = U('$ZodIPv4', (r, i) => {
		(i.pattern ?? (i.pattern = E$), E.init(r, i), (r._zod.bag.format = 'ipv4'));
	}),
	Ku = U('$ZodIPv6', (r, i) => {
		(i.pattern ?? (i.pattern = K$),
			E.init(r, i),
			(r._zod.bag.format = 'ipv6'),
			(r._zod.check = (v) => {
				try {
					new URL(`http://[${v.value}]`);
				} catch {
					v.issues.push({
						code: 'invalid_format',
						format: 'ipv6',
						input: v.value,
						inst: r,
						continue: !i.abort
					});
				}
			}));
	}),
	Qu = U('$ZodMAC', (r, i) => {
		(i.pattern ?? (i.pattern = Q$(i.delimiter)), E.init(r, i), (r._zod.bag.format = 'mac'));
	}),
	Tu = U('$ZodCIDRv4', (r, i) => {
		(i.pattern ?? (i.pattern = T$), E.init(r, i));
	}),
	Hu = U('$ZodCIDRv6', (r, i) => {
		(i.pattern ?? (i.pattern = H$),
			E.init(r, i),
			(r._zod.check = (v) => {
				let u = v.value.split('/');
				try {
					if (u.length !== 2) throw Error();
					let [n, $] = u;
					if (!$) throw Error();
					let g = Number($);
					if (`${g}` !== $) throw Error();
					if (g < 0 || g > 128) throw Error();
					new URL(`http://[${n}]`);
				} catch {
					v.issues.push({
						code: 'invalid_format',
						format: 'cidrv6',
						input: v.value,
						inst: r,
						continue: !i.abort
					});
				}
			}));
	});
function Bu(r) {
	if (r === '') return !0;
	if (/\s/.test(r)) return !1;
	if (r.length % 4 !== 0) return !1;
	try {
		return (atob(r), !0);
	} catch {
		return !1;
	}
}
var tu = U('$ZodBase64', (r, i) => {
	(i.pattern ?? (i.pattern = B$),
		E.init(r, i),
		(r._zod.bag.contentEncoding = 'base64'),
		(r._zod.check = (v) => {
			if (Bu(v.value)) return;
			v.issues.push({
				code: 'invalid_format',
				format: 'base64',
				input: v.value,
				inst: r,
				continue: !i.abort
			});
		}));
});
function Db(r) {
	if (!Gi.test(r)) return !1;
	let i = r.replace(/[-_]/g, (u) => (u === '-' ? '+' : '/')),
		v = i.padEnd(Math.ceil(i.length / 4) * 4, '=');
	return Bu(v);
}
var Mu = U('$ZodBase64URL', (r, i) => {
		(i.pattern ?? (i.pattern = Gi),
			E.init(r, i),
			(r._zod.bag.contentEncoding = 'base64url'),
			(r._zod.check = (v) => {
				if (Db(v.value)) return;
				v.issues.push({
					code: 'invalid_format',
					format: 'base64url',
					input: v.value,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	Au = U('$ZodE164', (r, i) => {
		(i.pattern ?? (i.pattern = M$), E.init(r, i));
	});
function cb(r, i = null) {
	try {
		let v = r.split('.');
		if (v.length !== 3) return !1;
		let [u] = v;
		if (!u) return !1;
		let n = JSON.parse(atob(u));
		if ('typ' in n && n?.typ !== 'JWT') return !1;
		if (!n.alg) return !1;
		if (i && (!('alg' in n) || n.alg !== i)) return !1;
		return !0;
	} catch {
		return !1;
	}
}
var Ru = U('$ZodJWT', (r, i) => {
		(E.init(r, i),
			(r._zod.check = (v) => {
				if (cb(v.value, i.alg)) return;
				v.issues.push({
					code: 'invalid_format',
					format: 'jwt',
					input: v.value,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	Fu = U('$ZodCustomStringFormat', (r, i) => {
		(E.init(r, i),
			(r._zod.check = (v) => {
				if (i.fn(v.value)) return;
				v.issues.push({
					code: 'invalid_format',
					format: i.format,
					input: v.value,
					inst: r,
					continue: !i.abort
				});
			}));
	}),
	Ki = U('$ZodNumber', (r, i) => {
		(G.init(r, i),
			(r._zod.pattern = r._zod.bag.pattern ?? Kn),
			(r._zod.parse = (v, u) => {
				if (i.coerce)
					try {
						v.value = Number(v.value);
					} catch (g) {}
				let n = v.value;
				if (typeof n === 'number' && !Number.isNaN(n) && Number.isFinite(n)) return v;
				let $ =
					typeof n === 'number'
						? Number.isNaN(n)
							? 'NaN'
							: !Number.isFinite(n)
								? 'Infinity'
								: void 0
						: void 0;
				return (
					v.issues.push({
						expected: 'number',
						code: 'invalid_type',
						input: n,
						inst: r,
						...($ ? { received: $ } : {})
					}),
					v
				);
			}));
	}),
	xu = U('$ZodNumberFormat', (r, i) => {
		(a$.init(r, i), Ki.init(r, i));
	}),
	Hn = U('$ZodBoolean', (r, i) => {
		(G.init(r, i),
			(r._zod.pattern = C$),
			(r._zod.parse = (v, u) => {
				if (i.coerce)
					try {
						v.value = Boolean(v.value);
					} catch ($) {}
				let n = v.value;
				if (typeof n === 'boolean') return v;
				return (v.issues.push({ expected: 'boolean', code: 'invalid_type', input: n, inst: r }), v);
			}));
	}),
	Qi = U('$ZodBigInt', (r, i) => {
		(G.init(r, i),
			(r._zod.pattern = Z$),
			(r._zod.parse = (v, u) => {
				if (i.coerce)
					try {
						v.value = BigInt(v.value);
					} catch (n) {}
				if (typeof v.value === 'bigint') return v;
				return (
					v.issues.push({ expected: 'bigint', code: 'invalid_type', input: v.value, inst: r }),
					v
				);
			}));
	}),
	Zu = U('$ZodBigIntFormat', (r, i) => {
		(p$.init(r, i), Qi.init(r, i));
	}),
	fu = U('$ZodSymbol', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				let n = v.value;
				if (typeof n === 'symbol') return v;
				return (v.issues.push({ expected: 'symbol', code: 'invalid_type', input: n, inst: r }), v);
			}));
	}),
	Cu = U('$ZodUndefined', (r, i) => {
		(G.init(r, i),
			(r._zod.pattern = y$),
			(r._zod.values = new Set([void 0])),
			(r._zod.parse = (v, u) => {
				let n = v.value;
				if (typeof n > 'u') return v;
				return (
					v.issues.push({ expected: 'undefined', code: 'invalid_type', input: n, inst: r }),
					v
				);
			}));
	}),
	mu = U('$ZodNull', (r, i) => {
		(G.init(r, i),
			(r._zod.pattern = m$),
			(r._zod.values = new Set([null])),
			(r._zod.parse = (v, u) => {
				let n = v.value;
				if (n === null) return v;
				return (v.issues.push({ expected: 'null', code: 'invalid_type', input: n, inst: r }), v);
			}));
	}),
	yu = U('$ZodAny', (r, i) => {
		(G.init(r, i), (r._zod.parse = (v) => v));
	}),
	du = U('$ZodUnknown', (r, i) => {
		(G.init(r, i), (r._zod.parse = (v) => v));
	}),
	hu = U('$ZodNever', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				return (
					v.issues.push({ expected: 'never', code: 'invalid_type', input: v.value, inst: r }),
					v
				);
			}));
	}),
	eu = U('$ZodVoid', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				let n = v.value;
				if (typeof n > 'u') return v;
				return (v.issues.push({ expected: 'void', code: 'invalid_type', input: n, inst: r }), v);
			}));
	}),
	au = U('$ZodDate', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				if (i.coerce)
					try {
						v.value = new Date(v.value);
					} catch (I) {}
				let n = v.value,
					$ = n instanceof Date;
				if ($ && !Number.isNaN(n.getTime())) return v;
				return (
					v.issues.push({
						expected: 'date',
						code: 'invalid_type',
						input: n,
						...($ ? { received: 'Invalid Date' } : {}),
						inst: r
					}),
					v
				);
			}));
	});
function rb(r, i, v) {
	if (r.issues.length) i.issues.push(...e(v, r.issues));
	i.value[v] = r.value;
}
var pu = U('$ZodArray', (r, i) => {
	(G.init(r, i),
		(r._zod.parse = (v, u) => {
			let n = v.value;
			if (!Array.isArray(n))
				return (v.issues.push({ expected: 'array', code: 'invalid_type', input: n, inst: r }), v);
			v.value = Array(n.length);
			let $ = [];
			for (let g = 0; g < n.length; g++) {
				let I = n[g],
					b = i.element._zod.run({ value: I, issues: [] }, u);
				if (b instanceof Promise) $.push(b.then((o) => rb(o, v, g)));
				else rb(b, v, g);
			}
			if ($.length) return Promise.all($).then(() => v);
			return v;
		}));
});
function Ei(r, i, v, u, n, $) {
	let g = v in u;
	if (r.issues.length) {
		if (n && $ && !g) return;
		i.issues.push(...e(v, r.issues));
	}
	if (!g && !n) {
		if (!r.issues.length)
			i.issues.push({ code: 'invalid_type', expected: 'nonoptional', input: void 0, path: [v] });
		return;
	}
	if (r.value === void 0) {
		if (g) i.value[v] = void 0;
	} else i.value[v] = r.value;
}
function Sb(r) {
	let i = Object.keys(r.shape);
	for (let u of i)
		if (!r.shape?.[u]?._zod?.traits?.has('$ZodType'))
			throw Error(`Invalid element at key "${u}": expected a Zod schema`);
	let v = k$(r.shape);
	return { ...r, keys: i, keySet: new Set(i), numKeys: i.length, optionalKeys: new Set(v) };
}
function wb(r, i, v, u, n, $) {
	let g = [],
		I = n.keySet,
		b = n.catchall._zod,
		o = b.def.type,
		_ = b.optin === 'optional',
		l = b.optout === 'optional';
	for (let D in i) {
		if (D === '__proto__') continue;
		if (I.has(D)) continue;
		if (o === 'never') {
			g.push(D);
			continue;
		}
		let c = b.run({ value: i[D], issues: [] }, u);
		if (c instanceof Promise) r.push(c.then((P) => Ei(P, v, D, i, _, l)));
		else Ei(c, v, D, i, _, l);
	}
	if (g.length) v.issues.push({ code: 'unrecognized_keys', keys: g, input: i, inst: $ });
	if (!r.length) return v;
	return Promise.all(r).then(() => {
		return v;
	});
}
var zb = U('$ZodObject', (r, i) => {
		if ((G.init(r, i), !Object.getOwnPropertyDescriptor(i, 'shape')?.get)) {
			let I = i.shape;
			Object.defineProperty(i, 'shape', {
				get: () => {
					let b = { ...I };
					return (Object.defineProperty(i, 'shape', { value: b }), b);
				}
			});
		}
		let u = xr(() => Sb(i));
		O(r._zod, 'propValues', () => {
			let I = i.shape,
				b = {};
			for (let o in I) {
				let _ = I[o]._zod;
				if (_.values) {
					b[o] ?? (b[o] = new Set());
					for (let l of _.values) b[o].add(l);
				}
			}
			return b;
		});
		let n = Kr,
			$ = i.catchall,
			g;
		r._zod.parse = (I, b) => {
			g ?? (g = u.value);
			let o = I.value;
			if (!n(o))
				return (I.issues.push({ expected: 'object', code: 'invalid_type', input: o, inst: r }), I);
			I.value = {};
			let _ = [],
				l = g.shape;
			for (let D of g.keys) {
				let c = l[D],
					P = c._zod.optin === 'optional',
					J = c._zod.optout === 'optional',
					q = c._zod.run({ value: o[D], issues: [] }, b);
				if (q instanceof Promise) _.push(q.then((A) => Ei(A, I, D, o, P, J)));
				else Ei(q, I, D, o, P, J);
			}
			if (!$) return _.length ? Promise.all(_).then(() => I) : I;
			return wb(_, o, I, b, u.value, r);
		};
	}),
	su = U('$ZodObjectJIT', (r, i) => {
		zb.init(r, i);
		let v = r._zod.parse,
			u = xr(() => Sb(i)),
			n = (D) => {
				let c = new qi(['shape', 'payload', 'ctx']),
					P = u.value,
					J = (t) => {
						let W = li(t);
						return `shape[${W}]._zod.run({ value: input[${W}], issues: [] }, ctx)`;
					};
				c.write('const input = payload.value;');
				let q = Object.create(null),
					A = 0;
				for (let t of P.keys) q[t] = `key_${A++}`;
				c.write('const newResult = {};');
				for (let t of P.keys) {
					let W = q[t],
						T = li(t),
						$r = D[t],
						B = $r?._zod?.optin === 'optional',
						R = $r?._zod?.optout === 'optional';
					if ((c.write(`const ${W} = ${J(t)};`), B && R))
						c.write(`
        if (${W}.issues.length) {
          if (${T} in input) {
            payload.issues = payload.issues.concat(${W}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${T}, ...iss.path] : [${T}]
            })));
          }
        }
        
        if (${W}.value === undefined) {
          if (${T} in input) {
            newResult[${T}] = undefined;
          }
        } else {
          newResult[${T}] = ${W}.value;
        }
        
      `);
					else if (!B)
						c.write(`
        const ${W}_present = ${T} in input;
        if (${W}.issues.length) {
          payload.issues = payload.issues.concat(${W}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${T}, ...iss.path] : [${T}]
          })));
        }
        if (!${W}_present && !${W}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${T}]
          });
        }

        if (${W}_present) {
          if (${W}.value === undefined) {
            newResult[${T}] = undefined;
          } else {
            newResult[${T}] = ${W}.value;
          }
        }

      `);
					else
						c.write(`
        if (${W}.issues.length) {
          payload.issues = payload.issues.concat(${W}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${T}, ...iss.path] : [${T}]
          })));
        }
        
        if (${W}.value === undefined) {
          if (${T} in input) {
            newResult[${T}] = undefined;
          }
        } else {
          newResult[${T}] = ${W}.value;
        }
        
      `);
				}
				(c.write('payload.value = newResult;'), c.write('return payload;'));
				let Z = c.compile();
				return (t, W) => Z(D, t, W);
			},
			$,
			g = Kr,
			I = !Yr.jitless,
			o = I && _$.value,
			_ = i.catchall,
			l;
		r._zod.parse = (D, c) => {
			l ?? (l = u.value);
			let P = D.value;
			if (!g(P))
				return (D.issues.push({ expected: 'object', code: 'invalid_type', input: P, inst: r }), D);
			if (I && o && c?.async === !1 && c.jitless !== !0) {
				if (!$) $ = n(i.shape);
				if (((D = $(D, c)), !_)) return D;
				return wb([], P, D, c, l, r);
			}
			return v(D, c);
		};
	});
function nb(r, i, v, u) {
	for (let $ of r) if ($.issues.length === 0) return ((i.value = $.value), i);
	let n = r.filter(($) => !Lr($));
	if (n.length === 1) return ((i.value = n[0].value), n[0]);
	return (
		i.issues.push({
			code: 'invalid_union',
			input: i.value,
			inst: v,
			errors: r.map(($) => $.issues.map((g) => y(g, u, M())))
		}),
		i
	);
}
var Bn = U('$ZodUnion', (r, i) => {
	(G.init(r, i),
		O(r._zod, 'optin', () =>
			i.options.some((u) => u._zod.optin === 'optional') ? 'optional' : void 0
		),
		O(r._zod, 'optout', () =>
			i.options.some((u) => u._zod.optout === 'optional') ? 'optional' : void 0
		),
		O(r._zod, 'values', () => {
			if (i.options.every((u) => u._zod.values))
				return new Set(i.options.flatMap((u) => Array.from(u._zod.values)));
			return;
		}),
		O(r._zod, 'pattern', () => {
			if (i.options.every((u) => u._zod.pattern)) {
				let u = i.options.map((n) => n._zod.pattern);
				return new RegExp(`^(${u.map((n) => Xn(n.source)).join('|')})$`);
			}
			return;
		}));
	let v = i.options.length === 1 ? i.options[0]._zod.run : null;
	r._zod.parse = (u, n) => {
		if (v) return v(u, n);
		let $ = !1,
			g = [];
		for (let I of i.options) {
			let b = I._zod.run({ value: u.value, issues: [] }, n);
			if (b instanceof Promise) (g.push(b), ($ = !0));
			else {
				if (b.issues.length === 0) return b;
				g.push(b);
			}
		}
		if (!$) return nb(g, u, r, n);
		return Promise.all(g).then((I) => {
			return nb(I, u, r, n);
		});
	};
});
function ib(r, i, v, u) {
	let n = r.filter(($) => $.issues.length === 0);
	if (n.length === 1) return ((i.value = n[0].value), i);
	if (n.length === 0)
		i.issues.push({
			code: 'invalid_union',
			input: i.value,
			inst: v,
			errors: r.map(($) => $.issues.map((g) => y(g, u, M())))
		});
	else i.issues.push({ code: 'invalid_union', input: i.value, inst: v, errors: [], inclusive: !1 });
	return i;
}
var rg = U('$ZodXor', (r, i) => {
		(Bn.init(r, i), (i.inclusive = !1));
		let v = i.options.length === 1 ? i.options[0]._zod.run : null;
		r._zod.parse = (u, n) => {
			if (v) return v(u, n);
			let $ = !1,
				g = [];
			for (let I of i.options) {
				let b = I._zod.run({ value: u.value, issues: [] }, n);
				if (b instanceof Promise) (g.push(b), ($ = !0));
				else g.push(b);
			}
			if (!$) return ib(g, u, r, n);
			return Promise.all(g).then((I) => {
				return ib(I, u, r, n);
			});
		};
	}),
	ng = U('$ZodDiscriminatedUnion', (r, i) => {
		((i.inclusive = !1), Bn.init(r, i));
		let v = r._zod.parse;
		O(r._zod, 'propValues', () => {
			let n = {};
			for (let $ of i.options) {
				let g = $._zod.propValues;
				if (!g || Object.keys(g).length === 0)
					throw Error(`Invalid discriminated union option at index "${i.options.indexOf($)}"`);
				for (let [I, b] of Object.entries(g)) {
					if (!n[I]) n[I] = new Set();
					for (let o of b) n[I].add(o);
				}
			}
			return n;
		});
		let u = xr(() => {
			let n = i.options,
				$ = new Map();
			for (let g of n) {
				let I = g._zod.propValues?.[i.discriminator];
				if (!I || I.size === 0)
					throw Error(`Invalid discriminated union option at index "${i.options.indexOf(g)}"`);
				for (let b of I) {
					if ($.has(b)) throw Error(`Duplicate discriminator value "${String(b)}"`);
					$.set(b, g);
				}
			}
			return $;
		});
		r._zod.parse = (n, $) => {
			let g = n.value;
			if (!Kr(g))
				return (n.issues.push({ code: 'invalid_type', expected: 'object', input: g, inst: r }), n);
			let I = u.value.get(g?.[i.discriminator]);
			if (I) return I._zod.run(n, $);
			if (i.unionFallback || $.direction === 'backward') return v(n, $);
			return (
				n.issues.push({
					code: 'invalid_union',
					errors: [],
					note: 'No matching discriminator',
					discriminator: i.discriminator,
					options: Array.from(u.value.keys()),
					input: g,
					path: [i.discriminator],
					inst: r
				}),
				n
			);
		};
	}),
	ig = U('$ZodIntersection', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				let n = v.value,
					$ = i.left._zod.run({ value: n, issues: [] }, u),
					g = i.right._zod.run({ value: n, issues: [] }, u);
				if ($ instanceof Promise || g instanceof Promise)
					return Promise.all([$, g]).then(([b, o]) => {
						return vb(v, b, o);
					});
				return vb(v, $, g);
			}));
	});
function cu(r, i) {
	if (r === i) return { valid: !0, data: r };
	if (r instanceof Date && i instanceof Date && +r === +i) return { valid: !0, data: r };
	if (Jr(r) && Jr(i)) {
		let v = Object.keys(i),
			u = Object.keys(r).filter(($) => v.indexOf($) !== -1),
			n = { ...r, ...i };
		for (let $ of u) {
			let g = cu(r[$], i[$]);
			if (!g.valid) return { valid: !1, mergeErrorPath: [$, ...g.mergeErrorPath] };
			n[$] = g.data;
		}
		return { valid: !0, data: n };
	}
	if (Array.isArray(r) && Array.isArray(i)) {
		if (r.length !== i.length) return { valid: !1, mergeErrorPath: [] };
		let v = [];
		for (let u = 0; u < r.length; u++) {
			let n = r[u],
				$ = i[u],
				g = cu(n, $);
			if (!g.valid) return { valid: !1, mergeErrorPath: [u, ...g.mergeErrorPath] };
			v.push(g.data);
		}
		return { valid: !0, data: v };
	}
	return { valid: !1, mergeErrorPath: [] };
}
function vb(r, i, v) {
	let u = new Map(),
		n;
	for (let I of i.issues)
		if (I.code === 'unrecognized_keys') {
			n ?? (n = I);
			for (let b of I.keys) {
				if (!u.has(b)) u.set(b, {});
				u.get(b).l = !0;
			}
		} else r.issues.push(I);
	for (let I of v.issues)
		if (I.code === 'unrecognized_keys')
			for (let b of I.keys) {
				if (!u.has(b)) u.set(b, {});
				u.get(b).r = !0;
			}
		else r.issues.push(I);
	let $ = [...u].filter(([, I]) => I.l && I.r).map(([I]) => I);
	if ($.length && n) r.issues.push({ ...n, keys: $ });
	if (Lr(r)) return r;
	let g = cu(i.value, v.value);
	if (!g.valid)
		throw Error(`Unmergable intersection. Error path: ${JSON.stringify(g.mergeErrorPath)}`);
	return ((r.value = g.data), r);
}
var Ti = U('$ZodTuple', (r, i) => {
	G.init(r, i);
	let v = i.items;
	r._zod.parse = (u, n) => {
		let $ = u.value;
		if (!Array.isArray($))
			return (u.issues.push({ input: $, inst: r, expected: 'tuple', code: 'invalid_type' }), u);
		u.value = [];
		let g = [],
			I = $b(v, 'optin'),
			b = $b(v, 'optout');
		if (!i.rest) {
			if ($.length < I)
				return (
					u.issues.push({
						code: 'too_small',
						minimum: I,
						inclusive: !0,
						input: $,
						inst: r,
						origin: 'array'
					}),
					u
				);
			if ($.length > v.length)
				u.issues.push({
					code: 'too_big',
					maximum: v.length,
					inclusive: !0,
					input: $,
					inst: r,
					origin: 'array'
				});
		}
		let o = Array(v.length);
		for (let _ = 0; _ < v.length; _++) {
			let l = v[_]._zod.run({ value: $[_], issues: [] }, n);
			if (l instanceof Promise)
				g.push(
					l.then((D) => {
						o[_] = D;
					})
				);
			else o[_] = l;
		}
		if (i.rest) {
			let _ = v.length - 1,
				l = $.slice(v.length);
			for (let D of l) {
				_++;
				let c = i.rest._zod.run({ value: D, issues: [] }, n);
				if (c instanceof Promise) g.push(c.then((P) => ub(P, u, _)));
				else ub(c, u, _);
			}
		}
		if (g.length) return Promise.all(g).then(() => gb(o, u, v, $, b));
		return gb(o, u, v, $, b);
	};
});
function $b(r, i) {
	for (let v = r.length - 1; v >= 0; v--) if (r[v]._zod[i] !== 'optional') return v + 1;
	return 0;
}
function ub(r, i, v) {
	if (r.issues.length) i.issues.push(...e(v, r.issues));
	i.value[v] = r.value;
}
function gb(r, i, v, u, n) {
	for (let $ = 0; $ < v.length; $++) {
		let g = r[$],
			I = $ < u.length;
		if (g.issues.length) {
			if (!I && $ >= n) {
				i.value.length = $;
				break;
			}
			i.issues.push(...e($, g.issues));
		}
		i.value[$] = g.value;
	}
	for (let $ = i.value.length - 1; $ >= u.length; $--)
		if (v[$]._zod.optout === 'optional' && i.value[$] === void 0) i.value.length = $;
		else break;
	return i;
}
var vg = U('$ZodRecord', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				let n = v.value;
				if (!Jr(n))
					return (
						v.issues.push({ expected: 'record', code: 'invalid_type', input: n, inst: r }),
						v
					);
				let $ = [],
					g = i.keyType._zod.values;
				if (g) {
					v.value = {};
					let I = new Set();
					for (let o of g)
						if (typeof o === 'string' || typeof o === 'number' || typeof o === 'symbol') {
							I.add(typeof o === 'number' ? o.toString() : o);
							let _ = i.keyType._zod.run({ value: o, issues: [] }, u);
							if (_ instanceof Promise)
								throw Error('Async schemas not supported in object keys currently');
							if (_.issues.length) {
								v.issues.push({
									code: 'invalid_key',
									origin: 'record',
									issues: _.issues.map((c) => y(c, u, M())),
									input: o,
									path: [o],
									inst: r
								});
								continue;
							}
							let l = _.value,
								D = i.valueType._zod.run({ value: n[o], issues: [] }, u);
							if (D instanceof Promise)
								$.push(
									D.then((c) => {
										if (c.issues.length) v.issues.push(...e(o, c.issues));
										v.value[l] = c.value;
									})
								);
							else {
								if (D.issues.length) v.issues.push(...e(o, D.issues));
								v.value[l] = D.value;
							}
						}
					let b;
					for (let o in n) if (!I.has(o)) ((b = b ?? []), b.push(o));
					if (b && b.length > 0)
						v.issues.push({ code: 'unrecognized_keys', input: n, inst: r, keys: b });
				} else {
					v.value = {};
					for (let I of Reflect.ownKeys(n)) {
						if (I === '__proto__') continue;
						if (!Object.prototype.propertyIsEnumerable.call(n, I)) continue;
						let b = i.keyType._zod.run({ value: I, issues: [] }, u);
						if (b instanceof Promise)
							throw Error('Async schemas not supported in object keys currently');
						if (typeof I === 'string' && Kn.test(I) && b.issues.length) {
							let l = i.keyType._zod.run({ value: Number(I), issues: [] }, u);
							if (l instanceof Promise)
								throw Error('Async schemas not supported in object keys currently');
							if (l.issues.length === 0) b = l;
						}
						if (b.issues.length) {
							if (i.mode === 'loose') v.value[I] = n[I];
							else
								v.issues.push({
									code: 'invalid_key',
									origin: 'record',
									issues: b.issues.map((l) => y(l, u, M())),
									input: I,
									path: [I],
									inst: r
								});
							continue;
						}
						let _ = i.valueType._zod.run({ value: n[I], issues: [] }, u);
						if (_ instanceof Promise)
							$.push(
								_.then((l) => {
									if (l.issues.length) v.issues.push(...e(I, l.issues));
									v.value[b.value] = l.value;
								})
							);
						else {
							if (_.issues.length) v.issues.push(...e(I, _.issues));
							v.value[b.value] = _.value;
						}
					}
				}
				if ($.length) return Promise.all($).then(() => v);
				return v;
			}));
	}),
	$g = U('$ZodMap', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				let n = v.value;
				if (!(n instanceof Map))
					return (v.issues.push({ expected: 'map', code: 'invalid_type', input: n, inst: r }), v);
				let $ = [];
				v.value = new Map();
				for (let [g, I] of n) {
					let b = i.keyType._zod.run({ value: g, issues: [] }, u),
						o = i.valueType._zod.run({ value: I, issues: [] }, u);
					if (b instanceof Promise || o instanceof Promise)
						$.push(
							Promise.all([b, o]).then(([_, l]) => {
								Ib(_, l, v, g, n, r, u);
							})
						);
					else Ib(b, o, v, g, n, r, u);
				}
				if ($.length) return Promise.all($).then(() => v);
				return v;
			}));
	});
function Ib(r, i, v, u, n, $, g) {
	if (r.issues.length)
		if (On.has(typeof u)) v.issues.push(...e(u, r.issues));
		else
			v.issues.push({
				code: 'invalid_key',
				origin: 'map',
				input: n,
				inst: $,
				issues: r.issues.map((I) => y(I, g, M()))
			});
	if (i.issues.length)
		if (On.has(typeof u)) v.issues.push(...e(u, i.issues));
		else
			v.issues.push({
				origin: 'map',
				code: 'invalid_element',
				input: n,
				inst: $,
				key: u,
				issues: i.issues.map((I) => y(I, g, M()))
			});
	v.value.set(r.value, i.value);
}
var ug = U('$ZodSet', (r, i) => {
	(G.init(r, i),
		(r._zod.parse = (v, u) => {
			let n = v.value;
			if (!(n instanceof Set))
				return (v.issues.push({ input: n, inst: r, expected: 'set', code: 'invalid_type' }), v);
			let $ = [];
			v.value = new Set();
			for (let g of n) {
				let I = i.valueType._zod.run({ value: g, issues: [] }, u);
				if (I instanceof Promise) $.push(I.then((b) => ob(b, v)));
				else ob(I, v);
			}
			if ($.length) return Promise.all($).then(() => v);
			return v;
		}));
});
function ob(r, i) {
	if (r.issues.length) i.issues.push(...r.issues);
	i.value.add(r.value);
}
var gg = U('$ZodEnum', (r, i) => {
		G.init(r, i);
		let v = Gn(i.entries),
			u = new Set(v);
		((r._zod.values = u),
			(r._zod.pattern = new RegExp(
				`^(${v
					.filter((n) => On.has(typeof n))
					.map((n) => (typeof n === 'string' ? ir(n) : n.toString()))
					.join('|')})$`
			)),
			(r._zod.parse = (n, $) => {
				let g = n.value;
				if (u.has(g)) return n;
				return (n.issues.push({ code: 'invalid_value', values: v, input: g, inst: r }), n);
			}));
	}),
	Ig = U('$ZodLiteral', (r, i) => {
		if ((G.init(r, i), i.values.length === 0))
			throw Error('Cannot create literal schema with no valid values');
		let v = new Set(i.values);
		((r._zod.values = v),
			(r._zod.pattern = new RegExp(
				`^(${i.values.map((u) => (typeof u === 'string' ? ir(u) : u ? ir(u.toString()) : String(u))).join('|')})$`
			)),
			(r._zod.parse = (u, n) => {
				let $ = u.value;
				if (v.has($)) return u;
				return (u.issues.push({ code: 'invalid_value', values: i.values, input: $, inst: r }), u);
			}));
	}),
	og = U('$ZodFile', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				let n = v.value;
				if (n instanceof File) return v;
				return (v.issues.push({ expected: 'file', code: 'invalid_type', input: n, inst: r }), v);
			}));
	}),
	bg = U('$ZodTransform', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				if (u.direction === 'backward') throw new Er(r.constructor.name);
				let n = i.transform(v.value, v);
				if (u.async)
					return (n instanceof Promise ? n : Promise.resolve(n)).then((g) => {
						return ((v.value = g), v);
					});
				if (n instanceof Promise) throw new or();
				return ((v.value = n), v);
			}));
	});
function bb(r, i) {
	if (r.issues.length && i === void 0) return { issues: [], value: void 0 };
	return r;
}
var Hi = U('$ZodOptional', (r, i) => {
		(G.init(r, i),
			(r._zod.optin = 'optional'),
			(r._zod.optout = 'optional'),
			O(r._zod, 'values', () => {
				return i.innerType._zod.values ? new Set([...i.innerType._zod.values, void 0]) : void 0;
			}),
			O(r._zod, 'pattern', () => {
				let v = i.innerType._zod.pattern;
				return v ? new RegExp(`^(${Xn(v.source)})?$`) : void 0;
			}),
			(r._zod.parse = (v, u) => {
				if (i.innerType._zod.optin === 'optional') {
					let n = i.innerType._zod.run(v, u);
					if (n instanceof Promise) return n.then(($) => bb($, v.value));
					return bb(n, v.value);
				}
				if (v.value === void 0) return v;
				return i.innerType._zod.run(v, u);
			}));
	}),
	_g = U('$ZodExactOptional', (r, i) => {
		(Hi.init(r, i),
			O(r._zod, 'values', () => i.innerType._zod.values),
			O(r._zod, 'pattern', () => i.innerType._zod.pattern),
			(r._zod.parse = (v, u) => {
				return i.innerType._zod.run(v, u);
			}));
	}),
	Ug = U('$ZodNullable', (r, i) => {
		(G.init(r, i),
			O(r._zod, 'optin', () => i.innerType._zod.optin),
			O(r._zod, 'optout', () => i.innerType._zod.optout),
			O(r._zod, 'pattern', () => {
				let v = i.innerType._zod.pattern;
				return v ? new RegExp(`^(${Xn(v.source)}|null)$`) : void 0;
			}),
			O(r._zod, 'values', () => {
				return i.innerType._zod.values ? new Set([...i.innerType._zod.values, null]) : void 0;
			}),
			(r._zod.parse = (v, u) => {
				if (v.value === null) return v;
				return i.innerType._zod.run(v, u);
			}));
	}),
	lg = U('$ZodDefault', (r, i) => {
		(G.init(r, i),
			(r._zod.optin = 'optional'),
			O(r._zod, 'values', () => i.innerType._zod.values),
			(r._zod.parse = (v, u) => {
				if (u.direction === 'backward') return i.innerType._zod.run(v, u);
				if (v.value === void 0) return ((v.value = i.defaultValue), v);
				let n = i.innerType._zod.run(v, u);
				if (n instanceof Promise) return n.then(($) => _b($, i));
				return _b(n, i);
			}));
	});
function _b(r, i) {
	if (r.value === void 0) r.value = i.defaultValue;
	return r;
}
var kg = U('$ZodPrefault', (r, i) => {
		(G.init(r, i),
			(r._zod.optin = 'optional'),
			O(r._zod, 'values', () => i.innerType._zod.values),
			(r._zod.parse = (v, u) => {
				if (u.direction === 'backward') return i.innerType._zod.run(v, u);
				if (v.value === void 0) v.value = i.defaultValue;
				return i.innerType._zod.run(v, u);
			}));
	}),
	Dg = U('$ZodNonOptional', (r, i) => {
		(G.init(r, i),
			O(r._zod, 'values', () => {
				let v = i.innerType._zod.values;
				return v ? new Set([...v].filter((u) => u !== void 0)) : void 0;
			}),
			(r._zod.parse = (v, u) => {
				let n = i.innerType._zod.run(v, u);
				if (n instanceof Promise) return n.then(($) => Ub($, r));
				return Ub(n, r);
			}));
	});
function Ub(r, i) {
	if (!r.issues.length && r.value === void 0)
		r.issues.push({ code: 'invalid_type', expected: 'nonoptional', input: r.value, inst: i });
	return r;
}
var cg = U('$ZodSuccess', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				if (u.direction === 'backward') throw new Er('ZodSuccess');
				let n = i.innerType._zod.run(v, u);
				if (n instanceof Promise)
					return n.then(($) => {
						return ((v.value = $.issues.length === 0), v);
					});
				return ((v.value = n.issues.length === 0), v);
			}));
	}),
	Sg = U('$ZodCatch', (r, i) => {
		(G.init(r, i),
			O(r._zod, 'optin', () => i.innerType._zod.optin),
			O(r._zod, 'optout', () => i.innerType._zod.optout),
			O(r._zod, 'values', () => i.innerType._zod.values),
			(r._zod.parse = (v, u) => {
				if (u.direction === 'backward') return i.innerType._zod.run(v, u);
				let n = i.innerType._zod.run(v, u);
				if (n instanceof Promise)
					return n.then(($) => {
						if (((v.value = $.value), $.issues.length))
							((v.value = i.catchValue({
								...v,
								error: { issues: $.issues.map((g) => y(g, u, M())) },
								input: v.value
							})),
								(v.issues = []));
						return v;
					});
				if (((v.value = n.value), n.issues.length))
					((v.value = i.catchValue({
						...v,
						error: { issues: n.issues.map(($) => y($, u, M())) },
						input: v.value
					})),
						(v.issues = []));
				return v;
			}));
	}),
	wg = U('$ZodNaN', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				if (typeof v.value !== 'number' || !Number.isNaN(v.value))
					return (
						v.issues.push({ input: v.value, inst: r, expected: 'nan', code: 'invalid_type' }),
						v
					);
				return v;
			}));
	}),
	zg = U('$ZodPipe', (r, i) => {
		(G.init(r, i),
			O(r._zod, 'values', () => i.in._zod.values),
			O(r._zod, 'optin', () => i.in._zod.optin),
			O(r._zod, 'optout', () => i.out._zod.optout),
			O(r._zod, 'propValues', () => i.in._zod.propValues),
			(r._zod.parse = (v, u) => {
				if (u.direction === 'backward') {
					let $ = i.out._zod.run(v, u);
					if ($ instanceof Promise) return $.then((g) => Wi(g, i.in, u));
					return Wi($, i.in, u);
				}
				let n = i.in._zod.run(v, u);
				if (n instanceof Promise) return n.then(($) => Wi($, i.out, u));
				return Wi(n, i.out, u);
			}));
	});
function Wi(r, i, v) {
	if (r.issues.length) return ((r.aborted = !0), r);
	return i._zod.run({ value: r.value, issues: r.issues }, v);
}
var tn = U('$ZodCodec', (r, i) => {
	(G.init(r, i),
		O(r._zod, 'values', () => i.in._zod.values),
		O(r._zod, 'optin', () => i.in._zod.optin),
		O(r._zod, 'optout', () => i.out._zod.optout),
		O(r._zod, 'propValues', () => i.in._zod.propValues),
		(r._zod.parse = (v, u) => {
			if ((u.direction || 'forward') === 'forward') {
				let $ = i.in._zod.run(v, u);
				if ($ instanceof Promise) return $.then((g) => Vi(g, i, u));
				return Vi($, i, u);
			} else {
				let $ = i.out._zod.run(v, u);
				if ($ instanceof Promise) return $.then((g) => Vi(g, i, u));
				return Vi($, i, u);
			}
		}));
});
function Vi(r, i, v) {
	if (r.issues.length) return ((r.aborted = !0), r);
	if ((v.direction || 'forward') === 'forward') {
		let n = i.transform(r.value, r);
		if (n instanceof Promise) return n.then(($) => Yi(r, $, i.out, v));
		return Yi(r, n, i.out, v);
	} else {
		let n = i.reverseTransform(r.value, r);
		if (n instanceof Promise) return n.then(($) => Yi(r, $, i.in, v));
		return Yi(r, n, i.in, v);
	}
}
function Yi(r, i, v, u) {
	if (r.issues.length) return ((r.aborted = !0), r);
	return v._zod.run({ value: i, issues: r.issues }, u);
}
var Ng = U('$ZodReadonly', (r, i) => {
	(G.init(r, i),
		O(r._zod, 'propValues', () => i.innerType._zod.propValues),
		O(r._zod, 'values', () => i.innerType._zod.values),
		O(r._zod, 'optin', () => i.innerType?._zod?.optin),
		O(r._zod, 'optout', () => i.innerType?._zod?.optout),
		(r._zod.parse = (v, u) => {
			if (u.direction === 'backward') return i.innerType._zod.run(v, u);
			let n = i.innerType._zod.run(v, u);
			if (n instanceof Promise) return n.then(lb);
			return lb(n);
		}));
});
function lb(r) {
	return ((r.value = Object.freeze(r.value)), r);
}
var Pg = U('$ZodTemplateLiteral', (r, i) => {
		G.init(r, i);
		let v = [];
		for (let u of i.parts)
			if (typeof u === 'object' && u !== null) {
				if (!u._zod.pattern)
					throw Error(
						`Invalid template literal part, no pattern found: ${[...u._zod.traits].shift()}`
					);
				let n = u._zod.pattern instanceof RegExp ? u._zod.pattern.source : u._zod.pattern;
				if (!n) throw Error(`Invalid template literal part: ${u._zod.traits}`);
				let $ = n.startsWith('^') ? 1 : 0,
					g = n.endsWith('$') ? n.length - 1 : n.length;
				v.push(n.slice($, g));
			} else if (u === null || l$.has(typeof u)) v.push(ir(`${u}`));
			else throw Error(`Invalid template literal part: ${u}`);
		((r._zod.pattern = new RegExp(`^${v.join('')}$`)),
			(r._zod.parse = (u, n) => {
				if (typeof u.value !== 'string')
					return (
						u.issues.push({ input: u.value, inst: r, expected: 'string', code: 'invalid_type' }),
						u
					);
				if (((r._zod.pattern.lastIndex = 0), !r._zod.pattern.test(u.value)))
					return (
						u.issues.push({
							input: u.value,
							inst: r,
							code: 'invalid_format',
							format: i.format ?? 'template_literal',
							pattern: r._zod.pattern.source
						}),
						u
					);
				return u;
			}));
	}),
	jg = U('$ZodFunction', (r, i) => {
		return (
			G.init(r, i),
			(r._def = i),
			(r._zod.def = i),
			(r.implement = (v) => {
				if (typeof v !== 'function') throw Error('implement() must be called with a function');
				return function (...u) {
					let n = r._def.input ? Di(r._def.input, u) : u,
						$ = Reflect.apply(v, this, n);
					if (r._def.output) return Di(r._def.output, $);
					return $;
				};
			}),
			(r.implementAsync = (v) => {
				if (typeof v !== 'function') throw Error('implementAsync() must be called with a function');
				return async function (...u) {
					let n = r._def.input ? await ci(r._def.input, u) : u,
						$ = await Reflect.apply(v, this, n);
					if (r._def.output) return await ci(r._def.output, $);
					return $;
				};
			}),
			(r._zod.parse = (v, u) => {
				if (typeof v.value !== 'function')
					return (
						v.issues.push({ code: 'invalid_type', expected: 'function', input: v.value, inst: r }),
						v
					);
				if (r._def.output && r._def.output._zod.def.type === 'promise')
					v.value = r.implementAsync(v.value);
				else v.value = r.implement(v.value);
				return v;
			}),
			(r.input = (...v) => {
				let u = r.constructor;
				if (Array.isArray(v[0]))
					return new u({
						type: 'function',
						input: new Ti({ type: 'tuple', items: v[0], rest: v[1] }),
						output: r._def.output
					});
				return new u({ type: 'function', input: v[0], output: r._def.output });
			}),
			(r.output = (v) => {
				return new r.constructor({ type: 'function', input: r._def.input, output: v });
			}),
			r
		);
	}),
	Jg = U('$ZodPromise', (r, i) => {
		(G.init(r, i),
			(r._zod.parse = (v, u) => {
				return Promise.resolve(v.value).then((n) =>
					i.innerType._zod.run({ value: n, issues: [] }, u)
				);
			}));
	}),
	Lg = U('$ZodLazy', (r, i) => {
		(G.init(r, i),
			O(r._zod, 'innerType', () => {
				let v = i;
				if (!v._cachedInner) v._cachedInner = i.getter();
				return v._cachedInner;
			}),
			O(r._zod, 'pattern', () => r._zod.innerType?._zod?.pattern),
			O(r._zod, 'propValues', () => r._zod.innerType?._zod?.propValues),
			O(r._zod, 'optin', () => r._zod.innerType?._zod?.optin ?? void 0),
			O(r._zod, 'optout', () => r._zod.innerType?._zod?.optout ?? void 0),
			(r._zod.parse = (v, u) => {
				return r._zod.innerType._zod.run(v, u);
			}));
	}),
	Gg = U('$ZodCustom', (r, i) => {
		(H.init(r, i),
			G.init(r, i),
			(r._zod.parse = (v, u) => {
				return v;
			}),
			(r._zod.check = (v) => {
				let u = v.value,
					n = i.fn(u);
				if (n instanceof Promise) return n.then(($) => kb($, v, u, r));
				kb(n, v, u, r);
				return;
			}));
	});
function kb(r, i, v, u) {
	if (!r) {
		let n = {
			code: 'custom',
			input: v,
			inst: u,
			path: [...(u._zod.def.path ?? [])],
			continue: !u._zod.def.abort
		};
		if (u._zod.def.params) n.params = u._zod.def.params;
		i.issues.push(Zr(n));
	}
}
var xn = {};
Dr(xn, {
	zhTW: () => z4,
	zhCN: () => w4,
	yo: () => N4,
	vi: () => S4,
	uz: () => c4,
	ur: () => D4,
	uk: () => Fn,
	ua: () => k4,
	tr: () => l4,
	th: () => U4,
	ta: () => _4,
	sv: () => b4,
	sl: () => o4,
	ru: () => I4,
	ro: () => g4,
	pt: () => u4,
	ps: () => v4,
	pl: () => $4,
	ota: () => i4,
	no: () => n4,
	nl: () => r4,
	ms: () => sg,
	mk: () => pg,
	lt: () => ag,
	ko: () => eg,
	km: () => An,
	kh: () => hg,
	ka: () => dg,
	ja: () => yg,
	it: () => mg,
	is: () => Cg,
	id: () => fg,
	hy: () => Zg,
	hu: () => xg,
	hr: () => Fg,
	he: () => Rg,
	frCA: () => Ag,
	fr: () => Mg,
	fi: () => tg,
	fa: () => Bg,
	es: () => Hg,
	eo: () => Tg,
	en: () => Mn,
	el: () => Qg,
	de: () => Kg,
	da: () => Eg,
	cs: () => Yg,
	ca: () => Vg,
	bg: () => Wg,
	be: () => qg,
	az: () => Og,
	ar: () => Xg
});
var X1 = () => {
	let r = {
		string: { unit: 'حرف', verb: 'أن يحوي' },
		file: { unit: 'بايت', verb: 'أن يحوي' },
		array: { unit: 'عنصر', verb: 'أن يحوي' },
		set: { unit: 'عنصر', verb: 'أن يحوي' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'مدخل',
			email: 'بريد إلكتروني',
			url: 'رابط',
			emoji: 'إيموجي',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'تاريخ ووقت بمعيار ISO',
			date: 'تاريخ بمعيار ISO',
			time: 'وقت بمعيار ISO',
			duration: 'مدة بمعيار ISO',
			ipv4: 'عنوان IPv4',
			ipv6: 'عنوان IPv6',
			cidrv4: 'مدى عناوين بصيغة IPv4',
			cidrv6: 'مدى عناوين بصيغة IPv6',
			base64: 'نَص بترميز base64-encoded',
			base64url: 'نَص بترميز base64url-encoded',
			json_string: 'نَص على هيئة JSON',
			e164: 'رقم هاتف بمعيار E.164',
			jwt: 'JWT',
			template_literal: 'مدخل'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `مدخلات غير مقبولة: يفترض إدخال instanceof ${n.expected}، ولكن تم إدخال ${I}`;
				return `مدخلات غير مقبولة: يفترض إدخال ${$}، ولكن تم إدخال ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `مدخلات غير مقبولة: يفترض إدخال ${S(n.values[0])}`;
				return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return ` أكبر من اللازم: يفترض أن تكون ${n.origin ?? 'القيمة'} ${$} ${n.maximum.toString()} ${g.unit ?? 'عنصر'}`;
				return `أكبر من اللازم: يفترض أن تكون ${n.origin ?? 'القيمة'} ${$} ${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `أصغر من اللازم: يفترض لـ ${n.origin} أن يكون ${$} ${n.minimum.toString()} ${g.unit}`;
				return `أصغر من اللازم: يفترض لـ ${n.origin} أن يكون ${$} ${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `نَص غير مقبول: يجب أن يبدأ بـ "${n.prefix}"`;
				if ($.format === 'ends_with') return `نَص غير مقبول: يجب أن ينتهي بـ "${$.suffix}"`;
				if ($.format === 'includes') return `نَص غير مقبول: يجب أن يتضمَّن "${$.includes}"`;
				if ($.format === 'regex') return `نَص غير مقبول: يجب أن يطابق النمط ${$.pattern}`;
				return `${v[$.format] ?? n.format} غير مقبول`;
			}
			case 'not_multiple_of':
				return `رقم غير مقبول: يجب أن يكون من مضاعفات ${n.divisor}`;
			case 'unrecognized_keys':
				return `معرف${n.keys.length > 1 ? 'ات' : ''} غريب${n.keys.length > 1 ? 'ة' : ''}: ${k(n.keys, '، ')}`;
			case 'invalid_key':
				return `معرف غير مقبول في ${n.origin}`;
			case 'invalid_union':
				return 'مدخل غير مقبول';
			case 'invalid_element':
				return `مدخل غير مقبول في ${n.origin}`;
			default:
				return 'مدخل غير مقبول';
		}
	};
};
function Xg() {
	return { localeError: X1() };
}
var O1 = () => {
	let r = {
		string: { unit: 'simvol', verb: 'olmalıdır' },
		file: { unit: 'bayt', verb: 'olmalıdır' },
		array: { unit: 'element', verb: 'olmalıdır' },
		set: { unit: 'element', verb: 'olmalıdır' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'input',
			email: 'email address',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO datetime',
			date: 'ISO date',
			time: 'ISO time',
			duration: 'ISO duration',
			ipv4: 'IPv4 address',
			ipv6: 'IPv6 address',
			cidrv4: 'IPv4 range',
			cidrv6: 'IPv6 range',
			base64: 'base64-encoded string',
			base64url: 'base64url-encoded string',
			json_string: 'JSON string',
			e164: 'E.164 number',
			jwt: 'JWT',
			template_literal: 'input'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Yanlış dəyər: gözlənilən instanceof ${n.expected}, daxil olan ${I}`;
				return `Yanlış dəyər: gözlənilən ${$}, daxil olan ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Yanlış dəyər: gözlənilən ${S(n.values[0])}`;
				return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Çox böyük: gözlənilən ${n.origin ?? 'dəyər'} ${$}${n.maximum.toString()} ${g.unit ?? 'element'}`;
				return `Çox böyük: gözlənilən ${n.origin ?? 'dəyər'} ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) return `Çox kiçik: gözlənilən ${n.origin} ${$}${n.minimum.toString()} ${g.unit}`;
				return `Çox kiçik: gözlənilən ${n.origin} ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Yanlış mətn: "${$.prefix}" ilə başlamalıdır`;
				if ($.format === 'ends_with') return `Yanlış mətn: "${$.suffix}" ilə bitməlidir`;
				if ($.format === 'includes') return `Yanlış mətn: "${$.includes}" daxil olmalıdır`;
				if ($.format === 'regex') return `Yanlış mətn: ${$.pattern} şablonuna uyğun olmalıdır`;
				return `Yanlış ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Yanlış ədəd: ${n.divisor} ilə bölünə bilən olmalıdır`;
			case 'unrecognized_keys':
				return `Tanınmayan açar${n.keys.length > 1 ? 'lar' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `${n.origin} daxilində yanlış açar`;
			case 'invalid_union':
				return 'Yanlış dəyər';
			case 'invalid_element':
				return `${n.origin} daxilində yanlış dəyər`;
			default:
				return 'Yanlış dəyər';
		}
	};
};
function Og() {
	return { localeError: O1() };
}
function Nb(r, i, v, u) {
	let n = Math.abs(r),
		$ = n % 10,
		g = n % 100;
	if (g >= 11 && g <= 19) return u;
	if ($ === 1) return i;
	if ($ >= 2 && $ <= 4) return v;
	return u;
}
var q1 = () => {
	let r = {
		string: { unit: { one: 'сімвал', few: 'сімвалы', many: 'сімвалаў' }, verb: 'мець' },
		array: { unit: { one: 'элемент', few: 'элементы', many: 'элементаў' }, verb: 'мець' },
		set: { unit: { one: 'элемент', few: 'элементы', many: 'элементаў' }, verb: 'мець' },
		file: { unit: { one: 'байт', few: 'байты', many: 'байтаў' }, verb: 'мець' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'увод',
			email: 'email адрас',
			url: 'URL',
			emoji: 'эмодзі',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO дата і час',
			date: 'ISO дата',
			time: 'ISO час',
			duration: 'ISO працягласць',
			ipv4: 'IPv4 адрас',
			ipv6: 'IPv6 адрас',
			cidrv4: 'IPv4 дыяпазон',
			cidrv6: 'IPv6 дыяпазон',
			base64: 'радок у фармаце base64',
			base64url: 'радок у фармаце base64url',
			json_string: 'JSON радок',
			e164: 'нумар E.164',
			jwt: 'JWT',
			template_literal: 'увод'
		},
		u = { nan: 'NaN', number: 'лік', array: 'масіў' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Няправільны ўвод: чакаўся instanceof ${n.expected}, атрымана ${I}`;
				return `Няправільны ўвод: чакаўся ${$}, атрымана ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Няправільны ўвод: чакалася ${S(n.values[0])}`;
				return `Няправільны варыянт: чакаўся адзін з ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g) {
					let I = Number(n.maximum),
						b = Nb(I, g.unit.one, g.unit.few, g.unit.many);
					return `Занадта вялікі: чакалася, што ${n.origin ?? 'значэнне'} павінна ${g.verb} ${$}${n.maximum.toString()} ${b}`;
				}
				return `Занадта вялікі: чакалася, што ${n.origin ?? 'значэнне'} павінна быць ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) {
					let I = Number(n.minimum),
						b = Nb(I, g.unit.one, g.unit.few, g.unit.many);
					return `Занадта малы: чакалася, што ${n.origin} павінна ${g.verb} ${$}${n.minimum.toString()} ${b}`;
				}
				return `Занадта малы: чакалася, што ${n.origin} павінна быць ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Няправільны радок: павінен пачынацца з "${$.prefix}"`;
				if ($.format === 'ends_with')
					return `Няправільны радок: павінен заканчвацца на "${$.suffix}"`;
				if ($.format === 'includes') return `Няправільны радок: павінен змяшчаць "${$.includes}"`;
				if ($.format === 'regex')
					return `Няправільны радок: павінен адпавядаць шаблону ${$.pattern}`;
				return `Няправільны ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Няправільны лік: павінен быць кратным ${n.divisor}`;
			case 'unrecognized_keys':
				return `Нераспазнаны ${n.keys.length > 1 ? 'ключы' : 'ключ'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Няправільны ключ у ${n.origin}`;
			case 'invalid_union':
				return 'Няправільны ўвод';
			case 'invalid_element':
				return `Няправільнае значэнне ў ${n.origin}`;
			default:
				return 'Няправільны ўвод';
		}
	};
};
function qg() {
	return { localeError: q1() };
}
var W1 = () => {
	let r = {
		string: { unit: 'символа', verb: 'да съдържа' },
		file: { unit: 'байта', verb: 'да съдържа' },
		array: { unit: 'елемента', verb: 'да съдържа' },
		set: { unit: 'елемента', verb: 'да съдържа' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'вход',
			email: 'имейл адрес',
			url: 'URL',
			emoji: 'емоджи',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO време',
			date: 'ISO дата',
			time: 'ISO време',
			duration: 'ISO продължителност',
			ipv4: 'IPv4 адрес',
			ipv6: 'IPv6 адрес',
			cidrv4: 'IPv4 диапазон',
			cidrv6: 'IPv6 диапазон',
			base64: 'base64-кодиран низ',
			base64url: 'base64url-кодиран низ',
			json_string: 'JSON низ',
			e164: 'E.164 номер',
			jwt: 'JWT',
			template_literal: 'вход'
		},
		u = { nan: 'NaN', number: 'число', array: 'масив' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Невалиден вход: очакван instanceof ${n.expected}, получен ${I}`;
				return `Невалиден вход: очакван ${$}, получен ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Невалиден вход: очакван ${S(n.values[0])}`;
				return `Невалидна опция: очаквано едно от ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Твърде голямо: очаква се ${n.origin ?? 'стойност'} да съдържа ${$}${n.maximum.toString()} ${g.unit ?? 'елемента'}`;
				return `Твърде голямо: очаква се ${n.origin ?? 'стойност'} да бъде ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Твърде малко: очаква се ${n.origin} да съдържа ${$}${n.minimum.toString()} ${g.unit}`;
				return `Твърде малко: очаква се ${n.origin} да бъде ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Невалиден низ: трябва да започва с "${$.prefix}"`;
				if ($.format === 'ends_with') return `Невалиден низ: трябва да завършва с "${$.suffix}"`;
				if ($.format === 'includes') return `Невалиден низ: трябва да включва "${$.includes}"`;
				if ($.format === 'regex') return `Невалиден низ: трябва да съвпада с ${$.pattern}`;
				let g = 'Невалиден';
				if ($.format === 'emoji') g = 'Невалидно';
				if ($.format === 'datetime') g = 'Невалидно';
				if ($.format === 'date') g = 'Невалидна';
				if ($.format === 'time') g = 'Невалидно';
				if ($.format === 'duration') g = 'Невалидна';
				return `${g} ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Невалидно число: трябва да бъде кратно на ${n.divisor}`;
			case 'unrecognized_keys':
				return `Неразпознат${n.keys.length > 1 ? 'и' : ''} ключ${n.keys.length > 1 ? 'ове' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Невалиден ключ в ${n.origin}`;
			case 'invalid_union':
				return 'Невалиден вход';
			case 'invalid_element':
				return `Невалидна стойност в ${n.origin}`;
			default:
				return 'Невалиден вход';
		}
	};
};
function Wg() {
	return { localeError: W1() };
}
var V1 = () => {
	let r = {
		string: { unit: 'caràcters', verb: 'contenir' },
		file: { unit: 'bytes', verb: 'contenir' },
		array: { unit: 'elements', verb: 'contenir' },
		set: { unit: 'elements', verb: 'contenir' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'entrada',
			email: 'adreça electrònica',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'data i hora ISO',
			date: 'data ISO',
			time: 'hora ISO',
			duration: 'durada ISO',
			ipv4: 'adreça IPv4',
			ipv6: 'adreça IPv6',
			cidrv4: 'rang IPv4',
			cidrv6: 'rang IPv6',
			base64: 'cadena codificada en base64',
			base64url: 'cadena codificada en base64url',
			json_string: 'cadena JSON',
			e164: 'número E.164',
			jwt: 'JWT',
			template_literal: 'entrada'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Tipus invàlid: s'esperava instanceof ${n.expected}, s'ha rebut ${I}`;
				return `Tipus invàlid: s'esperava ${$}, s'ha rebut ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Valor invàlid: s'esperava ${S(n.values[0])}`;
				return `Opció invàlida: s'esperava una de ${k(n.values, ' o ')}`;
			case 'too_big': {
				let $ = n.inclusive ? 'com a màxim' : 'menys de',
					g = i(n.origin);
				if (g)
					return `Massa gran: s'esperava que ${n.origin ?? 'el valor'} contingués ${$} ${n.maximum.toString()} ${g.unit ?? 'elements'}`;
				return `Massa gran: s'esperava que ${n.origin ?? 'el valor'} fos ${$} ${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? 'com a mínim' : 'més de',
					g = i(n.origin);
				if (g)
					return `Massa petit: s'esperava que ${n.origin} contingués ${$} ${n.minimum.toString()} ${g.unit}`;
				return `Massa petit: s'esperava que ${n.origin} fos ${$} ${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Format invàlid: ha de començar amb "${$.prefix}"`;
				if ($.format === 'ends_with') return `Format invàlid: ha d'acabar amb "${$.suffix}"`;
				if ($.format === 'includes') return `Format invàlid: ha d'incloure "${$.includes}"`;
				if ($.format === 'regex')
					return `Format invàlid: ha de coincidir amb el patró ${$.pattern}`;
				return `Format invàlid per a ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Número invàlid: ha de ser múltiple de ${n.divisor}`;
			case 'unrecognized_keys':
				return `Clau${n.keys.length > 1 ? 's' : ''} no reconeguda${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Clau invàlida a ${n.origin}`;
			case 'invalid_union':
				return 'Entrada invàlida';
			case 'invalid_element':
				return `Element invàlid a ${n.origin}`;
			default:
				return 'Entrada invàlida';
		}
	};
};
function Vg() {
	return { localeError: V1() };
}
var Y1 = () => {
	let r = {
		string: { unit: 'znaků', verb: 'mít' },
		file: { unit: 'bajtů', verb: 'mít' },
		array: { unit: 'prvků', verb: 'mít' },
		set: { unit: 'prvků', verb: 'mít' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'regulární výraz',
			email: 'e-mailová adresa',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'datum a čas ve formátu ISO',
			date: 'datum ve formátu ISO',
			time: 'čas ve formátu ISO',
			duration: 'doba trvání ISO',
			ipv4: 'IPv4 adresa',
			ipv6: 'IPv6 adresa',
			cidrv4: 'rozsah IPv4',
			cidrv6: 'rozsah IPv6',
			base64: 'řetězec zakódovaný ve formátu base64',
			base64url: 'řetězec zakódovaný ve formátu base64url',
			json_string: 'řetězec ve formátu JSON',
			e164: 'číslo E.164',
			jwt: 'JWT',
			template_literal: 'vstup'
		},
		u = { nan: 'NaN', number: 'číslo', string: 'řetězec', function: 'funkce', array: 'pole' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Neplatný vstup: očekáváno instanceof ${n.expected}, obdrženo ${I}`;
				return `Neplatný vstup: očekáváno ${$}, obdrženo ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Neplatný vstup: očekáváno ${S(n.values[0])}`;
				return `Neplatná možnost: očekávána jedna z hodnot ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Hodnota je příliš velká: ${n.origin ?? 'hodnota'} musí mít ${$}${n.maximum.toString()} ${g.unit ?? 'prvků'}`;
				return `Hodnota je příliš velká: ${n.origin ?? 'hodnota'} musí být ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Hodnota je příliš malá: ${n.origin ?? 'hodnota'} musí mít ${$}${n.minimum.toString()} ${g.unit ?? 'prvků'}`;
				return `Hodnota je příliš malá: ${n.origin ?? 'hodnota'} musí být ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Neplatný řetězec: musí začínat na "${$.prefix}"`;
				if ($.format === 'ends_with') return `Neplatný řetězec: musí končit na "${$.suffix}"`;
				if ($.format === 'includes') return `Neplatný řetězec: musí obsahovat "${$.includes}"`;
				if ($.format === 'regex') return `Neplatný řetězec: musí odpovídat vzoru ${$.pattern}`;
				return `Neplatný formát ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Neplatné číslo: musí být násobkem ${n.divisor}`;
			case 'unrecognized_keys':
				return `Neznámé klíče: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Neplatný klíč v ${n.origin}`;
			case 'invalid_union':
				return 'Neplatný vstup';
			case 'invalid_element':
				return `Neplatná hodnota v ${n.origin}`;
			default:
				return 'Neplatný vstup';
		}
	};
};
function Yg() {
	return { localeError: Y1() };
}
var E1 = () => {
	let r = {
		string: { unit: 'tegn', verb: 'havde' },
		file: { unit: 'bytes', verb: 'havde' },
		array: { unit: 'elementer', verb: 'indeholdt' },
		set: { unit: 'elementer', verb: 'indeholdt' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'input',
			email: 'e-mailadresse',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO dato- og klokkeslæt',
			date: 'ISO-dato',
			time: 'ISO-klokkeslæt',
			duration: 'ISO-varighed',
			ipv4: 'IPv4-område',
			ipv6: 'IPv6-område',
			cidrv4: 'IPv4-spektrum',
			cidrv6: 'IPv6-spektrum',
			base64: 'base64-kodet streng',
			base64url: 'base64url-kodet streng',
			json_string: 'JSON-streng',
			e164: 'E.164-nummer',
			jwt: 'JWT',
			template_literal: 'input'
		},
		u = {
			nan: 'NaN',
			string: 'streng',
			number: 'tal',
			boolean: 'boolean',
			array: 'liste',
			object: 'objekt',
			set: 'sæt',
			file: 'fil'
		};
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Ugyldigt input: forventede instanceof ${n.expected}, fik ${I}`;
				return `Ugyldigt input: forventede ${$}, fik ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Ugyldig værdi: forventede ${S(n.values[0])}`;
				return `Ugyldigt valg: forventede en af følgende ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin),
					I = u[n.origin] ?? n.origin;
				if (g)
					return `For stor: forventede ${I ?? 'value'} ${g.verb} ${$} ${n.maximum.toString()} ${g.unit ?? 'elementer'}`;
				return `For stor: forventede ${I ?? 'value'} havde ${$} ${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin),
					I = u[n.origin] ?? n.origin;
				if (g) return `For lille: forventede ${I} ${g.verb} ${$} ${n.minimum.toString()} ${g.unit}`;
				return `For lille: forventede ${I} havde ${$} ${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Ugyldig streng: skal starte med "${$.prefix}"`;
				if ($.format === 'ends_with') return `Ugyldig streng: skal ende med "${$.suffix}"`;
				if ($.format === 'includes') return `Ugyldig streng: skal indeholde "${$.includes}"`;
				if ($.format === 'regex') return `Ugyldig streng: skal matche mønsteret ${$.pattern}`;
				return `Ugyldig ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Ugyldigt tal: skal være deleligt med ${n.divisor}`;
			case 'unrecognized_keys':
				return `${n.keys.length > 1 ? 'Ukendte nøgler' : 'Ukendt nøgle'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Ugyldig nøgle i ${n.origin}`;
			case 'invalid_union':
				return 'Ugyldigt input: matcher ingen af de tilladte typer';
			case 'invalid_element':
				return `Ugyldig værdi i ${n.origin}`;
			default:
				return 'Ugyldigt input';
		}
	};
};
function Eg() {
	return { localeError: E1() };
}
var K1 = () => {
	let r = {
		string: { unit: 'Zeichen', verb: 'zu haben' },
		file: { unit: 'Bytes', verb: 'zu haben' },
		array: { unit: 'Elemente', verb: 'zu haben' },
		set: { unit: 'Elemente', verb: 'zu haben' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'Eingabe',
			email: 'E-Mail-Adresse',
			url: 'URL',
			emoji: 'Emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO-Datum und -Uhrzeit',
			date: 'ISO-Datum',
			time: 'ISO-Uhrzeit',
			duration: 'ISO-Dauer',
			ipv4: 'IPv4-Adresse',
			ipv6: 'IPv6-Adresse',
			cidrv4: 'IPv4-Bereich',
			cidrv6: 'IPv6-Bereich',
			base64: 'Base64-codierter String',
			base64url: 'Base64-URL-codierter String',
			json_string: 'JSON-String',
			e164: 'E.164-Nummer',
			jwt: 'JWT',
			template_literal: 'Eingabe'
		},
		u = { nan: 'NaN', number: 'Zahl', array: 'Array' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Ungültige Eingabe: erwartet instanceof ${n.expected}, erhalten ${I}`;
				return `Ungültige Eingabe: erwartet ${$}, erhalten ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Ungültige Eingabe: erwartet ${S(n.values[0])}`;
				return `Ungültige Option: erwartet eine von ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Zu groß: erwartet, dass ${n.origin ?? 'Wert'} ${$}${n.maximum.toString()} ${g.unit ?? 'Elemente'} hat`;
				return `Zu groß: erwartet, dass ${n.origin ?? 'Wert'} ${$}${n.maximum.toString()} ist`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Zu klein: erwartet, dass ${n.origin} ${$}${n.minimum.toString()} ${g.unit} hat`;
				return `Zu klein: erwartet, dass ${n.origin} ${$}${n.minimum.toString()} ist`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Ungültiger String: muss mit "${$.prefix}" beginnen`;
				if ($.format === 'ends_with') return `Ungültiger String: muss mit "${$.suffix}" enden`;
				if ($.format === 'includes') return `Ungültiger String: muss "${$.includes}" enthalten`;
				if ($.format === 'regex')
					return `Ungültiger String: muss dem Muster ${$.pattern} entsprechen`;
				return `Ungültig: ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Ungültige Zahl: muss ein Vielfaches von ${n.divisor} sein`;
			case 'unrecognized_keys':
				return `${n.keys.length > 1 ? 'Unbekannte Schlüssel' : 'Unbekannter Schlüssel'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Ungültiger Schlüssel in ${n.origin}`;
			case 'invalid_union':
				return 'Ungültige Eingabe';
			case 'invalid_element':
				return `Ungültiger Wert in ${n.origin}`;
			default:
				return 'Ungültige Eingabe';
		}
	};
};
function Kg() {
	return { localeError: K1() };
}
var Q1 = () => {
	let r = {
		string: { unit: 'χαρακτήρες', verb: 'να έχει' },
		file: { unit: 'bytes', verb: 'να έχει' },
		array: { unit: 'στοιχεία', verb: 'να έχει' },
		set: { unit: 'στοιχεία', verb: 'να έχει' },
		map: { unit: 'καταχωρήσεις', verb: 'να έχει' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'είσοδος',
			email: 'διεύθυνση email',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO ημερομηνία και ώρα',
			date: 'ISO ημερομηνία',
			time: 'ISO ώρα',
			duration: 'ISO διάρκεια',
			ipv4: 'διεύθυνση IPv4',
			ipv6: 'διεύθυνση IPv6',
			mac: 'διεύθυνση MAC',
			cidrv4: 'εύρος IPv4',
			cidrv6: 'εύρος IPv6',
			base64: 'συμβολοσειρά κωδικοποιημένη σε base64',
			base64url: 'συμβολοσειρά κωδικοποιημένη σε base64url',
			json_string: 'συμβολοσειρά JSON',
			e164: 'αριθμός E.164',
			jwt: 'JWT',
			template_literal: 'είσοδος'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (typeof n.expected === 'string' && /^[A-Z]/.test(n.expected))
					return `Μη έγκυρη είσοδος: αναμενόταν instanceof ${n.expected}, λήφθηκε ${I}`;
				return `Μη έγκυρη είσοδος: αναμενόταν ${$}, λήφθηκε ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Μη έγκυρη είσοδος: αναμενόταν ${S(n.values[0])}`;
				return `Μη έγκυρη επιλογή: αναμενόταν ένα από ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Πολύ μεγάλο: αναμενόταν ${n.origin ?? 'τιμή'} να έχει ${$}${n.maximum.toString()} ${g.unit ?? 'στοιχεία'}`;
				return `Πολύ μεγάλο: αναμενόταν ${n.origin ?? 'τιμή'} να είναι ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Πολύ μικρό: αναμενόταν ${n.origin} να έχει ${$}${n.minimum.toString()} ${g.unit}`;
				return `Πολύ μικρό: αναμενόταν ${n.origin} να είναι ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Μη έγκυρη συμβολοσειρά: πρέπει να ξεκινά με "${$.prefix}"`;
				if ($.format === 'ends_with')
					return `Μη έγκυρη συμβολοσειρά: πρέπει να τελειώνει με "${$.suffix}"`;
				if ($.format === 'includes')
					return `Μη έγκυρη συμβολοσειρά: πρέπει να περιέχει "${$.includes}"`;
				if ($.format === 'regex')
					return `Μη έγκυρη συμβολοσειρά: πρέπει να ταιριάζει με το μοτίβο ${$.pattern}`;
				return `Μη έγκυρο: ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Μη έγκυρος αριθμός: πρέπει να είναι πολλαπλάσιο του ${n.divisor}`;
			case 'unrecognized_keys':
				return `Άγνωστ${n.keys.length > 1 ? 'α' : 'ο'} κλειδ${n.keys.length > 1 ? 'ιά' : 'ί'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Μη έγκυρο κλειδί στο ${n.origin}`;
			case 'invalid_union':
				return 'Μη έγκυρη είσοδος';
			case 'invalid_element':
				return `Μη έγκυρη τιμή στο ${n.origin}`;
			default:
				return 'Μη έγκυρη είσοδος';
		}
	};
};
function Qg() {
	return { localeError: Q1() };
}
var T1 = () => {
	let r = {
		string: { unit: 'characters', verb: 'to have' },
		file: { unit: 'bytes', verb: 'to have' },
		array: { unit: 'items', verb: 'to have' },
		set: { unit: 'items', verb: 'to have' },
		map: { unit: 'entries', verb: 'to have' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'input',
			email: 'email address',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO datetime',
			date: 'ISO date',
			time: 'ISO time',
			duration: 'ISO duration',
			ipv4: 'IPv4 address',
			ipv6: 'IPv6 address',
			mac: 'MAC address',
			cidrv4: 'IPv4 range',
			cidrv6: 'IPv6 range',
			base64: 'base64-encoded string',
			base64url: 'base64url-encoded string',
			json_string: 'JSON string',
			e164: 'E.164 number',
			jwt: 'JWT',
			template_literal: 'input'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				return `Invalid input: expected ${$}, received ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Invalid input: expected ${S(n.values[0])}`;
				return `Invalid option: expected one of ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Too big: expected ${n.origin ?? 'value'} to have ${$}${n.maximum.toString()} ${g.unit ?? 'elements'}`;
				return `Too big: expected ${n.origin ?? 'value'} to be ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Too small: expected ${n.origin} to have ${$}${n.minimum.toString()} ${g.unit}`;
				return `Too small: expected ${n.origin} to be ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Invalid string: must start with "${$.prefix}"`;
				if ($.format === 'ends_with') return `Invalid string: must end with "${$.suffix}"`;
				if ($.format === 'includes') return `Invalid string: must include "${$.includes}"`;
				if ($.format === 'regex') return `Invalid string: must match pattern ${$.pattern}`;
				return `Invalid ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Invalid number: must be a multiple of ${n.divisor}`;
			case 'unrecognized_keys':
				return `Unrecognized key${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Invalid key in ${n.origin}`;
			case 'invalid_union':
				if (n.options && Array.isArray(n.options) && n.options.length > 0)
					return `Invalid discriminator value. Expected ${n.options.map((g) => `'${g}'`).join(' | ')}`;
				return 'Invalid input';
			case 'invalid_element':
				return `Invalid value in ${n.origin}`;
			default:
				return 'Invalid input';
		}
	};
};
function Mn() {
	return { localeError: T1() };
}
var H1 = () => {
	let r = {
		string: { unit: 'karaktrojn', verb: 'havi' },
		file: { unit: 'bajtojn', verb: 'havi' },
		array: { unit: 'elementojn', verb: 'havi' },
		set: { unit: 'elementojn', verb: 'havi' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'enigo',
			email: 'retadreso',
			url: 'URL',
			emoji: 'emoĝio',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO-datotempo',
			date: 'ISO-dato',
			time: 'ISO-tempo',
			duration: 'ISO-daŭro',
			ipv4: 'IPv4-adreso',
			ipv6: 'IPv6-adreso',
			cidrv4: 'IPv4-rango',
			cidrv6: 'IPv6-rango',
			base64: '64-ume kodita karaktraro',
			base64url: 'URL-64-ume kodita karaktraro',
			json_string: 'JSON-karaktraro',
			e164: 'E.164-nombro',
			jwt: 'JWT',
			template_literal: 'enigo'
		},
		u = { nan: 'NaN', number: 'nombro', array: 'tabelo', null: 'senvalora' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Nevalida enigo: atendiĝis instanceof ${n.expected}, riceviĝis ${I}`;
				return `Nevalida enigo: atendiĝis ${$}, riceviĝis ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Nevalida enigo: atendiĝis ${S(n.values[0])}`;
				return `Nevalida opcio: atendiĝis unu el ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Tro granda: atendiĝis ke ${n.origin ?? 'valoro'} havu ${$}${n.maximum.toString()} ${g.unit ?? 'elementojn'}`;
				return `Tro granda: atendiĝis ke ${n.origin ?? 'valoro'} havu ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Tro malgranda: atendiĝis ke ${n.origin} havu ${$}${n.minimum.toString()} ${g.unit}`;
				return `Tro malgranda: atendiĝis ke ${n.origin} estu ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Nevalida karaktraro: devas komenciĝi per "${$.prefix}"`;
				if ($.format === 'ends_with') return `Nevalida karaktraro: devas finiĝi per "${$.suffix}"`;
				if ($.format === 'includes') return `Nevalida karaktraro: devas inkluzivi "${$.includes}"`;
				if ($.format === 'regex')
					return `Nevalida karaktraro: devas kongrui kun la modelo ${$.pattern}`;
				return `Nevalida ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Nevalida nombro: devas esti oblo de ${n.divisor}`;
			case 'unrecognized_keys':
				return `Nekonata${n.keys.length > 1 ? 'j' : ''} ŝlosilo${n.keys.length > 1 ? 'j' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Nevalida ŝlosilo en ${n.origin}`;
			case 'invalid_union':
				return 'Nevalida enigo';
			case 'invalid_element':
				return `Nevalida valoro en ${n.origin}`;
			default:
				return 'Nevalida enigo';
		}
	};
};
function Tg() {
	return { localeError: H1() };
}
var B1 = () => {
	let r = {
		string: { unit: 'caracteres', verb: 'tener' },
		file: { unit: 'bytes', verb: 'tener' },
		array: { unit: 'elementos', verb: 'tener' },
		set: { unit: 'elementos', verb: 'tener' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'entrada',
			email: 'dirección de correo electrónico',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'fecha y hora ISO',
			date: 'fecha ISO',
			time: 'hora ISO',
			duration: 'duración ISO',
			ipv4: 'dirección IPv4',
			ipv6: 'dirección IPv6',
			cidrv4: 'rango IPv4',
			cidrv6: 'rango IPv6',
			base64: 'cadena codificada en base64',
			base64url: 'URL codificada en base64',
			json_string: 'cadena JSON',
			e164: 'número E.164',
			jwt: 'JWT',
			template_literal: 'entrada'
		},
		u = {
			nan: 'NaN',
			string: 'texto',
			number: 'número',
			boolean: 'booleano',
			array: 'arreglo',
			object: 'objeto',
			set: 'conjunto',
			file: 'archivo',
			date: 'fecha',
			bigint: 'número grande',
			symbol: 'símbolo',
			undefined: 'indefinido',
			null: 'nulo',
			function: 'función',
			map: 'mapa',
			record: 'registro',
			tuple: 'tupla',
			enum: 'enumeración',
			union: 'unión',
			literal: 'literal',
			promise: 'promesa',
			void: 'vacío',
			never: 'nunca',
			unknown: 'desconocido',
			any: 'cualquiera'
		};
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Entrada inválida: se esperaba instanceof ${n.expected}, recibido ${I}`;
				return `Entrada inválida: se esperaba ${$}, recibido ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Entrada inválida: se esperaba ${S(n.values[0])}`;
				return `Opción inválida: se esperaba una de ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin),
					I = u[n.origin] ?? n.origin;
				if (g)
					return `Demasiado grande: se esperaba que ${I ?? 'valor'} tuviera ${$}${n.maximum.toString()} ${g.unit ?? 'elementos'}`;
				return `Demasiado grande: se esperaba que ${I ?? 'valor'} fuera ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin),
					I = u[n.origin] ?? n.origin;
				if (g)
					return `Demasiado pequeño: se esperaba que ${I} tuviera ${$}${n.minimum.toString()} ${g.unit}`;
				return `Demasiado pequeño: se esperaba que ${I} fuera ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Cadena inválida: debe comenzar con "${$.prefix}"`;
				if ($.format === 'ends_with') return `Cadena inválida: debe terminar en "${$.suffix}"`;
				if ($.format === 'includes') return `Cadena inválida: debe incluir "${$.includes}"`;
				if ($.format === 'regex')
					return `Cadena inválida: debe coincidir con el patrón ${$.pattern}`;
				return `Inválido ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Número inválido: debe ser múltiplo de ${n.divisor}`;
			case 'unrecognized_keys':
				return `Llave${n.keys.length > 1 ? 's' : ''} desconocida${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Llave inválida en ${u[n.origin] ?? n.origin}`;
			case 'invalid_union':
				return 'Entrada inválida';
			case 'invalid_element':
				return `Valor inválido en ${u[n.origin] ?? n.origin}`;
			default:
				return 'Entrada inválida';
		}
	};
};
function Hg() {
	return { localeError: B1() };
}
var t1 = () => {
	let r = {
		string: { unit: 'کاراکتر', verb: 'داشته باشد' },
		file: { unit: 'بایت', verb: 'داشته باشد' },
		array: { unit: 'آیتم', verb: 'داشته باشد' },
		set: { unit: 'آیتم', verb: 'داشته باشد' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'ورودی',
			email: 'آدرس ایمیل',
			url: 'URL',
			emoji: 'ایموجی',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'تاریخ و زمان ایزو',
			date: 'تاریخ ایزو',
			time: 'زمان ایزو',
			duration: 'مدت زمان ایزو',
			ipv4: 'IPv4 آدرس',
			ipv6: 'IPv6 آدرس',
			cidrv4: 'IPv4 دامنه',
			cidrv6: 'IPv6 دامنه',
			base64: 'base64-encoded رشته',
			base64url: 'base64url-encoded رشته',
			json_string: 'JSON رشته',
			e164: 'E.164 عدد',
			jwt: 'JWT',
			template_literal: 'ورودی'
		},
		u = { nan: 'NaN', number: 'عدد', array: 'آرایه' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `ورودی نامعتبر: می‌بایست instanceof ${n.expected} می‌بود، ${I} دریافت شد`;
				return `ورودی نامعتبر: می‌بایست ${$} می‌بود، ${I} دریافت شد`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `ورودی نامعتبر: می‌بایست ${S(n.values[0])} می‌بود`;
				return `گزینه نامعتبر: می‌بایست یکی از ${k(n.values, '|')} می‌بود`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `خیلی بزرگ: ${n.origin ?? 'مقدار'} باید ${$}${n.maximum.toString()} ${g.unit ?? 'عنصر'} باشد`;
				return `خیلی بزرگ: ${n.origin ?? 'مقدار'} باید ${$}${n.maximum.toString()} باشد`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) return `خیلی کوچک: ${n.origin} باید ${$}${n.minimum.toString()} ${g.unit} باشد`;
				return `خیلی کوچک: ${n.origin} باید ${$}${n.minimum.toString()} باشد`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `رشته نامعتبر: باید با "${$.prefix}" شروع شود`;
				if ($.format === 'ends_with') return `رشته نامعتبر: باید با "${$.suffix}" تمام شود`;
				if ($.format === 'includes') return `رشته نامعتبر: باید شامل "${$.includes}" باشد`;
				if ($.format === 'regex')
					return `رشته نامعتبر: باید با الگوی ${$.pattern} مطابقت داشته باشد`;
				return `${v[$.format] ?? n.format} نامعتبر`;
			}
			case 'not_multiple_of':
				return `عدد نامعتبر: باید مضرب ${n.divisor} باشد`;
			case 'unrecognized_keys':
				return `کلید${n.keys.length > 1 ? 'های' : ''} ناشناس: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `کلید ناشناس در ${n.origin}`;
			case 'invalid_union':
				return 'ورودی نامعتبر';
			case 'invalid_element':
				return `مقدار نامعتبر در ${n.origin}`;
			default:
				return 'ورودی نامعتبر';
		}
	};
};
function Bg() {
	return { localeError: t1() };
}
var M1 = () => {
	let r = {
		string: { unit: 'merkkiä', subject: 'merkkijonon' },
		file: { unit: 'tavua', subject: 'tiedoston' },
		array: { unit: 'alkiota', subject: 'listan' },
		set: { unit: 'alkiota', subject: 'joukon' },
		number: { unit: '', subject: 'luvun' },
		bigint: { unit: '', subject: 'suuren kokonaisluvun' },
		int: { unit: '', subject: 'kokonaisluvun' },
		date: { unit: '', subject: 'päivämäärän' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'säännöllinen lauseke',
			email: 'sähköpostiosoite',
			url: 'URL-osoite',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO-aikaleima',
			date: 'ISO-päivämäärä',
			time: 'ISO-aika',
			duration: 'ISO-kesto',
			ipv4: 'IPv4-osoite',
			ipv6: 'IPv6-osoite',
			cidrv4: 'IPv4-alue',
			cidrv6: 'IPv6-alue',
			base64: 'base64-koodattu merkkijono',
			base64url: 'base64url-koodattu merkkijono',
			json_string: 'JSON-merkkijono',
			e164: 'E.164-luku',
			jwt: 'JWT',
			template_literal: 'templaattimerkkijono'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Virheellinen tyyppi: odotettiin instanceof ${n.expected}, oli ${I}`;
				return `Virheellinen tyyppi: odotettiin ${$}, oli ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Virheellinen syöte: täytyy olla ${S(n.values[0])}`;
				return `Virheellinen valinta: täytyy olla yksi seuraavista: ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Liian suuri: ${g.subject} täytyy olla ${$}${n.maximum.toString()} ${g.unit}`.trim();
				return `Liian suuri: arvon täytyy olla ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Liian pieni: ${g.subject} täytyy olla ${$}${n.minimum.toString()} ${g.unit}`.trim();
				return `Liian pieni: arvon täytyy olla ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Virheellinen syöte: täytyy alkaa "${$.prefix}"`;
				if ($.format === 'ends_with') return `Virheellinen syöte: täytyy loppua "${$.suffix}"`;
				if ($.format === 'includes') return `Virheellinen syöte: täytyy sisältää "${$.includes}"`;
				if ($.format === 'regex')
					return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${$.pattern}`;
				return `Virheellinen ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Virheellinen luku: täytyy olla luvun ${n.divisor} monikerta`;
			case 'unrecognized_keys':
				return `${n.keys.length > 1 ? 'Tuntemattomat avaimet' : 'Tuntematon avain'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return 'Virheellinen avain tietueessa';
			case 'invalid_union':
				return 'Virheellinen unioni';
			case 'invalid_element':
				return 'Virheellinen arvo joukossa';
			default:
				return 'Virheellinen syöte';
		}
	};
};
function tg() {
	return { localeError: M1() };
}
var A1 = () => {
	let r = {
		string: { unit: 'caractères', verb: 'avoir' },
		file: { unit: 'octets', verb: 'avoir' },
		array: { unit: 'éléments', verb: 'avoir' },
		set: { unit: 'éléments', verb: 'avoir' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'entrée',
			email: 'adresse e-mail',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'date et heure ISO',
			date: 'date ISO',
			time: 'heure ISO',
			duration: 'durée ISO',
			ipv4: 'adresse IPv4',
			ipv6: 'adresse IPv6',
			cidrv4: 'plage IPv4',
			cidrv6: 'plage IPv6',
			base64: 'chaîne encodée en base64',
			base64url: 'chaîne encodée en base64url',
			json_string: 'chaîne JSON',
			e164: 'numéro E.164',
			jwt: 'JWT',
			template_literal: 'entrée'
		},
		u = {
			string: 'chaîne',
			number: 'nombre',
			int: 'entier',
			boolean: 'booléen',
			bigint: 'grand entier',
			symbol: 'symbole',
			undefined: 'indéfini',
			null: 'null',
			never: 'jamais',
			void: 'vide',
			date: 'date',
			array: 'tableau',
			object: 'objet',
			tuple: 'tuple',
			record: 'enregistrement',
			map: 'carte',
			set: 'ensemble',
			file: 'fichier',
			nonoptional: 'non-optionnel',
			nan: 'NaN',
			function: 'fonction'
		};
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Entrée invalide : instanceof ${n.expected} attendu, ${I} reçu`;
				return `Entrée invalide : ${$} attendu, ${I} reçu`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Entrée invalide : ${S(n.values[0])} attendu`;
				return `Option invalide : une valeur parmi ${k(n.values, '|')} attendue`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Trop grand : ${u[n.origin] ?? 'valeur'} doit ${g.verb} ${$}${n.maximum.toString()} ${g.unit ?? 'élément(s)'}`;
				return `Trop grand : ${u[n.origin] ?? 'valeur'} doit être ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Trop petit : ${u[n.origin] ?? 'valeur'} doit ${g.verb} ${$}${n.minimum.toString()} ${g.unit}`;
				return `Trop petit : ${u[n.origin] ?? 'valeur'} doit être ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Chaîne invalide : doit commencer par "${$.prefix}"`;
				if ($.format === 'ends_with') return `Chaîne invalide : doit se terminer par "${$.suffix}"`;
				if ($.format === 'includes') return `Chaîne invalide : doit inclure "${$.includes}"`;
				if ($.format === 'regex')
					return `Chaîne invalide : doit correspondre au modèle ${$.pattern}`;
				return `${v[$.format] ?? n.format} invalide`;
			}
			case 'not_multiple_of':
				return `Nombre invalide : doit être un multiple de ${n.divisor}`;
			case 'unrecognized_keys':
				return `Clé${n.keys.length > 1 ? 's' : ''} non reconnue${n.keys.length > 1 ? 's' : ''} : ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Clé invalide dans ${n.origin}`;
			case 'invalid_union':
				return 'Entrée invalide';
			case 'invalid_element':
				return `Valeur invalide dans ${n.origin}`;
			default:
				return 'Entrée invalide';
		}
	};
};
function Mg() {
	return { localeError: A1() };
}
var R1 = () => {
	let r = {
		string: { unit: 'caractères', verb: 'avoir' },
		file: { unit: 'octets', verb: 'avoir' },
		array: { unit: 'éléments', verb: 'avoir' },
		set: { unit: 'éléments', verb: 'avoir' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'entrée',
			email: 'adresse courriel',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'date-heure ISO',
			date: 'date ISO',
			time: 'heure ISO',
			duration: 'durée ISO',
			ipv4: 'adresse IPv4',
			ipv6: 'adresse IPv6',
			cidrv4: 'plage IPv4',
			cidrv6: 'plage IPv6',
			base64: 'chaîne encodée en base64',
			base64url: 'chaîne encodée en base64url',
			json_string: 'chaîne JSON',
			e164: 'numéro E.164',
			jwt: 'JWT',
			template_literal: 'entrée'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Entrée invalide : attendu instanceof ${n.expected}, reçu ${I}`;
				return `Entrée invalide : attendu ${$}, reçu ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Entrée invalide : attendu ${S(n.values[0])}`;
				return `Option invalide : attendu l'une des valeurs suivantes ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '≤' : '<',
					g = i(n.origin);
				if (g)
					return `Trop grand : attendu que ${n.origin ?? 'la valeur'} ait ${$}${n.maximum.toString()} ${g.unit}`;
				return `Trop grand : attendu que ${n.origin ?? 'la valeur'} soit ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '≥' : '>',
					g = i(n.origin);
				if (g)
					return `Trop petit : attendu que ${n.origin} ait ${$}${n.minimum.toString()} ${g.unit}`;
				return `Trop petit : attendu que ${n.origin} soit ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Chaîne invalide : doit commencer par "${$.prefix}"`;
				if ($.format === 'ends_with') return `Chaîne invalide : doit se terminer par "${$.suffix}"`;
				if ($.format === 'includes') return `Chaîne invalide : doit inclure "${$.includes}"`;
				if ($.format === 'regex')
					return `Chaîne invalide : doit correspondre au motif ${$.pattern}`;
				return `${v[$.format] ?? n.format} invalide`;
			}
			case 'not_multiple_of':
				return `Nombre invalide : doit être un multiple de ${n.divisor}`;
			case 'unrecognized_keys':
				return `Clé${n.keys.length > 1 ? 's' : ''} non reconnue${n.keys.length > 1 ? 's' : ''} : ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Clé invalide dans ${n.origin}`;
			case 'invalid_union':
				return 'Entrée invalide';
			case 'invalid_element':
				return `Valeur invalide dans ${n.origin}`;
			default:
				return 'Entrée invalide';
		}
	};
};
function Ag() {
	return { localeError: R1() };
}
var F1 = () => {
	let r = {
			string: { label: 'מחרוזת', gender: 'f' },
			number: { label: 'מספר', gender: 'm' },
			boolean: { label: 'ערך בוליאני', gender: 'm' },
			bigint: { label: 'BigInt', gender: 'm' },
			date: { label: 'תאריך', gender: 'm' },
			array: { label: 'מערך', gender: 'm' },
			object: { label: 'אובייקט', gender: 'm' },
			null: { label: 'ערך ריק (null)', gender: 'm' },
			undefined: { label: 'ערך לא מוגדר (undefined)', gender: 'm' },
			symbol: { label: 'סימבול (Symbol)', gender: 'm' },
			function: { label: 'פונקציה', gender: 'f' },
			map: { label: 'מפה (Map)', gender: 'f' },
			set: { label: 'קבוצה (Set)', gender: 'f' },
			file: { label: 'קובץ', gender: 'm' },
			promise: { label: 'Promise', gender: 'm' },
			NaN: { label: 'NaN', gender: 'm' },
			unknown: { label: 'ערך לא ידוע', gender: 'm' },
			value: { label: 'ערך', gender: 'm' }
		},
		i = {
			string: { unit: 'תווים', shortLabel: 'קצר', longLabel: 'ארוך' },
			file: { unit: 'בייטים', shortLabel: 'קטן', longLabel: 'גדול' },
			array: { unit: 'פריטים', shortLabel: 'קטן', longLabel: 'גדול' },
			set: { unit: 'פריטים', shortLabel: 'קטן', longLabel: 'גדול' },
			number: { unit: '', shortLabel: 'קטן', longLabel: 'גדול' }
		},
		v = (o) => (o ? r[o] : void 0),
		u = (o) => {
			let _ = v(o);
			if (_) return _.label;
			return o ?? r.unknown.label;
		},
		n = (o) => `ה${u(o)}`,
		$ = (o) => {
			return (v(o)?.gender ?? 'm') === 'f' ? 'צריכה להיות' : 'צריך להיות';
		},
		g = (o) => {
			if (!o) return null;
			return i[o] ?? null;
		},
		I = {
			regex: { label: 'קלט', gender: 'm' },
			email: { label: 'כתובת אימייל', gender: 'f' },
			url: { label: 'כתובת רשת', gender: 'f' },
			emoji: { label: "אימוג'י", gender: 'm' },
			uuid: { label: 'UUID', gender: 'm' },
			nanoid: { label: 'nanoid', gender: 'm' },
			guid: { label: 'GUID', gender: 'm' },
			cuid: { label: 'cuid', gender: 'm' },
			cuid2: { label: 'cuid2', gender: 'm' },
			ulid: { label: 'ULID', gender: 'm' },
			xid: { label: 'XID', gender: 'm' },
			ksuid: { label: 'KSUID', gender: 'm' },
			datetime: { label: 'תאריך וזמן ISO', gender: 'm' },
			date: { label: 'תאריך ISO', gender: 'm' },
			time: { label: 'זמן ISO', gender: 'm' },
			duration: { label: 'משך זמן ISO', gender: 'm' },
			ipv4: { label: 'כתובת IPv4', gender: 'f' },
			ipv6: { label: 'כתובת IPv6', gender: 'f' },
			cidrv4: { label: 'טווח IPv4', gender: 'm' },
			cidrv6: { label: 'טווח IPv6', gender: 'm' },
			base64: { label: 'מחרוזת בבסיס 64', gender: 'f' },
			base64url: { label: 'מחרוזת בבסיס 64 לכתובות רשת', gender: 'f' },
			json_string: { label: 'מחרוזת JSON', gender: 'f' },
			e164: { label: 'מספר E.164', gender: 'm' },
			jwt: { label: 'JWT', gender: 'm' },
			ends_with: { label: 'קלט', gender: 'm' },
			includes: { label: 'קלט', gender: 'm' },
			lowercase: { label: 'קלט', gender: 'm' },
			starts_with: { label: 'קלט', gender: 'm' },
			uppercase: { label: 'קלט', gender: 'm' }
		},
		b = { nan: 'NaN' };
	return (o) => {
		switch (o.code) {
			case 'invalid_type': {
				let _ = o.expected,
					l = b[_ ?? ''] ?? u(_),
					D = w(o.input),
					c = b[D] ?? r[D]?.label ?? D;
				if (/^[A-Z]/.test(o.expected))
					return `קלט לא תקין: צריך להיות instanceof ${o.expected}, התקבל ${c}`;
				return `קלט לא תקין: צריך להיות ${l}, התקבל ${c}`;
			}
			case 'invalid_value': {
				if (o.values.length === 1) return `ערך לא תקין: הערך חייב להיות ${S(o.values[0])}`;
				let _ = o.values.map((c) => S(c));
				if (o.values.length === 2) return `ערך לא תקין: האפשרויות המתאימות הן ${_[0]} או ${_[1]}`;
				let l = _[_.length - 1];
				return `ערך לא תקין: האפשרויות המתאימות הן ${_.slice(0, -1).join(', ')} או ${l}`;
			}
			case 'too_big': {
				let _ = g(o.origin),
					l = n(o.origin ?? 'value');
				if (o.origin === 'string')
					return `${_?.longLabel ?? 'ארוך'} מדי: ${l} צריכה להכיל ${o.maximum.toString()} ${_?.unit ?? ''} ${o.inclusive ? 'או פחות' : 'לכל היותר'}`.trim();
				if (o.origin === 'number') {
					let P = o.inclusive ? `קטן או שווה ל-${o.maximum}` : `קטן מ-${o.maximum}`;
					return `גדול מדי: ${l} צריך להיות ${P}`;
				}
				if (o.origin === 'array' || o.origin === 'set') {
					let P = o.origin === 'set' ? 'צריכה' : 'צריך',
						J = o.inclusive
							? `${o.maximum} ${_?.unit ?? ''} או פחות`
							: `פחות מ-${o.maximum} ${_?.unit ?? ''}`;
					return `גדול מדי: ${l} ${P} להכיל ${J}`.trim();
				}
				let D = o.inclusive ? '<=' : '<',
					c = $(o.origin ?? 'value');
				if (_?.unit) return `${_.longLabel} מדי: ${l} ${c} ${D}${o.maximum.toString()} ${_.unit}`;
				return `${_?.longLabel ?? 'גדול'} מדי: ${l} ${c} ${D}${o.maximum.toString()}`;
			}
			case 'too_small': {
				let _ = g(o.origin),
					l = n(o.origin ?? 'value');
				if (o.origin === 'string')
					return `${_?.shortLabel ?? 'קצר'} מדי: ${l} צריכה להכיל ${o.minimum.toString()} ${_?.unit ?? ''} ${o.inclusive ? 'או יותר' : 'לפחות'}`.trim();
				if (o.origin === 'number') {
					let P = o.inclusive ? `גדול או שווה ל-${o.minimum}` : `גדול מ-${o.minimum}`;
					return `קטן מדי: ${l} צריך להיות ${P}`;
				}
				if (o.origin === 'array' || o.origin === 'set') {
					let P = o.origin === 'set' ? 'צריכה' : 'צריך';
					if (o.minimum === 1 && o.inclusive) {
						let q = o.origin === 'set' ? 'לפחות פריט אחד' : 'לפחות פריט אחד';
						return `קטן מדי: ${l} ${P} להכיל ${q}`;
					}
					let J = o.inclusive
						? `${o.minimum} ${_?.unit ?? ''} או יותר`
						: `יותר מ-${o.minimum} ${_?.unit ?? ''}`;
					return `קטן מדי: ${l} ${P} להכיל ${J}`.trim();
				}
				let D = o.inclusive ? '>=' : '>',
					c = $(o.origin ?? 'value');
				if (_?.unit) return `${_.shortLabel} מדי: ${l} ${c} ${D}${o.minimum.toString()} ${_.unit}`;
				return `${_?.shortLabel ?? 'קטן'} מדי: ${l} ${c} ${D}${o.minimum.toString()}`;
			}
			case 'invalid_format': {
				let _ = o;
				if (_.format === 'starts_with') return `המחרוזת חייבת להתחיל ב "${_.prefix}"`;
				if (_.format === 'ends_with') return `המחרוזת חייבת להסתיים ב "${_.suffix}"`;
				if (_.format === 'includes') return `המחרוזת חייבת לכלול "${_.includes}"`;
				if (_.format === 'regex') return `המחרוזת חייבת להתאים לתבנית ${_.pattern}`;
				let l = I[_.format],
					D = l?.label ?? _.format,
					P = (l?.gender ?? 'm') === 'f' ? 'תקינה' : 'תקין';
				return `${D} לא ${P}`;
			}
			case 'not_multiple_of':
				return `מספר לא תקין: חייב להיות מכפלה של ${o.divisor}`;
			case 'unrecognized_keys':
				return `מפתח${o.keys.length > 1 ? 'ות' : ''} לא מזוה${o.keys.length > 1 ? 'ים' : 'ה'}: ${k(o.keys, ', ')}`;
			case 'invalid_key':
				return 'שדה לא תקין באובייקט';
			case 'invalid_union':
				return 'קלט לא תקין';
			case 'invalid_element':
				return `ערך לא תקין ב${n(o.origin ?? 'array')}`;
			default:
				return 'קלט לא תקין';
		}
	};
};
function Rg() {
	return { localeError: F1() };
}
var x1 = () => {
	let r = {
		string: { unit: 'znakova', verb: 'imati' },
		file: { unit: 'bajtova', verb: 'imati' },
		array: { unit: 'stavki', verb: 'imati' },
		set: { unit: 'stavki', verb: 'imati' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'unos',
			email: 'email adresa',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO datum i vrijeme',
			date: 'ISO datum',
			time: 'ISO vrijeme',
			duration: 'ISO trajanje',
			ipv4: 'IPv4 adresa',
			ipv6: 'IPv6 adresa',
			cidrv4: 'IPv4 raspon',
			cidrv6: 'IPv6 raspon',
			base64: 'base64 kodirani tekst',
			base64url: 'base64url kodirani tekst',
			json_string: 'JSON tekst',
			e164: 'E.164 broj',
			jwt: 'JWT',
			template_literal: 'unos'
		},
		u = {
			nan: 'NaN',
			string: 'tekst',
			number: 'broj',
			boolean: 'boolean',
			array: 'niz',
			object: 'objekt',
			set: 'skup',
			file: 'datoteka',
			date: 'datum',
			bigint: 'bigint',
			symbol: 'simbol',
			undefined: 'undefined',
			null: 'null',
			function: 'funkcija',
			map: 'mapa'
		};
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Neispravan unos: očekuje se instanceof ${n.expected}, a primljeno je ${I}`;
				return `Neispravan unos: očekuje se ${$}, a primljeno je ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Neispravna vrijednost: očekivano ${S(n.values[0])}`;
				return `Neispravna opcija: očekivano jedno od ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin),
					I = u[n.origin] ?? n.origin;
				if (g)
					return `Preveliko: očekivano da ${I ?? 'vrijednost'} ima ${$}${n.maximum.toString()} ${g.unit ?? 'elemenata'}`;
				return `Preveliko: očekivano da ${I ?? 'vrijednost'} bude ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin),
					I = u[n.origin] ?? n.origin;
				if (g) return `Premalo: očekivano da ${I} ima ${$}${n.minimum.toString()} ${g.unit}`;
				return `Premalo: očekivano da ${I} bude ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Neispravan tekst: mora započinjati s "${$.prefix}"`;
				if ($.format === 'ends_with') return `Neispravan tekst: mora završavati s "${$.suffix}"`;
				if ($.format === 'includes') return `Neispravan tekst: mora sadržavati "${$.includes}"`;
				if ($.format === 'regex') return `Neispravan tekst: mora odgovarati uzorku ${$.pattern}`;
				return `Neispravna ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Neispravan broj: mora biti višekratnik od ${n.divisor}`;
			case 'unrecognized_keys':
				return `Neprepoznat${n.keys.length > 1 ? 'i ključevi' : ' ključ'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Neispravan ključ u ${u[n.origin] ?? n.origin}`;
			case 'invalid_union':
				return 'Neispravan unos';
			case 'invalid_element':
				return `Neispravna vrijednost u ${u[n.origin] ?? n.origin}`;
			default:
				return 'Neispravan unos';
		}
	};
};
function Fg() {
	return { localeError: x1() };
}
var Z1 = () => {
	let r = {
		string: { unit: 'karakter', verb: 'legyen' },
		file: { unit: 'byte', verb: 'legyen' },
		array: { unit: 'elem', verb: 'legyen' },
		set: { unit: 'elem', verb: 'legyen' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'bemenet',
			email: 'email cím',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO időbélyeg',
			date: 'ISO dátum',
			time: 'ISO idő',
			duration: 'ISO időintervallum',
			ipv4: 'IPv4 cím',
			ipv6: 'IPv6 cím',
			cidrv4: 'IPv4 tartomány',
			cidrv6: 'IPv6 tartomány',
			base64: 'base64-kódolt string',
			base64url: 'base64url-kódolt string',
			json_string: 'JSON string',
			e164: 'E.164 szám',
			jwt: 'JWT',
			template_literal: 'bemenet'
		},
		u = { nan: 'NaN', number: 'szám', array: 'tömb' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Érvénytelen bemenet: a várt érték instanceof ${n.expected}, a kapott érték ${I}`;
				return `Érvénytelen bemenet: a várt érték ${$}, a kapott érték ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Érvénytelen bemenet: a várt érték ${S(n.values[0])}`;
				return `Érvénytelen opció: valamelyik érték várt ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Túl nagy: ${n.origin ?? 'érték'} mérete túl nagy ${$}${n.maximum.toString()} ${g.unit ?? 'elem'}`;
				return `Túl nagy: a bemeneti érték ${n.origin ?? 'érték'} túl nagy: ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Túl kicsi: a bemeneti érték ${n.origin} mérete túl kicsi ${$}${n.minimum.toString()} ${g.unit}`;
				return `Túl kicsi: a bemeneti érték ${n.origin} túl kicsi ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Érvénytelen string: "${$.prefix}" értékkel kell kezdődnie`;
				if ($.format === 'ends_with')
					return `Érvénytelen string: "${$.suffix}" értékkel kell végződnie`;
				if ($.format === 'includes')
					return `Érvénytelen string: "${$.includes}" értéket kell tartalmaznia`;
				if ($.format === 'regex')
					return `Érvénytelen string: ${$.pattern} mintának kell megfelelnie`;
				return `Érvénytelen ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Érvénytelen szám: ${n.divisor} többszörösének kell lennie`;
			case 'unrecognized_keys':
				return `Ismeretlen kulcs${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Érvénytelen kulcs ${n.origin}`;
			case 'invalid_union':
				return 'Érvénytelen bemenet';
			case 'invalid_element':
				return `Érvénytelen érték: ${n.origin}`;
			default:
				return 'Érvénytelen bemenet';
		}
	};
};
function xg() {
	return { localeError: Z1() };
}
function Pb(r, i, v) {
	return Math.abs(r) === 1 ? i : v;
}
function hr(r) {
	if (!r) return '';
	let i = ['ա', 'ե', 'ը', 'ի', 'ո', 'ու', 'օ'],
		v = r[r.length - 1];
	return r + (i.includes(v) ? 'ն' : 'ը');
}
var f1 = () => {
	let r = {
		string: { unit: { one: 'նշան', many: 'նշաններ' }, verb: 'ունենալ' },
		file: { unit: { one: 'բայթ', many: 'բայթեր' }, verb: 'ունենալ' },
		array: { unit: { one: 'տարր', many: 'տարրեր' }, verb: 'ունենալ' },
		set: { unit: { one: 'տարր', many: 'տարրեր' }, verb: 'ունենալ' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'մուտք',
			email: 'էլ. հասցե',
			url: 'URL',
			emoji: 'էմոջի',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO ամսաթիվ և ժամ',
			date: 'ISO ամսաթիվ',
			time: 'ISO ժամ',
			duration: 'ISO տևողություն',
			ipv4: 'IPv4 հասցե',
			ipv6: 'IPv6 հասցե',
			cidrv4: 'IPv4 միջակայք',
			cidrv6: 'IPv6 միջակայք',
			base64: 'base64 ձևաչափով տող',
			base64url: 'base64url ձևաչափով տող',
			json_string: 'JSON տող',
			e164: 'E.164 համար',
			jwt: 'JWT',
			template_literal: 'մուտք'
		},
		u = { nan: 'NaN', number: 'թիվ', array: 'զանգված' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Սխալ մուտքագրում․ սպասվում էր instanceof ${n.expected}, ստացվել է ${I}`;
				return `Սխալ մուտքագրում․ սպասվում էր ${$}, ստացվել է ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Սխալ մուտքագրում․ սպասվում էր ${S(n.values[1])}`;
				return `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g) {
					let I = Number(n.maximum),
						b = Pb(I, g.unit.one, g.unit.many);
					return `Չափազանց մեծ արժեք․ սպասվում է, որ ${hr(n.origin ?? 'արժեք')} կունենա ${$}${n.maximum.toString()} ${b}`;
				}
				return `Չափազանց մեծ արժեք․ սպասվում է, որ ${hr(n.origin ?? 'արժեք')} լինի ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) {
					let I = Number(n.minimum),
						b = Pb(I, g.unit.one, g.unit.many);
					return `Չափազանց փոքր արժեք․ սպասվում է, որ ${hr(n.origin)} կունենա ${$}${n.minimum.toString()} ${b}`;
				}
				return `Չափազանց փոքր արժեք․ սպասվում է, որ ${hr(n.origin)} լինի ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Սխալ տող․ պետք է սկսվի "${$.prefix}"-ով`;
				if ($.format === 'ends_with') return `Սխալ տող․ պետք է ավարտվի "${$.suffix}"-ով`;
				if ($.format === 'includes') return `Սխալ տող․ պետք է պարունակի "${$.includes}"`;
				if ($.format === 'regex') return `Սխալ տող․ պետք է համապատասխանի ${$.pattern} ձևաչափին`;
				return `Սխալ ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${n.divisor}-ի`;
			case 'unrecognized_keys':
				return `Չճանաչված բանալի${n.keys.length > 1 ? 'ներ' : ''}. ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Սխալ բանալի ${hr(n.origin)}-ում`;
			case 'invalid_union':
				return 'Սխալ մուտքագրում';
			case 'invalid_element':
				return `Սխալ արժեք ${hr(n.origin)}-ում`;
			default:
				return 'Սխալ մուտքագրում';
		}
	};
};
function Zg() {
	return { localeError: f1() };
}
var C1 = () => {
	let r = {
		string: { unit: 'karakter', verb: 'memiliki' },
		file: { unit: 'byte', verb: 'memiliki' },
		array: { unit: 'item', verb: 'memiliki' },
		set: { unit: 'item', verb: 'memiliki' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'input',
			email: 'alamat email',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'tanggal dan waktu format ISO',
			date: 'tanggal format ISO',
			time: 'jam format ISO',
			duration: 'durasi format ISO',
			ipv4: 'alamat IPv4',
			ipv6: 'alamat IPv6',
			cidrv4: 'rentang alamat IPv4',
			cidrv6: 'rentang alamat IPv6',
			base64: 'string dengan enkode base64',
			base64url: 'string dengan enkode base64url',
			json_string: 'string JSON',
			e164: 'angka E.164',
			jwt: 'JWT',
			template_literal: 'input'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Input tidak valid: diharapkan instanceof ${n.expected}, diterima ${I}`;
				return `Input tidak valid: diharapkan ${$}, diterima ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Input tidak valid: diharapkan ${S(n.values[0])}`;
				return `Pilihan tidak valid: diharapkan salah satu dari ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Terlalu besar: diharapkan ${n.origin ?? 'value'} memiliki ${$}${n.maximum.toString()} ${g.unit ?? 'elemen'}`;
				return `Terlalu besar: diharapkan ${n.origin ?? 'value'} menjadi ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Terlalu kecil: diharapkan ${n.origin} memiliki ${$}${n.minimum.toString()} ${g.unit}`;
				return `Terlalu kecil: diharapkan ${n.origin} menjadi ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `String tidak valid: harus dimulai dengan "${$.prefix}"`;
				if ($.format === 'ends_with')
					return `String tidak valid: harus berakhir dengan "${$.suffix}"`;
				if ($.format === 'includes') return `String tidak valid: harus menyertakan "${$.includes}"`;
				if ($.format === 'regex') return `String tidak valid: harus sesuai pola ${$.pattern}`;
				return `${v[$.format] ?? n.format} tidak valid`;
			}
			case 'not_multiple_of':
				return `Angka tidak valid: harus kelipatan dari ${n.divisor}`;
			case 'unrecognized_keys':
				return `Kunci tidak dikenali ${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Kunci tidak valid di ${n.origin}`;
			case 'invalid_union':
				return 'Input tidak valid';
			case 'invalid_element':
				return `Nilai tidak valid di ${n.origin}`;
			default:
				return 'Input tidak valid';
		}
	};
};
function fg() {
	return { localeError: C1() };
}
var m1 = () => {
	let r = {
		string: { unit: 'stafi', verb: 'að hafa' },
		file: { unit: 'bæti', verb: 'að hafa' },
		array: { unit: 'hluti', verb: 'að hafa' },
		set: { unit: 'hluti', verb: 'að hafa' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'gildi',
			email: 'netfang',
			url: 'vefslóð',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO dagsetning og tími',
			date: 'ISO dagsetning',
			time: 'ISO tími',
			duration: 'ISO tímalengd',
			ipv4: 'IPv4 address',
			ipv6: 'IPv6 address',
			cidrv4: 'IPv4 range',
			cidrv6: 'IPv6 range',
			base64: 'base64-encoded strengur',
			base64url: 'base64url-encoded strengur',
			json_string: 'JSON strengur',
			e164: 'E.164 tölugildi',
			jwt: 'JWT',
			template_literal: 'gildi'
		},
		u = { nan: 'NaN', number: 'númer', array: 'fylki' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Rangt gildi: Þú slóst inn ${I} þar sem á að vera instanceof ${n.expected}`;
				return `Rangt gildi: Þú slóst inn ${I} þar sem á að vera ${$}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Rangt gildi: gert ráð fyrir ${S(n.values[0])}`;
				return `Ógilt val: má vera eitt af eftirfarandi ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Of stórt: gert er ráð fyrir að ${n.origin ?? 'gildi'} hafi ${$}${n.maximum.toString()} ${g.unit ?? 'hluti'}`;
				return `Of stórt: gert er ráð fyrir að ${n.origin ?? 'gildi'} sé ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Of lítið: gert er ráð fyrir að ${n.origin} hafi ${$}${n.minimum.toString()} ${g.unit}`;
				return `Of lítið: gert er ráð fyrir að ${n.origin} sé ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Ógildur strengur: verður að byrja á "${$.prefix}"`;
				if ($.format === 'ends_with') return `Ógildur strengur: verður að enda á "${$.suffix}"`;
				if ($.format === 'includes') return `Ógildur strengur: verður að innihalda "${$.includes}"`;
				if ($.format === 'regex') return `Ógildur strengur: verður að fylgja mynstri ${$.pattern}`;
				return `Rangt ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Röng tala: verður að vera margfeldi af ${n.divisor}`;
			case 'unrecognized_keys':
				return `Óþekkt ${n.keys.length > 1 ? 'ir lyklar' : 'ur lykill'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Rangur lykill í ${n.origin}`;
			case 'invalid_union':
				return 'Rangt gildi';
			case 'invalid_element':
				return `Rangt gildi í ${n.origin}`;
			default:
				return 'Rangt gildi';
		}
	};
};
function Cg() {
	return { localeError: m1() };
}
var y1 = () => {
	let r = {
		string: { unit: 'caratteri', verb: 'avere' },
		file: { unit: 'byte', verb: 'avere' },
		array: { unit: 'elementi', verb: 'avere' },
		set: { unit: 'elementi', verb: 'avere' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'input',
			email: 'indirizzo email',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'data e ora ISO',
			date: 'data ISO',
			time: 'ora ISO',
			duration: 'durata ISO',
			ipv4: 'indirizzo IPv4',
			ipv6: 'indirizzo IPv6',
			cidrv4: 'intervallo IPv4',
			cidrv6: 'intervallo IPv6',
			base64: 'stringa codificata in base64',
			base64url: 'URL codificata in base64',
			json_string: 'stringa JSON',
			e164: 'numero E.164',
			jwt: 'JWT',
			template_literal: 'input'
		},
		u = { nan: 'NaN', number: 'numero', array: 'vettore' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Input non valido: atteso instanceof ${n.expected}, ricevuto ${I}`;
				return `Input non valido: atteso ${$}, ricevuto ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Input non valido: atteso ${S(n.values[0])}`;
				return `Opzione non valida: atteso uno tra ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Troppo grande: ${n.origin ?? 'valore'} deve avere ${$}${n.maximum.toString()} ${g.unit ?? 'elementi'}`;
				return `Troppo grande: ${n.origin ?? 'valore'} deve essere ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Troppo piccolo: ${n.origin} deve avere ${$}${n.minimum.toString()} ${g.unit}`;
				return `Troppo piccolo: ${n.origin} deve essere ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Stringa non valida: deve iniziare con "${$.prefix}"`;
				if ($.format === 'ends_with') return `Stringa non valida: deve terminare con "${$.suffix}"`;
				if ($.format === 'includes') return `Stringa non valida: deve includere "${$.includes}"`;
				if ($.format === 'regex')
					return `Stringa non valida: deve corrispondere al pattern ${$.pattern}`;
				return `Input non valido: ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Numero non valido: deve essere un multiplo di ${n.divisor}`;
			case 'unrecognized_keys':
				return `Chiav${n.keys.length > 1 ? 'i' : 'e'} non riconosciut${n.keys.length > 1 ? 'e' : 'a'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Chiave non valida in ${n.origin}`;
			case 'invalid_union':
				return 'Input non valido';
			case 'invalid_element':
				return `Valore non valido in ${n.origin}`;
			default:
				return 'Input non valido';
		}
	};
};
function mg() {
	return { localeError: y1() };
}
var d1 = () => {
	let r = {
		string: { unit: '文字', verb: 'である' },
		file: { unit: 'バイト', verb: 'である' },
		array: { unit: '要素', verb: 'である' },
		set: { unit: '要素', verb: 'である' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: '入力値',
			email: 'メールアドレス',
			url: 'URL',
			emoji: '絵文字',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO日時',
			date: 'ISO日付',
			time: 'ISO時刻',
			duration: 'ISO期間',
			ipv4: 'IPv4アドレス',
			ipv6: 'IPv6アドレス',
			cidrv4: 'IPv4範囲',
			cidrv6: 'IPv6範囲',
			base64: 'base64エンコード文字列',
			base64url: 'base64urlエンコード文字列',
			json_string: 'JSON文字列',
			e164: 'E.164番号',
			jwt: 'JWT',
			template_literal: '入力値'
		},
		u = { nan: 'NaN', number: '数値', array: '配列' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `無効な入力: instanceof ${n.expected}が期待されましたが、${I}が入力されました`;
				return `無効な入力: ${$}が期待されましたが、${I}が入力されました`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `無効な入力: ${S(n.values[0])}が期待されました`;
				return `無効な選択: ${k(n.values, '、')}のいずれかである必要があります`;
			case 'too_big': {
				let $ = n.inclusive ? '以下である' : 'より小さい',
					g = i(n.origin);
				if (g)
					return `大きすぎる値: ${n.origin ?? '値'}は${n.maximum.toString()}${g.unit ?? '要素'}${$}必要があります`;
				return `大きすぎる値: ${n.origin ?? '値'}は${n.maximum.toString()}${$}必要があります`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '以上である' : 'より大きい',
					g = i(n.origin);
				if (g)
					return `小さすぎる値: ${n.origin}は${n.minimum.toString()}${g.unit}${$}必要があります`;
				return `小さすぎる値: ${n.origin}は${n.minimum.toString()}${$}必要があります`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `無効な文字列: "${$.prefix}"で始まる必要があります`;
				if ($.format === 'ends_with') return `無効な文字列: "${$.suffix}"で終わる必要があります`;
				if ($.format === 'includes') return `無効な文字列: "${$.includes}"を含む必要があります`;
				if ($.format === 'regex')
					return `無効な文字列: パターン${$.pattern}に一致する必要があります`;
				return `無効な${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `無効な数値: ${n.divisor}の倍数である必要があります`;
			case 'unrecognized_keys':
				return `認識されていないキー${n.keys.length > 1 ? '群' : ''}: ${k(n.keys, '、')}`;
			case 'invalid_key':
				return `${n.origin}内の無効なキー`;
			case 'invalid_union':
				return '無効な入力';
			case 'invalid_element':
				return `${n.origin}内の無効な値`;
			default:
				return '無効な入力';
		}
	};
};
function yg() {
	return { localeError: d1() };
}
var h1 = () => {
	let r = {
		string: { unit: 'სიმბოლო', verb: 'უნდა შეიცავდეს' },
		file: { unit: 'ბაიტი', verb: 'უნდა შეიცავდეს' },
		array: { unit: 'ელემენტი', verb: 'უნდა შეიცავდეს' },
		set: { unit: 'ელემენტი', verb: 'უნდა შეიცავდეს' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'შეყვანა',
			email: 'ელ-ფოსტის მისამართი',
			url: 'URL',
			emoji: 'ემოჯი',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'თარიღი-დრო',
			date: 'თარიღი',
			time: 'დრო',
			duration: 'ხანგრძლივობა',
			ipv4: 'IPv4 მისამართი',
			ipv6: 'IPv6 მისამართი',
			cidrv4: 'IPv4 დიაპაზონი',
			cidrv6: 'IPv6 დიაპაზონი',
			base64: 'base64-კოდირებული ველი',
			base64url: 'base64url-კოდირებული ველი',
			json_string: 'JSON ველი',
			e164: 'E.164 ნომერი',
			jwt: 'JWT',
			template_literal: 'შეყვანა'
		},
		u = {
			nan: 'NaN',
			number: 'რიცხვი',
			string: 'ველი',
			boolean: 'ბულეანი',
			function: 'ფუნქცია',
			array: 'მასივი'
		};
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `არასწორი შეყვანა: მოსალოდნელი instanceof ${n.expected}, მიღებული ${I}`;
				return `არასწორი შეყვანა: მოსალოდნელი ${$}, მიღებული ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `არასწორი შეყვანა: მოსალოდნელი ${S(n.values[0])}`;
				return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${k(n.values, '|')}-დან`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `ზედმეტად დიდი: მოსალოდნელი ${n.origin ?? 'მნიშვნელობა'} ${g.verb} ${$}${n.maximum.toString()} ${g.unit}`;
				return `ზედმეტად დიდი: მოსალოდნელი ${n.origin ?? 'მნიშვნელობა'} იყოს ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `ზედმეტად პატარა: მოსალოდნელი ${n.origin} ${g.verb} ${$}${n.minimum.toString()} ${g.unit}`;
				return `ზედმეტად პატარა: მოსალოდნელი ${n.origin} იყოს ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `არასწორი ველი: უნდა იწყებოდეს "${$.prefix}"-ით`;
				if ($.format === 'ends_with') return `არასწორი ველი: უნდა მთავრდებოდეს "${$.suffix}"-ით`;
				if ($.format === 'includes') return `არასწორი ველი: უნდა შეიცავდეს "${$.includes}"-ს`;
				if ($.format === 'regex') return `არასწორი ველი: უნდა შეესაბამებოდეს შაბლონს ${$.pattern}`;
				return `არასწორი ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `არასწორი რიცხვი: უნდა იყოს ${n.divisor}-ის ჯერადი`;
			case 'unrecognized_keys':
				return `უცნობი გასაღებ${n.keys.length > 1 ? 'ები' : 'ი'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `არასწორი გასაღები ${n.origin}-ში`;
			case 'invalid_union':
				return 'არასწორი შეყვანა';
			case 'invalid_element':
				return `არასწორი მნიშვნელობა ${n.origin}-ში`;
			default:
				return 'არასწორი შეყვანა';
		}
	};
};
function dg() {
	return { localeError: h1() };
}
var e1 = () => {
	let r = {
		string: { unit: 'តួអក្សរ', verb: 'គួរមាន' },
		file: { unit: 'បៃ', verb: 'គួរមាន' },
		array: { unit: 'ធាតុ', verb: 'គួរមាន' },
		set: { unit: 'ធាតុ', verb: 'គួរមាន' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'ទិន្នន័យបញ្ចូល',
			email: 'អាសយដ្ឋានអ៊ីមែល',
			url: 'URL',
			emoji: 'សញ្ញាអារម្មណ៍',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'កាលបរិច្ឆេទ និងម៉ោង ISO',
			date: 'កាលបរិច្ឆេទ ISO',
			time: 'ម៉ោង ISO',
			duration: 'រយៈពេល ISO',
			ipv4: 'អាសយដ្ឋាន IPv4',
			ipv6: 'អាសយដ្ឋាន IPv6',
			cidrv4: 'ដែនអាសយដ្ឋាន IPv4',
			cidrv6: 'ដែនអាសយដ្ឋាន IPv6',
			base64: 'ខ្សែអក្សរអ៊ិកូដ base64',
			base64url: 'ខ្សែអក្សរអ៊ិកូដ base64url',
			json_string: 'ខ្សែអក្សរ JSON',
			e164: 'លេខ E.164',
			jwt: 'JWT',
			template_literal: 'ទិន្នន័យបញ្ចូល'
		},
		u = { nan: 'NaN', number: 'លេខ', array: 'អារេ (Array)', null: 'គ្មានតម្លៃ (null)' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${n.expected} ប៉ុន្តែទទួលបាន ${I}`;
				return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${$} ប៉ុន្តែទទួលបាន ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${S(n.values[0])}`;
				return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `ធំពេក៖ ត្រូវការ ${n.origin ?? 'តម្លៃ'} ${$} ${n.maximum.toString()} ${g.unit ?? 'ធាតុ'}`;
				return `ធំពេក៖ ត្រូវការ ${n.origin ?? 'តម្លៃ'} ${$} ${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) return `តូចពេក៖ ត្រូវការ ${n.origin} ${$} ${n.minimum.toString()} ${g.unit}`;
				return `តូចពេក៖ ត្រូវការ ${n.origin} ${$} ${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${$.prefix}"`;
				if ($.format === 'ends_with') return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${$.suffix}"`;
				if ($.format === 'includes') return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${$.includes}"`;
				if ($.format === 'regex')
					return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${$.pattern}`;
				return `មិនត្រឹមត្រូវ៖ ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${n.divisor}`;
			case 'unrecognized_keys':
				return `រកឃើញសោមិនស្គាល់៖ ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `សោមិនត្រឹមត្រូវនៅក្នុង ${n.origin}`;
			case 'invalid_union':
				return 'ទិន្នន័យមិនត្រឹមត្រូវ';
			case 'invalid_element':
				return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${n.origin}`;
			default:
				return 'ទិន្នន័យមិនត្រឹមត្រូវ';
		}
	};
};
function An() {
	return { localeError: e1() };
}
function hg() {
	return An();
}
var a1 = () => {
	let r = {
		string: { unit: '문자', verb: 'to have' },
		file: { unit: '바이트', verb: 'to have' },
		array: { unit: '개', verb: 'to have' },
		set: { unit: '개', verb: 'to have' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: '입력',
			email: '이메일 주소',
			url: 'URL',
			emoji: '이모지',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO 날짜시간',
			date: 'ISO 날짜',
			time: 'ISO 시간',
			duration: 'ISO 기간',
			ipv4: 'IPv4 주소',
			ipv6: 'IPv6 주소',
			cidrv4: 'IPv4 범위',
			cidrv6: 'IPv6 범위',
			base64: 'base64 인코딩 문자열',
			base64url: 'base64url 인코딩 문자열',
			json_string: 'JSON 문자열',
			e164: 'E.164 번호',
			jwt: 'JWT',
			template_literal: '입력'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `잘못된 입력: 예상 타입은 instanceof ${n.expected}, 받은 타입은 ${I}입니다`;
				return `잘못된 입력: 예상 타입은 ${$}, 받은 타입은 ${I}입니다`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `잘못된 입력: 값은 ${S(n.values[0])} 이어야 합니다`;
				return `잘못된 옵션: ${k(n.values, '또는 ')} 중 하나여야 합니다`;
			case 'too_big': {
				let $ = n.inclusive ? '이하' : '미만',
					g = $ === '미만' ? '이어야 합니다' : '여야 합니다',
					I = i(n.origin),
					b = I?.unit ?? '요소';
				if (I) return `${n.origin ?? '값'}이 너무 큽니다: ${n.maximum.toString()}${b} ${$}${g}`;
				return `${n.origin ?? '값'}이 너무 큽니다: ${n.maximum.toString()} ${$}${g}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '이상' : '초과',
					g = $ === '이상' ? '이어야 합니다' : '여야 합니다',
					I = i(n.origin),
					b = I?.unit ?? '요소';
				if (I) return `${n.origin ?? '값'}이 너무 작습니다: ${n.minimum.toString()}${b} ${$}${g}`;
				return `${n.origin ?? '값'}이 너무 작습니다: ${n.minimum.toString()} ${$}${g}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `잘못된 문자열: "${$.prefix}"(으)로 시작해야 합니다`;
				if ($.format === 'ends_with') return `잘못된 문자열: "${$.suffix}"(으)로 끝나야 합니다`;
				if ($.format === 'includes') return `잘못된 문자열: "${$.includes}"을(를) 포함해야 합니다`;
				if ($.format === 'regex')
					return `잘못된 문자열: 정규식 ${$.pattern} 패턴과 일치해야 합니다`;
				return `잘못된 ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `잘못된 숫자: ${n.divisor}의 배수여야 합니다`;
			case 'unrecognized_keys':
				return `인식할 수 없는 키: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `잘못된 키: ${n.origin}`;
			case 'invalid_union':
				return '잘못된 입력';
			case 'invalid_element':
				return `잘못된 값: ${n.origin}`;
			default:
				return '잘못된 입력';
		}
	};
};
function eg() {
	return { localeError: a1() };
}
var Rn = (r) => {
	return r.charAt(0).toUpperCase() + r.slice(1);
};
function jb(r) {
	let i = Math.abs(r),
		v = i % 10,
		u = i % 100;
	if ((u >= 11 && u <= 19) || v === 0) return 'many';
	if (v === 1) return 'one';
	return 'few';
}
var p1 = () => {
	let r = {
		string: {
			unit: { one: 'simbolis', few: 'simboliai', many: 'simbolių' },
			verb: {
				smaller: {
					inclusive: 'turi būti ne ilgesnė kaip',
					notInclusive: 'turi būti trumpesnė kaip'
				},
				bigger: { inclusive: 'turi būti ne trumpesnė kaip', notInclusive: 'turi būti ilgesnė kaip' }
			}
		},
		file: {
			unit: { one: 'baitas', few: 'baitai', many: 'baitų' },
			verb: {
				smaller: {
					inclusive: 'turi būti ne didesnis kaip',
					notInclusive: 'turi būti mažesnis kaip'
				},
				bigger: { inclusive: 'turi būti ne mažesnis kaip', notInclusive: 'turi būti didesnis kaip' }
			}
		},
		array: {
			unit: { one: 'elementą', few: 'elementus', many: 'elementų' },
			verb: {
				smaller: {
					inclusive: 'turi turėti ne daugiau kaip',
					notInclusive: 'turi turėti mažiau kaip'
				},
				bigger: {
					inclusive: 'turi turėti ne mažiau kaip',
					notInclusive: 'turi turėti daugiau kaip'
				}
			}
		},
		set: {
			unit: { one: 'elementą', few: 'elementus', many: 'elementų' },
			verb: {
				smaller: {
					inclusive: 'turi turėti ne daugiau kaip',
					notInclusive: 'turi turėti mažiau kaip'
				},
				bigger: {
					inclusive: 'turi turėti ne mažiau kaip',
					notInclusive: 'turi turėti daugiau kaip'
				}
			}
		}
	};
	function i(n, $, g, I) {
		let b = r[n] ?? null;
		if (b === null) return b;
		return { unit: b.unit[$], verb: b.verb[I][g ? 'inclusive' : 'notInclusive'] };
	}
	let v = {
			regex: 'įvestis',
			email: 'el. pašto adresas',
			url: 'URL',
			emoji: 'jaustukas',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO data ir laikas',
			date: 'ISO data',
			time: 'ISO laikas',
			duration: 'ISO trukmė',
			ipv4: 'IPv4 adresas',
			ipv6: 'IPv6 adresas',
			cidrv4: 'IPv4 tinklo prefiksas (CIDR)',
			cidrv6: 'IPv6 tinklo prefiksas (CIDR)',
			base64: 'base64 užkoduota eilutė',
			base64url: 'base64url užkoduota eilutė',
			json_string: 'JSON eilutė',
			e164: 'E.164 numeris',
			jwt: 'JWT',
			template_literal: 'įvestis'
		},
		u = {
			nan: 'NaN',
			number: 'skaičius',
			bigint: 'sveikasis skaičius',
			string: 'eilutė',
			boolean: 'loginė reikšmė',
			undefined: 'neapibrėžta reikšmė',
			function: 'funkcija',
			symbol: 'simbolis',
			array: 'masyvas',
			object: 'objektas',
			null: 'nulinė reikšmė'
		};
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Gautas tipas ${I}, o tikėtasi - instanceof ${n.expected}`;
				return `Gautas tipas ${I}, o tikėtasi - ${$}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Privalo būti ${S(n.values[0])}`;
				return `Privalo būti vienas iš ${k(n.values, '|')} pasirinkimų`;
			case 'too_big': {
				let $ = u[n.origin] ?? n.origin,
					g = i(n.origin, jb(Number(n.maximum)), n.inclusive ?? !1, 'smaller');
				if (g?.verb)
					return `${Rn($ ?? n.origin ?? 'reikšmė')} ${g.verb} ${n.maximum.toString()} ${g.unit ?? 'elementų'}`;
				let I = n.inclusive ? 'ne didesnis kaip' : 'mažesnis kaip';
				return `${Rn($ ?? n.origin ?? 'reikšmė')} turi būti ${I} ${n.maximum.toString()} ${g?.unit}`;
			}
			case 'too_small': {
				let $ = u[n.origin] ?? n.origin,
					g = i(n.origin, jb(Number(n.minimum)), n.inclusive ?? !1, 'bigger');
				if (g?.verb)
					return `${Rn($ ?? n.origin ?? 'reikšmė')} ${g.verb} ${n.minimum.toString()} ${g.unit ?? 'elementų'}`;
				let I = n.inclusive ? 'ne mažesnis kaip' : 'didesnis kaip';
				return `${Rn($ ?? n.origin ?? 'reikšmė')} turi būti ${I} ${n.minimum.toString()} ${g?.unit}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Eilutė privalo prasidėti "${$.prefix}"`;
				if ($.format === 'ends_with') return `Eilutė privalo pasibaigti "${$.suffix}"`;
				if ($.format === 'includes') return `Eilutė privalo įtraukti "${$.includes}"`;
				if ($.format === 'regex') return `Eilutė privalo atitikti ${$.pattern}`;
				return `Neteisingas ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Skaičius privalo būti ${n.divisor} kartotinis.`;
			case 'unrecognized_keys':
				return `Neatpažint${n.keys.length > 1 ? 'i' : 'as'} rakt${n.keys.length > 1 ? 'ai' : 'as'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return 'Rastas klaidingas raktas';
			case 'invalid_union':
				return 'Klaidinga įvestis';
			case 'invalid_element': {
				let $ = u[n.origin] ?? n.origin;
				return `${Rn($ ?? n.origin ?? 'reikšmė')} turi klaidingą įvestį`;
			}
			default:
				return 'Klaidinga įvestis';
		}
	};
};
function ag() {
	return { localeError: p1() };
}
var s1 = () => {
	let r = {
		string: { unit: 'знаци', verb: 'да имаат' },
		file: { unit: 'бајти', verb: 'да имаат' },
		array: { unit: 'ставки', verb: 'да имаат' },
		set: { unit: 'ставки', verb: 'да имаат' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'внес',
			email: 'адреса на е-пошта',
			url: 'URL',
			emoji: 'емоџи',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO датум и време',
			date: 'ISO датум',
			time: 'ISO време',
			duration: 'ISO времетраење',
			ipv4: 'IPv4 адреса',
			ipv6: 'IPv6 адреса',
			cidrv4: 'IPv4 опсег',
			cidrv6: 'IPv6 опсег',
			base64: 'base64-енкодирана низа',
			base64url: 'base64url-енкодирана низа',
			json_string: 'JSON низа',
			e164: 'E.164 број',
			jwt: 'JWT',
			template_literal: 'внес'
		},
		u = { nan: 'NaN', number: 'број', array: 'низа' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Грешен внес: се очекува instanceof ${n.expected}, примено ${I}`;
				return `Грешен внес: се очекува ${$}, примено ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Invalid input: expected ${S(n.values[0])}`;
				return `Грешана опција: се очекува една ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Премногу голем: се очекува ${n.origin ?? 'вредноста'} да има ${$}${n.maximum.toString()} ${g.unit ?? 'елементи'}`;
				return `Премногу голем: се очекува ${n.origin ?? 'вредноста'} да биде ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Премногу мал: се очекува ${n.origin} да има ${$}${n.minimum.toString()} ${g.unit}`;
				return `Премногу мал: се очекува ${n.origin} да биде ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Неважечка низа: мора да започнува со "${$.prefix}"`;
				if ($.format === 'ends_with') return `Неважечка низа: мора да завршува со "${$.suffix}"`;
				if ($.format === 'includes') return `Неважечка низа: мора да вклучува "${$.includes}"`;
				if ($.format === 'regex') return `Неважечка низа: мора да одгоара на патернот ${$.pattern}`;
				return `Invalid ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Грешен број: мора да биде делив со ${n.divisor}`;
			case 'unrecognized_keys':
				return `${n.keys.length > 1 ? 'Непрепознаени клучеви' : 'Непрепознаен клуч'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Грешен клуч во ${n.origin}`;
			case 'invalid_union':
				return 'Грешен внес';
			case 'invalid_element':
				return `Грешна вредност во ${n.origin}`;
			default:
				return 'Грешен внес';
		}
	};
};
function pg() {
	return { localeError: s1() };
}
var rk = () => {
	let r = {
		string: { unit: 'aksara', verb: 'mempunyai' },
		file: { unit: 'bait', verb: 'mempunyai' },
		array: { unit: 'elemen', verb: 'mempunyai' },
		set: { unit: 'elemen', verb: 'mempunyai' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'input',
			email: 'alamat e-mel',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'tarikh masa ISO',
			date: 'tarikh ISO',
			time: 'masa ISO',
			duration: 'tempoh ISO',
			ipv4: 'alamat IPv4',
			ipv6: 'alamat IPv6',
			cidrv4: 'julat IPv4',
			cidrv6: 'julat IPv6',
			base64: 'string dikodkan base64',
			base64url: 'string dikodkan base64url',
			json_string: 'string JSON',
			e164: 'nombor E.164',
			jwt: 'JWT',
			template_literal: 'input'
		},
		u = { nan: 'NaN', number: 'nombor' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Input tidak sah: dijangka instanceof ${n.expected}, diterima ${I}`;
				return `Input tidak sah: dijangka ${$}, diterima ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Input tidak sah: dijangka ${S(n.values[0])}`;
				return `Pilihan tidak sah: dijangka salah satu daripada ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Terlalu besar: dijangka ${n.origin ?? 'nilai'} ${g.verb} ${$}${n.maximum.toString()} ${g.unit ?? 'elemen'}`;
				return `Terlalu besar: dijangka ${n.origin ?? 'nilai'} adalah ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Terlalu kecil: dijangka ${n.origin} ${g.verb} ${$}${n.minimum.toString()} ${g.unit}`;
				return `Terlalu kecil: dijangka ${n.origin} adalah ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `String tidak sah: mesti bermula dengan "${$.prefix}"`;
				if ($.format === 'ends_with')
					return `String tidak sah: mesti berakhir dengan "${$.suffix}"`;
				if ($.format === 'includes') return `String tidak sah: mesti mengandungi "${$.includes}"`;
				if ($.format === 'regex')
					return `String tidak sah: mesti sepadan dengan corak ${$.pattern}`;
				return `${v[$.format] ?? n.format} tidak sah`;
			}
			case 'not_multiple_of':
				return `Nombor tidak sah: perlu gandaan ${n.divisor}`;
			case 'unrecognized_keys':
				return `Kunci tidak dikenali: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Kunci tidak sah dalam ${n.origin}`;
			case 'invalid_union':
				return 'Input tidak sah';
			case 'invalid_element':
				return `Nilai tidak sah dalam ${n.origin}`;
			default:
				return 'Input tidak sah';
		}
	};
};
function sg() {
	return { localeError: rk() };
}
var nk = () => {
	let r = {
		string: { unit: 'tekens', verb: 'heeft' },
		file: { unit: 'bytes', verb: 'heeft' },
		array: { unit: 'elementen', verb: 'heeft' },
		set: { unit: 'elementen', verb: 'heeft' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'invoer',
			email: 'emailadres',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO datum en tijd',
			date: 'ISO datum',
			time: 'ISO tijd',
			duration: 'ISO duur',
			ipv4: 'IPv4-adres',
			ipv6: 'IPv6-adres',
			cidrv4: 'IPv4-bereik',
			cidrv6: 'IPv6-bereik',
			base64: 'base64-gecodeerde tekst',
			base64url: 'base64 URL-gecodeerde tekst',
			json_string: 'JSON string',
			e164: 'E.164-nummer',
			jwt: 'JWT',
			template_literal: 'invoer'
		},
		u = { nan: 'NaN', number: 'getal' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Ongeldige invoer: verwacht instanceof ${n.expected}, ontving ${I}`;
				return `Ongeldige invoer: verwacht ${$}, ontving ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Ongeldige invoer: verwacht ${S(n.values[0])}`;
				return `Ongeldige optie: verwacht één van ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin),
					I = n.origin === 'date' ? 'laat' : n.origin === 'string' ? 'lang' : 'groot';
				if (g)
					return `Te ${I}: verwacht dat ${n.origin ?? 'waarde'} ${$}${n.maximum.toString()} ${g.unit ?? 'elementen'} ${g.verb}`;
				return `Te ${I}: verwacht dat ${n.origin ?? 'waarde'} ${$}${n.maximum.toString()} is`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin),
					I = n.origin === 'date' ? 'vroeg' : n.origin === 'string' ? 'kort' : 'klein';
				if (g)
					return `Te ${I}: verwacht dat ${n.origin} ${$}${n.minimum.toString()} ${g.unit} ${g.verb}`;
				return `Te ${I}: verwacht dat ${n.origin} ${$}${n.minimum.toString()} is`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Ongeldige tekst: moet met "${$.prefix}" beginnen`;
				if ($.format === 'ends_with') return `Ongeldige tekst: moet op "${$.suffix}" eindigen`;
				if ($.format === 'includes') return `Ongeldige tekst: moet "${$.includes}" bevatten`;
				if ($.format === 'regex')
					return `Ongeldige tekst: moet overeenkomen met patroon ${$.pattern}`;
				return `Ongeldig: ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Ongeldig getal: moet een veelvoud van ${n.divisor} zijn`;
			case 'unrecognized_keys':
				return `Onbekende key${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Ongeldige key in ${n.origin}`;
			case 'invalid_union':
				return 'Ongeldige invoer';
			case 'invalid_element':
				return `Ongeldige waarde in ${n.origin}`;
			default:
				return 'Ongeldige invoer';
		}
	};
};
function r4() {
	return { localeError: nk() };
}
var ik = () => {
	let r = {
		string: { unit: 'tegn', verb: 'å ha' },
		file: { unit: 'bytes', verb: 'å ha' },
		array: { unit: 'elementer', verb: 'å inneholde' },
		set: { unit: 'elementer', verb: 'å inneholde' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'input',
			email: 'e-postadresse',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO dato- og klokkeslett',
			date: 'ISO-dato',
			time: 'ISO-klokkeslett',
			duration: 'ISO-varighet',
			ipv4: 'IPv4-område',
			ipv6: 'IPv6-område',
			cidrv4: 'IPv4-spekter',
			cidrv6: 'IPv6-spekter',
			base64: 'base64-enkodet streng',
			base64url: 'base64url-enkodet streng',
			json_string: 'JSON-streng',
			e164: 'E.164-nummer',
			jwt: 'JWT',
			template_literal: 'input'
		},
		u = { nan: 'NaN', number: 'tall', array: 'liste' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Ugyldig input: forventet instanceof ${n.expected}, fikk ${I}`;
				return `Ugyldig input: forventet ${$}, fikk ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Ugyldig verdi: forventet ${S(n.values[0])}`;
				return `Ugyldig valg: forventet en av ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `For stor(t): forventet ${n.origin ?? 'value'} til å ha ${$}${n.maximum.toString()} ${g.unit ?? 'elementer'}`;
				return `For stor(t): forventet ${n.origin ?? 'value'} til å ha ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `For lite(n): forventet ${n.origin} til å ha ${$}${n.minimum.toString()} ${g.unit}`;
				return `For lite(n): forventet ${n.origin} til å ha ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Ugyldig streng: må starte med "${$.prefix}"`;
				if ($.format === 'ends_with') return `Ugyldig streng: må ende med "${$.suffix}"`;
				if ($.format === 'includes') return `Ugyldig streng: må inneholde "${$.includes}"`;
				if ($.format === 'regex') return `Ugyldig streng: må matche mønsteret ${$.pattern}`;
				return `Ugyldig ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Ugyldig tall: må være et multiplum av ${n.divisor}`;
			case 'unrecognized_keys':
				return `${n.keys.length > 1 ? 'Ukjente nøkler' : 'Ukjent nøkkel'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Ugyldig nøkkel i ${n.origin}`;
			case 'invalid_union':
				return 'Ugyldig input';
			case 'invalid_element':
				return `Ugyldig verdi i ${n.origin}`;
			default:
				return 'Ugyldig input';
		}
	};
};
function n4() {
	return { localeError: ik() };
}
var vk = () => {
	let r = {
		string: { unit: 'harf', verb: 'olmalıdır' },
		file: { unit: 'bayt', verb: 'olmalıdır' },
		array: { unit: 'unsur', verb: 'olmalıdır' },
		set: { unit: 'unsur', verb: 'olmalıdır' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'giren',
			email: 'epostagâh',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO hengâmı',
			date: 'ISO tarihi',
			time: 'ISO zamanı',
			duration: 'ISO müddeti',
			ipv4: 'IPv4 nişânı',
			ipv6: 'IPv6 nişânı',
			cidrv4: 'IPv4 menzili',
			cidrv6: 'IPv6 menzili',
			base64: 'base64-şifreli metin',
			base64url: 'base64url-şifreli metin',
			json_string: 'JSON metin',
			e164: 'E.164 sayısı',
			jwt: 'JWT',
			template_literal: 'giren'
		},
		u = { nan: 'NaN', number: 'numara', array: 'saf', null: 'gayb' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Fâsit giren: umulan instanceof ${n.expected}, alınan ${I}`;
				return `Fâsit giren: umulan ${$}, alınan ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Fâsit giren: umulan ${S(n.values[0])}`;
				return `Fâsit tercih: mûteberler ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Fazla büyük: ${n.origin ?? 'value'}, ${$}${n.maximum.toString()} ${g.unit ?? 'elements'} sahip olmalıydı.`;
				return `Fazla büyük: ${n.origin ?? 'value'}, ${$}${n.maximum.toString()} olmalıydı.`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Fazla küçük: ${n.origin}, ${$}${n.minimum.toString()} ${g.unit} sahip olmalıydı.`;
				return `Fazla küçük: ${n.origin}, ${$}${n.minimum.toString()} olmalıydı.`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Fâsit metin: "${$.prefix}" ile başlamalı.`;
				if ($.format === 'ends_with') return `Fâsit metin: "${$.suffix}" ile bitmeli.`;
				if ($.format === 'includes') return `Fâsit metin: "${$.includes}" ihtivâ etmeli.`;
				if ($.format === 'regex') return `Fâsit metin: ${$.pattern} nakşına uymalı.`;
				return `Fâsit ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Fâsit sayı: ${n.divisor} katı olmalıydı.`;
			case 'unrecognized_keys':
				return `Tanınmayan anahtar ${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `${n.origin} için tanınmayan anahtar var.`;
			case 'invalid_union':
				return 'Giren tanınamadı.';
			case 'invalid_element':
				return `${n.origin} için tanınmayan kıymet var.`;
			default:
				return 'Kıymet tanınamadı.';
		}
	};
};
function i4() {
	return { localeError: vk() };
}
var $k = () => {
	let r = {
		string: { unit: 'توکي', verb: 'ولري' },
		file: { unit: 'بایټس', verb: 'ولري' },
		array: { unit: 'توکي', verb: 'ولري' },
		set: { unit: 'توکي', verb: 'ولري' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'ورودي',
			email: 'بریښنالیک',
			url: 'یو آر ال',
			emoji: 'ایموجي',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'نیټه او وخت',
			date: 'نېټه',
			time: 'وخت',
			duration: 'موده',
			ipv4: 'د IPv4 پته',
			ipv6: 'د IPv6 پته',
			cidrv4: 'د IPv4 ساحه',
			cidrv6: 'د IPv6 ساحه',
			base64: 'base64-encoded متن',
			base64url: 'base64url-encoded متن',
			json_string: 'JSON متن',
			e164: 'د E.164 شمېره',
			jwt: 'JWT',
			template_literal: 'ورودي'
		},
		u = { nan: 'NaN', number: 'عدد', array: 'ارې' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `ناسم ورودي: باید instanceof ${n.expected} وای, مګر ${I} ترلاسه شو`;
				return `ناسم ورودي: باید ${$} وای, مګر ${I} ترلاسه شو`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `ناسم ورودي: باید ${S(n.values[0])} وای`;
				return `ناسم انتخاب: باید یو له ${k(n.values, '|')} څخه وای`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `ډیر لوی: ${n.origin ?? 'ارزښت'} باید ${$}${n.maximum.toString()} ${g.unit ?? 'عنصرونه'} ولري`;
				return `ډیر لوی: ${n.origin ?? 'ارزښت'} باید ${$}${n.maximum.toString()} وي`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) return `ډیر کوچنی: ${n.origin} باید ${$}${n.minimum.toString()} ${g.unit} ولري`;
				return `ډیر کوچنی: ${n.origin} باید ${$}${n.minimum.toString()} وي`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `ناسم متن: باید د "${$.prefix}" سره پیل شي`;
				if ($.format === 'ends_with') return `ناسم متن: باید د "${$.suffix}" سره پای ته ورسيږي`;
				if ($.format === 'includes') return `ناسم متن: باید "${$.includes}" ولري`;
				if ($.format === 'regex') return `ناسم متن: باید د ${$.pattern} سره مطابقت ولري`;
				return `${v[$.format] ?? n.format} ناسم دی`;
			}
			case 'not_multiple_of':
				return `ناسم عدد: باید د ${n.divisor} مضرب وي`;
			case 'unrecognized_keys':
				return `ناسم ${n.keys.length > 1 ? 'کلیډونه' : 'کلیډ'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `ناسم کلیډ په ${n.origin} کې`;
			case 'invalid_union':
				return 'ناسمه ورودي';
			case 'invalid_element':
				return `ناسم عنصر په ${n.origin} کې`;
			default:
				return 'ناسمه ورودي';
		}
	};
};
function v4() {
	return { localeError: $k() };
}
var uk = () => {
	let r = {
		string: { unit: 'znaków', verb: 'mieć' },
		file: { unit: 'bajtów', verb: 'mieć' },
		array: { unit: 'elementów', verb: 'mieć' },
		set: { unit: 'elementów', verb: 'mieć' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'wyrażenie',
			email: 'adres email',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'data i godzina w formacie ISO',
			date: 'data w formacie ISO',
			time: 'godzina w formacie ISO',
			duration: 'czas trwania ISO',
			ipv4: 'adres IPv4',
			ipv6: 'adres IPv6',
			cidrv4: 'zakres IPv4',
			cidrv6: 'zakres IPv6',
			base64: 'ciąg znaków zakodowany w formacie base64',
			base64url: 'ciąg znaków zakodowany w formacie base64url',
			json_string: 'ciąg znaków w formacie JSON',
			e164: 'liczba E.164',
			jwt: 'JWT',
			template_literal: 'wejście'
		},
		u = { nan: 'NaN', number: 'liczba', array: 'tablica' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${n.expected}, otrzymano ${I}`;
				return `Nieprawidłowe dane wejściowe: oczekiwano ${$}, otrzymano ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1)
					return `Nieprawidłowe dane wejściowe: oczekiwano ${S(n.values[0])}`;
				return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Za duża wartość: oczekiwano, że ${n.origin ?? 'wartość'} będzie mieć ${$}${n.maximum.toString()} ${g.unit ?? 'elementów'}`;
				return `Zbyt duż(y/a/e): oczekiwano, że ${n.origin ?? 'wartość'} będzie wynosić ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Za mała wartość: oczekiwano, że ${n.origin ?? 'wartość'} będzie mieć ${$}${n.minimum.toString()} ${g.unit ?? 'elementów'}`;
				return `Zbyt mał(y/a/e): oczekiwano, że ${n.origin ?? 'wartość'} będzie wynosić ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${$.prefix}"`;
				if ($.format === 'ends_with')
					return `Nieprawidłowy ciąg znaków: musi kończyć się na "${$.suffix}"`;
				if ($.format === 'includes')
					return `Nieprawidłowy ciąg znaków: musi zawierać "${$.includes}"`;
				if ($.format === 'regex')
					return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${$.pattern}`;
				return `Nieprawidłow(y/a/e) ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Nieprawidłowa liczba: musi być wielokrotnością ${n.divisor}`;
			case 'unrecognized_keys':
				return `Nierozpoznane klucze${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Nieprawidłowy klucz w ${n.origin}`;
			case 'invalid_union':
				return 'Nieprawidłowe dane wejściowe';
			case 'invalid_element':
				return `Nieprawidłowa wartość w ${n.origin}`;
			default:
				return 'Nieprawidłowe dane wejściowe';
		}
	};
};
function $4() {
	return { localeError: uk() };
}
var gk = () => {
	let r = {
		string: { unit: 'caracteres', verb: 'ter' },
		file: { unit: 'bytes', verb: 'ter' },
		array: { unit: 'itens', verb: 'ter' },
		set: { unit: 'itens', verb: 'ter' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'padrão',
			email: 'endereço de e-mail',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'data e hora ISO',
			date: 'data ISO',
			time: 'hora ISO',
			duration: 'duração ISO',
			ipv4: 'endereço IPv4',
			ipv6: 'endereço IPv6',
			cidrv4: 'faixa de IPv4',
			cidrv6: 'faixa de IPv6',
			base64: 'texto codificado em base64',
			base64url: 'URL codificada em base64',
			json_string: 'texto JSON',
			e164: 'número E.164',
			jwt: 'JWT',
			template_literal: 'entrada'
		},
		u = { nan: 'NaN', number: 'número', null: 'nulo' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Tipo inválido: esperado instanceof ${n.expected}, recebido ${I}`;
				return `Tipo inválido: esperado ${$}, recebido ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Entrada inválida: esperado ${S(n.values[0])}`;
				return `Opção inválida: esperada uma das ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Muito grande: esperado que ${n.origin ?? 'valor'} tivesse ${$}${n.maximum.toString()} ${g.unit ?? 'elementos'}`;
				return `Muito grande: esperado que ${n.origin ?? 'valor'} fosse ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Muito pequeno: esperado que ${n.origin} tivesse ${$}${n.minimum.toString()} ${g.unit}`;
				return `Muito pequeno: esperado que ${n.origin} fosse ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Texto inválido: deve começar com "${$.prefix}"`;
				if ($.format === 'ends_with') return `Texto inválido: deve terminar com "${$.suffix}"`;
				if ($.format === 'includes') return `Texto inválido: deve incluir "${$.includes}"`;
				if ($.format === 'regex') return `Texto inválido: deve corresponder ao padrão ${$.pattern}`;
				return `${v[$.format] ?? n.format} inválido`;
			}
			case 'not_multiple_of':
				return `Número inválido: deve ser múltiplo de ${n.divisor}`;
			case 'unrecognized_keys':
				return `Chave${n.keys.length > 1 ? 's' : ''} desconhecida${n.keys.length > 1 ? 's' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Chave inválida em ${n.origin}`;
			case 'invalid_union':
				return 'Entrada inválida';
			case 'invalid_element':
				return `Valor inválido em ${n.origin}`;
			default:
				return 'Campo inválido';
		}
	};
};
function u4() {
	return { localeError: gk() };
}
var Ik = () => {
	let r = {
		string: { unit: 'caractere', verb: 'să aibă' },
		file: { unit: 'octeți', verb: 'să aibă' },
		array: { unit: 'elemente', verb: 'să aibă' },
		set: { unit: 'elemente', verb: 'să aibă' },
		map: { unit: 'intrări', verb: 'să aibă' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'intrare',
			email: 'adresă de email',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'dată și oră ISO',
			date: 'dată ISO',
			time: 'oră ISO',
			duration: 'durată ISO',
			ipv4: 'adresă IPv4',
			ipv6: 'adresă IPv6',
			mac: 'adresă MAC',
			cidrv4: 'interval IPv4',
			cidrv6: 'interval IPv6',
			base64: 'șir codat base64',
			base64url: 'șir codat base64url',
			json_string: 'șir JSON',
			e164: 'număr E.164',
			jwt: 'JWT',
			template_literal: 'intrare'
		},
		u = {
			nan: 'NaN',
			string: 'șir',
			number: 'număr',
			boolean: 'boolean',
			function: 'funcție',
			array: 'matrice',
			object: 'obiect',
			undefined: 'nedefinit',
			symbol: 'simbol',
			bigint: 'număr mare',
			void: 'void',
			never: 'never',
			map: 'hartă',
			set: 'set'
		};
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				return `Intrare invalidă: așteptat ${$}, primit ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Intrare invalidă: așteptat ${S(n.values[0])}`;
				return `Opțiune invalidă: așteptat una dintre ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Prea mare: așteptat ca ${n.origin ?? 'valoarea'} ${g.verb} ${$}${n.maximum.toString()} ${g.unit ?? 'elemente'}`;
				return `Prea mare: așteptat ca ${n.origin ?? 'valoarea'} să fie ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Prea mic: așteptat ca ${n.origin} ${g.verb} ${$}${n.minimum.toString()} ${g.unit}`;
				return `Prea mic: așteptat ca ${n.origin} să fie ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Șir invalid: trebuie să înceapă cu "${$.prefix}"`;
				if ($.format === 'ends_with') return `Șir invalid: trebuie să se termine cu "${$.suffix}"`;
				if ($.format === 'includes') return `Șir invalid: trebuie să includă "${$.includes}"`;
				if ($.format === 'regex')
					return `Șir invalid: trebuie să se potrivească cu modelul ${$.pattern}`;
				return `Format invalid: ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Număr invalid: trebuie să fie multiplu de ${n.divisor}`;
			case 'unrecognized_keys':
				return `Chei nerecunoscute: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Cheie invalidă în ${n.origin}`;
			case 'invalid_union':
				return 'Intrare invalidă';
			case 'invalid_element':
				return `Valoare invalidă în ${n.origin}`;
			default:
				return 'Intrare invalidă';
		}
	};
};
function g4() {
	return { localeError: Ik() };
}
function Jb(r, i, v, u) {
	let n = Math.abs(r),
		$ = n % 10,
		g = n % 100;
	if (g >= 11 && g <= 19) return u;
	if ($ === 1) return i;
	if ($ >= 2 && $ <= 4) return v;
	return u;
}
var ok = () => {
	let r = {
		string: { unit: { one: 'символ', few: 'символа', many: 'символов' }, verb: 'иметь' },
		file: { unit: { one: 'байт', few: 'байта', many: 'байт' }, verb: 'иметь' },
		array: { unit: { one: 'элемент', few: 'элемента', many: 'элементов' }, verb: 'иметь' },
		set: { unit: { one: 'элемент', few: 'элемента', many: 'элементов' }, verb: 'иметь' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'ввод',
			email: 'email адрес',
			url: 'URL',
			emoji: 'эмодзи',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO дата и время',
			date: 'ISO дата',
			time: 'ISO время',
			duration: 'ISO длительность',
			ipv4: 'IPv4 адрес',
			ipv6: 'IPv6 адрес',
			cidrv4: 'IPv4 диапазон',
			cidrv6: 'IPv6 диапазон',
			base64: 'строка в формате base64',
			base64url: 'строка в формате base64url',
			json_string: 'JSON строка',
			e164: 'номер E.164',
			jwt: 'JWT',
			template_literal: 'ввод'
		},
		u = { nan: 'NaN', number: 'число', array: 'массив' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Неверный ввод: ожидалось instanceof ${n.expected}, получено ${I}`;
				return `Неверный ввод: ожидалось ${$}, получено ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Неверный ввод: ожидалось ${S(n.values[0])}`;
				return `Неверный вариант: ожидалось одно из ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g) {
					let I = Number(n.maximum),
						b = Jb(I, g.unit.one, g.unit.few, g.unit.many);
					return `Слишком большое значение: ожидалось, что ${n.origin ?? 'значение'} будет иметь ${$}${n.maximum.toString()} ${b}`;
				}
				return `Слишком большое значение: ожидалось, что ${n.origin ?? 'значение'} будет ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) {
					let I = Number(n.minimum),
						b = Jb(I, g.unit.one, g.unit.few, g.unit.many);
					return `Слишком маленькое значение: ожидалось, что ${n.origin} будет иметь ${$}${n.minimum.toString()} ${b}`;
				}
				return `Слишком маленькое значение: ожидалось, что ${n.origin} будет ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Неверная строка: должна начинаться с "${$.prefix}"`;
				if ($.format === 'ends_with')
					return `Неверная строка: должна заканчиваться на "${$.suffix}"`;
				if ($.format === 'includes') return `Неверная строка: должна содержать "${$.includes}"`;
				if ($.format === 'regex')
					return `Неверная строка: должна соответствовать шаблону ${$.pattern}`;
				return `Неверный ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Неверное число: должно быть кратным ${n.divisor}`;
			case 'unrecognized_keys':
				return `Нераспознанн${n.keys.length > 1 ? 'ые' : 'ый'} ключ${n.keys.length > 1 ? 'и' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Неверный ключ в ${n.origin}`;
			case 'invalid_union':
				return 'Неверные входные данные';
			case 'invalid_element':
				return `Неверное значение в ${n.origin}`;
			default:
				return 'Неверные входные данные';
		}
	};
};
function I4() {
	return { localeError: ok() };
}
var bk = () => {
	let r = {
		string: { unit: 'znakov', verb: 'imeti' },
		file: { unit: 'bajtov', verb: 'imeti' },
		array: { unit: 'elementov', verb: 'imeti' },
		set: { unit: 'elementov', verb: 'imeti' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'vnos',
			email: 'e-poštni naslov',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO datum in čas',
			date: 'ISO datum',
			time: 'ISO čas',
			duration: 'ISO trajanje',
			ipv4: 'IPv4 naslov',
			ipv6: 'IPv6 naslov',
			cidrv4: 'obseg IPv4',
			cidrv6: 'obseg IPv6',
			base64: 'base64 kodiran niz',
			base64url: 'base64url kodiran niz',
			json_string: 'JSON niz',
			e164: 'E.164 številka',
			jwt: 'JWT',
			template_literal: 'vnos'
		},
		u = { nan: 'NaN', number: 'število', array: 'tabela' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Neveljaven vnos: pričakovano instanceof ${n.expected}, prejeto ${I}`;
				return `Neveljaven vnos: pričakovano ${$}, prejeto ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Neveljaven vnos: pričakovano ${S(n.values[0])}`;
				return `Neveljavna možnost: pričakovano eno izmed ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Preveliko: pričakovano, da bo ${n.origin ?? 'vrednost'} imelo ${$}${n.maximum.toString()} ${g.unit ?? 'elementov'}`;
				return `Preveliko: pričakovano, da bo ${n.origin ?? 'vrednost'} ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Premajhno: pričakovano, da bo ${n.origin} imelo ${$}${n.minimum.toString()} ${g.unit}`;
				return `Premajhno: pričakovano, da bo ${n.origin} ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Neveljaven niz: mora se začeti z "${$.prefix}"`;
				if ($.format === 'ends_with') return `Neveljaven niz: mora se končati z "${$.suffix}"`;
				if ($.format === 'includes') return `Neveljaven niz: mora vsebovati "${$.includes}"`;
				if ($.format === 'regex') return `Neveljaven niz: mora ustrezati vzorcu ${$.pattern}`;
				return `Neveljaven ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Neveljavno število: mora biti večkratnik ${n.divisor}`;
			case 'unrecognized_keys':
				return `Neprepoznan${n.keys.length > 1 ? 'i ključi' : ' ključ'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Neveljaven ključ v ${n.origin}`;
			case 'invalid_union':
				return 'Neveljaven vnos';
			case 'invalid_element':
				return `Neveljavna vrednost v ${n.origin}`;
			default:
				return 'Neveljaven vnos';
		}
	};
};
function o4() {
	return { localeError: bk() };
}
var _k = () => {
	let r = {
		string: { unit: 'tecken', verb: 'att ha' },
		file: { unit: 'bytes', verb: 'att ha' },
		array: { unit: 'objekt', verb: 'att innehålla' },
		set: { unit: 'objekt', verb: 'att innehålla' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'reguljärt uttryck',
			email: 'e-postadress',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO-datum och tid',
			date: 'ISO-datum',
			time: 'ISO-tid',
			duration: 'ISO-varaktighet',
			ipv4: 'IPv4-intervall',
			ipv6: 'IPv6-intervall',
			cidrv4: 'IPv4-spektrum',
			cidrv6: 'IPv6-spektrum',
			base64: 'base64-kodad sträng',
			base64url: 'base64url-kodad sträng',
			json_string: 'JSON-sträng',
			e164: 'E.164-nummer',
			jwt: 'JWT',
			template_literal: 'mall-literal'
		},
		u = { nan: 'NaN', number: 'antal', array: 'lista' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Ogiltig inmatning: förväntat instanceof ${n.expected}, fick ${I}`;
				return `Ogiltig inmatning: förväntat ${$}, fick ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Ogiltig inmatning: förväntat ${S(n.values[0])}`;
				return `Ogiltigt val: förväntade en av ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `För stor(t): förväntade ${n.origin ?? 'värdet'} att ha ${$}${n.maximum.toString()} ${g.unit ?? 'element'}`;
				return `För stor(t): förväntat ${n.origin ?? 'värdet'} att ha ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `För lite(t): förväntade ${n.origin ?? 'värdet'} att ha ${$}${n.minimum.toString()} ${g.unit}`;
				return `För lite(t): förväntade ${n.origin ?? 'värdet'} att ha ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Ogiltig sträng: måste börja med "${$.prefix}"`;
				if ($.format === 'ends_with') return `Ogiltig sträng: måste sluta med "${$.suffix}"`;
				if ($.format === 'includes') return `Ogiltig sträng: måste innehålla "${$.includes}"`;
				if ($.format === 'regex') return `Ogiltig sträng: måste matcha mönstret "${$.pattern}"`;
				return `Ogiltig(t) ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Ogiltigt tal: måste vara en multipel av ${n.divisor}`;
			case 'unrecognized_keys':
				return `${n.keys.length > 1 ? 'Okända nycklar' : 'Okänd nyckel'}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Ogiltig nyckel i ${n.origin ?? 'värdet'}`;
			case 'invalid_union':
				return 'Ogiltig input';
			case 'invalid_element':
				return `Ogiltigt värde i ${n.origin ?? 'värdet'}`;
			default:
				return 'Ogiltig input';
		}
	};
};
function b4() {
	return { localeError: _k() };
}
var Uk = () => {
	let r = {
		string: { unit: 'எழுத்துக்கள்', verb: 'கொண்டிருக்க வேண்டும்' },
		file: { unit: 'பைட்டுகள்', verb: 'கொண்டிருக்க வேண்டும்' },
		array: { unit: 'உறுப்புகள்', verb: 'கொண்டிருக்க வேண்டும்' },
		set: { unit: 'உறுப்புகள்', verb: 'கொண்டிருக்க வேண்டும்' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'உள்ளீடு',
			email: 'மின்னஞ்சல் முகவரி',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO தேதி நேரம்',
			date: 'ISO தேதி',
			time: 'ISO நேரம்',
			duration: 'ISO கால அளவு',
			ipv4: 'IPv4 முகவரி',
			ipv6: 'IPv6 முகவரி',
			cidrv4: 'IPv4 வரம்பு',
			cidrv6: 'IPv6 வரம்பு',
			base64: 'base64-encoded சரம்',
			base64url: 'base64url-encoded சரம்',
			json_string: 'JSON சரம்',
			e164: 'E.164 எண்',
			jwt: 'JWT',
			template_literal: 'input'
		},
		u = { nan: 'NaN', number: 'எண்', array: 'அணி', null: 'வெறுமை' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${n.expected}, பெறப்பட்டது ${I}`;
				return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${$}, பெறப்பட்டது ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${S(n.values[0])}`;
				return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${k(n.values, '|')} இல் ஒன்று`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${n.origin ?? 'மதிப்பு'} ${$}${n.maximum.toString()} ${g.unit ?? 'உறுப்புகள்'} ஆக இருக்க வேண்டும்`;
				return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${n.origin ?? 'மதிப்பு'} ${$}${n.maximum.toString()} ஆக இருக்க வேண்டும்`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${n.origin} ${$}${n.minimum.toString()} ${g.unit} ஆக இருக்க வேண்டும்`;
				return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${n.origin} ${$}${n.minimum.toString()} ஆக இருக்க வேண்டும்`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `தவறான சரம்: "${$.prefix}" இல் தொடங்க வேண்டும்`;
				if ($.format === 'ends_with') return `தவறான சரம்: "${$.suffix}" இல் முடிவடைய வேண்டும்`;
				if ($.format === 'includes') return `தவறான சரம்: "${$.includes}" ஐ உள்ளடக்க வேண்டும்`;
				if ($.format === 'regex') return `தவறான சரம்: ${$.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
				return `தவறான ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `தவறான எண்: ${n.divisor} இன் பலமாக இருக்க வேண்டும்`;
			case 'unrecognized_keys':
				return `அடையாளம் தெரியாத விசை${n.keys.length > 1 ? 'கள்' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `${n.origin} இல் தவறான விசை`;
			case 'invalid_union':
				return 'தவறான உள்ளீடு';
			case 'invalid_element':
				return `${n.origin} இல் தவறான மதிப்பு`;
			default:
				return 'தவறான உள்ளீடு';
		}
	};
};
function _4() {
	return { localeError: Uk() };
}
var lk = () => {
	let r = {
		string: { unit: 'ตัวอักษร', verb: 'ควรมี' },
		file: { unit: 'ไบต์', verb: 'ควรมี' },
		array: { unit: 'รายการ', verb: 'ควรมี' },
		set: { unit: 'รายการ', verb: 'ควรมี' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'ข้อมูลที่ป้อน',
			email: 'ที่อยู่อีเมล',
			url: 'URL',
			emoji: 'อิโมจิ',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'วันที่เวลาแบบ ISO',
			date: 'วันที่แบบ ISO',
			time: 'เวลาแบบ ISO',
			duration: 'ช่วงเวลาแบบ ISO',
			ipv4: 'ที่อยู่ IPv4',
			ipv6: 'ที่อยู่ IPv6',
			cidrv4: 'ช่วง IP แบบ IPv4',
			cidrv6: 'ช่วง IP แบบ IPv6',
			base64: 'ข้อความแบบ Base64',
			base64url: 'ข้อความแบบ Base64 สำหรับ URL',
			json_string: 'ข้อความแบบ JSON',
			e164: 'เบอร์โทรศัพท์ระหว่างประเทศ (E.164)',
			jwt: 'โทเคน JWT',
			template_literal: 'ข้อมูลที่ป้อน'
		},
		u = { nan: 'NaN', number: 'ตัวเลข', array: 'อาร์เรย์ (Array)', null: 'ไม่มีค่า (null)' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${n.expected} แต่ได้รับ ${I}`;
				return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${$} แต่ได้รับ ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `ค่าไม่ถูกต้อง: ควรเป็น ${S(n.values[0])}`;
				return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? 'ไม่เกิน' : 'น้อยกว่า',
					g = i(n.origin);
				if (g)
					return `เกินกำหนด: ${n.origin ?? 'ค่า'} ควรมี${$} ${n.maximum.toString()} ${g.unit ?? 'รายการ'}`;
				return `เกินกำหนด: ${n.origin ?? 'ค่า'} ควรมี${$} ${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? 'อย่างน้อย' : 'มากกว่า',
					g = i(n.origin);
				if (g) return `น้อยกว่ากำหนด: ${n.origin} ควรมี${$} ${n.minimum.toString()} ${g.unit}`;
				return `น้อยกว่ากำหนด: ${n.origin} ควรมี${$} ${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${$.prefix}"`;
				if ($.format === 'ends_with')
					return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${$.suffix}"`;
				if ($.format === 'includes')
					return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${$.includes}" อยู่ในข้อความ`;
				if ($.format === 'regex') return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${$.pattern}`;
				return `รูปแบบไม่ถูกต้อง: ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${n.divisor} ได้ลงตัว`;
			case 'unrecognized_keys':
				return `พบคีย์ที่ไม่รู้จัก: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `คีย์ไม่ถูกต้องใน ${n.origin}`;
			case 'invalid_union':
				return 'ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้';
			case 'invalid_element':
				return `ข้อมูลไม่ถูกต้องใน ${n.origin}`;
			default:
				return 'ข้อมูลไม่ถูกต้อง';
		}
	};
};
function U4() {
	return { localeError: lk() };
}
var kk = () => {
	let r = {
		string: { unit: 'karakter', verb: 'olmalı' },
		file: { unit: 'bayt', verb: 'olmalı' },
		array: { unit: 'öğe', verb: 'olmalı' },
		set: { unit: 'öğe', verb: 'olmalı' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'girdi',
			email: 'e-posta adresi',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO tarih ve saat',
			date: 'ISO tarih',
			time: 'ISO saat',
			duration: 'ISO süre',
			ipv4: 'IPv4 adresi',
			ipv6: 'IPv6 adresi',
			cidrv4: 'IPv4 aralığı',
			cidrv6: 'IPv6 aralığı',
			base64: 'base64 ile şifrelenmiş metin',
			base64url: 'base64url ile şifrelenmiş metin',
			json_string: 'JSON dizesi',
			e164: 'E.164 sayısı',
			jwt: 'JWT',
			template_literal: 'Şablon dizesi'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Geçersiz değer: beklenen instanceof ${n.expected}, alınan ${I}`;
				return `Geçersiz değer: beklenen ${$}, alınan ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Geçersiz değer: beklenen ${S(n.values[0])}`;
				return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Çok büyük: beklenen ${n.origin ?? 'değer'} ${$}${n.maximum.toString()} ${g.unit ?? 'öğe'}`;
				return `Çok büyük: beklenen ${n.origin ?? 'değer'} ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) return `Çok küçük: beklenen ${n.origin} ${$}${n.minimum.toString()} ${g.unit}`;
				return `Çok küçük: beklenen ${n.origin} ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Geçersiz metin: "${$.prefix}" ile başlamalı`;
				if ($.format === 'ends_with') return `Geçersiz metin: "${$.suffix}" ile bitmeli`;
				if ($.format === 'includes') return `Geçersiz metin: "${$.includes}" içermeli`;
				if ($.format === 'regex') return `Geçersiz metin: ${$.pattern} desenine uymalı`;
				return `Geçersiz ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Geçersiz sayı: ${n.divisor} ile tam bölünebilmeli`;
			case 'unrecognized_keys':
				return `Tanınmayan anahtar${n.keys.length > 1 ? 'lar' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `${n.origin} içinde geçersiz anahtar`;
			case 'invalid_union':
				return 'Geçersiz değer';
			case 'invalid_element':
				return `${n.origin} içinde geçersiz değer`;
			default:
				return 'Geçersiz değer';
		}
	};
};
function l4() {
	return { localeError: kk() };
}
var Dk = () => {
	let r = {
		string: { unit: 'символів', verb: 'матиме' },
		file: { unit: 'байтів', verb: 'матиме' },
		array: { unit: 'елементів', verb: 'матиме' },
		set: { unit: 'елементів', verb: 'матиме' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'вхідні дані',
			email: 'адреса електронної пошти',
			url: 'URL',
			emoji: 'емодзі',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'дата та час ISO',
			date: 'дата ISO',
			time: 'час ISO',
			duration: 'тривалість ISO',
			ipv4: 'адреса IPv4',
			ipv6: 'адреса IPv6',
			cidrv4: 'діапазон IPv4',
			cidrv6: 'діапазон IPv6',
			base64: 'рядок у кодуванні base64',
			base64url: 'рядок у кодуванні base64url',
			json_string: 'рядок JSON',
			e164: 'номер E.164',
			jwt: 'JWT',
			template_literal: 'вхідні дані'
		},
		u = { nan: 'NaN', number: 'число', array: 'масив' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Неправильні вхідні дані: очікується instanceof ${n.expected}, отримано ${I}`;
				return `Неправильні вхідні дані: очікується ${$}, отримано ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Неправильні вхідні дані: очікується ${S(n.values[0])}`;
				return `Неправильна опція: очікується одне з ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Занадто велике: очікується, що ${n.origin ?? 'значення'} ${g.verb} ${$}${n.maximum.toString()} ${g.unit ?? 'елементів'}`;
				return `Занадто велике: очікується, що ${n.origin ?? 'значення'} буде ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Занадто мале: очікується, що ${n.origin} ${g.verb} ${$}${n.minimum.toString()} ${g.unit}`;
				return `Занадто мале: очікується, що ${n.origin} буде ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Неправильний рядок: повинен починатися з "${$.prefix}"`;
				if ($.format === 'ends_with')
					return `Неправильний рядок: повинен закінчуватися на "${$.suffix}"`;
				if ($.format === 'includes') return `Неправильний рядок: повинен містити "${$.includes}"`;
				if ($.format === 'regex')
					return `Неправильний рядок: повинен відповідати шаблону ${$.pattern}`;
				return `Неправильний ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Неправильне число: повинно бути кратним ${n.divisor}`;
			case 'unrecognized_keys':
				return `Нерозпізнаний ключ${n.keys.length > 1 ? 'і' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Неправильний ключ у ${n.origin}`;
			case 'invalid_union':
				return 'Неправильні вхідні дані';
			case 'invalid_element':
				return `Неправильне значення у ${n.origin}`;
			default:
				return 'Неправильні вхідні дані';
		}
	};
};
function Fn() {
	return { localeError: Dk() };
}
function k4() {
	return Fn();
}
var ck = () => {
	let r = {
		string: { unit: 'حروف', verb: 'ہونا' },
		file: { unit: 'بائٹس', verb: 'ہونا' },
		array: { unit: 'آئٹمز', verb: 'ہونا' },
		set: { unit: 'آئٹمز', verb: 'ہونا' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'ان پٹ',
			email: 'ای میل ایڈریس',
			url: 'یو آر ایل',
			emoji: 'ایموجی',
			uuid: 'یو یو آئی ڈی',
			uuidv4: 'یو یو آئی ڈی وی 4',
			uuidv6: 'یو یو آئی ڈی وی 6',
			nanoid: 'نینو آئی ڈی',
			guid: 'جی یو آئی ڈی',
			cuid: 'سی یو آئی ڈی',
			cuid2: 'سی یو آئی ڈی 2',
			ulid: 'یو ایل آئی ڈی',
			xid: 'ایکس آئی ڈی',
			ksuid: 'کے ایس یو آئی ڈی',
			datetime: 'آئی ایس او ڈیٹ ٹائم',
			date: 'آئی ایس او تاریخ',
			time: 'آئی ایس او وقت',
			duration: 'آئی ایس او مدت',
			ipv4: 'آئی پی وی 4 ایڈریس',
			ipv6: 'آئی پی وی 6 ایڈریس',
			cidrv4: 'آئی پی وی 4 رینج',
			cidrv6: 'آئی پی وی 6 رینج',
			base64: 'بیس 64 ان کوڈڈ سٹرنگ',
			base64url: 'بیس 64 یو آر ایل ان کوڈڈ سٹرنگ',
			json_string: 'جے ایس او این سٹرنگ',
			e164: 'ای 164 نمبر',
			jwt: 'جے ڈبلیو ٹی',
			template_literal: 'ان پٹ'
		},
		u = { nan: 'NaN', number: 'نمبر', array: 'آرے', null: 'نل' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `غلط ان پٹ: instanceof ${n.expected} متوقع تھا، ${I} موصول ہوا`;
				return `غلط ان پٹ: ${$} متوقع تھا، ${I} موصول ہوا`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `غلط ان پٹ: ${S(n.values[0])} متوقع تھا`;
				return `غلط آپشن: ${k(n.values, '|')} میں سے ایک متوقع تھا`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `بہت بڑا: ${n.origin ?? 'ویلیو'} کے ${$}${n.maximum.toString()} ${g.unit ?? 'عناصر'} ہونے متوقع تھے`;
				return `بہت بڑا: ${n.origin ?? 'ویلیو'} کا ${$}${n.maximum.toString()} ہونا متوقع تھا`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `بہت چھوٹا: ${n.origin} کے ${$}${n.minimum.toString()} ${g.unit} ہونے متوقع تھے`;
				return `بہت چھوٹا: ${n.origin} کا ${$}${n.minimum.toString()} ہونا متوقع تھا`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `غلط سٹرنگ: "${$.prefix}" سے شروع ہونا چاہیے`;
				if ($.format === 'ends_with') return `غلط سٹرنگ: "${$.suffix}" پر ختم ہونا چاہیے`;
				if ($.format === 'includes') return `غلط سٹرنگ: "${$.includes}" شامل ہونا چاہیے`;
				if ($.format === 'regex') return `غلط سٹرنگ: پیٹرن ${$.pattern} سے میچ ہونا چاہیے`;
				return `غلط ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `غلط نمبر: ${n.divisor} کا مضاعف ہونا چاہیے`;
			case 'unrecognized_keys':
				return `غیر تسلیم شدہ کی${n.keys.length > 1 ? 'ز' : ''}: ${k(n.keys, '، ')}`;
			case 'invalid_key':
				return `${n.origin} میں غلط کی`;
			case 'invalid_union':
				return 'غلط ان پٹ';
			case 'invalid_element':
				return `${n.origin} میں غلط ویلیو`;
			default:
				return 'غلط ان پٹ';
		}
	};
};
function D4() {
	return { localeError: ck() };
}
var Sk = () => {
	let r = {
		string: { unit: 'belgi', verb: 'bo‘lishi kerak' },
		file: { unit: 'bayt', verb: 'bo‘lishi kerak' },
		array: { unit: 'element', verb: 'bo‘lishi kerak' },
		set: { unit: 'element', verb: 'bo‘lishi kerak' },
		map: { unit: 'yozuv', verb: 'bo‘lishi kerak' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'kirish',
			email: 'elektron pochta manzili',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO sana va vaqti',
			date: 'ISO sana',
			time: 'ISO vaqt',
			duration: 'ISO davomiylik',
			ipv4: 'IPv4 manzil',
			ipv6: 'IPv6 manzil',
			mac: 'MAC manzil',
			cidrv4: 'IPv4 diapazon',
			cidrv6: 'IPv6 diapazon',
			base64: 'base64 kodlangan satr',
			base64url: 'base64url kodlangan satr',
			json_string: 'JSON satr',
			e164: 'E.164 raqam',
			jwt: 'JWT',
			template_literal: 'kirish'
		},
		u = { nan: 'NaN', number: 'raqam', array: 'massiv' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Noto‘g‘ri kirish: kutilgan instanceof ${n.expected}, qabul qilingan ${I}`;
				return `Noto‘g‘ri kirish: kutilgan ${$}, qabul qilingan ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Noto‘g‘ri kirish: kutilgan ${S(n.values[0])}`;
				return `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Juda katta: kutilgan ${n.origin ?? 'qiymat'} ${$}${n.maximum.toString()} ${g.unit} ${g.verb}`;
				return `Juda katta: kutilgan ${n.origin ?? 'qiymat'} ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Juda kichik: kutilgan ${n.origin} ${$}${n.minimum.toString()} ${g.unit} ${g.verb}`;
				return `Juda kichik: kutilgan ${n.origin} ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Noto‘g‘ri satr: "${$.prefix}" bilan boshlanishi kerak`;
				if ($.format === 'ends_with') return `Noto‘g‘ri satr: "${$.suffix}" bilan tugashi kerak`;
				if ($.format === 'includes')
					return `Noto‘g‘ri satr: "${$.includes}" ni o‘z ichiga olishi kerak`;
				if ($.format === 'regex')
					return `Noto‘g‘ri satr: ${$.pattern} shabloniga mos kelishi kerak`;
				return `Noto‘g‘ri ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Noto‘g‘ri raqam: ${n.divisor} ning karralisi bo‘lishi kerak`;
			case 'unrecognized_keys':
				return `Noma’lum kalit${n.keys.length > 1 ? 'lar' : ''}: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `${n.origin} dagi kalit noto‘g‘ri`;
			case 'invalid_union':
				return 'Noto‘g‘ri kirish';
			case 'invalid_element':
				return `${n.origin} da noto‘g‘ri qiymat`;
			default:
				return 'Noto‘g‘ri kirish';
		}
	};
};
function c4() {
	return { localeError: Sk() };
}
var wk = () => {
	let r = {
		string: { unit: 'ký tự', verb: 'có' },
		file: { unit: 'byte', verb: 'có' },
		array: { unit: 'phần tử', verb: 'có' },
		set: { unit: 'phần tử', verb: 'có' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'đầu vào',
			email: 'địa chỉ email',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ngày giờ ISO',
			date: 'ngày ISO',
			time: 'giờ ISO',
			duration: 'khoảng thời gian ISO',
			ipv4: 'địa chỉ IPv4',
			ipv6: 'địa chỉ IPv6',
			cidrv4: 'dải IPv4',
			cidrv6: 'dải IPv6',
			base64: 'chuỗi mã hóa base64',
			base64url: 'chuỗi mã hóa base64url',
			json_string: 'chuỗi JSON',
			e164: 'số E.164',
			jwt: 'JWT',
			template_literal: 'đầu vào'
		},
		u = { nan: 'NaN', number: 'số', array: 'mảng' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Đầu vào không hợp lệ: mong đợi instanceof ${n.expected}, nhận được ${I}`;
				return `Đầu vào không hợp lệ: mong đợi ${$}, nhận được ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Đầu vào không hợp lệ: mong đợi ${S(n.values[0])}`;
				return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Quá lớn: mong đợi ${n.origin ?? 'giá trị'} ${g.verb} ${$}${n.maximum.toString()} ${g.unit ?? 'phần tử'}`;
				return `Quá lớn: mong đợi ${n.origin ?? 'giá trị'} ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g)
					return `Quá nhỏ: mong đợi ${n.origin} ${g.verb} ${$}${n.minimum.toString()} ${g.unit}`;
				return `Quá nhỏ: mong đợi ${n.origin} ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with')
					return `Chuỗi không hợp lệ: phải bắt đầu bằng "${$.prefix}"`;
				if ($.format === 'ends_with') return `Chuỗi không hợp lệ: phải kết thúc bằng "${$.suffix}"`;
				if ($.format === 'includes') return `Chuỗi không hợp lệ: phải bao gồm "${$.includes}"`;
				if ($.format === 'regex') return `Chuỗi không hợp lệ: phải khớp với mẫu ${$.pattern}`;
				return `${v[$.format] ?? n.format} không hợp lệ`;
			}
			case 'not_multiple_of':
				return `Số không hợp lệ: phải là bội số của ${n.divisor}`;
			case 'unrecognized_keys':
				return `Khóa không được nhận dạng: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Khóa không hợp lệ trong ${n.origin}`;
			case 'invalid_union':
				return 'Đầu vào không hợp lệ';
			case 'invalid_element':
				return `Giá trị không hợp lệ trong ${n.origin}`;
			default:
				return 'Đầu vào không hợp lệ';
		}
	};
};
function S4() {
	return { localeError: wk() };
}
var zk = () => {
	let r = {
		string: { unit: '字符', verb: '包含' },
		file: { unit: '字节', verb: '包含' },
		array: { unit: '项', verb: '包含' },
		set: { unit: '项', verb: '包含' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: '输入',
			email: '电子邮件',
			url: 'URL',
			emoji: '表情符号',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO日期时间',
			date: 'ISO日期',
			time: 'ISO时间',
			duration: 'ISO时长',
			ipv4: 'IPv4地址',
			ipv6: 'IPv6地址',
			cidrv4: 'IPv4网段',
			cidrv6: 'IPv6网段',
			base64: 'base64编码字符串',
			base64url: 'base64url编码字符串',
			json_string: 'JSON字符串',
			e164: 'E.164号码',
			jwt: 'JWT',
			template_literal: '输入'
		},
		u = { nan: 'NaN', number: '数字', array: '数组', null: '空值(null)' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `无效输入：期望 instanceof ${n.expected}，实际接收 ${I}`;
				return `无效输入：期望 ${$}，实际接收 ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `无效输入：期望 ${S(n.values[0])}`;
				return `无效选项：期望以下之一 ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `数值过大：期望 ${n.origin ?? '值'} ${$}${n.maximum.toString()} ${g.unit ?? '个元素'}`;
				return `数值过大：期望 ${n.origin ?? '值'} ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) return `数值过小：期望 ${n.origin} ${$}${n.minimum.toString()} ${g.unit}`;
				return `数值过小：期望 ${n.origin} ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `无效字符串：必须以 "${$.prefix}" 开头`;
				if ($.format === 'ends_with') return `无效字符串：必须以 "${$.suffix}" 结尾`;
				if ($.format === 'includes') return `无效字符串：必须包含 "${$.includes}"`;
				if ($.format === 'regex') return `无效字符串：必须满足正则表达式 ${$.pattern}`;
				return `无效${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `无效数字：必须是 ${n.divisor} 的倍数`;
			case 'unrecognized_keys':
				return `出现未知的键(key): ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `${n.origin} 中的键(key)无效`;
			case 'invalid_union':
				return '无效输入';
			case 'invalid_element':
				return `${n.origin} 中包含无效值(value)`;
			default:
				return '无效输入';
		}
	};
};
function w4() {
	return { localeError: zk() };
}
var Nk = () => {
	let r = {
		string: { unit: '字元', verb: '擁有' },
		file: { unit: '位元組', verb: '擁有' },
		array: { unit: '項目', verb: '擁有' },
		set: { unit: '項目', verb: '擁有' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: '輸入',
			email: '郵件地址',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'ISO 日期時間',
			date: 'ISO 日期',
			time: 'ISO 時間',
			duration: 'ISO 期間',
			ipv4: 'IPv4 位址',
			ipv6: 'IPv6 位址',
			cidrv4: 'IPv4 範圍',
			cidrv6: 'IPv6 範圍',
			base64: 'base64 編碼字串',
			base64url: 'base64url 編碼字串',
			json_string: 'JSON 字串',
			e164: 'E.164 數值',
			jwt: 'JWT',
			template_literal: '輸入'
		},
		u = { nan: 'NaN' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `無效的輸入值：預期為 instanceof ${n.expected}，但收到 ${I}`;
				return `無效的輸入值：預期為 ${$}，但收到 ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `無效的輸入值：預期為 ${S(n.values[0])}`;
				return `無效的選項：預期為以下其中之一 ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `數值過大：預期 ${n.origin ?? '值'} 應為 ${$}${n.maximum.toString()} ${g.unit ?? '個元素'}`;
				return `數值過大：預期 ${n.origin ?? '值'} 應為 ${$}${n.maximum.toString()}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) return `數值過小：預期 ${n.origin} 應為 ${$}${n.minimum.toString()} ${g.unit}`;
				return `數值過小：預期 ${n.origin} 應為 ${$}${n.minimum.toString()}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `無效的字串：必須以 "${$.prefix}" 開頭`;
				if ($.format === 'ends_with') return `無效的字串：必須以 "${$.suffix}" 結尾`;
				if ($.format === 'includes') return `無效的字串：必須包含 "${$.includes}"`;
				if ($.format === 'regex') return `無效的字串：必須符合格式 ${$.pattern}`;
				return `無效的 ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `無效的數字：必須為 ${n.divisor} 的倍數`;
			case 'unrecognized_keys':
				return `無法識別的鍵值${n.keys.length > 1 ? '們' : ''}：${k(n.keys, '、')}`;
			case 'invalid_key':
				return `${n.origin} 中有無效的鍵值`;
			case 'invalid_union':
				return '無效的輸入值';
			case 'invalid_element':
				return `${n.origin} 中有無效的值`;
			default:
				return '無效的輸入值';
		}
	};
};
function z4() {
	return { localeError: Nk() };
}
var Pk = () => {
	let r = {
		string: { unit: 'àmi', verb: 'ní' },
		file: { unit: 'bytes', verb: 'ní' },
		array: { unit: 'nkan', verb: 'ní' },
		set: { unit: 'nkan', verb: 'ní' }
	};
	function i(n) {
		return r[n] ?? null;
	}
	let v = {
			regex: 'ẹ̀rọ ìbáwọlé',
			email: 'àdírẹ́sì ìmẹ́lì',
			url: 'URL',
			emoji: 'emoji',
			uuid: 'UUID',
			uuidv4: 'UUIDv4',
			uuidv6: 'UUIDv6',
			nanoid: 'nanoid',
			guid: 'GUID',
			cuid: 'cuid',
			cuid2: 'cuid2',
			ulid: 'ULID',
			xid: 'XID',
			ksuid: 'KSUID',
			datetime: 'àkókò ISO',
			date: 'ọjọ́ ISO',
			time: 'àkókò ISO',
			duration: 'àkókò tó pé ISO',
			ipv4: 'àdírẹ́sì IPv4',
			ipv6: 'àdírẹ́sì IPv6',
			cidrv4: 'àgbègbè IPv4',
			cidrv6: 'àgbègbè IPv6',
			base64: 'ọ̀rọ̀ tí a kọ́ ní base64',
			base64url: 'ọ̀rọ̀ base64url',
			json_string: 'ọ̀rọ̀ JSON',
			e164: 'nọ́mbà E.164',
			jwt: 'JWT',
			template_literal: 'ẹ̀rọ ìbáwọlé'
		},
		u = { nan: 'NaN', number: 'nọ́mbà', array: 'akopọ' };
	return (n) => {
		switch (n.code) {
			case 'invalid_type': {
				let $ = u[n.expected] ?? n.expected,
					g = w(n.input),
					I = u[g] ?? g;
				if (/^[A-Z]/.test(n.expected))
					return `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${n.expected}, àmọ̀ a rí ${I}`;
				return `Ìbáwọlé aṣìṣe: a ní láti fi ${$}, àmọ̀ a rí ${I}`;
			}
			case 'invalid_value':
				if (n.values.length === 1) return `Ìbáwọlé aṣìṣe: a ní láti fi ${S(n.values[0])}`;
				return `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${k(n.values, '|')}`;
			case 'too_big': {
				let $ = n.inclusive ? '<=' : '<',
					g = i(n.origin);
				if (g)
					return `Tó pọ̀ jù: a ní láti jẹ́ pé ${n.origin ?? 'iye'} ${g.verb} ${$}${n.maximum} ${g.unit}`;
				return `Tó pọ̀ jù: a ní láti jẹ́ ${$}${n.maximum}`;
			}
			case 'too_small': {
				let $ = n.inclusive ? '>=' : '>',
					g = i(n.origin);
				if (g) return `Kéré ju: a ní láti jẹ́ pé ${n.origin} ${g.verb} ${$}${n.minimum} ${g.unit}`;
				return `Kéré ju: a ní láti jẹ́ ${$}${n.minimum}`;
			}
			case 'invalid_format': {
				let $ = n;
				if ($.format === 'starts_with') return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${$.prefix}"`;
				if ($.format === 'ends_with') return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${$.suffix}"`;
				if ($.format === 'includes') return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${$.includes}"`;
				if ($.format === 'regex') return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${$.pattern}`;
				return `Aṣìṣe: ${v[$.format] ?? n.format}`;
			}
			case 'not_multiple_of':
				return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${n.divisor}`;
			case 'unrecognized_keys':
				return `Bọtìnì àìmọ̀: ${k(n.keys, ', ')}`;
			case 'invalid_key':
				return `Bọtìnì aṣìṣe nínú ${n.origin}`;
			case 'invalid_union':
				return 'Ìbáwọlé aṣìṣe';
			case 'invalid_element':
				return `Iye aṣìṣe nínú ${n.origin}`;
			default:
				return 'Ìbáwọlé aṣìṣe';
		}
	};
};
function N4() {
	return { localeError: Pk() };
}
var Lb,
	P4 = Symbol('ZodOutput'),
	j4 = Symbol('ZodInput');
class J4 {
	constructor() {
		((this._map = new WeakMap()), (this._idmap = new Map()));
	}
	add(r, ...i) {
		let v = i[0];
		if ((this._map.set(r, v), v && typeof v === 'object' && 'id' in v)) this._idmap.set(v.id, r);
		return this;
	}
	clear() {
		return ((this._map = new WeakMap()), (this._idmap = new Map()), this);
	}
	remove(r) {
		let i = this._map.get(r);
		if (i && typeof i === 'object' && 'id' in i) this._idmap.delete(i.id);
		return (this._map.delete(r), this);
	}
	get(r) {
		let i = r._zod.parent;
		if (i) {
			let v = { ...(this.get(i) ?? {}) };
			delete v.id;
			let u = { ...v, ...this._map.get(r) };
			return Object.keys(u).length ? u : void 0;
		}
		return this._map.get(r);
	}
	has(r) {
		return this._map.has(r);
	}
}
function Bi() {
	return new J4();
}
(Lb = globalThis).__zod_globalRegistry ?? (Lb.__zod_globalRegistry = Bi());
var f = globalThis.__zod_globalRegistry;
function L4(r, i) {
	return new r({ type: 'string', ...N(i) });
}
function G4(r, i) {
	return new r({ type: 'string', coerce: !0, ...N(i) });
}
function ti(r, i) {
	return new r({ type: 'string', format: 'email', check: 'string_format', abort: !1, ...N(i) });
}
function Zn(r, i) {
	return new r({ type: 'string', format: 'guid', check: 'string_format', abort: !1, ...N(i) });
}
function Mi(r, i) {
	return new r({ type: 'string', format: 'uuid', check: 'string_format', abort: !1, ...N(i) });
}
function Ai(r, i) {
	return new r({
		type: 'string',
		format: 'uuid',
		check: 'string_format',
		abort: !1,
		version: 'v4',
		...N(i)
	});
}
function Ri(r, i) {
	return new r({
		type: 'string',
		format: 'uuid',
		check: 'string_format',
		abort: !1,
		version: 'v6',
		...N(i)
	});
}
function Fi(r, i) {
	return new r({
		type: 'string',
		format: 'uuid',
		check: 'string_format',
		abort: !1,
		version: 'v7',
		...N(i)
	});
}
function fn(r, i) {
	return new r({ type: 'string', format: 'url', check: 'string_format', abort: !1, ...N(i) });
}
function xi(r, i) {
	return new r({ type: 'string', format: 'emoji', check: 'string_format', abort: !1, ...N(i) });
}
function Zi(r, i) {
	return new r({ type: 'string', format: 'nanoid', check: 'string_format', abort: !1, ...N(i) });
}
function fi(r, i) {
	return new r({ type: 'string', format: 'cuid', check: 'string_format', abort: !1, ...N(i) });
}
function Ci(r, i) {
	return new r({ type: 'string', format: 'cuid2', check: 'string_format', abort: !1, ...N(i) });
}
function mi(r, i) {
	return new r({ type: 'string', format: 'ulid', check: 'string_format', abort: !1, ...N(i) });
}
function yi(r, i) {
	return new r({ type: 'string', format: 'xid', check: 'string_format', abort: !1, ...N(i) });
}
function di(r, i) {
	return new r({ type: 'string', format: 'ksuid', check: 'string_format', abort: !1, ...N(i) });
}
function hi(r, i) {
	return new r({ type: 'string', format: 'ipv4', check: 'string_format', abort: !1, ...N(i) });
}
function ei(r, i) {
	return new r({ type: 'string', format: 'ipv6', check: 'string_format', abort: !1, ...N(i) });
}
function X4(r, i) {
	return new r({ type: 'string', format: 'mac', check: 'string_format', abort: !1, ...N(i) });
}
function ai(r, i) {
	return new r({ type: 'string', format: 'cidrv4', check: 'string_format', abort: !1, ...N(i) });
}
function pi(r, i) {
	return new r({ type: 'string', format: 'cidrv6', check: 'string_format', abort: !1, ...N(i) });
}
function si(r, i) {
	return new r({ type: 'string', format: 'base64', check: 'string_format', abort: !1, ...N(i) });
}
function rv(r, i) {
	return new r({ type: 'string', format: 'base64url', check: 'string_format', abort: !1, ...N(i) });
}
function nv(r, i) {
	return new r({ type: 'string', format: 'e164', check: 'string_format', abort: !1, ...N(i) });
}
function iv(r, i) {
	return new r({ type: 'string', format: 'jwt', check: 'string_format', abort: !1, ...N(i) });
}
var O4 = { Any: null, Minute: -1, Second: 0, Millisecond: 3, Microsecond: 6 };
function q4(r, i) {
	return new r({
		type: 'string',
		format: 'datetime',
		check: 'string_format',
		offset: !1,
		local: !1,
		precision: null,
		...N(i)
	});
}
function W4(r, i) {
	return new r({ type: 'string', format: 'date', check: 'string_format', ...N(i) });
}
function V4(r, i) {
	return new r({
		type: 'string',
		format: 'time',
		check: 'string_format',
		precision: null,
		...N(i)
	});
}
function Y4(r, i) {
	return new r({ type: 'string', format: 'duration', check: 'string_format', ...N(i) });
}
function E4(r, i) {
	return new r({ type: 'number', checks: [], ...N(i) });
}
function K4(r, i) {
	return new r({ type: 'number', coerce: !0, checks: [], ...N(i) });
}
function Q4(r, i) {
	return new r({ type: 'number', check: 'number_format', abort: !1, format: 'safeint', ...N(i) });
}
function T4(r, i) {
	return new r({ type: 'number', check: 'number_format', abort: !1, format: 'float32', ...N(i) });
}
function H4(r, i) {
	return new r({ type: 'number', check: 'number_format', abort: !1, format: 'float64', ...N(i) });
}
function B4(r, i) {
	return new r({ type: 'number', check: 'number_format', abort: !1, format: 'int32', ...N(i) });
}
function t4(r, i) {
	return new r({ type: 'number', check: 'number_format', abort: !1, format: 'uint32', ...N(i) });
}
function M4(r, i) {
	return new r({ type: 'boolean', ...N(i) });
}
function A4(r, i) {
	return new r({ type: 'boolean', coerce: !0, ...N(i) });
}
function R4(r, i) {
	return new r({ type: 'bigint', ...N(i) });
}
function F4(r, i) {
	return new r({ type: 'bigint', coerce: !0, ...N(i) });
}
function x4(r, i) {
	return new r({ type: 'bigint', check: 'bigint_format', abort: !1, format: 'int64', ...N(i) });
}
function Z4(r, i) {
	return new r({ type: 'bigint', check: 'bigint_format', abort: !1, format: 'uint64', ...N(i) });
}
function f4(r, i) {
	return new r({ type: 'symbol', ...N(i) });
}
function C4(r, i) {
	return new r({ type: 'undefined', ...N(i) });
}
function m4(r, i) {
	return new r({ type: 'null', ...N(i) });
}
function y4(r) {
	return new r({ type: 'any' });
}
function d4(r) {
	return new r({ type: 'unknown' });
}
function h4(r, i) {
	return new r({ type: 'never', ...N(i) });
}
function e4(r, i) {
	return new r({ type: 'void', ...N(i) });
}
function a4(r, i) {
	return new r({ type: 'date', ...N(i) });
}
function p4(r, i) {
	return new r({ type: 'date', coerce: !0, ...N(i) });
}
function s4(r, i) {
	return new r({ type: 'nan', ...N(i) });
}
function br(r, i) {
	return new Xi({ check: 'less_than', ...N(i), value: r, inclusive: !1 });
}
function rr(r, i) {
	return new Xi({ check: 'less_than', ...N(i), value: r, inclusive: !0 });
}
function _r(r, i) {
	return new Oi({ check: 'greater_than', ...N(i), value: r, inclusive: !1 });
}
function d(r, i) {
	return new Oi({ check: 'greater_than', ...N(i), value: r, inclusive: !0 });
}
function vv(r) {
	return _r(0, r);
}
function $v(r) {
	return br(0, r);
}
function uv(r) {
	return rr(0, r);
}
function gv(r) {
	return d(0, r);
}
function Gr(r, i) {
	return new e$({ check: 'multiple_of', ...N(i), value: r });
}
function Xr(r, i) {
	return new s$({ check: 'max_size', ...N(i), maximum: r });
}
function Ur(r, i) {
	return new ru({ check: 'min_size', ...N(i), minimum: r });
}
function Hr(r, i) {
	return new nu({ check: 'size_equals', ...N(i), size: r });
}
function Br(r, i) {
	return new iu({ check: 'max_length', ...N(i), maximum: r });
}
function wr(r, i) {
	return new vu({ check: 'min_length', ...N(i), minimum: r });
}
function tr(r, i) {
	return new $u({ check: 'length_equals', ...N(i), length: r });
}
function er(r, i) {
	return new uu({ check: 'string_format', format: 'regex', ...N(i), pattern: r });
}
function ar(r) {
	return new gu({ check: 'string_format', format: 'lowercase', ...N(r) });
}
function pr(r) {
	return new Iu({ check: 'string_format', format: 'uppercase', ...N(r) });
}
function sr(r, i) {
	return new ou({ check: 'string_format', format: 'includes', ...N(i), includes: r });
}
function rn(r, i) {
	return new bu({ check: 'string_format', format: 'starts_with', ...N(i), prefix: r });
}
function nn(r, i) {
	return new _u({ check: 'string_format', format: 'ends_with', ...N(i), suffix: r });
}
function Iv(r, i, v) {
	return new Uu({ check: 'property', property: r, schema: i, ...N(v) });
}
function vn(r, i) {
	return new lu({ check: 'mime_type', mime: r, ...N(i) });
}
function ur(r) {
	return new ku({ check: 'overwrite', tx: r });
}
function $n(r) {
	return ur((i) => i.normalize(r));
}
function un() {
	return ur((r) => r.trim());
}
function gn() {
	return ur((r) => r.toLowerCase());
}
function In() {
	return ur((r) => r.toUpperCase());
}
function on() {
	return ur((r) => b$(r));
}
function rI(r, i, v) {
	return new r({ type: 'array', element: i, ...N(v) });
}
function Jk(r, i, v) {
	return new r({ type: 'union', options: i, ...N(v) });
}
function Lk(r, i, v) {
	return new r({ type: 'union', options: i, inclusive: !1, ...N(v) });
}
function Gk(r, i, v, u) {
	return new r({ type: 'union', options: v, discriminator: i, ...N(u) });
}
function Xk(r, i, v) {
	return new r({ type: 'intersection', left: i, right: v });
}
function Ok(r, i, v, u) {
	let n = v instanceof G;
	return new r({ type: 'tuple', items: i, rest: n ? v : null, ...N(n ? u : v) });
}
function qk(r, i, v, u) {
	return new r({ type: 'record', keyType: i, valueType: v, ...N(u) });
}
function Wk(r, i, v, u) {
	return new r({ type: 'map', keyType: i, valueType: v, ...N(u) });
}
function Vk(r, i, v) {
	return new r({ type: 'set', valueType: i, ...N(v) });
}
function Yk(r, i, v) {
	let u = Array.isArray(i) ? Object.fromEntries(i.map((n) => [n, n])) : i;
	return new r({ type: 'enum', entries: u, ...N(v) });
}
function Ek(r, i, v) {
	return new r({ type: 'enum', entries: i, ...N(v) });
}
function Kk(r, i, v) {
	return new r({ type: 'literal', values: Array.isArray(i) ? i : [i], ...N(v) });
}
function nI(r, i) {
	return new r({ type: 'file', ...N(i) });
}
function Qk(r, i) {
	return new r({ type: 'transform', transform: i });
}
function Tk(r, i) {
	return new r({ type: 'optional', innerType: i });
}
function Hk(r, i) {
	return new r({ type: 'nullable', innerType: i });
}
function Bk(r, i, v) {
	return new r({
		type: 'default',
		innerType: i,
		get defaultValue() {
			return typeof v === 'function' ? v() : U$(v);
		}
	});
}
function tk(r, i, v) {
	return new r({ type: 'nonoptional', innerType: i, ...N(v) });
}
function Mk(r, i) {
	return new r({ type: 'success', innerType: i });
}
function Ak(r, i, v) {
	return new r({ type: 'catch', innerType: i, catchValue: typeof v === 'function' ? v : () => v });
}
function Rk(r, i, v) {
	return new r({ type: 'pipe', in: i, out: v });
}
function Fk(r, i) {
	return new r({ type: 'readonly', innerType: i });
}
function xk(r, i, v) {
	return new r({ type: 'template_literal', parts: i, ...N(v) });
}
function Zk(r, i) {
	return new r({ type: 'lazy', getter: i });
}
function fk(r, i) {
	return new r({ type: 'promise', innerType: i });
}
function iI(r, i, v) {
	let u = N(v);
	return (u.abort ?? (u.abort = !0), new r({ type: 'custom', check: 'custom', fn: i, ...u }));
}
function vI(r, i, v) {
	return new r({ type: 'custom', check: 'custom', fn: i, ...N(v) });
}
function $I(r, i) {
	let v = Gb((u) => {
		return (
			(u.addIssue = (n) => {
				if (typeof n === 'string') u.issues.push(Zr(n, u.value, v._zod.def));
				else {
					let $ = n;
					if ($.fatal) $.continue = !1;
					($.code ?? ($.code = 'custom'),
						$.input ?? ($.input = u.value),
						$.inst ?? ($.inst = v),
						$.continue ?? ($.continue = !v._zod.def.abort),
						u.issues.push(Zr($)));
				}
			}),
			r(u.value, u)
		);
	}, i);
	return v;
}
function Gb(r, i) {
	let v = new H({ check: 'custom', ...N(i) });
	return ((v._zod.check = r), v);
}
function uI(r) {
	let i = new H({ check: 'describe' });
	return (
		(i._zod.onattach = [
			(v) => {
				let u = f.get(v) ?? {};
				f.add(v, { ...u, description: r });
			}
		]),
		(i._zod.check = () => {}),
		i
	);
}
function gI(r) {
	let i = new H({ check: 'meta' });
	return (
		(i._zod.onattach = [
			(v) => {
				let u = f.get(v) ?? {};
				f.add(v, { ...u, ...r });
			}
		]),
		(i._zod.check = () => {}),
		i
	);
}
function II(r, i) {
	let v = N(i),
		u = v.truthy ?? ['true', '1', 'yes', 'on', 'y', 'enabled'],
		n = v.falsy ?? ['false', '0', 'no', 'off', 'n', 'disabled'];
	if (v.case !== 'sensitive')
		((u = u.map((c) => (typeof c === 'string' ? c.toLowerCase() : c))),
			(n = n.map((c) => (typeof c === 'string' ? c.toLowerCase() : c))));
	let $ = new Set(u),
		g = new Set(n),
		I = r.Codec ?? tn,
		b = r.Boolean ?? Hn,
		_ = new (r.String ?? Tr)({ type: 'string', error: v.error }),
		l = new b({ type: 'boolean', error: v.error }),
		D = new I({
			type: 'pipe',
			in: _,
			out: l,
			transform: (c, P) => {
				let J = c;
				if (v.case !== 'sensitive') J = J.toLowerCase();
				if ($.has(J)) return !0;
				else if (g.has(J)) return !1;
				else
					return (
						P.issues.push({
							code: 'invalid_value',
							expected: 'stringbool',
							values: [...$, ...g],
							input: P.value,
							inst: D,
							continue: !1
						}),
						{}
					);
			},
			reverseTransform: (c, P) => {
				if (c === !0) return u[0] || 'true';
				else return n[0] || 'false';
			},
			error: v.error
		});
	return D;
}
function bn(r, i, v, u = {}) {
	let n = N(u),
		$ = {
			...N(u),
			check: 'string_format',
			type: 'string',
			format: i,
			fn: typeof v === 'function' ? v : (I) => v.test(I),
			...n
		};
	if (v instanceof RegExp) $.pattern = v;
	return new r($);
}
function Or(r) {
	let i = r?.target ?? 'draft-2020-12';
	if (i === 'draft-4') i = 'draft-04';
	if (i === 'draft-7') i = 'draft-07';
	return {
		processors: r.processors ?? {},
		metadataRegistry: r?.metadata ?? f,
		target: i,
		unrepresentable: r?.unrepresentable ?? 'throw',
		override: r?.override ?? (() => {}),
		io: r?.io ?? 'output',
		counter: 0,
		seen: new Map(),
		cycles: r?.cycles ?? 'ref',
		reused: r?.reused ?? 'inline',
		external: r?.external ?? void 0
	};
}
function Y(r, i, v = { path: [], schemaPath: [] }) {
	var u;
	let n = r._zod.def,
		$ = i.seen.get(r);
	if ($) {
		if (($.count++, v.schemaPath.includes(r))) $.cycle = v.path;
		return $.schema;
	}
	let g = { schema: {}, count: 1, cycle: void 0, path: v.path };
	i.seen.set(r, g);
	let I = r._zod.toJSONSchema?.();
	if (I) g.schema = I;
	else {
		let _ = { ...v, schemaPath: [...v.schemaPath, r], path: v.path };
		if (r._zod.processJSONSchema) r._zod.processJSONSchema(i, g.schema, _);
		else {
			let D = g.schema,
				c = i.processors[n.type];
			if (!c) throw Error(`[toJSONSchema]: Non-representable type encountered: ${n.type}`);
			c(r, i, D, _);
		}
		let l = r._zod.parent;
		if (l) {
			if (!g.ref) g.ref = l;
			(Y(l, i, _), (i.seen.get(l).isParent = !0));
		}
	}
	let b = i.metadataRegistry.get(r);
	if (b) Object.assign(g.schema, b);
	if (i.io === 'input' && h(r)) (delete g.schema.examples, delete g.schema.default);
	if (i.io === 'input' && '_prefault' in g.schema)
		(u = g.schema).default ?? (u.default = g.schema._prefault);
	return (delete g.schema._prefault, i.seen.get(r).schema);
}
function qr(r, i) {
	let v = r.seen.get(i);
	if (!v) throw Error('Unprocessed schema. This is a bug in Zod.');
	let u = new Map();
	for (let g of r.seen.entries()) {
		let I = r.metadataRegistry.get(g[0])?.id;
		if (I) {
			let b = u.get(I);
			if (b && b !== g[0])
				throw Error(
					`Duplicate schema id "${I}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`
				);
			u.set(I, g[0]);
		}
	}
	let n = (g) => {
			let I = r.target === 'draft-2020-12' ? '$defs' : 'definitions';
			if (r.external) {
				let l = r.external.registry.get(g[0])?.id,
					D = r.external.uri ?? ((P) => P);
				if (l) return { ref: D(l) };
				let c = g[1].defId ?? g[1].schema.id ?? `schema${r.counter++}`;
				return ((g[1].defId = c), { defId: c, ref: `${D('__shared')}#/${I}/${c}` });
			}
			if (g[1] === v) return { ref: '#' };
			let o = `${'#'}/${I}/`,
				_ = g[1].schema.id ?? `__schema${r.counter++}`;
			return { defId: _, ref: o + _ };
		},
		$ = (g) => {
			if (g[1].schema.$ref) return;
			let I = g[1],
				{ ref: b, defId: o } = n(g);
			if (((I.def = { ...I.schema }), o)) I.defId = o;
			let _ = I.schema;
			for (let l in _) delete _[l];
			_.$ref = b;
		};
	if (r.cycles === 'throw')
		for (let g of r.seen.entries()) {
			let I = g[1];
			if (I.cycle)
				throw Error(`Cycle detected: #/${I.cycle?.join('/')}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
		}
	for (let g of r.seen.entries()) {
		let I = g[1];
		if (i === g[0]) {
			$(g);
			continue;
		}
		if (r.external) {
			let o = r.external.registry.get(g[0])?.id;
			if (i !== g[0] && o) {
				$(g);
				continue;
			}
		}
		if (r.metadataRegistry.get(g[0])?.id) {
			$(g);
			continue;
		}
		if (I.cycle) {
			$(g);
			continue;
		}
		if (I.count > 1) {
			if (r.reused === 'ref') {
				$(g);
				continue;
			}
		}
	}
}
function Wr(r, i) {
	let v = r.seen.get(i);
	if (!v) throw Error('Unprocessed schema. This is a bug in Zod.');
	let u = (I) => {
		let b = r.seen.get(I);
		if (b.ref === null) return;
		let o = b.def ?? b.schema,
			_ = { ...o },
			l = b.ref;
		if (((b.ref = null), l)) {
			u(l);
			let c = r.seen.get(l),
				P = c.schema;
			if (
				P.$ref &&
				(r.target === 'draft-07' || r.target === 'draft-04' || r.target === 'openapi-3.0')
			)
				((o.allOf = o.allOf ?? []), o.allOf.push(P));
			else Object.assign(o, P);
			if ((Object.assign(o, _), I._zod.parent === l))
				for (let q in o) {
					if (q === '$ref' || q === 'allOf') continue;
					if (!(q in _)) delete o[q];
				}
			if (P.$ref && c.def)
				for (let q in o) {
					if (q === '$ref' || q === 'allOf') continue;
					if (q in c.def && JSON.stringify(o[q]) === JSON.stringify(c.def[q])) delete o[q];
				}
		}
		let D = I._zod.parent;
		if (D && D !== l) {
			u(D);
			let c = r.seen.get(D);
			if (c?.schema.$ref) {
				if (((o.$ref = c.schema.$ref), c.def))
					for (let P in o) {
						if (P === '$ref' || P === 'allOf') continue;
						if (P in c.def && JSON.stringify(o[P]) === JSON.stringify(c.def[P])) delete o[P];
					}
			}
		}
		r.override({ zodSchema: I, jsonSchema: o, path: b.path ?? [] });
	};
	for (let I of [...r.seen.entries()].reverse()) u(I[0]);
	let n = {};
	if (r.target === 'draft-2020-12') n.$schema = 'https://json-schema.org/draft/2020-12/schema';
	else if (r.target === 'draft-07') n.$schema = 'http://json-schema.org/draft-07/schema#';
	else if (r.target === 'draft-04') n.$schema = 'http://json-schema.org/draft-04/schema#';
	else if (r.target === 'openapi-3.0');
	if (r.external?.uri) {
		let I = r.external.registry.get(i)?.id;
		if (!I) throw Error('Schema is missing an `id` property');
		n.$id = r.external.uri(I);
	}
	Object.assign(n, v.def ?? v.schema);
	let $ = r.metadataRegistry.get(i)?.id;
	if ($ !== void 0 && n.id === $) delete n.id;
	let g = r.external?.defs ?? {};
	for (let I of r.seen.entries()) {
		let b = I[1];
		if (b.def && b.defId) {
			if (b.def.id === b.defId) delete b.def.id;
			g[b.defId] = b.def;
		}
	}
	if (r.external);
	else if (Object.keys(g).length > 0)
		if (r.target === 'draft-2020-12') n.$defs = g;
		else n.definitions = g;
	try {
		let I = JSON.parse(JSON.stringify(n));
		return (
			Object.defineProperty(I, '~standard', {
				value: {
					...i['~standard'],
					jsonSchema: { input: _n(i, 'input', r.processors), output: _n(i, 'output', r.processors) }
				},
				enumerable: !1,
				writable: !1
			}),
			I
		);
	} catch (I) {
		throw Error('Error converting schema to JSON.');
	}
}
function h(r, i) {
	let v = i ?? { seen: new Set() };
	if (v.seen.has(r)) return !1;
	v.seen.add(r);
	let u = r._zod.def;
	if (u.type === 'transform') return !0;
	if (u.type === 'array') return h(u.element, v);
	if (u.type === 'set') return h(u.valueType, v);
	if (u.type === 'lazy') return h(u.getter(), v);
	if (
		u.type === 'promise' ||
		u.type === 'optional' ||
		u.type === 'nonoptional' ||
		u.type === 'nullable' ||
		u.type === 'readonly' ||
		u.type === 'default' ||
		u.type === 'prefault'
	)
		return h(u.innerType, v);
	if (u.type === 'intersection') return h(u.left, v) || h(u.right, v);
	if (u.type === 'record' || u.type === 'map') return h(u.keyType, v) || h(u.valueType, v);
	if (u.type === 'pipe') return h(u.in, v) || h(u.out, v);
	if (u.type === 'object') {
		for (let n in u.shape) if (h(u.shape[n], v)) return !0;
		return !1;
	}
	if (u.type === 'union') {
		for (let n of u.options) if (h(n, v)) return !0;
		return !1;
	}
	if (u.type === 'tuple') {
		for (let n of u.items) if (h(n, v)) return !0;
		if (u.rest && h(u.rest, v)) return !0;
		return !1;
	}
	return !1;
}
var oI =
		(r, i = {}) =>
		(v) => {
			let u = Or({ ...v, processors: i });
			return (Y(r, u), qr(u, r), Wr(u, r));
		},
	_n =
		(r, i, v = {}) =>
		(u) => {
			let { libraryOptions: n, target: $ } = u ?? {},
				g = Or({ ...(n ?? {}), target: $, io: i, processors: v });
			return (Y(r, g), qr(g, r), Wr(g, r));
		};
var Ck = { guid: 'uuid', url: 'uri', datetime: 'date-time', json_string: 'json-string', regex: '' },
	bI = (r, i, v, u) => {
		let n = v;
		n.type = 'string';
		let { minimum: $, maximum: g, format: I, patterns: b, contentEncoding: o } = r._zod.bag;
		if (typeof $ === 'number') n.minLength = $;
		if (typeof g === 'number') n.maxLength = g;
		if (I) {
			if (((n.format = Ck[I] ?? I), n.format === '')) delete n.format;
			if (I === 'time') delete n.format;
		}
		if (o) n.contentEncoding = o;
		if (b && b.size > 0) {
			let _ = [...b];
			if (_.length === 1) n.pattern = _[0].source;
			else if (_.length > 1)
				n.allOf = [
					..._.map((l) => ({
						...(i.target === 'draft-07' || i.target === 'draft-04' || i.target === 'openapi-3.0'
							? { type: 'string' }
							: {}),
						pattern: l.source
					}))
				];
		}
	},
	_I = (r, i, v, u) => {
		let n = v,
			{
				minimum: $,
				maximum: g,
				format: I,
				multipleOf: b,
				exclusiveMaximum: o,
				exclusiveMinimum: _
			} = r._zod.bag;
		if (typeof I === 'string' && I.includes('int')) n.type = 'integer';
		else n.type = 'number';
		let l = typeof _ === 'number' && _ >= ($ ?? Number.NEGATIVE_INFINITY),
			D = typeof o === 'number' && o <= (g ?? Number.POSITIVE_INFINITY),
			c = i.target === 'draft-04' || i.target === 'openapi-3.0';
		if (l)
			if (c) ((n.minimum = _), (n.exclusiveMinimum = !0));
			else n.exclusiveMinimum = _;
		else if (typeof $ === 'number') n.minimum = $;
		if (D)
			if (c) ((n.maximum = o), (n.exclusiveMaximum = !0));
			else n.exclusiveMaximum = o;
		else if (typeof g === 'number') n.maximum = g;
		if (typeof b === 'number') n.multipleOf = b;
	},
	UI = (r, i, v, u) => {
		v.type = 'boolean';
	},
	lI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw') throw Error('BigInt cannot be represented in JSON Schema');
	},
	kI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw') throw Error('Symbols cannot be represented in JSON Schema');
	},
	DI = (r, i, v, u) => {
		if (i.target === 'openapi-3.0') ((v.type = 'string'), (v.nullable = !0), (v.enum = [null]));
		else v.type = 'null';
	},
	cI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw')
			throw Error('Undefined cannot be represented in JSON Schema');
	},
	SI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw') throw Error('Void cannot be represented in JSON Schema');
	},
	wI = (r, i, v, u) => {
		v.not = {};
	},
	zI = (r, i, v, u) => {},
	NI = (r, i, v, u) => {},
	PI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw') throw Error('Date cannot be represented in JSON Schema');
	},
	jI = (r, i, v, u) => {
		let n = r._zod.def,
			$ = Gn(n.entries);
		if ($.every((g) => typeof g === 'number')) v.type = 'number';
		if ($.every((g) => typeof g === 'string')) v.type = 'string';
		v.enum = $;
	},
	JI = (r, i, v, u) => {
		let n = r._zod.def,
			$ = [];
		for (let g of n.values)
			if (g === void 0) {
				if (i.unrepresentable === 'throw')
					throw Error('Literal `undefined` cannot be represented in JSON Schema');
			} else if (typeof g === 'bigint')
				if (i.unrepresentable === 'throw')
					throw Error('BigInt literals cannot be represented in JSON Schema');
				else $.push(Number(g));
			else $.push(g);
		if ($.length === 0);
		else if ($.length === 1) {
			let g = $[0];
			if (
				((v.type = g === null ? 'null' : typeof g),
				i.target === 'draft-04' || i.target === 'openapi-3.0')
			)
				v.enum = [g];
			else v.const = g;
		} else {
			if ($.every((g) => typeof g === 'number')) v.type = 'number';
			if ($.every((g) => typeof g === 'string')) v.type = 'string';
			if ($.every((g) => typeof g === 'boolean')) v.type = 'boolean';
			if ($.every((g) => g === null)) v.type = 'null';
			v.enum = $;
		}
	},
	LI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw') throw Error('NaN cannot be represented in JSON Schema');
	},
	GI = (r, i, v, u) => {
		let n = v,
			$ = r._zod.pattern;
		if (!$) throw Error('Pattern not found in template literal');
		((n.type = 'string'), (n.pattern = $.source));
	},
	XI = (r, i, v, u) => {
		let n = v,
			$ = { type: 'string', format: 'binary', contentEncoding: 'binary' },
			{ minimum: g, maximum: I, mime: b } = r._zod.bag;
		if (g !== void 0) $.minLength = g;
		if (I !== void 0) $.maxLength = I;
		if (b)
			if (b.length === 1) (($.contentMediaType = b[0]), Object.assign(n, $));
			else (Object.assign(n, $), (n.anyOf = b.map((o) => ({ contentMediaType: o }))));
		else Object.assign(n, $);
	},
	OI = (r, i, v, u) => {
		v.type = 'boolean';
	},
	qI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw')
			throw Error('Custom types cannot be represented in JSON Schema');
	},
	WI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw')
			throw Error('Function types cannot be represented in JSON Schema');
	},
	VI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw')
			throw Error('Transforms cannot be represented in JSON Schema');
	},
	YI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw') throw Error('Map cannot be represented in JSON Schema');
	},
	EI = (r, i, v, u) => {
		if (i.unrepresentable === 'throw') throw Error('Set cannot be represented in JSON Schema');
	},
	KI = (r, i, v, u) => {
		let n = v,
			$ = r._zod.def,
			{ minimum: g, maximum: I } = r._zod.bag;
		if (typeof g === 'number') n.minItems = g;
		if (typeof I === 'number') n.maxItems = I;
		((n.type = 'array'), (n.items = Y($.element, i, { ...u, path: [...u.path, 'items'] })));
	},
	QI = (r, i, v, u) => {
		let n = v,
			$ = r._zod.def;
		((n.type = 'object'), (n.properties = {}));
		let g = $.shape;
		for (let o in g) n.properties[o] = Y(g[o], i, { ...u, path: [...u.path, 'properties', o] });
		let I = new Set(Object.keys(g)),
			b = new Set(
				[...I].filter((o) => {
					let _ = $.shape[o]._zod;
					if (i.io === 'input') return _.optin === void 0;
					else return _.optout === void 0;
				})
			);
		if (b.size > 0) n.required = Array.from(b);
		if ($.catchall?._zod.def.type === 'never') n.additionalProperties = !1;
		else if (!$.catchall) {
			if (i.io === 'output') n.additionalProperties = !1;
		} else if ($.catchall)
			n.additionalProperties = Y($.catchall, i, {
				...u,
				path: [...u.path, 'additionalProperties']
			});
	},
	bv = (r, i, v, u) => {
		let n = r._zod.def,
			$ = n.inclusive === !1,
			g = n.options.map((I, b) => Y(I, i, { ...u, path: [...u.path, $ ? 'oneOf' : 'anyOf', b] }));
		if ($) v.oneOf = g;
		else v.anyOf = g;
	},
	TI = (r, i, v, u) => {
		let n = r._zod.def,
			$ = Y(n.left, i, { ...u, path: [...u.path, 'allOf', 0] }),
			g = Y(n.right, i, { ...u, path: [...u.path, 'allOf', 1] }),
			I = (o) => 'allOf' in o && Object.keys(o).length === 1,
			b = [...(I($) ? $.allOf : [$]), ...(I(g) ? g.allOf : [g])];
		v.allOf = b;
	},
	HI = (r, i, v, u) => {
		let n = v,
			$ = r._zod.def;
		n.type = 'array';
		let g = i.target === 'draft-2020-12' ? 'prefixItems' : 'items',
			I =
				i.target === 'draft-2020-12'
					? 'items'
					: i.target === 'openapi-3.0'
						? 'items'
						: 'additionalItems',
			b = $.items.map((D, c) => Y(D, i, { ...u, path: [...u.path, g, c] })),
			o = $.rest
				? Y($.rest, i, {
						...u,
						path: [...u.path, I, ...(i.target === 'openapi-3.0' ? [$.items.length] : [])]
					})
				: null;
		if (i.target === 'draft-2020-12') {
			if (((n.prefixItems = b), o)) n.items = o;
		} else if (i.target === 'openapi-3.0') {
			if (((n.items = { anyOf: b }), o)) n.items.anyOf.push(o);
			if (((n.minItems = b.length), !o)) n.maxItems = b.length;
		} else if (((n.items = b), o)) n.additionalItems = o;
		let { minimum: _, maximum: l } = r._zod.bag;
		if (typeof _ === 'number') n.minItems = _;
		if (typeof l === 'number') n.maxItems = l;
	},
	BI = (r, i, v, u) => {
		let n = v,
			$ = r._zod.def;
		n.type = 'object';
		let g = $.keyType,
			b = g._zod.bag?.patterns;
		if ($.mode === 'loose' && b && b.size > 0) {
			let _ = Y($.valueType, i, { ...u, path: [...u.path, 'patternProperties', '*'] });
			n.patternProperties = {};
			for (let l of b) n.patternProperties[l.source] = _;
		} else {
			if (i.target === 'draft-07' || i.target === 'draft-2020-12')
				n.propertyNames = Y($.keyType, i, { ...u, path: [...u.path, 'propertyNames'] });
			n.additionalProperties = Y($.valueType, i, {
				...u,
				path: [...u.path, 'additionalProperties']
			});
		}
		let o = g._zod.values;
		if (o) {
			let _ = [...o].filter((l) => typeof l === 'string' || typeof l === 'number');
			if (_.length > 0) n.required = _;
		}
	},
	tI = (r, i, v, u) => {
		let n = r._zod.def,
			$ = Y(n.innerType, i, u),
			g = i.seen.get(r);
		if (i.target === 'openapi-3.0') ((g.ref = n.innerType), (v.nullable = !0));
		else v.anyOf = [$, { type: 'null' }];
	},
	MI = (r, i, v, u) => {
		let n = r._zod.def;
		Y(n.innerType, i, u);
		let $ = i.seen.get(r);
		$.ref = n.innerType;
	},
	AI = (r, i, v, u) => {
		let n = r._zod.def;
		Y(n.innerType, i, u);
		let $ = i.seen.get(r);
		(($.ref = n.innerType), (v.default = JSON.parse(JSON.stringify(n.defaultValue))));
	},
	RI = (r, i, v, u) => {
		let n = r._zod.def;
		Y(n.innerType, i, u);
		let $ = i.seen.get(r);
		if ((($.ref = n.innerType), i.io === 'input'))
			v._prefault = JSON.parse(JSON.stringify(n.defaultValue));
	},
	FI = (r, i, v, u) => {
		let n = r._zod.def;
		Y(n.innerType, i, u);
		let $ = i.seen.get(r);
		$.ref = n.innerType;
		let g;
		try {
			g = n.catchValue(void 0);
		} catch {
			throw Error('Dynamic catch values are not supported in JSON Schema');
		}
		v.default = g;
	},
	xI = (r, i, v, u) => {
		let n = r._zod.def,
			$ = i.io === 'input' ? (n.in._zod.def.type === 'transform' ? n.out : n.in) : n.out;
		Y($, i, u);
		let g = i.seen.get(r);
		g.ref = $;
	},
	ZI = (r, i, v, u) => {
		let n = r._zod.def;
		Y(n.innerType, i, u);
		let $ = i.seen.get(r);
		(($.ref = n.innerType), (v.readOnly = !0));
	},
	fI = (r, i, v, u) => {
		let n = r._zod.def;
		Y(n.innerType, i, u);
		let $ = i.seen.get(r);
		$.ref = n.innerType;
	},
	_v = (r, i, v, u) => {
		let n = r._zod.def;
		Y(n.innerType, i, u);
		let $ = i.seen.get(r);
		$.ref = n.innerType;
	},
	CI = (r, i, v, u) => {
		let n = r._zod.innerType;
		Y(n, i, u);
		let $ = i.seen.get(r);
		$.ref = n;
	},
	ov = {
		string: bI,
		number: _I,
		boolean: UI,
		bigint: lI,
		symbol: kI,
		null: DI,
		undefined: cI,
		void: SI,
		never: wI,
		any: zI,
		unknown: NI,
		date: PI,
		enum: jI,
		literal: JI,
		nan: LI,
		template_literal: GI,
		file: XI,
		success: OI,
		custom: qI,
		function: WI,
		transform: VI,
		map: YI,
		set: EI,
		array: KI,
		object: QI,
		union: bv,
		intersection: TI,
		tuple: HI,
		record: BI,
		nullable: tI,
		nonoptional: MI,
		default: AI,
		prefault: RI,
		catch: FI,
		pipe: xI,
		readonly: ZI,
		promise: fI,
		optional: _v,
		lazy: CI
	};
function Uv(r, i) {
	if ('_idmap' in r) {
		let u = r,
			n = Or({ ...i, processors: ov }),
			$ = {};
		for (let b of u._idmap.entries()) {
			let [o, _] = b;
			Y(_, n);
		}
		let g = {},
			I = { registry: u, uri: i?.uri, defs: $ };
		n.external = I;
		for (let b of u._idmap.entries()) {
			let [o, _] = b;
			(qr(n, _), (g[o] = Wr(n, _)));
		}
		if (Object.keys($).length > 0) {
			let b = n.target === 'draft-2020-12' ? '$defs' : 'definitions';
			g.__shared = { [b]: $ };
		}
		return { schemas: g };
	}
	let v = Or({ ...i, processors: ov });
	return (Y(r, v), qr(v, r), Wr(v, r));
}
class mI {
	get metadataRegistry() {
		return this.ctx.metadataRegistry;
	}
	get target() {
		return this.ctx.target;
	}
	get unrepresentable() {
		return this.ctx.unrepresentable;
	}
	get override() {
		return this.ctx.override;
	}
	get io() {
		return this.ctx.io;
	}
	get counter() {
		return this.ctx.counter;
	}
	set counter(r) {
		this.ctx.counter = r;
	}
	get seen() {
		return this.ctx.seen;
	}
	constructor(r) {
		let i = r?.target ?? 'draft-2020-12';
		if (i === 'draft-4') i = 'draft-04';
		if (i === 'draft-7') i = 'draft-07';
		this.ctx = Or({
			processors: ov,
			target: i,
			...(r?.metadata && { metadata: r.metadata }),
			...(r?.unrepresentable && { unrepresentable: r.unrepresentable }),
			...(r?.override && { override: r.override }),
			...(r?.io && { io: r.io })
		});
	}
	process(r, i = { path: [], schemaPath: [] }) {
		return Y(r, this.ctx, i);
	}
	emit(r, i) {
		if (i) {
			if (i.cycles) this.ctx.cycles = i.cycles;
			if (i.reused) this.ctx.reused = i.reused;
			if (i.external) this.ctx.external = i.external;
		}
		qr(this.ctx, r);
		let v = Wr(this.ctx, r),
			{ '~standard': u, ...n } = v;
		return n;
	}
}
var Xb = {};
var Cn = {};
Dr(Cn, {
	xor: () => z_,
	xid: () => Fb,
	void: () => l_,
	uuidv7: () => Qb,
	uuidv6: () => Kb,
	uuidv4: () => Eb,
	uuid: () => Yb,
	url: () => Tb,
	unknown: () => Mr,
	union: () => tv,
	undefined: () => __,
	ulid: () => Rb,
	uint64: () => o_,
	uint32: () => u_,
	tuple: () => O6,
	transform: () => Av,
	templateLiteral: () => K_,
	symbol: () => b_,
	superRefine: () => s6,
	success: () => W_,
	stringbool: () => R_,
	stringFormat: () => pb,
	string: () => mn,
	strictObject: () => S_,
	set: () => L_,
	refine: () => p6,
	record: () => q6,
	readonly: () => m6,
	promise: () => Q_,
	preprocess: () => x_,
	prefault: () => A6,
	pipe: () => en,
	partialRecord: () => P_,
	optional: () => dn,
	object: () => c_,
	number: () => _6,
	nullish: () => q_,
	nullable: () => hn,
	null: () => c6,
	nonoptional: () => R6,
	never: () => Bv,
	nativeEnum: () => G_,
	nanoid: () => tb,
	nan: () => V_,
	meta: () => M_,
	map: () => J_,
	mac: () => fb,
	looseRecord: () => j_,
	looseObject: () => w_,
	literal: () => X_,
	lazy: () => h6,
	ksuid: () => xb,
	keyof: () => D_,
	jwt: () => ab,
	json: () => F_,
	ipv6: () => Cb,
	ipv4: () => Zb,
	invertCodec: () => E_,
	intersection: () => G6,
	int64: () => I_,
	int32: () => $_,
	int: () => wv,
	instanceof: () => A_,
	httpUrl: () => Hb,
	hostname: () => sb,
	hex: () => r_,
	hash: () => n_,
	guid: () => Vb,
	function: () => T_,
	float64: () => v_,
	float32: () => i_,
	file: () => O_,
	exactOptional: () => T6,
	enum: () => Mv,
	emoji: () => Bb,
	email: () => Wb,
	e164: () => eb,
	discriminatedUnion: () => N_,
	describe: () => t_,
	date: () => k_,
	custom: () => B_,
	cuid2: () => Ab,
	cuid: () => Mb,
	codec: () => Y_,
	cidrv6: () => yb,
	cidrv4: () => mb,
	check: () => H_,
	catch: () => Z6,
	boolean: () => U6,
	bigint: () => g_,
	base64url: () => hb,
	base64: () => db,
	array: () => ri,
	any: () => U_,
	_function: () => T_,
	_default: () => t6,
	_ZodString: () => zv,
	ZodXor: () => j6,
	ZodXID: () => Xv,
	ZodVoid: () => N6,
	ZodUnknown: () => w6,
	ZodUnion: () => ii,
	ZodUndefined: () => k6,
	ZodUUID: () => lr,
	ZodURL: () => pn,
	ZodULID: () => Gv,
	ZodType: () => X,
	ZodTuple: () => X6,
	ZodTransform: () => K6,
	ZodTemplateLiteral: () => y6,
	ZodSymbol: () => l6,
	ZodSuccess: () => F6,
	ZodStringFormat: () => K,
	ZodString: () => Dn,
	ZodSet: () => V6,
	ZodRecord: () => ln,
	ZodReadonly: () => C6,
	ZodPromise: () => e6,
	ZodPrefault: () => M6,
	ZodPipe: () => xv,
	ZodOptional: () => Rv,
	ZodObject: () => ni,
	ZodNumberFormat: () => Ar,
	ZodNumber: () => Sn,
	ZodNullable: () => H6,
	ZodNull: () => D6,
	ZodNonOptional: () => Fv,
	ZodNever: () => z6,
	ZodNanoID: () => jv,
	ZodNaN: () => f6,
	ZodMap: () => W6,
	ZodMAC: () => b6,
	ZodLiteral: () => Y6,
	ZodLazy: () => d6,
	ZodKSUID: () => Ov,
	ZodJWT: () => Tv,
	ZodIntersection: () => L6,
	ZodIPv6: () => Wv,
	ZodIPv4: () => qv,
	ZodGUID: () => yn,
	ZodFunction: () => a6,
	ZodFile: () => E6,
	ZodExactOptional: () => Q6,
	ZodEnum: () => kn,
	ZodEmoji: () => Pv,
	ZodEmail: () => Nv,
	ZodE164: () => Qv,
	ZodDiscriminatedUnion: () => J6,
	ZodDefault: () => B6,
	ZodDate: () => sn,
	ZodCustomStringFormat: () => cn,
	ZodCustom: () => $i,
	ZodCodec: () => vi,
	ZodCatch: () => x6,
	ZodCUID2: () => Lv,
	ZodCUID: () => Jv,
	ZodCIDRv6: () => Yv,
	ZodCIDRv4: () => Vv,
	ZodBoolean: () => wn,
	ZodBigIntFormat: () => Hv,
	ZodBigInt: () => zn,
	ZodBase64URL: () => Kv,
	ZodBase64: () => Ev,
	ZodArray: () => P6,
	ZodAny: () => S6
});
var lv = {};
Dr(lv, {
	uppercase: () => pr,
	trim: () => un,
	toUpperCase: () => In,
	toLowerCase: () => gn,
	startsWith: () => rn,
	slugify: () => on,
	size: () => Hr,
	regex: () => er,
	property: () => Iv,
	positive: () => vv,
	overwrite: () => ur,
	normalize: () => $n,
	nonpositive: () => uv,
	nonnegative: () => gv,
	negative: () => $v,
	multipleOf: () => Gr,
	minSize: () => Ur,
	minLength: () => wr,
	mime: () => vn,
	maxSize: () => Xr,
	maxLength: () => Br,
	lte: () => rr,
	lt: () => br,
	lowercase: () => ar,
	length: () => tr,
	includes: () => sr,
	gte: () => d,
	gt: () => _r,
	endsWith: () => nn
});
var Un = {};
Dr(Un, {
	time: () => hI,
	duration: () => eI,
	datetime: () => yI,
	date: () => dI,
	ZodISOTime: () => cv,
	ZodISODuration: () => Sv,
	ZodISODateTime: () => kv,
	ZodISODate: () => Dv
});
var kv = U('ZodISODateTime', (r, i) => {
	(qu.init(r, i), K.init(r, i));
});
function yI(r) {
	return q4(kv, r);
}
var Dv = U('ZodISODate', (r, i) => {
	(Wu.init(r, i), K.init(r, i));
});
function dI(r) {
	return W4(Dv, r);
}
var cv = U('ZodISOTime', (r, i) => {
	(Vu.init(r, i), K.init(r, i));
});
function hI(r) {
	return V4(cv, r);
}
var Sv = U('ZodISODuration', (r, i) => {
	(Yu.init(r, i), K.init(r, i));
});
function eI(r) {
	return Y4(Sv, r);
}
var Ob = (r, i) => {
		(Vn.init(r, i),
			(r.name = 'ZodError'),
			Object.defineProperties(r, {
				format: { value: (v) => En(r, v) },
				flatten: { value: (v) => Yn(r, v) },
				addIssue: {
					value: (v) => {
						(r.issues.push(v), (r.message = JSON.stringify(r.issues, Fr, 2)));
					}
				},
				addIssues: {
					value: (v) => {
						(r.issues.push(...v), (r.message = JSON.stringify(r.issues, Fr, 2)));
					}
				},
				isEmpty: {
					get() {
						return r.issues.length === 0;
					}
				}
			}));
	},
	yk = U('ZodError', Ob),
	p = U('ZodError', Ob, { Parent: Error });
var aI = fr(p),
	pI = Cr(p),
	sI = mr(p),
	r6 = yr(p),
	n6 = Si(p),
	i6 = wi(p),
	v6 = zi(p),
	$6 = Ni(p),
	u6 = Pi(p),
	g6 = ji(p),
	I6 = Ji(p),
	o6 = Li(p);
var qb = new WeakMap();
function an(r, i, v) {
	let u = Object.getPrototypeOf(r),
		n = qb.get(u);
	if (!n) ((n = new Set()), qb.set(u, n));
	if (n.has(i)) return;
	n.add(i);
	for (let $ in v) {
		let g = v[$];
		Object.defineProperty(u, $, {
			configurable: !0,
			enumerable: !1,
			get() {
				let I = g.bind(this);
				return (
					Object.defineProperty(this, $, {
						configurable: !0,
						writable: !0,
						enumerable: !0,
						value: I
					}),
					I
				);
			},
			set(I) {
				Object.defineProperty(this, $, {
					configurable: !0,
					writable: !0,
					enumerable: !0,
					value: I
				});
			}
		});
	}
}
var X = U('ZodType', (r, i) => {
		return (
			G.init(r, i),
			Object.assign(r['~standard'], {
				jsonSchema: { input: _n(r, 'input'), output: _n(r, 'output') }
			}),
			(r.toJSONSchema = oI(r, {})),
			(r.def = i),
			(r.type = i.type),
			Object.defineProperty(r, '_def', { value: i }),
			(r.parse = (v, u) => aI(r, v, u, { callee: r.parse })),
			(r.safeParse = (v, u) => sI(r, v, u)),
			(r.parseAsync = async (v, u) => pI(r, v, u, { callee: r.parseAsync })),
			(r.safeParseAsync = async (v, u) => r6(r, v, u)),
			(r.spa = r.safeParseAsync),
			(r.encode = (v, u) => n6(r, v, u)),
			(r.decode = (v, u) => i6(r, v, u)),
			(r.encodeAsync = async (v, u) => v6(r, v, u)),
			(r.decodeAsync = async (v, u) => $6(r, v, u)),
			(r.safeEncode = (v, u) => u6(r, v, u)),
			(r.safeDecode = (v, u) => g6(r, v, u)),
			(r.safeEncodeAsync = async (v, u) => I6(r, v, u)),
			(r.safeDecodeAsync = async (v, u) => o6(r, v, u)),
			an(r, 'ZodType', {
				check(...v) {
					let u = this.def;
					return this.clone(
						z.mergeDefs(u, {
							checks: [
								...(u.checks ?? []),
								...v.map((n) =>
									typeof n === 'function'
										? { _zod: { check: n, def: { check: 'custom' }, onattach: [] } }
										: n
								)
							]
						}),
						{ parent: !0 }
					);
				},
				with(...v) {
					return this.check(...v);
				},
				clone(v, u) {
					return m(this, v, u);
				},
				brand() {
					return this;
				},
				register(v, u) {
					return (v.add(this, u), this);
				},
				refine(v, u) {
					return this.check(p6(v, u));
				},
				superRefine(v, u) {
					return this.check(s6(v, u));
				},
				overwrite(v) {
					return this.check(ur(v));
				},
				optional() {
					return dn(this);
				},
				exactOptional() {
					return T6(this);
				},
				nullable() {
					return hn(this);
				},
				nullish() {
					return dn(hn(this));
				},
				nonoptional(v) {
					return R6(this, v);
				},
				array() {
					return ri(this);
				},
				or(v) {
					return tv([this, v]);
				},
				and(v) {
					return G6(this, v);
				},
				transform(v) {
					return en(this, Av(v));
				},
				default(v) {
					return t6(this, v);
				},
				prefault(v) {
					return A6(this, v);
				},
				catch(v) {
					return Z6(this, v);
				},
				pipe(v) {
					return en(this, v);
				},
				readonly() {
					return m6(this);
				},
				describe(v) {
					let u = this.clone();
					return (f.add(u, { description: v }), u);
				},
				meta(...v) {
					if (v.length === 0) return f.get(this);
					let u = this.clone();
					return (f.add(u, v[0]), u);
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(v) {
					return v(this);
				}
			}),
			Object.defineProperty(r, 'description', {
				get() {
					return f.get(r)?.description;
				},
				configurable: !0
			}),
			r
		);
	}),
	zv = U('_ZodString', (r, i) => {
		(Tr.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (u, n, $) => bI(r, u, n, $)));
		let v = r._zod.bag;
		((r.format = v.format ?? null),
			(r.minLength = v.minimum ?? null),
			(r.maxLength = v.maximum ?? null),
			an(r, '_ZodString', {
				regex(...u) {
					return this.check(er(...u));
				},
				includes(...u) {
					return this.check(sr(...u));
				},
				startsWith(...u) {
					return this.check(rn(...u));
				},
				endsWith(...u) {
					return this.check(nn(...u));
				},
				min(...u) {
					return this.check(wr(...u));
				},
				max(...u) {
					return this.check(Br(...u));
				},
				length(...u) {
					return this.check(tr(...u));
				},
				nonempty(...u) {
					return this.check(wr(1, ...u));
				},
				lowercase(u) {
					return this.check(ar(u));
				},
				uppercase(u) {
					return this.check(pr(u));
				},
				trim() {
					return this.check(un());
				},
				normalize(...u) {
					return this.check($n(...u));
				},
				toLowerCase() {
					return this.check(gn());
				},
				toUpperCase() {
					return this.check(In());
				},
				slugify() {
					return this.check(on());
				}
			}));
	}),
	Dn = U('ZodString', (r, i) => {
		(Tr.init(r, i),
			zv.init(r, i),
			(r.email = (v) => r.check(ti(Nv, v))),
			(r.url = (v) => r.check(fn(pn, v))),
			(r.jwt = (v) => r.check(iv(Tv, v))),
			(r.emoji = (v) => r.check(xi(Pv, v))),
			(r.guid = (v) => r.check(Zn(yn, v))),
			(r.uuid = (v) => r.check(Mi(lr, v))),
			(r.uuidv4 = (v) => r.check(Ai(lr, v))),
			(r.uuidv6 = (v) => r.check(Ri(lr, v))),
			(r.uuidv7 = (v) => r.check(Fi(lr, v))),
			(r.nanoid = (v) => r.check(Zi(jv, v))),
			(r.guid = (v) => r.check(Zn(yn, v))),
			(r.cuid = (v) => r.check(fi(Jv, v))),
			(r.cuid2 = (v) => r.check(Ci(Lv, v))),
			(r.ulid = (v) => r.check(mi(Gv, v))),
			(r.base64 = (v) => r.check(si(Ev, v))),
			(r.base64url = (v) => r.check(rv(Kv, v))),
			(r.xid = (v) => r.check(yi(Xv, v))),
			(r.ksuid = (v) => r.check(di(Ov, v))),
			(r.ipv4 = (v) => r.check(hi(qv, v))),
			(r.ipv6 = (v) => r.check(ei(Wv, v))),
			(r.cidrv4 = (v) => r.check(ai(Vv, v))),
			(r.cidrv6 = (v) => r.check(pi(Yv, v))),
			(r.e164 = (v) => r.check(nv(Qv, v))),
			(r.datetime = (v) => r.check(yI(v))),
			(r.date = (v) => r.check(dI(v))),
			(r.time = (v) => r.check(hI(v))),
			(r.duration = (v) => r.check(eI(v))));
	});
function mn(r) {
	return L4(Dn, r);
}
var K = U('ZodStringFormat', (r, i) => {
		(E.init(r, i), zv.init(r, i));
	}),
	Nv = U('ZodEmail', (r, i) => {
		(zu.init(r, i), K.init(r, i));
	});
function Wb(r) {
	return ti(Nv, r);
}
var yn = U('ZodGUID', (r, i) => {
	(Su.init(r, i), K.init(r, i));
});
function Vb(r) {
	return Zn(yn, r);
}
var lr = U('ZodUUID', (r, i) => {
	(wu.init(r, i), K.init(r, i));
});
function Yb(r) {
	return Mi(lr, r);
}
function Eb(r) {
	return Ai(lr, r);
}
function Kb(r) {
	return Ri(lr, r);
}
function Qb(r) {
	return Fi(lr, r);
}
var pn = U('ZodURL', (r, i) => {
	(Nu.init(r, i), K.init(r, i));
});
function Tb(r) {
	return fn(pn, r);
}
function Hb(r) {
	return fn(pn, { protocol: s.httpProtocol, hostname: s.domain, ...z.normalizeParams(r) });
}
var Pv = U('ZodEmoji', (r, i) => {
	(Pu.init(r, i), K.init(r, i));
});
function Bb(r) {
	return xi(Pv, r);
}
var jv = U('ZodNanoID', (r, i) => {
	(ju.init(r, i), K.init(r, i));
});
function tb(r) {
	return Zi(jv, r);
}
var Jv = U('ZodCUID', (r, i) => {
	(Ju.init(r, i), K.init(r, i));
});
function Mb(r) {
	return fi(Jv, r);
}
var Lv = U('ZodCUID2', (r, i) => {
	(Lu.init(r, i), K.init(r, i));
});
function Ab(r) {
	return Ci(Lv, r);
}
var Gv = U('ZodULID', (r, i) => {
	(Gu.init(r, i), K.init(r, i));
});
function Rb(r) {
	return mi(Gv, r);
}
var Xv = U('ZodXID', (r, i) => {
	(Xu.init(r, i), K.init(r, i));
});
function Fb(r) {
	return yi(Xv, r);
}
var Ov = U('ZodKSUID', (r, i) => {
	(Ou.init(r, i), K.init(r, i));
});
function xb(r) {
	return di(Ov, r);
}
var qv = U('ZodIPv4', (r, i) => {
	(Eu.init(r, i), K.init(r, i));
});
function Zb(r) {
	return hi(qv, r);
}
var b6 = U('ZodMAC', (r, i) => {
	(Qu.init(r, i), K.init(r, i));
});
function fb(r) {
	return X4(b6, r);
}
var Wv = U('ZodIPv6', (r, i) => {
	(Ku.init(r, i), K.init(r, i));
});
function Cb(r) {
	return ei(Wv, r);
}
var Vv = U('ZodCIDRv4', (r, i) => {
	(Tu.init(r, i), K.init(r, i));
});
function mb(r) {
	return ai(Vv, r);
}
var Yv = U('ZodCIDRv6', (r, i) => {
	(Hu.init(r, i), K.init(r, i));
});
function yb(r) {
	return pi(Yv, r);
}
var Ev = U('ZodBase64', (r, i) => {
	(tu.init(r, i), K.init(r, i));
});
function db(r) {
	return si(Ev, r);
}
var Kv = U('ZodBase64URL', (r, i) => {
	(Mu.init(r, i), K.init(r, i));
});
function hb(r) {
	return rv(Kv, r);
}
var Qv = U('ZodE164', (r, i) => {
	(Au.init(r, i), K.init(r, i));
});
function eb(r) {
	return nv(Qv, r);
}
var Tv = U('ZodJWT', (r, i) => {
	(Ru.init(r, i), K.init(r, i));
});
function ab(r) {
	return iv(Tv, r);
}
var cn = U('ZodCustomStringFormat', (r, i) => {
	(Fu.init(r, i), K.init(r, i));
});
function pb(r, i, v = {}) {
	return bn(cn, r, i, v);
}
function sb(r) {
	return bn(cn, 'hostname', s.hostname, r);
}
function r_(r) {
	return bn(cn, 'hex', s.hex, r);
}
function n_(r, i) {
	let v = i?.enc ?? 'hex',
		u = `${r}_${v}`,
		n = s[u];
	if (!n) throw Error(`Unrecognized hash format: ${u}`);
	return bn(cn, u, n, i);
}
var Sn = U('ZodNumber', (r, i) => {
	(Ki.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (u, n, $) => _I(r, u, n, $)),
		an(r, 'ZodNumber', {
			gt(u, n) {
				return this.check(_r(u, n));
			},
			gte(u, n) {
				return this.check(d(u, n));
			},
			min(u, n) {
				return this.check(d(u, n));
			},
			lt(u, n) {
				return this.check(br(u, n));
			},
			lte(u, n) {
				return this.check(rr(u, n));
			},
			max(u, n) {
				return this.check(rr(u, n));
			},
			int(u) {
				return this.check(wv(u));
			},
			safe(u) {
				return this.check(wv(u));
			},
			positive(u) {
				return this.check(_r(0, u));
			},
			nonnegative(u) {
				return this.check(d(0, u));
			},
			negative(u) {
				return this.check(br(0, u));
			},
			nonpositive(u) {
				return this.check(rr(0, u));
			},
			multipleOf(u, n) {
				return this.check(Gr(u, n));
			},
			step(u, n) {
				return this.check(Gr(u, n));
			},
			finite() {
				return this;
			}
		}));
	let v = r._zod.bag;
	((r.minValue =
		Math.max(
			v.minimum ?? Number.NEGATIVE_INFINITY,
			v.exclusiveMinimum ?? Number.NEGATIVE_INFINITY
		) ?? null),
		(r.maxValue =
			Math.min(
				v.maximum ?? Number.POSITIVE_INFINITY,
				v.exclusiveMaximum ?? Number.POSITIVE_INFINITY
			) ?? null),
		(r.isInt = (v.format ?? '').includes('int') || Number.isSafeInteger(v.multipleOf ?? 0.5)),
		(r.isFinite = !0),
		(r.format = v.format ?? null));
});
function _6(r) {
	return E4(Sn, r);
}
var Ar = U('ZodNumberFormat', (r, i) => {
	(xu.init(r, i), Sn.init(r, i));
});
function wv(r) {
	return Q4(Ar, r);
}
function i_(r) {
	return T4(Ar, r);
}
function v_(r) {
	return H4(Ar, r);
}
function $_(r) {
	return B4(Ar, r);
}
function u_(r) {
	return t4(Ar, r);
}
var wn = U('ZodBoolean', (r, i) => {
	(Hn.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => UI(r, v, u, n)));
});
function U6(r) {
	return M4(wn, r);
}
var zn = U('ZodBigInt', (r, i) => {
	(Qi.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (u, n, $) => lI(r, u, n, $)),
		(r.gte = (u, n) => r.check(d(u, n))),
		(r.min = (u, n) => r.check(d(u, n))),
		(r.gt = (u, n) => r.check(_r(u, n))),
		(r.gte = (u, n) => r.check(d(u, n))),
		(r.min = (u, n) => r.check(d(u, n))),
		(r.lt = (u, n) => r.check(br(u, n))),
		(r.lte = (u, n) => r.check(rr(u, n))),
		(r.max = (u, n) => r.check(rr(u, n))),
		(r.positive = (u) => r.check(_r(BigInt(0), u))),
		(r.negative = (u) => r.check(br(BigInt(0), u))),
		(r.nonpositive = (u) => r.check(rr(BigInt(0), u))),
		(r.nonnegative = (u) => r.check(d(BigInt(0), u))),
		(r.multipleOf = (u, n) => r.check(Gr(u, n))));
	let v = r._zod.bag;
	((r.minValue = v.minimum ?? null),
		(r.maxValue = v.maximum ?? null),
		(r.format = v.format ?? null));
});
function g_(r) {
	return R4(zn, r);
}
var Hv = U('ZodBigIntFormat', (r, i) => {
	(Zu.init(r, i), zn.init(r, i));
});
function I_(r) {
	return x4(Hv, r);
}
function o_(r) {
	return Z4(Hv, r);
}
var l6 = U('ZodSymbol', (r, i) => {
	(fu.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => kI(r, v, u, n)));
});
function b_(r) {
	return f4(l6, r);
}
var k6 = U('ZodUndefined', (r, i) => {
	(Cu.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => cI(r, v, u, n)));
});
function __(r) {
	return C4(k6, r);
}
var D6 = U('ZodNull', (r, i) => {
	(mu.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => DI(r, v, u, n)));
});
function c6(r) {
	return m4(D6, r);
}
var S6 = U('ZodAny', (r, i) => {
	(yu.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => zI(r, v, u, n)));
});
function U_() {
	return y4(S6);
}
var w6 = U('ZodUnknown', (r, i) => {
	(du.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => NI(r, v, u, n)));
});
function Mr() {
	return d4(w6);
}
var z6 = U('ZodNever', (r, i) => {
	(hu.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => wI(r, v, u, n)));
});
function Bv(r) {
	return h4(z6, r);
}
var N6 = U('ZodVoid', (r, i) => {
	(eu.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => SI(r, v, u, n)));
});
function l_(r) {
	return e4(N6, r);
}
var sn = U('ZodDate', (r, i) => {
	(au.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (u, n, $) => PI(r, u, n, $)),
		(r.min = (u, n) => r.check(d(u, n))),
		(r.max = (u, n) => r.check(rr(u, n))));
	let v = r._zod.bag;
	((r.minDate = v.minimum ? new Date(v.minimum) : null),
		(r.maxDate = v.maximum ? new Date(v.maximum) : null));
});
function k_(r) {
	return a4(sn, r);
}
var P6 = U('ZodArray', (r, i) => {
	(pu.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => KI(r, v, u, n)),
		(r.element = i.element),
		an(r, 'ZodArray', {
			min(v, u) {
				return this.check(wr(v, u));
			},
			nonempty(v) {
				return this.check(wr(1, v));
			},
			max(v, u) {
				return this.check(Br(v, u));
			},
			length(v, u) {
				return this.check(tr(v, u));
			},
			unwrap() {
				return this.element;
			}
		}));
});
function ri(r, i) {
	return rI(P6, r, i);
}
function D_(r) {
	let i = r._zod.def.shape;
	return Mv(Object.keys(i));
}
var ni = U('ZodObject', (r, i) => {
	(su.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => QI(r, v, u, n)),
		z.defineLazy(r, 'shape', () => {
			return i.shape;
		}),
		an(r, 'ZodObject', {
			keyof() {
				return Mv(Object.keys(this._zod.def.shape));
			},
			catchall(v) {
				return this.clone({ ...this._zod.def, catchall: v });
			},
			passthrough() {
				return this.clone({ ...this._zod.def, catchall: Mr() });
			},
			loose() {
				return this.clone({ ...this._zod.def, catchall: Mr() });
			},
			strict() {
				return this.clone({ ...this._zod.def, catchall: Bv() });
			},
			strip() {
				return this.clone({ ...this._zod.def, catchall: void 0 });
			},
			extend(v) {
				return z.extend(this, v);
			},
			safeExtend(v) {
				return z.safeExtend(this, v);
			},
			merge(v) {
				return z.merge(this, v);
			},
			pick(v) {
				return z.pick(this, v);
			},
			omit(v) {
				return z.omit(this, v);
			},
			partial(...v) {
				return z.partial(Rv, this, v[0]);
			},
			required(...v) {
				return z.required(Fv, this, v[0]);
			}
		}));
});
function c_(r, i) {
	let v = { type: 'object', shape: r ?? {}, ...z.normalizeParams(i) };
	return new ni(v);
}
function S_(r, i) {
	return new ni({ type: 'object', shape: r, catchall: Bv(), ...z.normalizeParams(i) });
}
function w_(r, i) {
	return new ni({ type: 'object', shape: r, catchall: Mr(), ...z.normalizeParams(i) });
}
var ii = U('ZodUnion', (r, i) => {
	(Bn.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => bv(r, v, u, n)),
		(r.options = i.options));
});
function tv(r, i) {
	return new ii({ type: 'union', options: r, ...z.normalizeParams(i) });
}
var j6 = U('ZodXor', (r, i) => {
	(ii.init(r, i),
		rg.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => bv(r, v, u, n)),
		(r.options = i.options));
});
function z_(r, i) {
	return new j6({ type: 'union', options: r, inclusive: !1, ...z.normalizeParams(i) });
}
var J6 = U('ZodDiscriminatedUnion', (r, i) => {
	(ii.init(r, i), ng.init(r, i));
});
function N_(r, i, v) {
	return new J6({ type: 'union', options: i, discriminator: r, ...z.normalizeParams(v) });
}
var L6 = U('ZodIntersection', (r, i) => {
	(ig.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => TI(r, v, u, n)));
});
function G6(r, i) {
	return new L6({ type: 'intersection', left: r, right: i });
}
var X6 = U('ZodTuple', (r, i) => {
	(Ti.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => HI(r, v, u, n)),
		(r.rest = (v) => r.clone({ ...r._zod.def, rest: v })));
});
function O6(r, i, v) {
	let u = i instanceof G,
		n = u ? v : i;
	return new X6({ type: 'tuple', items: r, rest: u ? i : null, ...z.normalizeParams(n) });
}
var ln = U('ZodRecord', (r, i) => {
	(vg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => BI(r, v, u, n)),
		(r.keyType = i.keyType),
		(r.valueType = i.valueType));
});
function q6(r, i, v) {
	if (!i || !i._zod)
		return new ln({ type: 'record', keyType: mn(), valueType: r, ...z.normalizeParams(i) });
	return new ln({ type: 'record', keyType: r, valueType: i, ...z.normalizeParams(v) });
}
function P_(r, i, v) {
	let u = m(r);
	return (
		(u._zod.values = void 0),
		new ln({ type: 'record', keyType: u, valueType: i, ...z.normalizeParams(v) })
	);
}
function j_(r, i, v) {
	return new ln({
		type: 'record',
		keyType: r,
		valueType: i,
		mode: 'loose',
		...z.normalizeParams(v)
	});
}
var W6 = U('ZodMap', (r, i) => {
	($g.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => YI(r, v, u, n)),
		(r.keyType = i.keyType),
		(r.valueType = i.valueType),
		(r.min = (...v) => r.check(Ur(...v))),
		(r.nonempty = (v) => r.check(Ur(1, v))),
		(r.max = (...v) => r.check(Xr(...v))),
		(r.size = (...v) => r.check(Hr(...v))));
});
function J_(r, i, v) {
	return new W6({ type: 'map', keyType: r, valueType: i, ...z.normalizeParams(v) });
}
var V6 = U('ZodSet', (r, i) => {
	(ug.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => EI(r, v, u, n)),
		(r.min = (...v) => r.check(Ur(...v))),
		(r.nonempty = (v) => r.check(Ur(1, v))),
		(r.max = (...v) => r.check(Xr(...v))),
		(r.size = (...v) => r.check(Hr(...v))));
});
function L_(r, i) {
	return new V6({ type: 'set', valueType: r, ...z.normalizeParams(i) });
}
var kn = U('ZodEnum', (r, i) => {
	(gg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (u, n, $) => jI(r, u, n, $)),
		(r.enum = i.entries),
		(r.options = Object.values(i.entries)));
	let v = new Set(Object.keys(i.entries));
	((r.extract = (u, n) => {
		let $ = {};
		for (let g of u)
			if (v.has(g)) $[g] = i.entries[g];
			else throw Error(`Key ${g} not found in enum`);
		return new kn({ ...i, checks: [], ...z.normalizeParams(n), entries: $ });
	}),
		(r.exclude = (u, n) => {
			let $ = { ...i.entries };
			for (let g of u)
				if (v.has(g)) delete $[g];
				else throw Error(`Key ${g} not found in enum`);
			return new kn({ ...i, checks: [], ...z.normalizeParams(n), entries: $ });
		}));
});
function Mv(r, i) {
	let v = Array.isArray(r) ? Object.fromEntries(r.map((u) => [u, u])) : r;
	return new kn({ type: 'enum', entries: v, ...z.normalizeParams(i) });
}
function G_(r, i) {
	return new kn({ type: 'enum', entries: r, ...z.normalizeParams(i) });
}
var Y6 = U('ZodLiteral', (r, i) => {
	(Ig.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => JI(r, v, u, n)),
		(r.values = new Set(i.values)),
		Object.defineProperty(r, 'value', {
			get() {
				if (i.values.length > 1)
					throw Error('This schema contains multiple valid literal values. Use `.values` instead.');
				return i.values[0];
			}
		}));
});
function X_(r, i) {
	return new Y6({ type: 'literal', values: Array.isArray(r) ? r : [r], ...z.normalizeParams(i) });
}
var E6 = U('ZodFile', (r, i) => {
	(og.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => XI(r, v, u, n)),
		(r.min = (v, u) => r.check(Ur(v, u))),
		(r.max = (v, u) => r.check(Xr(v, u))),
		(r.mime = (v, u) => r.check(vn(Array.isArray(v) ? v : [v], u))));
});
function O_(r) {
	return nI(E6, r);
}
var K6 = U('ZodTransform', (r, i) => {
	(bg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => VI(r, v, u, n)),
		(r._zod.parse = (v, u) => {
			if (u.direction === 'backward') throw new Er(r.constructor.name);
			v.addIssue = ($) => {
				if (typeof $ === 'string') v.issues.push(z.issue($, v.value, i));
				else {
					let g = $;
					if (g.fatal) g.continue = !1;
					(g.code ?? (g.code = 'custom'),
						g.input ?? (g.input = v.value),
						g.inst ?? (g.inst = r),
						v.issues.push(z.issue(g)));
				}
			};
			let n = i.transform(v.value, v);
			if (n instanceof Promise)
				return n.then(($) => {
					return ((v.value = $), v);
				});
			return ((v.value = n), v);
		}));
});
function Av(r) {
	return new K6({ type: 'transform', transform: r });
}
var Rv = U('ZodOptional', (r, i) => {
	(Hi.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => _v(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType));
});
function dn(r) {
	return new Rv({ type: 'optional', innerType: r });
}
var Q6 = U('ZodExactOptional', (r, i) => {
	(_g.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => _v(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType));
});
function T6(r) {
	return new Q6({ type: 'optional', innerType: r });
}
var H6 = U('ZodNullable', (r, i) => {
	(Ug.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => tI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType));
});
function hn(r) {
	return new H6({ type: 'nullable', innerType: r });
}
function q_(r) {
	return dn(hn(r));
}
var B6 = U('ZodDefault', (r, i) => {
	(lg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => AI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType),
		(r.removeDefault = r.unwrap));
});
function t6(r, i) {
	return new B6({
		type: 'default',
		innerType: r,
		get defaultValue() {
			return typeof i === 'function' ? i() : z.shallowClone(i);
		}
	});
}
var M6 = U('ZodPrefault', (r, i) => {
	(kg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => RI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType));
});
function A6(r, i) {
	return new M6({
		type: 'prefault',
		innerType: r,
		get defaultValue() {
			return typeof i === 'function' ? i() : z.shallowClone(i);
		}
	});
}
var Fv = U('ZodNonOptional', (r, i) => {
	(Dg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => MI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType));
});
function R6(r, i) {
	return new Fv({ type: 'nonoptional', innerType: r, ...z.normalizeParams(i) });
}
var F6 = U('ZodSuccess', (r, i) => {
	(cg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => OI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType));
});
function W_(r) {
	return new F6({ type: 'success', innerType: r });
}
var x6 = U('ZodCatch', (r, i) => {
	(Sg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => FI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType),
		(r.removeCatch = r.unwrap));
});
function Z6(r, i) {
	return new x6({ type: 'catch', innerType: r, catchValue: typeof i === 'function' ? i : () => i });
}
var f6 = U('ZodNaN', (r, i) => {
	(wg.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => LI(r, v, u, n)));
});
function V_(r) {
	return s4(f6, r);
}
var xv = U('ZodPipe', (r, i) => {
	(zg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => xI(r, v, u, n)),
		(r.in = i.in),
		(r.out = i.out));
});
function en(r, i) {
	return new xv({ type: 'pipe', in: r, out: i });
}
var vi = U('ZodCodec', (r, i) => {
	(xv.init(r, i), tn.init(r, i));
});
function Y_(r, i, v) {
	return new vi({ type: 'pipe', in: r, out: i, transform: v.decode, reverseTransform: v.encode });
}
function E_(r) {
	let i = r._zod.def;
	return new vi({
		type: 'pipe',
		in: i.out,
		out: i.in,
		transform: i.reverseTransform,
		reverseTransform: i.transform
	});
}
var C6 = U('ZodReadonly', (r, i) => {
	(Ng.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => ZI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType));
});
function m6(r) {
	return new C6({ type: 'readonly', innerType: r });
}
var y6 = U('ZodTemplateLiteral', (r, i) => {
	(Pg.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => GI(r, v, u, n)));
});
function K_(r, i) {
	return new y6({ type: 'template_literal', parts: r, ...z.normalizeParams(i) });
}
var d6 = U('ZodLazy', (r, i) => {
	(Lg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => CI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.getter()));
});
function h6(r) {
	return new d6({ type: 'lazy', getter: r });
}
var e6 = U('ZodPromise', (r, i) => {
	(Jg.init(r, i),
		X.init(r, i),
		(r._zod.processJSONSchema = (v, u, n) => fI(r, v, u, n)),
		(r.unwrap = () => r._zod.def.innerType));
});
function Q_(r) {
	return new e6({ type: 'promise', innerType: r });
}
var a6 = U('ZodFunction', (r, i) => {
	(jg.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => WI(r, v, u, n)));
});
function T_(r) {
	return new a6({
		type: 'function',
		input: Array.isArray(r?.input) ? O6(r?.input) : (r?.input ?? ri(Mr())),
		output: r?.output ?? Mr()
	});
}
var $i = U('ZodCustom', (r, i) => {
	(Gg.init(r, i), X.init(r, i), (r._zod.processJSONSchema = (v, u, n) => qI(r, v, u, n)));
});
function H_(r) {
	let i = new H({ check: 'custom' });
	return ((i._zod.check = r), i);
}
function B_(r, i) {
	return iI($i, r ?? (() => !0), i);
}
function p6(r, i = {}) {
	return vI($i, r, i);
}
function s6(r, i) {
	return $I(r, i);
}
var t_ = uI,
	M_ = gI;
function A_(r, i = {}) {
	let v = new $i({
		type: 'custom',
		check: 'custom',
		fn: (u) => u instanceof r,
		abort: !0,
		...z.normalizeParams(i)
	});
	return (
		(v._zod.bag.Class = r),
		(v._zod.check = (u) => {
			if (!(u.value instanceof r))
				u.issues.push({
					code: 'invalid_type',
					expected: r.name,
					input: u.value,
					inst: v,
					path: [...(v._zod.def.path ?? [])]
				});
		}),
		v
	);
}
var R_ = (...r) => II({ Codec: vi, Boolean: wn, String: Dn }, ...r);
function F_(r) {
	let i = h6(() => {
		return tv([mn(r), _6(), U6(), c6(), ri(i), q6(mn(), i)]);
	});
	return i;
}
function x_(r, i) {
	return en(Av(r), i);
}
var hk = {
	invalid_type: 'invalid_type',
	too_big: 'too_big',
	too_small: 'too_small',
	invalid_format: 'invalid_format',
	not_multiple_of: 'not_multiple_of',
	unrecognized_keys: 'unrecognized_keys',
	invalid_union: 'invalid_union',
	invalid_key: 'invalid_key',
	invalid_element: 'invalid_element',
	invalid_value: 'invalid_value',
	custom: 'custom'
};
function ek(r) {
	M({ customError: r });
}
function ak() {
	return M().customError;
}
var ro;
(function (r) {})(ro || (ro = {}));
var j = { ...Cn, ...lv, iso: Un },
	pk = new Set([
		'$schema',
		'$ref',
		'$defs',
		'definitions',
		'$id',
		'id',
		'$comment',
		'$anchor',
		'$vocabulary',
		'$dynamicRef',
		'$dynamicAnchor',
		'type',
		'enum',
		'const',
		'anyOf',
		'oneOf',
		'allOf',
		'not',
		'properties',
		'required',
		'additionalProperties',
		'patternProperties',
		'propertyNames',
		'minProperties',
		'maxProperties',
		'items',
		'prefixItems',
		'additionalItems',
		'minItems',
		'maxItems',
		'uniqueItems',
		'contains',
		'minContains',
		'maxContains',
		'minLength',
		'maxLength',
		'pattern',
		'format',
		'minimum',
		'maximum',
		'exclusiveMinimum',
		'exclusiveMaximum',
		'multipleOf',
		'description',
		'default',
		'contentEncoding',
		'contentMediaType',
		'contentSchema',
		'unevaluatedItems',
		'unevaluatedProperties',
		'if',
		'then',
		'else',
		'dependentSchemas',
		'dependentRequired',
		'nullable',
		'readOnly'
	]);
function sk(r, i) {
	let v = r.$schema;
	if (v === 'https://json-schema.org/draft/2020-12/schema') return 'draft-2020-12';
	if (v === 'http://json-schema.org/draft-07/schema#') return 'draft-7';
	if (v === 'http://json-schema.org/draft-04/schema#') return 'draft-4';
	return i ?? 'draft-2020-12';
}
function rD(r, i) {
	if (!r.startsWith('#'))
		throw Error('External $ref is not supported, only local refs (#/...) are allowed');
	let v = r.slice(1).split('/').filter(Boolean);
	if (v.length === 0) return i.rootSchema;
	let u = i.version === 'draft-2020-12' ? '$defs' : 'definitions';
	if (v[0] === u) {
		let n = v[1];
		if (!n || !i.defs[n]) throw Error(`Reference not found: ${r}`);
		return i.defs[n];
	}
	throw Error(`Reference not found: ${r}`);
}
function Z_(r, i) {
	if (r.not !== void 0) {
		if (typeof r.not === 'object' && Object.keys(r.not).length === 0) return j.never();
		throw Error('not is not supported in Zod (except { not: {} } for never)');
	}
	if (r.unevaluatedItems !== void 0) throw Error('unevaluatedItems is not supported');
	if (r.unevaluatedProperties !== void 0) throw Error('unevaluatedProperties is not supported');
	if (r.if !== void 0 || r.then !== void 0 || r.else !== void 0)
		throw Error('Conditional schemas (if/then/else) are not supported');
	if (r.dependentSchemas !== void 0 || r.dependentRequired !== void 0)
		throw Error('dependentSchemas and dependentRequired are not supported');
	if (r.$ref) {
		let n = r.$ref;
		if (i.refs.has(n)) return i.refs.get(n);
		if (i.processing.has(n))
			return j.lazy(() => {
				if (!i.refs.has(n)) throw Error(`Circular reference not resolved: ${n}`);
				return i.refs.get(n);
			});
		i.processing.add(n);
		let $ = rD(n, i),
			g = C($, i);
		return (i.refs.set(n, g), i.processing.delete(n), g);
	}
	if (r.enum !== void 0) {
		let n = r.enum;
		if (i.version === 'openapi-3.0' && r.nullable === !0 && n.length === 1 && n[0] === null)
			return j.null();
		if (n.length === 0) return j.never();
		if (n.length === 1) return j.literal(n[0]);
		if (n.every((g) => typeof g === 'string')) return j.enum(n);
		let $ = n.map((g) => j.literal(g));
		if ($.length < 2) return $[0];
		return j.union([$[0], $[1], ...$.slice(2)]);
	}
	if (r.const !== void 0) return j.literal(r.const);
	let v = r.type;
	if (Array.isArray(v)) {
		let n = v.map(($) => {
			let g = { ...r, type: $ };
			return Z_(g, i);
		});
		if (n.length === 0) return j.never();
		if (n.length === 1) return n[0];
		return j.union(n);
	}
	if (!v) return j.any();
	let u;
	switch (v) {
		case 'string': {
			let n = j.string();
			if (r.format) {
				let $ = r.format;
				if ($ === 'email') n = n.check(j.email());
				else if ($ === 'uri' || $ === 'uri-reference') n = n.check(j.url());
				else if ($ === 'uuid' || $ === 'guid') n = n.check(j.uuid());
				else if ($ === 'date-time') n = n.check(j.iso.datetime());
				else if ($ === 'date') n = n.check(j.iso.date());
				else if ($ === 'time') n = n.check(j.iso.time());
				else if ($ === 'duration') n = n.check(j.iso.duration());
				else if ($ === 'ipv4') n = n.check(j.ipv4());
				else if ($ === 'ipv6') n = n.check(j.ipv6());
				else if ($ === 'mac') n = n.check(j.mac());
				else if ($ === 'cidr') n = n.check(j.cidrv4());
				else if ($ === 'cidr-v6') n = n.check(j.cidrv6());
				else if ($ === 'base64') n = n.check(j.base64());
				else if ($ === 'base64url') n = n.check(j.base64url());
				else if ($ === 'e164') n = n.check(j.e164());
				else if ($ === 'jwt') n = n.check(j.jwt());
				else if ($ === 'emoji') n = n.check(j.emoji());
				else if ($ === 'nanoid') n = n.check(j.nanoid());
				else if ($ === 'cuid') n = n.check(j.cuid());
				else if ($ === 'cuid2') n = n.check(j.cuid2());
				else if ($ === 'ulid') n = n.check(j.ulid());
				else if ($ === 'xid') n = n.check(j.xid());
				else if ($ === 'ksuid') n = n.check(j.ksuid());
			}
			if (typeof r.minLength === 'number') n = n.min(r.minLength);
			if (typeof r.maxLength === 'number') n = n.max(r.maxLength);
			if (r.pattern) n = n.regex(new RegExp(r.pattern));
			u = n;
			break;
		}
		case 'number':
		case 'integer': {
			let n = v === 'integer' ? j.number().int() : j.number();
			if (typeof r.minimum === 'number') n = n.min(r.minimum);
			if (typeof r.maximum === 'number') n = n.max(r.maximum);
			if (typeof r.exclusiveMinimum === 'number') n = n.gt(r.exclusiveMinimum);
			else if (r.exclusiveMinimum === !0 && typeof r.minimum === 'number') n = n.gt(r.minimum);
			if (typeof r.exclusiveMaximum === 'number') n = n.lt(r.exclusiveMaximum);
			else if (r.exclusiveMaximum === !0 && typeof r.maximum === 'number') n = n.lt(r.maximum);
			if (typeof r.multipleOf === 'number') n = n.multipleOf(r.multipleOf);
			u = n;
			break;
		}
		case 'boolean': {
			u = j.boolean();
			break;
		}
		case 'null': {
			u = j.null();
			break;
		}
		case 'object': {
			let n = {},
				$ = r.properties || {},
				g = new Set(r.required || []);
			for (let [b, o] of Object.entries($)) {
				let _ = C(o, i);
				n[b] = g.has(b) ? _ : _.optional();
			}
			if (r.propertyNames) {
				let b = C(r.propertyNames, i),
					o =
						r.additionalProperties && typeof r.additionalProperties === 'object'
							? C(r.additionalProperties, i)
							: j.any();
				if (Object.keys(n).length === 0) {
					u = j.record(b, o);
					break;
				}
				let _ = j.object(n).passthrough(),
					l = j.looseRecord(b, o);
				u = j.intersection(_, l);
				break;
			}
			if (r.patternProperties) {
				let b = r.patternProperties,
					o = Object.keys(b),
					_ = [];
				for (let D of o) {
					let c = C(b[D], i),
						P = j.string().regex(new RegExp(D));
					_.push(j.looseRecord(P, c));
				}
				let l = [];
				if (Object.keys(n).length > 0) l.push(j.object(n).passthrough());
				if ((l.push(..._), l.length === 0)) u = j.object({}).passthrough();
				else if (l.length === 1) u = l[0];
				else {
					let D = j.intersection(l[0], l[1]);
					for (let c = 2; c < l.length; c++) D = j.intersection(D, l[c]);
					u = D;
				}
				break;
			}
			let I = j.object(n);
			if (r.additionalProperties === !1) u = I.strict();
			else if (typeof r.additionalProperties === 'object')
				u = I.catchall(C(r.additionalProperties, i));
			else u = I.passthrough();
			break;
		}
		case 'array': {
			let { prefixItems: n, items: $ } = r;
			if (n && Array.isArray(n)) {
				let g = n.map((b) => C(b, i)),
					I = $ && typeof $ === 'object' && !Array.isArray($) ? C($, i) : void 0;
				if (I) u = j.tuple(g).rest(I);
				else u = j.tuple(g);
				if (typeof r.minItems === 'number') u = u.check(j.minLength(r.minItems));
				if (typeof r.maxItems === 'number') u = u.check(j.maxLength(r.maxItems));
			} else if (Array.isArray($)) {
				let g = $.map((b) => C(b, i)),
					I =
						r.additionalItems && typeof r.additionalItems === 'object'
							? C(r.additionalItems, i)
							: void 0;
				if (I) u = j.tuple(g).rest(I);
				else u = j.tuple(g);
				if (typeof r.minItems === 'number') u = u.check(j.minLength(r.minItems));
				if (typeof r.maxItems === 'number') u = u.check(j.maxLength(r.maxItems));
			} else if ($ !== void 0) {
				let g = C($, i),
					I = j.array(g);
				if (typeof r.minItems === 'number') I = I.min(r.minItems);
				if (typeof r.maxItems === 'number') I = I.max(r.maxItems);
				u = I;
			} else u = j.array(j.any());
			break;
		}
		default:
			throw Error(`Unsupported type: ${v}`);
	}
	return u;
}
function C(r, i) {
	if (typeof r === 'boolean') return r ? j.any() : j.never();
	let v = Z_(r, i),
		u = r.type || r.enum !== void 0 || r.const !== void 0;
	if (r.anyOf && Array.isArray(r.anyOf)) {
		let I = r.anyOf.map((o) => C(o, i)),
			b = j.union(I);
		v = u ? j.intersection(v, b) : b;
	}
	if (r.oneOf && Array.isArray(r.oneOf)) {
		let I = r.oneOf.map((o) => C(o, i)),
			b = j.xor(I);
		v = u ? j.intersection(v, b) : b;
	}
	if (r.allOf && Array.isArray(r.allOf))
		if (r.allOf.length === 0) v = u ? v : j.any();
		else {
			let I = u ? v : C(r.allOf[0], i),
				b = u ? 0 : 1;
			for (let o = b; o < r.allOf.length; o++) I = j.intersection(I, C(r.allOf[o], i));
			v = I;
		}
	if (r.nullable === !0 && i.version === 'openapi-3.0') v = j.nullable(v);
	if (r.readOnly === !0) v = j.readonly(v);
	if (r.default !== void 0) v = v.default(r.default);
	let n = {},
		$ = ['$id', 'id', '$comment', '$anchor', '$vocabulary', '$dynamicRef', '$dynamicAnchor'];
	for (let I of $) if (I in r) n[I] = r[I];
	let g = ['contentEncoding', 'contentMediaType', 'contentSchema'];
	for (let I of g) if (I in r) n[I] = r[I];
	for (let I of Object.keys(r)) if (!pk.has(I)) n[I] = r[I];
	if (Object.keys(n).length > 0) i.registry.add(v, n);
	if (r.description) v = v.describe(r.description);
	return v;
}
function f_(r, i) {
	if (typeof r === 'boolean') return r ? j.any() : j.never();
	let v;
	try {
		v = JSON.parse(JSON.stringify(r));
	} catch {
		throw Error(
			'fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas'
		);
	}
	let u = sk(v, i?.defaultTarget),
		n = v.$defs || v.definitions || {},
		$ = {
			version: u,
			defs: n,
			refs: new Map(),
			processing: new Set(),
			rootSchema: v,
			registry: i?.registry ?? f
		};
	return C(v, $);
}
var no = {};
Dr(no, { string: () => nD, number: () => iD, date: () => uD, boolean: () => vD, bigint: () => $D });
function nD(r) {
	return G4(Dn, r);
}
function iD(r) {
	return K4(Sn, r);
}
function vD(r) {
	return A4(wn, r);
}
function $D(r) {
	return F4(zn, r);
}
function uD(r) {
	return p4(sn, r);
}
M(Mn());
var F = io;
import { styleText as ui } from 'node:util';
import { stdout as oD, stdin as bD } from 'node:process';
var nr = Ii($o(), 1);
import _D from 'node:readline';
function oo(r, i, v) {
	if (!v.some((g) => !g.disabled)) return r;
	let u = r + i,
		n = Math.max(v.length - 1, 0),
		$ = u < 0 ? n : u > n ? 0 : u;
	return v[$].disabled ? oo($, i < 0 ? -1 : 1, v) : $;
}
var UD = (r) =>
		r === 161 ||
		r === 164 ||
		r === 167 ||
		r === 168 ||
		r === 170 ||
		r === 173 ||
		r === 174 ||
		(r >= 176 && r <= 180) ||
		(r >= 182 && r <= 186) ||
		(r >= 188 && r <= 191) ||
		r === 198 ||
		r === 208 ||
		r === 215 ||
		r === 216 ||
		(r >= 222 && r <= 225) ||
		r === 230 ||
		(r >= 232 && r <= 234) ||
		r === 236 ||
		r === 237 ||
		r === 240 ||
		r === 242 ||
		r === 243 ||
		(r >= 247 && r <= 250) ||
		r === 252 ||
		r === 254 ||
		r === 257 ||
		r === 273 ||
		r === 275 ||
		r === 283 ||
		r === 294 ||
		r === 295 ||
		r === 299 ||
		(r >= 305 && r <= 307) ||
		r === 312 ||
		(r >= 319 && r <= 322) ||
		r === 324 ||
		(r >= 328 && r <= 331) ||
		r === 333 ||
		r === 338 ||
		r === 339 ||
		r === 358 ||
		r === 359 ||
		r === 363 ||
		r === 462 ||
		r === 464 ||
		r === 466 ||
		r === 468 ||
		r === 470 ||
		r === 472 ||
		r === 474 ||
		r === 476 ||
		r === 593 ||
		r === 609 ||
		r === 708 ||
		r === 711 ||
		(r >= 713 && r <= 715) ||
		r === 717 ||
		r === 720 ||
		(r >= 728 && r <= 731) ||
		r === 733 ||
		r === 735 ||
		(r >= 768 && r <= 879) ||
		(r >= 913 && r <= 929) ||
		(r >= 931 && r <= 937) ||
		(r >= 945 && r <= 961) ||
		(r >= 963 && r <= 969) ||
		r === 1025 ||
		(r >= 1040 && r <= 1103) ||
		r === 1105 ||
		r === 8208 ||
		(r >= 8211 && r <= 8214) ||
		r === 8216 ||
		r === 8217 ||
		r === 8220 ||
		r === 8221 ||
		(r >= 8224 && r <= 8226) ||
		(r >= 8228 && r <= 8231) ||
		r === 8240 ||
		r === 8242 ||
		r === 8243 ||
		r === 8245 ||
		r === 8251 ||
		r === 8254 ||
		r === 8308 ||
		r === 8319 ||
		(r >= 8321 && r <= 8324) ||
		r === 8364 ||
		r === 8451 ||
		r === 8453 ||
		r === 8457 ||
		r === 8467 ||
		r === 8470 ||
		r === 8481 ||
		r === 8482 ||
		r === 8486 ||
		r === 8491 ||
		r === 8531 ||
		r === 8532 ||
		(r >= 8539 && r <= 8542) ||
		(r >= 8544 && r <= 8555) ||
		(r >= 8560 && r <= 8569) ||
		r === 8585 ||
		(r >= 8592 && r <= 8601) ||
		r === 8632 ||
		r === 8633 ||
		r === 8658 ||
		r === 8660 ||
		r === 8679 ||
		r === 8704 ||
		r === 8706 ||
		r === 8707 ||
		r === 8711 ||
		r === 8712 ||
		r === 8715 ||
		r === 8719 ||
		r === 8721 ||
		r === 8725 ||
		r === 8730 ||
		(r >= 8733 && r <= 8736) ||
		r === 8739 ||
		r === 8741 ||
		(r >= 8743 && r <= 8748) ||
		r === 8750 ||
		(r >= 8756 && r <= 8759) ||
		r === 8764 ||
		r === 8765 ||
		r === 8776 ||
		r === 8780 ||
		r === 8786 ||
		r === 8800 ||
		r === 8801 ||
		(r >= 8804 && r <= 8807) ||
		r === 8810 ||
		r === 8811 ||
		r === 8814 ||
		r === 8815 ||
		r === 8834 ||
		r === 8835 ||
		r === 8838 ||
		r === 8839 ||
		r === 8853 ||
		r === 8857 ||
		r === 8869 ||
		r === 8895 ||
		r === 8978 ||
		(r >= 9312 && r <= 9449) ||
		(r >= 9451 && r <= 9547) ||
		(r >= 9552 && r <= 9587) ||
		(r >= 9600 && r <= 9615) ||
		(r >= 9618 && r <= 9621) ||
		r === 9632 ||
		r === 9633 ||
		(r >= 9635 && r <= 9641) ||
		r === 9650 ||
		r === 9651 ||
		r === 9654 ||
		r === 9655 ||
		r === 9660 ||
		r === 9661 ||
		r === 9664 ||
		r === 9665 ||
		(r >= 9670 && r <= 9672) ||
		r === 9675 ||
		(r >= 9678 && r <= 9681) ||
		(r >= 9698 && r <= 9701) ||
		r === 9711 ||
		r === 9733 ||
		r === 9734 ||
		r === 9737 ||
		r === 9742 ||
		r === 9743 ||
		r === 9756 ||
		r === 9758 ||
		r === 9792 ||
		r === 9794 ||
		r === 9824 ||
		r === 9825 ||
		(r >= 9827 && r <= 9829) ||
		(r >= 9831 && r <= 9834) ||
		r === 9836 ||
		r === 9837 ||
		r === 9839 ||
		r === 9886 ||
		r === 9887 ||
		r === 9919 ||
		(r >= 9926 && r <= 9933) ||
		(r >= 9935 && r <= 9939) ||
		(r >= 9941 && r <= 9953) ||
		r === 9955 ||
		r === 9960 ||
		r === 9961 ||
		(r >= 9963 && r <= 9969) ||
		r === 9972 ||
		(r >= 9974 && r <= 9977) ||
		r === 9979 ||
		r === 9980 ||
		r === 9982 ||
		r === 9983 ||
		r === 10045 ||
		(r >= 10102 && r <= 10111) ||
		(r >= 11094 && r <= 11097) ||
		(r >= 12872 && r <= 12879) ||
		(r >= 57344 && r <= 63743) ||
		(r >= 65024 && r <= 65039) ||
		r === 65533 ||
		(r >= 127232 && r <= 127242) ||
		(r >= 127248 && r <= 127277) ||
		(r >= 127280 && r <= 127337) ||
		(r >= 127344 && r <= 127373) ||
		r === 127375 ||
		r === 127376 ||
		(r >= 127387 && r <= 127404) ||
		(r >= 917760 && r <= 917999) ||
		(r >= 983040 && r <= 1048573) ||
		(r >= 1048576 && r <= 1114109),
	lD = (r) => r === 12288 || (r >= 65281 && r <= 65376) || (r >= 65504 && r <= 65510),
	kD = (r) =>
		(r >= 4352 && r <= 4447) ||
		r === 8986 ||
		r === 8987 ||
		r === 9001 ||
		r === 9002 ||
		(r >= 9193 && r <= 9196) ||
		r === 9200 ||
		r === 9203 ||
		r === 9725 ||
		r === 9726 ||
		r === 9748 ||
		r === 9749 ||
		(r >= 9800 && r <= 9811) ||
		r === 9855 ||
		r === 9875 ||
		r === 9889 ||
		r === 9898 ||
		r === 9899 ||
		r === 9917 ||
		r === 9918 ||
		r === 9924 ||
		r === 9925 ||
		r === 9934 ||
		r === 9940 ||
		r === 9962 ||
		r === 9970 ||
		r === 9971 ||
		r === 9973 ||
		r === 9978 ||
		r === 9981 ||
		r === 9989 ||
		r === 9994 ||
		r === 9995 ||
		r === 10024 ||
		r === 10060 ||
		r === 10062 ||
		(r >= 10067 && r <= 10069) ||
		r === 10071 ||
		(r >= 10133 && r <= 10135) ||
		r === 10160 ||
		r === 10175 ||
		r === 11035 ||
		r === 11036 ||
		r === 11088 ||
		r === 11093 ||
		(r >= 11904 && r <= 11929) ||
		(r >= 11931 && r <= 12019) ||
		(r >= 12032 && r <= 12245) ||
		(r >= 12272 && r <= 12287) ||
		(r >= 12289 && r <= 12350) ||
		(r >= 12353 && r <= 12438) ||
		(r >= 12441 && r <= 12543) ||
		(r >= 12549 && r <= 12591) ||
		(r >= 12593 && r <= 12686) ||
		(r >= 12688 && r <= 12771) ||
		(r >= 12783 && r <= 12830) ||
		(r >= 12832 && r <= 12871) ||
		(r >= 12880 && r <= 19903) ||
		(r >= 19968 && r <= 42124) ||
		(r >= 42128 && r <= 42182) ||
		(r >= 43360 && r <= 43388) ||
		(r >= 44032 && r <= 55203) ||
		(r >= 63744 && r <= 64255) ||
		(r >= 65040 && r <= 65049) ||
		(r >= 65072 && r <= 65106) ||
		(r >= 65108 && r <= 65126) ||
		(r >= 65128 && r <= 65131) ||
		(r >= 94176 && r <= 94180) ||
		r === 94192 ||
		r === 94193 ||
		(r >= 94208 && r <= 100343) ||
		(r >= 100352 && r <= 101589) ||
		(r >= 101632 && r <= 101640) ||
		(r >= 110576 && r <= 110579) ||
		(r >= 110581 && r <= 110587) ||
		r === 110589 ||
		r === 110590 ||
		(r >= 110592 && r <= 110882) ||
		r === 110898 ||
		(r >= 110928 && r <= 110930) ||
		r === 110933 ||
		(r >= 110948 && r <= 110951) ||
		(r >= 110960 && r <= 111355) ||
		r === 126980 ||
		r === 127183 ||
		r === 127374 ||
		(r >= 127377 && r <= 127386) ||
		(r >= 127488 && r <= 127490) ||
		(r >= 127504 && r <= 127547) ||
		(r >= 127552 && r <= 127560) ||
		r === 127568 ||
		r === 127569 ||
		(r >= 127584 && r <= 127589) ||
		(r >= 127744 && r <= 127776) ||
		(r >= 127789 && r <= 127797) ||
		(r >= 127799 && r <= 127868) ||
		(r >= 127870 && r <= 127891) ||
		(r >= 127904 && r <= 127946) ||
		(r >= 127951 && r <= 127955) ||
		(r >= 127968 && r <= 127984) ||
		r === 127988 ||
		(r >= 127992 && r <= 128062) ||
		r === 128064 ||
		(r >= 128066 && r <= 128252) ||
		(r >= 128255 && r <= 128317) ||
		(r >= 128331 && r <= 128334) ||
		(r >= 128336 && r <= 128359) ||
		r === 128378 ||
		r === 128405 ||
		r === 128406 ||
		r === 128420 ||
		(r >= 128507 && r <= 128591) ||
		(r >= 128640 && r <= 128709) ||
		r === 128716 ||
		(r >= 128720 && r <= 128722) ||
		(r >= 128725 && r <= 128727) ||
		(r >= 128732 && r <= 128735) ||
		r === 128747 ||
		r === 128748 ||
		(r >= 128756 && r <= 128764) ||
		(r >= 128992 && r <= 129003) ||
		r === 129008 ||
		(r >= 129292 && r <= 129338) ||
		(r >= 129340 && r <= 129349) ||
		(r >= 129351 && r <= 129535) ||
		(r >= 129648 && r <= 129660) ||
		(r >= 129664 && r <= 129672) ||
		(r >= 129680 && r <= 129725) ||
		(r >= 129727 && r <= 129733) ||
		(r >= 129742 && r <= 129755) ||
		(r >= 129760 && r <= 129768) ||
		(r >= 129776 && r <= 129784) ||
		(r >= 131072 && r <= 196605) ||
		(r >= 196608 && r <= 262141),
	uo = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y,
	Zv = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y,
	fv = /\t{1,1000}/y,
	go =
		/[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/uy,
	Cv = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y,
	DD = /\p{M}+/gu,
	cD = { limit: 1 / 0, ellipsis: '' },
	e_ = (r, i = {}, v = {}) => {
		let u = i.limit ?? 1 / 0,
			n = i.ellipsis ?? '',
			$ = i?.ellipsisWidth ?? (n ? e_(n, cD, v).width : 0),
			g = v.ansiWidth ?? 0,
			I = v.controlWidth ?? 0,
			b = v.tabWidth ?? 8,
			o = v.ambiguousWidth ?? 1,
			_ = v.emojiWidth ?? 2,
			l = v.fullWidthWidth ?? 2,
			D = v.regularWidth ?? 1,
			c = v.wideWidth ?? 2,
			P = 0,
			J = 0,
			q = r.length,
			A = 0,
			Z = !1,
			t = q,
			W = Math.max(0, u - $),
			T = 0,
			$r = 0,
			B = 0,
			R = 0;
		r: for (;;) {
			if ($r > T || (J >= q && J > P)) {
				let lU = r.slice(T, $r) || r.slice(P, J);
				A = 0;
				for (let zo of lU.replaceAll(DD, '')) {
					let dv = zo.codePointAt(0) || 0;
					if (
						(lD(dv) ? (R = l) : kD(dv) ? (R = c) : o !== D && UD(dv) ? (R = o) : (R = D),
						B + R > W && (t = Math.min(t, Math.max(T, P) + A)),
						B + R > u)
					) {
						Z = !0;
						break r;
					}
					((A += zo.length), (B += R));
				}
				T = $r = 0;
			}
			if (J >= q) break;
			if (((Cv.lastIndex = J), Cv.test(r))) {
				if (
					((A = Cv.lastIndex - J),
					(R = A * D),
					B + R > W && (t = Math.min(t, J + Math.floor((W - B) / D))),
					B + R > u)
				) {
					Z = !0;
					break;
				}
				((B += R), (T = P), ($r = J), (J = P = Cv.lastIndex));
				continue;
			}
			if (((uo.lastIndex = J), uo.test(r))) {
				if ((B + g > W && (t = Math.min(t, J)), B + g > u)) {
					Z = !0;
					break;
				}
				((B += g), (T = P), ($r = J), (J = P = uo.lastIndex));
				continue;
			}
			if (((Zv.lastIndex = J), Zv.test(r))) {
				if (
					((A = Zv.lastIndex - J),
					(R = A * I),
					B + R > W && (t = Math.min(t, J + Math.floor((W - B) / I))),
					B + R > u)
				) {
					Z = !0;
					break;
				}
				((B += R), (T = P), ($r = J), (J = P = Zv.lastIndex));
				continue;
			}
			if (((fv.lastIndex = J), fv.test(r))) {
				if (
					((A = fv.lastIndex - J),
					(R = A * b),
					B + R > W && (t = Math.min(t, J + Math.floor((W - B) / b))),
					B + R > u)
				) {
					Z = !0;
					break;
				}
				((B += R), (T = P), ($r = J), (J = P = fv.lastIndex));
				continue;
			}
			if (((go.lastIndex = J), go.test(r))) {
				if ((B + _ > W && (t = Math.min(t, J)), B + _ > u)) {
					Z = !0;
					break;
				}
				((B += _), (T = P), ($r = J), (J = P = go.lastIndex));
				continue;
			}
			J += 1;
		}
		return { width: Z ? W : B, index: Z ? t : q, truncated: Z, ellipsed: Z && u >= $ };
	},
	SD = { limit: 1 / 0, ellipsis: '', ellipsisWidth: 0 },
	gi = (r, i = {}) => e_(r, SD, i).width,
	yv = '\x1B',
	a_ = '',
	wD = 39,
	_o = '\x07',
	p_ = '[',
	zD = ']',
	s_ = 'm',
	Uo = `${zD}8;;`,
	m_ = new RegExp(`(?:\\${p_}(?<code>\\d+)m|\\${Uo}(?<uri>.*)${_o})`, 'y'),
	ND = (r) => {
		if ((r >= 30 && r <= 37) || (r >= 90 && r <= 97)) return 39;
		if ((r >= 40 && r <= 47) || (r >= 100 && r <= 107)) return 49;
		if (r === 1 || r === 2) return 22;
		if (r === 3) return 23;
		if (r === 4) return 24;
		if (r === 7) return 27;
		if (r === 8) return 28;
		if (r === 9) return 29;
		if (r === 0) return 0;
	},
	y_ = (r) => `${yv}${p_}${r}${s_}`,
	d_ = (r) => `${yv}${Uo}${r}${_o}`,
	PD = (r) => r.map((i) => gi(i)),
	Io = (r, i, v) => {
		let u = i[Symbol.iterator](),
			n = !1,
			$ = !1,
			g = r.at(-1),
			I = g === void 0 ? 0 : gi(g),
			b = u.next(),
			o = u.next(),
			_ = 0;
		for (; !b.done; ) {
			let l = b.value,
				D = gi(l);
			(I + D <= v ? (r[r.length - 1] += l) : (r.push(l), (I = 0)),
				(l === yv || l === a_) && ((n = !0), ($ = i.startsWith(Uo, _ + 1))),
				n
					? $
						? l === _o && ((n = !1), ($ = !1))
						: l === s_ && (n = !1)
					: ((I += D), I === v && !o.done && (r.push(''), (I = 0))),
				(b = o),
				(o = u.next()),
				(_ += l.length));
		}
		((g = r.at(-1)),
			!I && g !== void 0 && g.length > 0 && r.length > 1 && (r[r.length - 2] += r.pop()));
	},
	jD = (r) => {
		let i = r.split(' '),
			v = i.length;
		for (; v > 0 && !(gi(i[v - 1]) > 0); ) v--;
		return v === i.length ? r : i.slice(0, v).join(' ') + i.slice(v).join('');
	},
	JD = (r, i, v = {}) => {
		if (v.trim !== !1 && r.trim() === '') return '';
		let u = '',
			n,
			$,
			g = r.split(' '),
			I = PD(g),
			b = [''];
		for (let [P, J] of g.entries()) {
			v.trim !== !1 && (b[b.length - 1] = (b.at(-1) ?? '').trimStart());
			let q = gi(b.at(-1) ?? '');
			if (
				(P !== 0 &&
					(q >= i && (v.wordWrap === !1 || v.trim === !1) && (b.push(''), (q = 0)),
					(q > 0 || v.trim === !1) && ((b[b.length - 1] += ' '), q++)),
				v.hard && I[P] > i)
			) {
				let A = i - q,
					Z = 1 + Math.floor((I[P] - A - 1) / i);
				(Math.floor((I[P] - 1) / i) < Z && b.push(''), Io(b, J, i));
				continue;
			}
			if (q + I[P] > i && q > 0 && I[P] > 0) {
				if (v.wordWrap === !1 && q < i) {
					Io(b, J, i);
					continue;
				}
				b.push('');
			}
			if (q + I[P] > i && v.wordWrap === !1) {
				Io(b, J, i);
				continue;
			}
			b[b.length - 1] += J;
		}
		v.trim !== !1 && (b = b.map((P) => jD(P)));
		let o = b.join(`
`),
			_ = o[Symbol.iterator](),
			l = _.next(),
			D = _.next(),
			c = 0;
		for (; !l.done; ) {
			let P = l.value,
				J = D.value;
			if (((u += P), P === yv || P === a_)) {
				m_.lastIndex = c + 1;
				let A = m_.exec(o)?.groups;
				if (A?.code !== void 0) {
					let Z = Number.parseFloat(A.code);
					n = Z === wD ? void 0 : Z;
				} else A?.uri !== void 0 && ($ = A.uri.length === 0 ? void 0 : A.uri);
			}
			let q = n ? ND(n) : void 0;
			(J ===
			`
`
				? ($ && (u += d_('')), n && q && (u += y_(q)))
				: P ===
						`
` && (n && q && (u += y_(n)), $ && (u += d_($))),
				(c += P.length),
				(l = D),
				(D = _.next()));
		}
		return u;
	};
function h_(r, i, v) {
	return String(r)
		.normalize()
		.replaceAll(
			`\r
`,
			`
`
		)
		.split(
			`
`
		)
		.map((u) => JD(u, i, v)).join(`
`);
}
var LD = ['up', 'down', 'left', 'right', 'space', 'enter', 'cancel'],
	vr = {
		actions: new Set(LD),
		aliases: new Map([
			['k', 'up'],
			['j', 'down'],
			['h', 'left'],
			['l', 'right'],
			['\x03', 'cancel'],
			['escape', 'cancel']
		]),
		messages: { cancel: 'Canceled', error: 'Something went wrong' },
		withGuide: !0
	};
function rU(r, i) {
	if (typeof r == 'string') return vr.aliases.get(r) === i;
	for (let v of r) if (v !== void 0 && rU(v, i)) return !0;
	return !1;
}
function GD(r, i) {
	if (r === i) return;
	let v = r.split(`
`),
		u = i.split(`
`),
		n = Math.max(v.length, u.length),
		$ = [];
	for (let g = 0; g < n; g++) v[g] !== u[g] && $.push(g);
	return { lines: $, numLinesBefore: v.length, numLinesAfter: u.length, numLines: n };
}
var Iz = globalThis.process.platform.startsWith('win'),
	bo = Symbol('clack:cancel');
function gr(r) {
	return r === bo;
}
function mv(r, i) {
	let v = r;
	v.isTTY && v.setRawMode(i);
}
var nU = (r) => ('rows' in r && typeof r.rows == 'number' ? r.rows : 20);
class Nn {
	input;
	output;
	_abortSignal;
	rl;
	opts;
	_render;
	_track = !1;
	_prevFrame = '';
	_subscribers = new Map();
	_cursor = 0;
	state = 'initial';
	error = '';
	value;
	userInput = '';
	constructor(r, i = !0) {
		let { input: v = bD, output: u = oD, render: n, signal: $, ...g } = r;
		((this.opts = g),
			(this.onKeypress = this.onKeypress.bind(this)),
			(this.close = this.close.bind(this)),
			(this.render = this.render.bind(this)),
			(this._render = n.bind(this)),
			(this._track = i),
			(this._abortSignal = $),
			(this.input = v),
			(this.output = u));
	}
	unsubscribe() {
		this._subscribers.clear();
	}
	setSubscriber(r, i) {
		let v = this._subscribers.get(r) ?? [];
		(v.push(i), this._subscribers.set(r, v));
	}
	on(r, i) {
		this.setSubscriber(r, { cb: i });
	}
	once(r, i) {
		this.setSubscriber(r, { cb: i, once: !0 });
	}
	emit(r, ...i) {
		let v = this._subscribers.get(r) ?? [],
			u = [];
		for (let n of v) (n.cb(...i), n.once && u.push(() => v.splice(v.indexOf(n), 1)));
		for (let n of u) n();
	}
	prompt() {
		return new Promise((r) => {
			if (this._abortSignal) {
				if (this._abortSignal.aborted) return ((this.state = 'cancel'), this.close(), r(bo));
				this._abortSignal.addEventListener(
					'abort',
					() => {
						((this.state = 'cancel'), this.close());
					},
					{ once: !0 }
				);
			}
			((this.rl = _D.createInterface({
				input: this.input,
				tabSize: 2,
				prompt: '',
				escapeCodeTimeout: 50,
				terminal: !0
			})),
				this.rl.prompt(),
				this.opts.initialUserInput !== void 0 && this._setUserInput(this.opts.initialUserInput, !0),
				this.input.on('keypress', this.onKeypress),
				mv(this.input, !0),
				this.output.on('resize', this.render),
				this.render(),
				this.once('submit', () => {
					(this.output.write(nr.cursor.show),
						this.output.off('resize', this.render),
						mv(this.input, !1),
						r(this.value));
				}),
				this.once('cancel', () => {
					(this.output.write(nr.cursor.show),
						this.output.off('resize', this.render),
						mv(this.input, !1),
						r(bo));
				}));
		});
	}
	_isActionKey(r, i) {
		return r === '\t';
	}
	_setValue(r) {
		((this.value = r), this.emit('value', this.value));
	}
	_setUserInput(r, i) {
		((this.userInput = r ?? ''),
			this.emit('userInput', this.userInput),
			i &&
				this._track &&
				this.rl &&
				(this.rl.write(this.userInput), (this._cursor = this.rl.cursor)));
	}
	_clearUserInput() {
		(this.rl?.write(null, { ctrl: !0, name: 'u' }), this._setUserInput(''));
	}
	onKeypress(r, i) {
		if (
			(this._track &&
				i.name !== 'return' &&
				(i.name && this._isActionKey(r, i) && this.rl?.write(null, { ctrl: !0, name: 'h' }),
				(this._cursor = this.rl?.cursor ?? 0),
				this._setUserInput(this.rl?.line)),
			this.state === 'error' && (this.state = 'active'),
			i?.name &&
				(!this._track && vr.aliases.has(i.name) && this.emit('cursor', vr.aliases.get(i.name)),
				vr.actions.has(i.name) && this.emit('cursor', i.name)),
			r &&
				(r.toLowerCase() === 'y' || r.toLowerCase() === 'n') &&
				this.emit('confirm', r.toLowerCase() === 'y'),
			this.emit('key', r?.toLowerCase(), i),
			i?.name === 'return')
		) {
			if (this.opts.validate) {
				let v = this.opts.validate(this.value);
				v &&
					((this.error = v instanceof Error ? v.message : v),
					(this.state = 'error'),
					this.rl?.write(this.userInput));
			}
			this.state !== 'error' && (this.state = 'submit');
		}
		(rU([r, i?.name, i?.sequence], 'cancel') && (this.state = 'cancel'),
			(this.state === 'submit' || this.state === 'cancel') && this.emit('finalize'),
			this.render(),
			(this.state === 'submit' || this.state === 'cancel') && this.close());
	}
	close() {
		(this.input.unpipe(),
			this.input.removeListener('keypress', this.onKeypress),
			this.output.write(`
`),
			mv(this.input, !1),
			this.rl?.close(),
			(this.rl = void 0),
			this.emit(`${this.state}`, this.value),
			this.unsubscribe());
	}
	restoreCursor() {
		let r =
			h_(this._prevFrame, process.stdout.columns, { hard: !0, trim: !1 }).split(`
`).length - 1;
		this.output.write(nr.cursor.move(-999, r * -1));
	}
	render() {
		let r = h_(this._render(this) ?? '', process.stdout.columns, { hard: !0, trim: !1 });
		if (r !== this._prevFrame) {
			if (this.state === 'initial') this.output.write(nr.cursor.hide);
			else {
				let i = GD(this._prevFrame, r),
					v = nU(this.output);
				if ((this.restoreCursor(), i)) {
					let u = Math.max(0, i.numLinesAfter - v),
						n = Math.max(0, i.numLinesBefore - v),
						$ = i.lines.find((g) => g >= u);
					if ($ === void 0) {
						this._prevFrame = r;
						return;
					}
					if (i.lines.length === 1) {
						(this.output.write(nr.cursor.move(0, $ - n)), this.output.write(nr.erase.lines(1)));
						let g = r.split(`
`);
						(this.output.write(g[$]),
							(this._prevFrame = r),
							this.output.write(nr.cursor.move(0, g.length - $ - 1)));
						return;
					} else if (i.lines.length > 1) {
						if (u < n) $ = u;
						else {
							let I = $ - n;
							I > 0 && this.output.write(nr.cursor.move(0, I));
						}
						this.output.write(nr.erase.down());
						let g = r
							.split(
								`
`
							)
							.slice($);
						(this.output.write(
							g.join(`
`)
						),
							(this._prevFrame = r));
						return;
					}
				}
				this.output.write(nr.erase.down());
			}
			(this.output.write(r),
				this.state === 'initial' && (this.state = 'active'),
				(this._prevFrame = r));
		}
	}
}
function XD(r, i) {
	if (r === void 0 || i.length === 0) return 0;
	let v = i.findIndex((u) => u.value === r);
	return v !== -1 ? v : 0;
}
function OD(r, i) {
	return (i.label ?? String(i.value)).toLowerCase().includes(r.toLowerCase());
}
function qD(r, i) {
	if (i) return r ? i : i[0];
}
class iU extends Nn {
	filteredOptions;
	multiple;
	isNavigating = !1;
	selectedValues = [];
	focusedValue;
	#r = 0;
	#i = '';
	#v;
	#n;
	get cursor() {
		return this.#r;
	}
	get userInputWithCursor() {
		if (!this.userInput) return ui(['inverse', 'hidden'], '_');
		if (this._cursor >= this.userInput.length) return `${this.userInput}█`;
		let r = this.userInput.slice(0, this._cursor),
			[i, ...v] = this.userInput.slice(this._cursor);
		return `${r}${ui('inverse', i)}${v.join('')}`;
	}
	get options() {
		return typeof this.#n == 'function' ? this.#n() : this.#n;
	}
	constructor(r) {
		(super(r), (this.#n = r.options));
		let i = this.options;
		((this.filteredOptions = [...i]),
			(this.multiple = r.multiple === !0),
			(this.#v = r.filter ?? OD));
		let v;
		if (
			(r.initialValue && Array.isArray(r.initialValue)
				? this.multiple
					? (v = r.initialValue)
					: (v = r.initialValue.slice(0, 1))
				: !this.multiple && this.options.length > 0 && (v = [this.options[0].value]),
			v)
		)
			for (let u of v) {
				let n = i.findIndex(($) => $.value === u);
				n !== -1 && (this.toggleSelected(u), (this.#r = n));
			}
		((this.focusedValue = this.options[this.#r]?.value),
			this.on('key', (u, n) => this.#$(u, n)),
			this.on('userInput', (u) => this.#u(u)));
	}
	_isActionKey(r, i) {
		return (
			r === '\t' ||
			(this.multiple && this.isNavigating && i.name === 'space' && r !== void 0 && r !== '')
		);
	}
	#$(r, i) {
		let v = i.name === 'up',
			u = i.name === 'down',
			n = i.name === 'return';
		v || u
			? ((this.#r = oo(this.#r, v ? -1 : 1, this.filteredOptions)),
				(this.focusedValue = this.filteredOptions[this.#r]?.value),
				this.multiple || (this.selectedValues = [this.focusedValue]),
				(this.isNavigating = !0))
			: n
				? (this.value = qD(this.multiple, this.selectedValues))
				: this.multiple
					? this.focusedValue !== void 0 &&
						(i.name === 'tab' || (this.isNavigating && i.name === 'space'))
						? this.toggleSelected(this.focusedValue)
						: (this.isNavigating = !1)
					: (this.focusedValue && (this.selectedValues = [this.focusedValue]),
						(this.isNavigating = !1));
	}
	deselectAll() {
		this.selectedValues = [];
	}
	toggleSelected(r) {
		this.filteredOptions.length !== 0 &&
			(this.multiple
				? this.selectedValues.includes(r)
					? (this.selectedValues = this.selectedValues.filter((i) => i !== r))
					: (this.selectedValues = [...this.selectedValues, r])
				: (this.selectedValues = [r]));
	}
	#u(r) {
		if (r !== this.#i) {
			this.#i = r;
			let i = this.options;
			r ? (this.filteredOptions = i.filter((n) => this.#v(r, n))) : (this.filteredOptions = [...i]);
			let v = XD(this.focusedValue, this.filteredOptions);
			this.#r = oo(v, 0, this.filteredOptions);
			let u = this.filteredOptions[this.#r];
			(u && !u.disabled ? (this.focusedValue = u.value) : (this.focusedValue = void 0),
				this.multiple ||
					(this.focusedValue !== void 0
						? this.toggleSelected(this.focusedValue)
						: this.deselectAll()));
		}
	}
}
class lo extends Nn {
	get cursor() {
		return this.value ? 0 : 1;
	}
	get _value() {
		return this.cursor === 0;
	}
	constructor(r) {
		(super(r, !1),
			(this.value = !!r.initialValue),
			this.on('userInput', () => {
				this.value = this._value;
			}),
			this.on('confirm', (i) => {
				(this.output.write(nr.cursor.move(0, -1)),
					(this.value = i),
					(this.state = 'submit'),
					this.close());
			}),
			this.on('cursor', () => {
				this.value = !this.value;
			}));
	}
}
class vU extends Nn {
	options;
	cursor = 0;
	#r;
	getGroupItems(r) {
		return this.options.filter((i) => i.group === r);
	}
	isGroupSelected(r) {
		let i = this.getGroupItems(r),
			v = this.value;
		return v === void 0 ? !1 : i.every((u) => v.includes(u.value));
	}
	toggleValue() {
		let r = this.options[this.cursor];
		if ((this.value === void 0 && (this.value = []), r.group === !0)) {
			let i = r.value,
				v = this.getGroupItems(i);
			(this.isGroupSelected(i)
				? (this.value = this.value.filter((u) => v.findIndex((n) => n.value === u) === -1))
				: (this.value = [...this.value, ...v.map((u) => u.value)]),
				(this.value = Array.from(new Set(this.value))));
		} else {
			let i = this.value.includes(r.value);
			this.value = i ? this.value.filter((v) => v !== r.value) : [...this.value, r.value];
		}
	}
	constructor(r) {
		super(r, !1);
		let { options: i } = r;
		((this.#r = r.selectableGroups !== !1),
			(this.options = Object.entries(i).flatMap(([v, u]) => [
				{ value: v, group: !0, label: v },
				...u.map((n) => ({ ...n, group: v }))
			])),
			(this.value = [...(r.initialValues ?? [])]),
			(this.cursor = Math.max(
				this.options.findIndex(({ value: v }) => v === r.cursorAt),
				this.#r ? 0 : 1
			)),
			this.on('cursor', (v) => {
				switch (v) {
					case 'left':
					case 'up': {
						this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
						let u = this.options[this.cursor]?.group === !0;
						!this.#r &&
							u &&
							(this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1);
						break;
					}
					case 'down':
					case 'right': {
						this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
						let u = this.options[this.cursor]?.group === !0;
						!this.#r &&
							u &&
							(this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1);
						break;
					}
					case 'space':
						this.toggleValue();
						break;
				}
			}));
	}
}
class ko extends Nn {
	_mask = '•';
	get cursor() {
		return this._cursor;
	}
	get masked() {
		return this.userInput.replaceAll(/./g, this._mask);
	}
	get userInputWithCursor() {
		if (this.state === 'submit' || this.state === 'cancel') return this.masked;
		let r = this.userInput;
		if (this.cursor >= r.length) return `${this.masked}${ui(['inverse', 'hidden'], '_')}`;
		let i = this.masked,
			v = i.slice(0, this.cursor),
			u = i.slice(this.cursor);
		return `${v}${ui('inverse', u[0])}${u.slice(1)}`;
	}
	clear() {
		this._clearUserInput();
	}
	constructor({ mask: r, ...i }) {
		(super(i),
			(this._mask = r ?? '•'),
			this.on('userInput', (v) => {
				this._setValue(v);
			}));
	}
}
class Do extends Nn {
	get userInputWithCursor() {
		if (this.state === 'submit') return this.userInput;
		let r = this.userInput;
		if (this.cursor >= r.length) return `${this.userInput}█`;
		let i = r.slice(0, this.cursor),
			[v, ...u] = r.slice(this.cursor);
		return `${i}${ui('inverse', v)}${u.join('')}`;
	}
	get cursor() {
		return this._cursor;
	}
	constructor(r) {
		(super({ ...r, initialUserInput: r.initialUserInput ?? r.initialValue }),
			this.on('userInput', (i) => {
				this._setValue(i);
			}),
			this.on('finalize', () => {
				(this.value || (this.value = r.defaultValue), this.value === void 0 && (this.value = ''));
			}));
	}
}
import { styleText as L, stripVTControlCharacters as zz } from 'node:util';
import Ir from 'node:process';
var gU = Ii($o(), 1);
function WD() {
	return Ir.platform !== 'win32'
		? Ir.env.TERM !== 'linux'
		: !!Ir.env.CI ||
				!!Ir.env.WT_SESSION ||
				!!Ir.env.TERMINUS_SUBLIME ||
				Ir.env.ConEmuTask === '{cmd::Cmder}' ||
				Ir.env.TERM_PROGRAM === 'Terminus-Sublime' ||
				Ir.env.TERM_PROGRAM === 'vscode' ||
				Ir.env.TERM === 'xterm-256color' ||
				Ir.env.TERM === 'alacritty' ||
				Ir.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}
var VD = WD();
var Q = (r, i) => (VD ? r : i),
	YD = Q('◆', '*'),
	ED = Q('■', 'x'),
	KD = Q('▲', 'x'),
	QD = Q('◇', 'o'),
	TD = Q('┌', 'T'),
	x = Q('│', '|'),
	Rr = Q('└', '—'),
	Pz = Q('┐', 'T'),
	jz = Q('┘', '—'),
	$U = Q('●', '>'),
	uU = Q('○', ' '),
	Jz = Q('◻', '[•]'),
	Lz = Q('◼', '[+]'),
	Gz = Q('◻', '[ ]'),
	HD = Q('▪', '•'),
	Xz = Q('─', '-'),
	Oz = Q('╮', '+'),
	qz = Q('├', '+'),
	Wz = Q('╯', '+'),
	Vz = Q('╰', '+'),
	Yz = Q('╭', '+'),
	Ez = Q('●', '•'),
	Kz = Q('◆', '*'),
	Qz = Q('▲', '!'),
	Tz = Q('■', 'x'),
	co = (r) => {
		switch (r) {
			case 'initial':
			case 'active':
				return L('cyan', YD);
			case 'cancel':
				return L('red', ED);
			case 'error':
				return L('yellow', KD);
			case 'submit':
				return L('green', QD);
		}
	};
var BD = '\x07',
	tD = '[',
	MD = ']';
var AD = `${MD}8;;`,
	Hz = new RegExp(`(?:\\${tD}(?<code>\\d+)m|\\${AD}(?<uri>.*)${BD})`, 'y');
var IU = (r) => {
	let i = r.active ?? 'Yes',
		v = r.inactive ?? 'No';
	return new lo({
		active: i,
		inactive: v,
		signal: r.signal,
		input: r.input,
		output: r.output,
		initialValue: r.initialValue ?? !0,
		render() {
			let u = r.withGuide ?? vr.withGuide,
				n = `${
					u
						? `${L('gray', x)}
`
						: ''
				}${co(this.state)}  ${r.message}
`,
				$ = this.value ? i : v;
			switch (this.state) {
				case 'submit': {
					let g = u ? `${L('gray', x)}  ` : '';
					return `${n}${g}${L('dim', $)}`;
				}
				case 'cancel': {
					let g = u ? `${L('gray', x)}  ` : '';
					return `${n}${g}${L(['strikethrough', 'dim'], $)}${
						u
							? `
${L('gray', x)}`
							: ''
					}`;
				}
				default: {
					let g = u ? `${L('cyan', x)}  ` : '',
						I = u ? L('cyan', Rr) : '';
					return `${n}${g}${this.value ? `${L('green', $U)} ${i}` : `${L('dim', uU)} ${L('dim', i)}`}${
						r.vertical
							? u
								? `
${L('cyan', x)}  `
								: `
`
							: ` ${L('dim', '/')} `
					}${this.value ? `${L('dim', uU)} ${L('dim', v)}` : `${L('green', $U)} ${v}`}
${I}
`;
				}
			}
		}
	}).prompt();
};
var Nr = (r = '', i) => {
		let v = i?.output ?? process.stdout,
			u = (i?.withGuide ?? vr.withGuide) ? `${L('gray', Rr)}  ` : '';
		v.write(`${u}${L('red', r)}

`);
	},
	oU = (r = '', i) => {
		let v = i?.output ?? process.stdout,
			u = (i?.withGuide ?? vr.withGuide) ? `${L('gray', TD)}  ` : '';
		v.write(`${u}${r}
`);
	},
	bU = (r = '', i) => {
		let v = i?.output ?? process.stdout,
			u =
				(i?.withGuide ?? vr.withGuide)
					? `${L('gray', x)}
${L('gray', Rr)}  `
					: '';
		v.write(`${u}${r}

`);
	};
var So = (r) =>
	new ko({
		validate: r.validate,
		mask: r.mask ?? HD,
		signal: r.signal,
		input: r.input,
		output: r.output,
		render() {
			let i = r.withGuide ?? vr.withGuide,
				v = `${
					i
						? `${L('gray', x)}
`
						: ''
				}${co(this.state)}  ${r.message}
`,
				u = this.userInputWithCursor,
				n = this.masked;
			switch (this.state) {
				case 'error': {
					let $ = i ? `${L('yellow', x)}  ` : '',
						g = i ? `${L('yellow', Rr)}  ` : '',
						I = n ?? '';
					return (
						r.clearOnError && this.clear(),
						`${v.trim()}
${$}${I}
${g}${L('yellow', this.error)}
`
					);
				}
				case 'submit': {
					let $ = i ? `${L('gray', x)}  ` : '',
						g = n ? L('dim', n) : '';
					return `${v}${$}${g}`;
				}
				case 'cancel': {
					let $ = i ? `${L('gray', x)}  ` : '',
						g = n ? L(['strikethrough', 'dim'], n) : '';
					return `${v}${$}${g}${
						n && i
							? `
${L('gray', x)}`
							: ''
					}`;
				}
				default: {
					let $ = i ? `${L('cyan', x)}  ` : '',
						g = i ? L('cyan', Rr) : '';
					return `${v}${$}${u}
${g}
`;
				}
			}
		}
	}).prompt();
var Bz = { light: Q('─', '-'), heavy: Q('━', '='), block: Q('█', '#') };
var tz = `${L('gray', x)}  `;
var Pn = (r) =>
	new Do({
		validate: r.validate,
		placeholder: r.placeholder,
		defaultValue: r.defaultValue,
		initialValue: r.initialValue,
		output: r.output,
		signal: r.signal,
		input: r.input,
		render() {
			let i = r?.withGuide ?? vr.withGuide,
				v = `${`${
					i
						? `${L('gray', x)}
`
						: ''
				}${co(this.state)}  `}${r.message}
`,
				u = r.placeholder
					? L('inverse', r.placeholder[0]) + L('dim', r.placeholder.slice(1))
					: L(['inverse', 'hidden'], '_'),
				n = this.userInput ? this.userInputWithCursor : u,
				$ = this.value ?? '';
			switch (this.state) {
				case 'error': {
					let g = this.error ? `  ${L('yellow', this.error)}` : '',
						I = i ? `${L('yellow', x)}  ` : '',
						b = i ? L('yellow', Rr) : '';
					return `${v.trim()}
${I}${n}
${b}${g}
`;
				}
				case 'submit': {
					let g = $ ? `  ${L('dim', $)}` : '',
						I = i ? L('gray', x) : '';
					return `${v}${I}${g}`;
				}
				case 'cancel': {
					let g = $ ? `  ${L(['strikethrough', 'dim'], $)}` : '',
						I = i ? L('gray', x) : '';
					return `${v}${I}${g}${
						$.trim()
							? `
${I}`
							: ''
					}`;
				}
				default: {
					let g = i ? `${L('cyan', x)}  ` : '',
						I = i ? L('cyan', Rr) : '';
					return `${v}${g}${n}
${I}
`;
				}
			}
		}
	}).prompt();
import * as _U from 'node:fs/promises';
var Vr = F.object({
		name: F.string().min(1).default('namepending'),
		public_url: F.string().default('$URL'),
		public_name: F.string().default('$NAME'),
		url: F.url({ protocol: /^https?$/, hostname: F.regexes.domain }),
		postgres_pass: F.string()
			.min(8)
			.default(crypto.getRandomValues(new Uint8Array(32)).toHex()),
		minio_user: F.string().default('minioadmin'),
		minio_pass: F.string()
			.min(8)
			.default(crypto.getRandomValues(new Uint8Array(32)).toHex()),
		traefik_dashboard: F.boolean().default(!1),
		traefik_dashboard_port: F.int().min(1024).max(65535).default(8781),
		traefik_web_port: F.int().min(1024).max(65535).default(8778),
		app_secret: F.string()
			.min(32)
			.default(crypto.getRandomValues(new Uint8Array(32)).toHex())
	}),
	UU = new Bo();
UU.name('namepending-setup')
	.description('hopefully an easier way to set up environment variables')
	.action(FD);
UU.parse();
async function FD() {
	oU(wo.default.inverse('Namepending Setup'));
	let r = await Pn({
		message: 'What is the name of your panel?',
		validate(o) {
			let _ = Vr.shape.name.safeParse(o);
			return _.success ? void 0 : F.prettifyError(_.error);
		}
	});
	if (gr(r)) (Nr('Setup cancelled'), process.exit(0));
	let i = await Pn({
		message: 'What is the URL of the panel',
		validate(o) {
			let _ = Vr.shape.url.safeParse(o);
			return _.success ? void 0 : F.prettifyError(_.error);
		}
	});
	if (gr(i)) (Nr('Setup cancelled'), process.exit(0));
	let v = await So({
		message: 'Password for Postgres (will be generated if empty)',
		mask: '*',
		clearOnError: !0,
		validate(o) {
			let _ = Vr.shape.postgres_pass.safeParse(o);
			return _.success ? void 0 : F.prettifyError(_.error);
		}
	});
	if (gr(v)) (Nr('Setup cancelled'), process.exit(0));
	let u = await Pn({
		message: 'Username for Minio (default: minioadmin)',
		initialValue: 'minioadmin',
		validate(o) {
			let _ = Vr.shape.minio_user.safeParse(o);
			return _.success ? void 0 : F.prettifyError(_.error);
		}
	});
	if (gr(u)) (Nr('Setup cancelled'), process.exit(0));
	let n = await So({
		message: 'Password for Minio (will be generated if empty)',
		mask: '*',
		clearOnError: !0,
		validate(o) {
			let _ = Vr.shape.minio_pass.safeParse(o);
			return _.success ? void 0 : F.prettifyError(_.error);
		}
	});
	if (gr(n)) (Nr('Setup cancelled'), process.exit(0));
	let $ = await IU({ message: 'Do you want to enable the Traefik dashboard?', initialValue: !1 });
	if (gr($)) (Nr('Setup cancelled'), process.exit(0));
	let g = await Pn({
		message: 'Port for Traefik dashboard (default: 8781)',
		initialValue: '8781',
		validate(o) {
			let _ = Vr.shape.traefik_dashboard_port.safeParse(Number(o));
			return _.success ? void 0 : F.prettifyError(_.error);
		}
	});
	if (gr(g)) (Nr('Setup cancelled'), process.exit(0));
	let I = await Pn({
		message: 'Port for Traefik web entrypoint (default: 8778)',
		initialValue: '8778',
		validate(o) {
			let _ = Vr.shape.traefik_web_port.safeParse(Number(o));
			return _.success ? void 0 : F.prettifyError(_.error);
		}
	});
	if (gr(I)) (Nr('Setup cancelled'), process.exit(0));
	let b = Vr.parse({
		url: i,
		postgres_pass: v,
		minio_user: u,
		minio_pass: n,
		traefik_dashboard: $,
		traefik_dashboard_port: Number(g),
		traefik_web_port: Number(I)
	});
	(_U.writeFile(
		'.env',
		Object.entries(b).map(([o, _]) => `${o.toUpperCase()}=${_}`).join(`
`)
	),
		bU(wo.default.green('Setup completed! .env file has been created with the provided values.')));
}
