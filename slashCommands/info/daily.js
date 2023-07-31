const { MessageEmbed } = require('discord.js');
const { User } = require('../../utils/schema');
const emojiVang = '1134532609993621524';

module.exports = {
  name: 'daily',
  description: 'Hãy điểm danh mỗi ngày để nhận thưởng nhé!',
  run: async (client, interaction) => {
    const user = interaction.user;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
    const embed = new MessageEmbed({ color: 'GOLD' });

    // Chuyển khoảng thời gian thành dạng timestamp đếm ngược từ 12 giờ
    function formatTimestamp(timestamp) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(12, 0, 0, 0); // Đặt giờ 12:00:00 cho ngày tiếp theo
      const twelveHoursAfterNextDay = nextDay.getTime() - timestamp;
      return `<t:${Math.floor((Date.now() + twelveHoursAfterNextDay) / 1000)}:R>`;
    }

    if (userData.cooldowns.daily > Date.now()) {
      const remainingTime = userData.cooldowns.daily - Date.now();
      return interaction.reply({
        embeds: [
          embed
            .setDescription(` Lượt nhận kế sau ${formatTimestamp(userData.cooldowns.daily)}`)
            .setFooter({ text: `ID: ${user.id} • 👛 x ${userData.vang}` }),
        ],
        ephemeral: false,
      });
    }

    const randomVang = Math.floor(Math.random() * (500 - 50 + 1) + 50);
    userData.vang += randomVang;
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0); // Đặt giờ 00:00:00 cho ngày tiếp theo
    userData.cooldowns.daily = nextDay.getTime() + 12 * 60 * 60 * 1000; // Thêm 12 giờ (12 * 60 * 60 * 1000 milliseconds) cho ngày tiếp theo
    userData.save();

    return interaction.reply({
      embeds: [
        embed
          .setDescription(`<@${user.id}> nhận được **${randomVang}** <:emoji:${emojiVang}>`)
          .setFooter({ text: `ID: ${user.id} • 👛 x ${userData.vang}` }),
      ],
    });
  },
};
