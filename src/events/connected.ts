import { IEvent } from "../utils/interfaces";
import { Events } from "tmi.js";
import { ClientLogger } from "../utils/loggers";

export default class ConnectedEvent implements IEvent {
    name: keyof Events = "connected";

    onTriggered = async () => ClientLogger.log("SUCCESS", "Connected!");
}