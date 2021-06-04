import Collection from "@discordjs/collection";
import { Client } from "tmi.js";
import { events } from "../definitions/events";
import { ICommand } from "../utils/interfaces";
import { commands } from "../definitions/commands";
import { Handlers } from "./handlers";

/** Config of the client */
export const config = {
    prefix: "bot_prefix",
    username: "bot_username",
    access_token: "access_token",
    channels: ["channel_1", "channel_2"],
    developers: ["twitch_id_1", "twitch_id_2"]
};

/** The client */
export const client = new Client({
    connection: { reconnect: true, secure: true },
    identity: {
        username: config.username,
        password: `oauth:${config.access_token}`
    },
    channels: config.channels
});

/** Collection of the commands */
export const commandList = new Collection<string, ICommand>();

/** Handling the events */
Handlers.event(client, events);

/** Handling the commands */
Handlers.command(commands);