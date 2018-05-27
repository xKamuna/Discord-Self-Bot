const {Command} = require('discord.js-commando'),
  {oneLine, stripIndents} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rptoggletimeendCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rptoggletimeend',
      memberName: 'rptoggletimeend',
      group: 'settings',
      aliases: ['rptoggleend', 'toggleend', 'tte'],
      description: 'Toggle ending timestamp on or off',
      format: 'enable|disable',
      examples: ['rptoggletimeend enable'],
      guildOnly: false,
      args: [
        {
          key: 'option',
          prompt: 'Enable or disable ending timestamps?',
          type: 'boolean',
          label: 'Option for toggling',
          validate: (bool) => {
            const validBools = ['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+', 'false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-'];

            if (validBools.includes(bool.toLowerCase())) {
              return true;
            }

            return stripIndents`Has to be one of ${validBools.map(val => `\`${val}\``).join(', ')}
            Respond with your new selection or`;
          }
        }
      ]
    });
  }

  run (msg, {option}) {
    this.client.provider.set('global', 'rptoggletimeend', option);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Ending timestamps are now ${option 
      ? `enabled Run ${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}rptimeend set your ending timestamp` 
      : 'disabled'}.`);
  }
};