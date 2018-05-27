const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rplargeimageCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rplargeimage',
      memberName: 'rplargeimage',
      group: 'settings',
      aliases: ['largeimage', 'limage'],
      description: 'Set your Rich Presence LargeImage ID',
      format: 'LargeImageID|LargeImageName',
      examples: ['rplargeimage 379734851206512640'],
      guildOnly: false,
      args: [
        {
          key: 'largeimage',
          prompt: 'What is the LargeImageID for the "large" Rich Presence image you want?',
          type: 'string',
          label: 'largeimageID'
        }
      ]
    });
  }

  /* eslint max-depth: ["error", 5]*/

  async run (msg, args) {
    const appID = this.client.provider.get('global', 'rpappid');

    if (appID) {
      const application = await this.client.fetchApplication(appID);

      if (application) {
        const assets = await application.fetchAssets();

        if (assets) {
          const array = [];

          if (assets.length === 0) {
            return msg.reply(`No assets found in application with ID \`${appID}\``);
          }
          for (const i in assets) {
            if (assets[i].type === 'BIG') {
              array.push({
                id: assets[i].id,
                name: assets[i].name
              });
            }
          }

          const id = array.find(o => o.id === args.largeimage), // eslint-disable-line one-var
            name = array.find(o => o.name === args.largeimage);
          let imageID = '';

          if (id) {
            imageID = id.id;
          } else if (name) {
            imageID = name.id;
          }

          if (!imageID) {
            return msg.reply(`Can't find \`${args.largeimage}\` in application with ID \`${appID}\``);
          }

          this.client.provider.set('global', 'rplargeimage', imageID);
					
          deleteCommandMessages(msg, this.client);

          return msg.reply(oneLine`Your RichPresence LargeImageID has been set to \`${args.largeimage}\``);
        }

        return msg.reply(`No assets found in application with ID \`${appID}\``);
      }

      return msg.reply(oneLine`An error occurred fetching that application. Are you sure the ID is correct? Set it with the \`${msg.guild
        ? msg.guild.commandPrefix 
        : this.client.commandPrefix}rpappid\`command `);
    }

    return msg.reply(`You first need to set your application with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}rpappid\` command!`);
  }
};