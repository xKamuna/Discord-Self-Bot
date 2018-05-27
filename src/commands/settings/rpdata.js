const Discord = require('discord.js'),
  {Command} = require('discord.js-commando'),
  {deleteCommandMessages, momentFormat} = require('../../util.js');

module.exports = class rpdataCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpdata',
      memberName: 'rpdata',
      group: 'settings',
      aliases: ['rdata'],
      description: 'View your currently set Rich Presence data',
      examples: ['rpdata'],
      guildOnly: false
    });
  }

  run (msg) {
    const rpEmbed = new Discord.MessageEmbed();

    rpEmbed
      .setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
      .setFooter(`Rich Presence data on ${momentFormat(new Date(), this.client)}`)
      .setAuthor(`${this.client.user.tag} (${this.client.user.id})`)
      .setDescription(this.client.provider.get('global', 'rptoggle', false) ? 'Rich Presence Data' : 'Presence Data')
      .setThumbnail(this.client.provider.get('global', 'rptoggle', false)
        ? `https://cdn.discordapp.com/app-assets/${this.client.provider.get('global', 'rpappid')}/${this.client.provider.get('global', 'rpsmallimage')}.png`
        : this.client.user.displayAvatarURL({format: 'png'}))
      .setImage(this.client.provider.get('global', 'rptoggle', false)
        ? `https://cdn.discordapp.com/app-assets/${this.client.provider.get('global', 'rpappid')}/${this.client.provider.get('global', 'rplargeimage')}.png`
        : 'https://favna.xyz/images/appIcons/selfbot.png')
      .addField('Name', this.client.provider.get('global', 'rpname', 'None Set'), true)
      .addField('Type', this.client.provider.get('global', 'rptype', 'None Set'), true)
      .addField('URL', this.client.provider.get('global', 'rpurl', 'None Set'), true)
      .addField('Application', this.client.provider.get('global', 'rpappid', 'None Set'), true)
      .addField('Details', this.client.provider.get('global', 'rpdetails', 'None Set'), true)
      .addField('State', this.client.provider.get('global', 'rpstate', 'None Set'), true)
      .addField('Large Image', this.client.provider.get('global', 'rplargeimage', 'None Set'), true)
      .addField('Small Image', this.client.provider.get('global', 'rpsmallimage', 'None Set'), true)
      .addField('Large Image Text', this.client.provider.get('global', 'rplargetext', 'None Set'), true)
      .addField('Small Image Text', this.client.provider.get('global', 'rpsmalltext', 'None Set'), true)
      .addField('Party Minimum', this.client.provider.get('global', 'rppartysize')
        ? this.client.provider.get('global', 'rppartysize')[0]
        : 'None Set', true)
      .addField('Party Maximum', this.client.provider.get('global', 'rppartysize')
        ? this.client.provider.get('global', 'rppartysize')[1]
        : 'None Set', true)
      .addField('End Time Enabled', this.client.provider.get('global', 'rptoggletimeend', 'Disabled'), true)
      .addField('End Time Duration', this.client.provider.get('global', 'rptimeend', '1'), true)
      .addField('Timestamp', this.client.provider.get('global', 'rptimestamptoggle', 'Disabled'), true)
      .addField('Rich Presences Enabled', this.client.provider.get('global', 'rptoggle', 'Disabled'), true);

    deleteCommandMessages(msg, this.client);

    return msg.embed(rpEmbed);
  }
};