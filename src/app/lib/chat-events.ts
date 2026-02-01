import { EventEmitter } from 'events';

const globalForEvents = global as unknown as { chatEmitter: EventEmitter };

export const chatEmitter = globalForEvents.chatEmitter || new EventEmitter();

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.chatEmitter = chatEmitter;
}

chatEmitter.setMaxListeners(100);