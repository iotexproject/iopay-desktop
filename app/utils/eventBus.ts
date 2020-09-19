import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';

interface MessageEvents {
  'client.inited': () => void;
}

export const eventBus = new EventEmitter() as TypedEmitter<MessageEvents>;
