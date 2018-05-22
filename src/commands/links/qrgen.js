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

const {Command} = require('discord.js-commando'),
  imgur = require('imgur'),
  qr = require('qrcode'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class qrgenCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'qrgen',
      memberName: 'qrgen',
      group: 'links',
      aliases: ['qr'],
      description: 'Generates a QR code from a given string',
      format: 'URLToConvert',
      examples: ['qrgen https://github.com/Favna/Discord-Self-Bot/'],
      guildOnly: false,
      args: [
        {
          key: 'url',
          prompt: 'String (URL) to make a QR code for?',
          type: 'string'
        }
      ]
    });
  }

  async run (msg, args) {
    const base64 = await qr.toDataURL(args.url, {errorCorrectionLevel: 'M'});

    if (base64) {
      const upload = await imgur.uploadBase64(base64.slice(22));

      if (upload) {
        deleteCommandMessages(msg, this.client);

        return msg.say(`QR Code for this URL: ${upload.data.link}`);
      }

      return msg.reply('⚠️ An error occurred uploading the QR code to imgur.');
    }

    return msg.reply('⚠️ An error occurred getting a base64 image for that URL.');
  }
};