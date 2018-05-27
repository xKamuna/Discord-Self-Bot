const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpstateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpstate',
      memberName: 'rpstate',
      group: 'settings',
      aliases: ['state'],
      description: 'Set your Rich Presence state',
      format: 'StateText',
      examples: ['rpstate https://favna.xyz/selfbot'],
      guildOnly: false,
      args: [
        {
          key: 'state',
          prompt: 'What is the state string for your richpresence?',
          type: 'string',
          label: 'state',
          validate: (state) => {
            if (Buffer.byteLength(state, 'utf8') <= 128) {
              return true;
            }

            return 'The state string cannot be longer than 128 bytes';
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rpstate', args.state);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence State has been set to \`${args.state}\``);
  }
};