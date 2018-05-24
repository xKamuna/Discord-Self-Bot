/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @file Searches CydiaCommand - Gets info from a package on Cydia, only supports default repositories  
 * **Aliases**: `cy`
 * @module
 * @category search
 * @name cydia
 * @example cydia Anemone
 * @param {StringResolvable} TweakName Name of the tweak to find
 * @returns {MessageEmbed} Information about the tweak
 */

const Fuse = require('fuse.js'),
  cheerio = require('cheerio'),
  request = require('snekfetch'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class CydiaCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'cydia',
      memberName: 'cydia',
      group: 'searches',
      aliases: ['cy'],
      description: 'Finds info on a Cydia package',
      format: 'PackageName',
      examples: ['cydia anemone'],
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'deb',
          prompt: 'What package to find?',
          type: 'string'
        }
      ]
    });
  }

  async run (msg, {deb}) {
    const baseURL = 'https://cydia.saurik.com/',
      embed = new MessageEmbed(),
      fsoptions = {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['display', 'name']
      },
      packages = await request.get(`${baseURL}api/macciti`).query('query', deb);

    if (packages.ok) {
      const fuse = new Fuse(packages.body.results, fsoptions),
        results = fuse.search(deb);

      if (results.length) {
        const result = results[0];

        embed
          .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
          .setTitle(result.display)
          .setDescription(result.summary)
          .addField('Version', result.version, true)
          .addField('Link', `[Click Here](${baseURL}package/${result.name})`, true);

        try {
          const price = await request.get(`${baseURL}api/ibbignerd`).query('query', result.name),
            site = await request.get(`${baseURL}package/${result.name}`);

          if (site.ok) {
            const $ = cheerio.load(site.text);

            embed
              .addField('Source', $('.source-name').html(), true)
              .addField('Section', $('#section').html(), true)
              .addField('Size', $('#extra').text(), true);
          }

          if (price.ok) {
            embed.addField('Price', price.body ? `$${price.body.msrp}` : 'Free', true);
          }

          embed.addField('Package Name', result.name, false);
          deleteCommandMessages(msg, this.client);

          return msg.embed(embed);
        } catch (err) {
          console.error(err);

          embed.addField('Package Name', result.name, false);
          deleteCommandMessages(msg, this.client);

          return msg.embed(embed);
        }
      }
    }

    return msg.say(`**Tweak/Theme \`${deb}\` not found!**`);
  }
};