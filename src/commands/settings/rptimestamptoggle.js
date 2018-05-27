const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rptimestamptoggleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rptimestamptoggle',
      memberName: 'rptimestamptoggle',
      group: 'settings',
      aliases: ['timetoggle', 'tst', 'rptimestamp'],
      description: 'Configure whether you want a timestamp in your Rich Presence',
      format: 'enable|disable',
      examples: ['rptimestamptoggle enable'],
      guildOnly: false,
      args: [
        {
          key: 'option',
          prompt: 'Enable or disable the timestamp in rich presences?',
          type: 'boolean',
          label: 'Option for toggling',
          validate: (bool) => {
            const validBools = ['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+', 'false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-'];

            if (validBools.includes(bool.toLowerCase())) {
              return true;
            }

            return `Has to be one of ${validBools.join(', ')}`;
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rptimestamptoggle', args.option);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`The Timestamp in Rich Presence is now ${args.option 
      ? 'enabled' 
      : 'disabled'}. Run ${msg.guild 
      ? msg.guild.commandPrefix 
      : this.client.commandPrefix}rpreload to reload your presence.`);
  }
};