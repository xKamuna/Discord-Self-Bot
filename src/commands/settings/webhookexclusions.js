const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class webhookexclusionsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'webhookexclusions',
      memberName: 'webhookexclusions',
      group: 'settings',
      aliases: ['whe', 'hookexclusions'],
      description: 'Configure the keywords to be avoided in your Webhook Notification System (WNS)',
      format: 'user,name,nick,name',
      examples: ['webhookexclusions Fantasy'],
      guildOnly: false,
      args: [
        {
          key: 'exclusions',
          prompt: 'What keyword should be filtered for Webhook Notification System?',
          type: 'string',
          label: 'exclusions for WNS'
        }
      ]
    });
  }

  run (msg, {exclusions}) {
    this.client.provider.set('global', 'webhookexclusions', exclusions.split(','));

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`\`${exclusions.replace(/,/gim, ', ')}\` excluded from WNS. 
        Make sure to enable webhooks with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhooktoggle\`
        and set your keywords with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhookkeywords\` command`);
  }
};