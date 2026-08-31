# Namepending

Name pending duh, also you know what they say (they don't), all roads lead to SCP: Secret Laboratory, literally another mod panel

Namepending is what happens when you want to do something familiar but don't know what else to do, so this was a bit forced but I'm proud of where it's at right now

## Usage

**Setup script requires at least Node v25, Deno v2.5 or Bun v1.1.22**

I ship a dockerfile and docker compose file with pretty much all my projects, it's not quite as self setup anymore but there's the setup.js script right there for use

Run setup.js, `docker compose up -d`, use WEB_PORT as set up in setup script or manual .env in a reverse proxy, first user to sign up will be superuser

## Plugin (important, it's like half of this thing)

[Get latest release](https://github.com/laraproto/Namependingconnector/releases/latest)

Upon adding a server via the administration category, you will get a command you can paste into the console (**after you install the plugin**), will get you set up right up, even without a full server restart

## Showcase Video

Maybe if I get asked about it by a Horizons reviewer, the burnout is starting to hit

## Features

Namepending features a lot of nice convenience features, some menus can be a bit confusing though

- automatic linking with steam profiles in-game (upon connection set up via settings page)
- ban sync
- okay-ish warns page
- player profiles has some simple info (unavailable with DNT enabled)
- user profiles are separate from player profiles, a user can have multiple players linked (using link codes allowing even discord or northwood auth)
- way too complex forms, nice tables

## Demo mode

I shipped a useful but albeit kind of bad demo mode, i'll be running a demo mode for [Horizons reviewers](https://horizons.hackclub.com), Hack Club is very cool and you should totally find a YSWS to participate in

## Contributing

Honestly for what it's worth this is probably one of the easiest to contribute projects I've made, you should be able to get it going quite quickly, but like half of the stuff here is broken without HTTPS, so you better set up caddy with `caddy trust`