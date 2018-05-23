/* eslint-disable one-var */

const deleteCommandMessages = function (msg, client) { // eslint-disable-line consistent-return
  if (msg.deletable && client.provider.get('global', 'deletecommandmessages', false)) {
    return msg.delete();
  }
};

const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

module.exports = {
  capitalizeFirstLetter,
  deleteCommandMessages
};