const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class webhookkeywordsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'webhookkeywords',
      memberName: 'webhookkeywords',
      group: 'settings',
      aliases: ['whk', 'hookwords', 'hookkeywords'],
      description: 'Configure the keywords used in your Webhook Notification System (WNS)',
      format: 'user,name,nick,name',
      examples: ['webhookkeywords Favna,Fanava,Fav'],
      guildOnly: false,
      args: [
        {
          key: 'keywords',
          prompt: 'What keyword should be set for Webhook Notification System?',
          type: 'string',
          label: 'keywords for WNS'
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'webhookkeywords', args.keywords.split(','));
		
    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Webhook Keywords have been set to \`${args.keywords.replace(/,/gim, ', ')}\`. 
        Make sure to enable webhooks with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhooktoggle\`
        and optionally set your word exclusions with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhookexclusions\` command`);
  }
};