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
 * @file Searches AnimeCommand - Gets information about any anime from MyAnimeList  
 * **Aliases**: `ani`, `mal`
 * @module
 * @category searches
 * @name anime
 * @example anime Yu-Gi-Oh Dual Monsters
 * @param {StringResolvable} AnimeName anime to look up
 * @returns {MessageEmbed} Information about the requested anime
 */

const maljs = require('maljs'),
  {MessageEmbed} = require('discord.js'),
  {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class AnimeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'anime',
      memberName: 'anime',
      group: 'searches',
      aliases: ['ani', 'mal'],
      description: 'Gets information about any anime from MyAnimeList',
      format: 'AnimeName',
      examples: ['anime Yu-Gi-Oh Dual Monsters'],
      guildOnly: false,
      args: [
        {
          key: 'anime',
          prompt: 'What anime do you want to find?',
          type: 'string'
        }
      ]
    });
  }

  async run (msg, {anime}) {
    try {
      const aniEmbed = new MessageEmbed(),
        search = await maljs.quickSearch(anime, 'anime'),
        searchDetails = await search.anime[0].fetch();

      aniEmbed
        .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
        .setTitle(searchDetails.title)
        .setImage(searchDetails.cover)
        .setDescription(searchDetails.description)
        .setURL(`${searchDetails.mal.url}${searchDetails.path}`)
        .addField('Score', searchDetails.score, true)
        .addField('Popularity', searchDetails.popularity, true)
        .addField('Rank', searchDetails.ranked, true);

      deleteCommandMessages(msg, this.client);

      return msg.embed(aniEmbed, `${searchDetails.mal.url}${searchDetails.path}`);
    } catch (err) {
      deleteCommandMessages(msg, this.client);

      return msg.reply(`no anime found for the input \`${anime}\` `);
    }
  }
};