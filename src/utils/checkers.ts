import Collection from "@discordjs/collection";
import { ChatUserstate, Client } from "tmi.js";
import { config, commandList as commands } from "../core/client";
import { ICommand } from "./interfaces";

const Cooldowns = new Collection<string, Collection<string, number>>();

/**
 * Checks the message is a command or not.
 * @param client - Client
 * @param channel - Channel
 * @param state - State
 * @param message - Message
 */
export async function checkTheCommand(client: Client, channel: string, state: ChatUserstate, message: string) {
    const prefix = config.prefix;
    if (message.toLocaleLowerCase().indexOf(prefix) !== 0) return;
    const args = message.slice(prefix.length).trim().split(/ +/g);
    const command = (args.shift() as string).toLowerCase();

    try {
        const cmd: ICommand | undefined = commands.get(command) || commands.array().find(cmd => cmd.config.aliases && cmd.config.aliases.includes(command));
        if (!cmd) return;

        const authorId = state["user-id"] as string;

        if (cmd.config.enabled != true) return;
        if (cmd.require.developer && !isDeveloper(authorId)) return;
        if (cmd.require.mod && !isDeveloper(authorId) && !isMod(state)) return;

        if (typeof cmd.config.cooldown == 'number') {
            if (!Cooldowns.has(cmd.config.name)) Cooldowns.set(cmd.config.name, new Collection<string, number>());
            const now = Date.now();
            const timestamps = Cooldowns.get(cmd.config.name);
            const cooldownAmount = cmd.config.cooldown * 1000;

            if (timestamps?.has(authorId)) {
                const currentTime = timestamps.get(authorId);
                if (typeof currentTime != 'undefined') {
                    const expirationTime = currentTime + cooldownAmount;
                    if (now < expirationTime) {
                        const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                        return client.say(channel, `@${state.username} To run the command, you must wait ${timeLeft} more seconds.`)
                    }
                }
            }

            if (!isDeveloper(authorId) && !isMod(state)) {
                timestamps?.set(authorId, now);
                setTimeout(() => {
                    timestamps?.delete(authorId);
                }, cooldownAmount);
            }
        }

        await cmd.onTriggered(client, channel, state, message, args);
    } catch (error: any) { return console.error(error); }
}

/**
 * Checks the user developer or not.
 * @param id - User id
 */
export function isDeveloper(id: string): boolean {
    return config.developers.includes(id);
}

/**
 * Checks the user moderator or not.
 * @param user - User
 */
export function isMod(user: ChatUserstate): boolean {
    return user.mod as boolean;
}

/**
 * Checks the value is array or not.
 * @param value - Any value
 */
export function isArray(value: any): boolean {
    if (Array.isArray(value) && value.length) return true;
    else return false;
}