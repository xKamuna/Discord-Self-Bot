const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rplargetextCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rplargetext',
      memberName: 'rplargetext',
      group: 'settings',
      aliases: ['largetext', 'ltext'],
      description: 'Set your Rich Presence largetext',
      format: 'LargeText',
      examples: ['rplargetext See the website'],
      guildOnly: false,
      args: [
        {
          key: 'largetext',
          prompt: 'What is the largetext string for your richpresence?',
          type: 'string',
          label: 'largetext',
          validate: (largetext) => {
            if (Buffer.byteLength(largetext, 'utf8') <= 128) {
              return true;
            }

            return 'The largetext string cannot be longer than 128 bytes';
          }
        }
      ]
    });
  }
	
  run (msg, args) {
    this.client.provider.set('global', 'rplargetext', args.largetext);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence LargeText has been set to \`${args.largetext}\``);
  }
};