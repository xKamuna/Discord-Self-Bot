/**
 * @file Settings WebhookKeywordsCommand - Configure the keywords to be included in your Webhook Notification System  
 * **Aliases**: `whk`, `hookwords`, `hookkeywords`
 * @module
 * @category settings
 * @name webhookkeywords
 * @example webhookkeywords favna
 * @param {StringResolvable} Keywords The keyword(s) to include in the WNS
 * @returns {Message} Confirmation the setting was stored
 */

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class WebhookKeywordsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'webhookkeywords',
      memberName: 'webhookkeywords',
      group: 'settings',
      aliases: ['whk', 'hookwords', 'hookkeywords'],
      description: 'Configure the keywords to be included in your Webhook Notification System',
      format: 'user,name,nick,name',
      examples: ['webhookkeywords Favna'],
      guildOnly: false,
      args: [
        {
          key: 'keywords',
          prompt: 'What keyword should be set for Webhook Notification System?',
          type: 'string',
          label: 'keywords for WNS',
          infinite: true
        }
      ]
    });
  }

  run (msg, {keywords}) {
    this.client.provider.set('global', 'webhookkeywords', keywords);
		
    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Webhook Keywords have been set to \`${keywords.replace(/,/gim, ', ')}\`. 
        Make sure to enable webhooks with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhooktoggle\`
        and optionally set your word exclusions with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhookexclusions\` command`);
  }
};