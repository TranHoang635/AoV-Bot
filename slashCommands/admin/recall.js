const { MessageEmbed } = require('discord.js')
const { User } = require('../../utils/schema')
const emojiVang = '1134532609993621524';


module.exports = {
    name: 'recall',
    description: 'Thu hồi vàng',
    options: [
        {
            name: 'vàng',
            description: 'Thu hồi vàng',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Người cần thu hồi',
                    type: 6,
                    require: 'true',
                },
                {
                    name: 'vang',
                    description: 'vàng (0 là toàn bộ)',
                    type: 'INTEGER',
                    require: 'true',
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;
        let vang = interaction.options.getInteger('vang');
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
        const embed = new MessageEmbed({ color: 'YELLOW' });

        // Hàm định dạng số có dấu phẩy
        function formatVang(number) {
            return number.toLocaleString();
        }

        // Kiểm tra nếu không nhập số vang, trừ toàn bộ số vang còn lại của người dùng
        if (!vang) {
            vang = userData.vang;
            userData.vang = 0;
            embed.setDescription(`Đã thu hồi **__${formatVang(vang)}__** <:emoji:${emojiVang}> của <@${user.id}>⠀👌`);
        } else {
            // Kiểm tra nếu số vang muốn thu hồi lớn hơn số vang hiện có của người dùng
            if (vang > userData.vang) {
                embed.setDescription(`**Không thể thu hồi do số dư không đủ __${formatVang(vang)}__ <:emoji:${emojiVang}>**`);
                return interaction.reply({
                    embeds: [embed]
                });
            }
            userData.vang -= vang;
            embed.setDescription(`Đã thu hồi **__${formatVang(vang)}__** <:emoji:${emojiVang}> của <@${user.id}>⠀👌`);
        }
        userData.save();
        return interaction.reply({
            embeds: [embed]
        });
    }
}