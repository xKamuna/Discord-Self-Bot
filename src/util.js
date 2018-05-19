/* eslint-disable one-var */

const deleteCommandMessages = function (msg, client) { // eslint-disable-line consistent-return
  if (msg.deletable && client.provider.get('global', 'deletecommandmessages', false)) {
    return msg.delete();
  }
};

const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const stopTyping = function (msg) {
  msg.channel.stopTyping(true);
};

const startTyping = function (msg) {
  msg.channel.startTyping(1);
};

module.exports = {
  capitalizeFirstLetter,
  deleteCommandMessages,
  stopTyping,
  startTyping
};