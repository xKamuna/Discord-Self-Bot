const Database = require('better-sqlite3'),
  path = require('path'),
  snek = require('snekfetch'),
  {Client, SyncSQLiteProvider} = require('discord.js-commando'),
  {WebhookClient, MessageEmbed} = require('discord.js'),
  {oneLine, stripIndents} = require('common-tags');

class DiscordSelfBot {
  constructor (token) {
    this.token = token;
    this.client = new Client({
      owner: process.env.owner,
      commandPrefix: (/(?:favna)/gim).test(process.env.prefix) ? '$' : process.env.prefix,
      selfbot: true,
      unknownCommandResponse: false
    });
  }

  onCommandPrefixChange () {
    return (guild, prefix) => {
      console.log(oneLine` 
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    };
  }

  onReady () {
    return () => {
      console.log(stripIndents`Client ready
			logged in as ${this.client.user.tag} (${this.client.user.id})
			Prefix set to ${this.client.commandPrefix}
			Use ${this.client.commandPrefix}help to view the commands list!`);
      this.client.user.setAFK(true); // Set bot to AFK to enable mobile notifications

      if (process.env.heroku) {
        setInterval(async () => {
          await snek.get(`${process.env.heroku}.herokuapp.com`);
        }, 1500000);
      }
    };
  }

  onMessage () {
    return (msg) => {

      if (this.client.provider.get('global', 'webhooktoggle', false) && msg.author.id !== process.env.owner && !msg.mentions.users.get(process.env.owner)) {
        const hookClient = new WebhookClient(process.env.webhookid, process.env.webhooktoken, {disableEveryone: true}),
          mentionEmbed = new MessageEmbed(),
          regexpExclusions = [],
          regexpKeywords = [],
          wnsExclusions = this.client.provider.get('global', 'webhookexclusions', ['none']),
          wnsKeywords = this.client.provider.get('global', 'webhookkeywords', ['username', 'nickname']);

        for (const keyword in wnsKeywords) {
          const regex = new RegExp(`.*${wnsKeywords[keyword]}.*`, 'im');

          regexpKeywords.push(regex);
        }

        for (const exclusion in wnsExclusions) {
          const regex = new RegExp(`.*${wnsExclusions[exclusion]}.*`, 'im');

          regexpExclusions.push(regex);
        }

        if (regexpKeywords.find(rx => rx.test(msg.cleanContent))) {

          if (!regexpExclusions.find(rx => rx.test(msg.cleanContent))) {
            mentionEmbed
              .setAuthor(msg.channel.type === 'text'
                ? `${msg.member ? msg.member.displayName : 'someone'} dropped your name in #${msg.channel.name} in ${msg.guild.name}`
                : `${msg.author.username} sent a message with your name`, msg.author.displayAvatarURL())
              .setFooter('Message date')
              .setTimestamp(msg.createdAt)
              .setColor(msg.member ? msg.member.displayHexColor : '#7CFC00')
              .setThumbnail(msg.author.displayAvatarURL())
              .addField('Message Content', msg.cleanContent.length > 1024 ? msg.cleanContent.slice(0, 1024) : msg.cleanContent)
              .addField('Message Attachments', msg.attachments.first() && msg.attachments.first().url ? msg.attachments.map(au => au.url) : 'None');

            hookClient.send(`Stalkify away <@${process.env.owner}>`, {embeds: [mentionEmbed]}).catch(console.error);
          }
        }
      }
    };
  }

  init () {
    this.client
      .on('commandPrefixChange', this.onCommandPrefixChange())
      .on('message', this.onMessage())
      .on('ready', this.onReady());

    const db = new Database(path.join(__dirname, 'data/databases/settings.sqlite3'));

    this.client.setProvider(
      new SyncSQLiteProvider(db)
    );

    this.client.registry
      .registerGroups([
        ['games', 'Games - Play some games'],
        ['info', 'Info - Discord info at your fingertips'],
        ['searches', 'Searches - Browse the web and find results'],
        ['leaderboards', 'Leaderboards - View leaderboards from various games'],
        ['pokemon', 'Pokemon - Let Dexter answer your questions'],
        ['extra', 'Extra - Extra! Extra! Read All About It! Only Two Cents!'],
        ['images', 'Images - Send emojis and memes directly to the chat'],
        ['quoting', 'Quoting - Quote other users to really reply to them'],
        ['nsfw', 'NSFW - For all you dirty minds ( ͡° ͜ʖ ͡°)'],
        ['settings', 'Settings - Control the settings the bot has for you']
      ])
      .registerDefaultGroups()
      .registerDefaultTypes()
      .registerDefaultCommands({
        help: true,
        prefix: true,
        ping: false,
        eval_: true,
        commandState: true
      })
      .registerCommandsIn(path.join(__dirname, 'commands'));

    return this.client.login(this.token);
  }
}

module.exports = DiscordSelfBot;