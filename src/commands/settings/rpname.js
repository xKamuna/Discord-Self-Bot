const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpnameCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpname',
      memberName: 'rpname',
      group: 'settings',
      aliases: ['name'],
      description: 'Set your Rich Presence name',
      format: 'NameText',
      examples: ['rpname Discord-Self-Bot'],
      guildOnly: false,
      args: [
        {
          key: 'name',
          prompt: 'What is the activity for your richpresence?',
          type: 'string',
          label: 'name',
          validate: (name) => {
            if (Buffer.byteLength(name, 'utf8') <= 128) {
              return true;
            }

            return 'The name string cannot be longer than 128 bytes';
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rpname', args.name);
		
    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence Name has been set to \`${args.name}\``);
  }
};