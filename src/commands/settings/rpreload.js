const {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpreloadCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpreload',
      memberName: 'rpreload',
      group: 'settings',
      aliases: ['setpresence', 'setrp', 'rpset'],
      description: 'Reload your RichPresence data',
      examples: ['rpreload'],
      guildOnly: false
    });
  }

  addHours (date, h) {
    return date.getTime() + h * 60 * 60 * 1000;
  }

  run (msg) {
    if (!this.client.provider.get('global', 'rptoggle', false)) {
      this.client.user.setPresence({
        activity: {
          name: this.client.provider.get('global', 'rptoggle', 'Discord-Self-Bot'),
          type: this.client.provider.get('global', 'rptoggle', 'PLAYING'),
          url: this.client.provider.get('global', 'rptoggle', null)
        }
      });
    } else {
      this.client.user.setPresence({
        activity: {
          application: this.client.provider.get('global', 'rpappid', '355326429178757131'),
          name: this.client.provider.get('global', 'rpname', 'Discord-Self-Bot'),
          type: this.client.provider.get('global', 'rptype', 'WATCHING'),
          url: this.client.provider.get('global', 'rpurl', null),
          details: this.client.provider.get('global', 'rpdetails', 'Made by Favna'),
          state: this.client.provider.get('global', 'rpstate', 'https://favna.xyz/selfbot'),
          timestamps: this.client.provider.get('global', 'rptimestamptoggle', false) ? {
            start: Date.now(),
            end: this.client.provider.get('global', 'rptoggletimeend', true) ? this.addHours(new Date(), this.client.provider.get('global', 'rptimeend', 1)) : null
          } : null,
          assets: {
            largeImage: this.client.provider.get('global', 'rplargeimage', '379734851206512640'),
            smallImage: this.client.provider.get('global', 'rpsmallimage', '379734813751377921'),
            largeText: this.client.provider.get('global', 'rplargetext') ? this.client.provider.get('global', 'rplargetext') : null,
            smallText: this.client.provider.get('global', 'rpsmalltext') ? this.client.provider.get('global', 'rpsmalltext') : null
          }
        }
      });
    }

    deleteCommandMessages(msg, this.client);

    return msg.reply(`Your Rich Presence has been set! You can view your activity with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}activity\` command`);
  }
};