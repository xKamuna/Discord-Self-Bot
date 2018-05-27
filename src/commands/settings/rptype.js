const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rptypeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rptype',
      memberName: 'rptype',
      group: 'settings',
      aliases: ['rtyp'],
      description: 'Set your Rich Presence Type',
      format: 'playing|watching|listening|streaming',
      examples: ['rptype PLAYING'],
      guildOnly: false,
      args: [
        {
          key: 'type',
          prompt: 'What is the Type you want for your Rich Presence?',
          type: 'string',
          label: 'typeID',
          validate: (type) => {
            const validTypes = ['playing', 'watching', 'listening', 'streaming'];

            if (validTypes.includes(type.toLowerCase())) {
              return true;
            }

            return `Has to be one of ${validTypes.join(', ')}`;
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rptype', args.type.toUpperCase());

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence Type has been set to \`${args.type}\``);
  }
};