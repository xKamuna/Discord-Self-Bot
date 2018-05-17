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

const Discord = require('discord.js'),
  {Command} = require('discord.js-commando'),
  maljs = require('maljs'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class animeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'anime',
      memberName: 'anime',
      group: 'search',
      aliases: ['ani', 'mal'],
      description: 'Finds anime on MyAnimeList',
      format: 'AnimeName',
      examples: ['anime Pokemon'],
      guildOnly: false,
      args: [
        {
          key: 'query',
          prompt: 'What anime do you want to find?',
          type: 'string'
        }
      ]
    });
  }

  async run (msg, args) {
    const aniEmbed = new Discord.MessageEmbed(),
      res = await maljs.quickSearch(args.query, 'anime');

    if (res) {
      const anime = await res.anime[0].fetch();

      if (anime) {

        aniEmbed
          .setColor(msg.guild ? msg.member.displayHexColor : '#FF0000')
          .setTitle(anime.title)
          .setImage(anime.cover)
          .setDescription(anime.description)
          .setURL(`${anime.mal.url}${anime.path}`)
          .addField('Score', anime.score, true)
          .addField('Popularity', anime.popularity, true)
          .addField('Rank', anime.ranked, true);

        deleteCommandMessages(msg, this.client);

        msg.embed(aniEmbed, `${anime.mal.url}${anime.path}`);
      }
    }
  }
};