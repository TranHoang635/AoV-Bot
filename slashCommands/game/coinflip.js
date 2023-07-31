const { MessageEmbed } = require('discord.js');
const { User } = require('../../utils/schema');
const emojiVang = '1134532609993621524';
const coinflip = '1134758808523120781';

module.exports = {
  options: [
    {
      name: 'gamemode',
      description: 'Hãy chọn mặt đỏ hoặc đen',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: '🔴 Đỏ',
          value: '🔴'
        },
        {
          name: '⚫ Đen',
          value: '⚫'
        }
      ]
    },
    {
      name: 'vang',
      description: 'Nhập số vàng muốn cược',
      type: 'INTEGER',
      required: true
    }
  ],
  run: async (client, interaction) => {

    // Lấy người dùng gọi lệnh và lựa chọn của họ
    const user = interaction.user;
    const vang = interaction.options.getInteger('vang');
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    // Hàm định dạng số có dấu phẩy
    function formatVang(number) {
      return number.toLocaleString();
    }

    // Kiểm tra số vang cược có lớn hơn hoặc bằng 1
    if (vang < 0) {
      const errorEmbed = new MessageEmbed()
        .setColor('#FF0000')
        .setDescription(`\`\`\`Số cược không hợp lệ !!!\`\`\``)
      return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Kiểm tra số vang cược có lớn hơn số vang hiện có của người dùng hay không
    if (vang > userData.vang) {
      const errorEmbed = new MessageEmbed()
        .setColor('#FF0000')
        .setDescription(`**Bạn cần có ${formatVang(vang)} <:emoji:${emojiVang}> thực hiện lệnh**`)
        .setFooter({ text: `ID: ${user.id} • 👛 x ${userData.vang}` });
      return await interaction.reply({ embeds: [errorEmbed] });
    }

    // Hiển thị thông báo "rolling" để người dùng biết bot đang xử lý
    const loadingEmbed = new MessageEmbed()
      .setColor('#000000')
      .setDescription(`Đang tung đồng xu...<a:emoji:${coinflip}>`);

    const loadingMessage = await interaction.reply({ embeds: [loadingEmbed], fetchReply: true });

    // Tính toán kết quả
    const result = Math.random() < 0.5 ? '🔴' : '⚫';
    const win = result === interaction.options.getString('gamemode');

    // Cập nhật số vang của người dùng
    userData.vang += win ? vang : -vang;
    await userData.save();

    // Hiển thị kết quả
    setTimeout(async () => {
      const resultText = `Kết quả: ${result}`;
      const embed = new MessageEmbed()
        .setColor(win ? '#00FF00' : '#FF0000')
        .addFields(
          { name: '\u2009', value: win ? `\`\`\`Choose: ${interaction.options.getString('gamemode')} (${formatVang(vang)} 🪙)\nResult: ${result}\`\`\`\`\`\`Bạn đã thắng [+${formatVang(vang * 1)} 🪙]\`\`\`` : `\`\`\`Choose: ${interaction.options.getString('gamemode')} (${formatVang(vang)} 🪙)\nResult: ${result}\`\`\`\`\`\`Bạn đã thua [-${formatVang(vang)} 🪙]\`\`\`` })
        .setFooter({ text: `ID: ${user.id} • 👛 x ${userData.vang}` });
      // Thay thế thông báo "rolling" bằng kết quả cuối cùng
      await loadingMessage.edit({ embeds: [embed] });
    }, 2000);
  }
};
