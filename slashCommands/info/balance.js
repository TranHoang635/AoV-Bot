const { MessageEmbed } = require('discord.js')
const { User } = require('../../utils/schema')
const emojiVang = '1134532609993621524';

module.exports = {
    name: 'balance',
    description: 'Kiểm tra vàng của bạn',
    options: [
        {
            name: 'user',
            description: 'Người dùng cần kiểm tra',
            type: 'USER',
            required: false,
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.member.user;
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
    
        // Hàm định dạng số vàng có dấu phẩy
        function formatVang(number) {
            return number.toLocaleString();
        }
    
        const balanceEmbed = new MessageEmbed()
            .setDescription(`<@${user.id}> đang sở hữu **__${formatVang(userData.vang)}__** <:emoji:${emojiVang}>`)
            .setColor('WHITE');
    
        return interaction.reply({ embeds: [balanceEmbed] });
    },
    
};