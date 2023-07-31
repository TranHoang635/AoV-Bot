const { MessageEmbed } = require('discord.js')
const emojiVang = '1134532609993621524';

module.exports = {
  name: 'help',
  description: 'Thông tin các lệnh của bot',
  run: async (client, interaction) => {
    const user = interaction.user;
    const botAvatarURL = client.user.avatarURL();
    const helpEmbed = new MessageEmbed()
      .setColor('WHITE')
      .setTitle('Botify')
      .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      .setDescription(`Lười thêm quá 😑 <:emoji:${emojiVang}>`)
      .setThumbnail(botAvatarURL)
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();
    return interaction.reply({ embeds: [helpEmbed] })
  }
}
