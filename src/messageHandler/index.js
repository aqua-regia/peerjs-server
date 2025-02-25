const { MessageType } = require('../enums');

class MessageHandlers {
  constructor ({ realm }) {
    this.handlers = {};
  }

  registerHandler (messageType, handler) {
    this.handlers[messageType] = handler;
  }

  handle (client, message) {
    const { type } = message;

    const handler = this.handlers[type];

    if (!handler) {
      return;
    }

    handler(client, message);
  }
}
module.exports = ({ realm }) => {
  const transmissionHandler = require('./handlers/transmission')({ realm });

  const messageHandlers = new MessageHandlers({ realm });

  const handleTransmission = (client, message) => {
    transmissionHandler(client, {
      type: message.type,
      src: message.src,
      dst: message.dst,
      payload: message.payload
    });
  };

  const handleHeartbeat = (client, message) => {

  };

  const handleInit = (client, message) => {
    transmissionHandler(client, {
      type: message.type,
      src: message.src,
      dst: message.dst,
      payload: message.payload
    })
  }

  messageHandlers.registerHandler(MessageType.HEARTBEAT, handleHeartbeat);
  messageHandlers.registerHandler(MessageType.OFFER, handleTransmission);
  messageHandlers.registerHandler(MessageType.ANSWER, handleTransmission);
  messageHandlers.registerHandler(MessageType.CANDIDATE, handleTransmission);
  messageHandlers.registerHandler(MessageType.LEAVE, handleTransmission);
  messageHandlers.registerHandler(MessageType.EXPIRE, handleTransmission);
  messageHandlers.registerHandler(MessageType.DATA, handleInit);
  return (client, message) => messageHandlers.handle(client, message);
};
