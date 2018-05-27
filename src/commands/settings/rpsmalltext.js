const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpsmalltextCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpsmalltext',
      memberName: 'rpsmalltext',
      group: 'settings',
      aliases: ['smalltext', 'smalltext'],
      description: 'Set your Rich Presence smalltext',
      format: 'SmallText',
      examples: ['rpsmalltext Or the GitHub'],
      guildOnly: false,
      args: [
        {
          key: 'smalltext',
          prompt: 'What is the smalltext string for your richpresence?',
          type: 'string',
          label: 'smalltext',
          validate: (smalltext) => {
            if (Buffer.byteLength(smalltext, 'utf8') <= 128) {
              return true;
            }

            return 'The smalltext string cannot be longer than 128 bytes';
          }
        }
      ]
    });
  }

  run (msg, {smalltext}) {
    this.client.provider.set('global', 'rpsmalltext', smalltext);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence SmallText has been set to \`${smalltext}\``);
  }
};