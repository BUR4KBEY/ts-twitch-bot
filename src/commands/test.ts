import { ChatUserstate, Client } from "tmi.js";
import { ICommand, ICommandConfig, ICommandRequire } from "../utils/interfaces";

export class TestCommand implements ICommand {
    config: ICommandConfig = {
        name: "test",
        aliases: [],
        cooldown: false,
        enabled: true
    };

    require: ICommandRequire = {
        developer: true,
        mod: false
    };

    onTriggered = async (client: Client, channel: string, state: ChatUserstate, message: string, args: Array<string>) => {
        client.say(channel, `@${state.username}, test command works!`);
    }
}