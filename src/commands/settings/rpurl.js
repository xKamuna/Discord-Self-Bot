const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpurlCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpurl',
      memberName: 'rpurl',
      group: 'settings',
      aliases: ['url'],
      description: 'Set your Rich Presence URL',
      examples: ['rpurl https://twitch.tv/favna'],
      format: 'url',
      guildOnly: false,
      args: [
        {
          key: 'url',
          prompt: 'What is the Type you want for your Rich Presence?',
          type: 'string',
          label: 'url',
          validate: (url) => {
            // eslint-disable-next-line max-len
            if (/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(url)) {
              return true;
            }

            return 'Has to be a valid URL';
          }
        }
      ]
    });
  }

  run (msg, {url}) {
    this.client.provider.set('global', 'rpurl', url);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence URL has been set to \`${url}\``);
  }
};