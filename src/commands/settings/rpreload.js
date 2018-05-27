/**
 * @file Settings RPReloadCommand - Reload and set your Rich Presence  
 * **Aliases**: `setpresence`, `setrp`, `rpset`
 * @module
 * @category settings
 * @name rpreload
 * @returns {Message} Confirmation the rich presence was reloaded
 */

const {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RPReloadCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpreload',
      memberName: 'rpreload',
      group: 'settings',
      aliases: ['setpresence', 'setrp', 'rpset'],
      description: 'Reload and set your Rich Presence',
      examples: ['rpreload'],
      guildOnly: false
    });
  }

  addHours (date, h) {
    return date.getTime() + h * 60 * 60 * 1000;
  }

  run (msg) {
    if (this.client.provider.get('global', 'rptoggle', false)) {
      this.client.user.setPresence({
        activity: {
          application: this.client.provider.get('global', 'rpappid', ''),
          name: this.client.provider.get('global', 'rpname', ''),
          type: this.client.provider.get('global', 'rptype', ''),
          url: this.client.provider.get('global', 'rpurl', ''),
          details: this.client.provider.get('global', 'rpdetails', ''),
          state: this.client.provider.get('global', 'rpstate', ''),
          timestamps: this.client.provider.get('global', 'rptimestamptoggle', false) ? {
            start: Date.now(),
            end: this.client.provider.get('global', 'rptoggletimeend', true) ? this.addHours(new Date(), this.client.provider.get('global', 'rptimeend', 1)) : ''
          } : '',
          assets: {
            largeImage: this.client.provider.get('global', 'rplargeimage', ''),
            smallImage: this.client.provider.get('global', 'rpsmallimage', ''),
            largeText: this.client.provider.get('global', 'rplargetext', ''),
            smallText: this.client.provider.get('global', 'rpsmalltext', '')
          }
        }
      });
    } else {
      this.client.user.setPresence({
        activity: {
          name: this.client.provider.get('global', 'rptoggle', ''),
          type: this.client.provider.get('global', 'rptoggle', ''),
          url: this.client.provider.get('global', 'rptoggle', '')
        }
      });
    }

    deleteCommandMessages(msg, this.client);

    return msg.reply(`Your Rich Presence has been set! You can view your activity with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}activity\` command`);
  }
};