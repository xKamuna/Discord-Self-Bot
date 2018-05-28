/* eslint-disable one-var */
const arrayClean = function (deleteValue, array) {
  for (let val in array) {
    if (array[val] === deleteValue) {
      array.splice(val, 1);
      val -= 1;
    }
  }

  return array;
};

const deleteCommandMessages = function (msg, client) { // eslint-disable-line consistent-return
  if (msg.deletable && client.provider.get('global', 'deletecommandmessages', false)) {
    return msg.delete();
  }
};

const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const roundNumber = function (num, scale = 0) {
  if (!String(num).includes('e')) {
    return Number(`${Math.round(`${num}e+${scale}`)}e-${scale}`);
  }
  const arr = `${num}`.split('e');
  let sig = '';

  if (Number(arr[1]) + scale > 0) {
    sig = '+';
  }

  return Number(`${Math.round(`${Number(arr[0])}e${sig}${Number(arr[1]) + scale}`)}e-${scale}`);
};

module.exports = {
  arrayClean,
  capitalizeFirstLetter,
  deleteCommandMessages,
  roundNumber
};