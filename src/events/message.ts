import { IEvent } from "../utils/interfaces";
import { ChatUserstate, Client, Events } from "tmi.js";
import { checkTheCommand } from "../utils/checkers";

export default class MessageEvent implements IEvent {
    name: keyof Events = "message";

    onTriggered = async (client: Client, channel: string, state: ChatUserstate, message: string, self: boolean) => {
        if (self) return;
        await checkTheCommand(client, channel, state, message);
    }
}