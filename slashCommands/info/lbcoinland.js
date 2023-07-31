const { MessageEmbed } = require('discord.js')
const { User } = require('../../utils/schema')
const emojiVang = '1134532609993621524';


let leaderboard = []
let vangCount = {}

module.exports = {
  name: 'lbcoinland',
  description: 'Xem bảng xếp hạng',
  run: async (client, interaction) => {
    const updateLeaderboard = async () => {
      const users = await User.find();
      const filteredUsers = [];

      // Lọc bỏ các người dùng có vang = 0 và người dùng không còn trong server
      for (const user of users) {
        const member = await interaction.guild.members.fetch(user.id);
        if (user.vang > 0 && member) {
          filteredUsers.push(user);
        }
      }

      // Sắp xếp danh sách leaderboard từ những người dùng hợp lệ
      leaderboard = filteredUsers.sort((a, b) => b.vang - a.vang).slice(0, 6);
    };

    const updateUserVangCount = async () => {
      const users = await User.find();
      users.forEach(user => vangCount[user.id] = user.vang);
    };

    await updateLeaderboard();
    await updateUserVangCount();

    setInterval(async () => {
      await updateLeaderboard();
      await updateUserVangCount();
    }, 4000);

    await interaction.deferReply();
    const indexOfUser = leaderboard.findIndex(user => user.id === interaction.user.id);

    // Tạo một chuỗi để hiển thị bảng xếp hạng gần nhau
    const leaderboardString = leaderboard.map((user, index) => {
      return `\n\`\`${index + 1}. \`\`**<@${user.id}>** • **${user.vang}** <:emoji:${emojiVang}>`;
    }).join('');

    return interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setTitle('**AOV Leaderboard**')
          .setColor('GOLD')
          .setDescription(leaderboardString)
          .setFooter({ text: `Bạn đứng thứ ${indexOfUser + 1}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setTimestamp(),
      ],
    });
  }
}