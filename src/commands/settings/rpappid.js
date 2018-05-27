const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpappidCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpappid',
      memberName: 'rpappid',
      group: 'settings',
      aliases: ['appid', 'rpapp', 'rpapplication'],
      description: 'Set your Rich Presence app ID',
      format: 'ApplicationID',
      examples: ['rpappid 355326429178757131'],
      guildOnly: false,
      args: [
        {
          key: 'appid',
          prompt: 'What is the ClientID of your Discord application?',
          type: 'string',
          label: 'appid',
          validate: (id) => {
            if (id.length === 18) {
              return true;
            }

            return 'The AppID has to be 18 digits';
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rpappid', args.appid);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence AppID has been set to \`${args.appid}\``);
  }
};