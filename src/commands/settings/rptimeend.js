const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpTimeEndCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rptimeend',
      memberName: 'rptimeend',
      group: 'settings',
      aliases: ['timeend', 'endtime', 'rptime', 'rpend'],
      description: 'Set your Rich Presence End Timestamp',
      details: 'Make sure to enable timestamp with the `rptoggletimeend` command',
      format: 'HoursAmount',
      examples: ['rptimeend 2'],
      guildOnly: false,
      args: [
        {
          key: 'time',
          prompt: 'How many hours in the future do you want the timer to end?',
          type: 'integer',
          label: 'endtime',
          validate: (time) => {
            if (time <= 24) {
              return true;
            }

            return 'Rich Presence time has to end within 24 hours';
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rptimeend', args.time);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence End Timestamp has been set to \`${args.time} hour(s)\``);
  }
};