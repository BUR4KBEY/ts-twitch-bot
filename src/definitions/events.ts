import { IEvent } from "../utils/interfaces";
import ConnectedEvent from "../events/connected";
import MessageEvent from "../events/message";

export const events: Array<IEvent> = [
    new ConnectedEvent,
    new MessageEvent
];