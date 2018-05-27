/**
 * @file Extra QRGenCommand - Generates a QR code from text (like a URL)  
 * **Aliases**: `qr`, `qrcode`
 * @module
 * @category extra
 * @name qrgen
 * @example qrgen https://favna.xyz/ribbon
 * @param {StringResolvable} URL URL you want to encode into a QR image
 * @returns {MessageEmbed} Embedded QR code and original image URL
 */

const qr = require('qrcode'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed, MessageAttachment} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class QRGenCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'qrgen',
      memberName: 'qrgen',
      group: 'extra',
      aliases: ['qr'],
      description: 'Generates a QR code from text (like a URL)',
      format: 'TextToEncode',
      examples: ['qrgen https://github.com/Favna/Discord-Self-Bot/'],
      guildOnly: false,
      args: [
        {
          key: 'url',
          prompt: 'Text to make a QR code for?',
          type: 'string'
        }
      ]
    });
  }

  async run (msg, {url}) {
    try {
      const base64 = await qr.toDataURL(url, {errorCorrectionLevel: 'M'}),
        buffer = Buffer.from(base64.replace(/^data:image\/png;base64,/, '').toString(), 'base64'),
        embedAttachment = new MessageAttachment(buffer, 'qrcode.png'),
        qrEmbed = new MessageEmbed();

      qrEmbed
        .attachFiles([embedAttachment])
        .setTitle(`QR code for ${url}`)
        .setImage('attachment://qrcode.png');

      deleteCommandMessages(msg, this.client);

      return msg.embed(qrEmbed);

    } catch (err) {
      deleteCommandMessages(msg, this.client);

      return msg.reply('an error occurred in the qr generation, you can contact Favna on his server');
    }
  }
};