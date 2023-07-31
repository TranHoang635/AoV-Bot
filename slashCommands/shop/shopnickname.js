const { MessageEmbed } = require('discord.js');
const { User } = require('../../utils/schema');
const emojiVang = '1134532609993621524';

module.exports = {
    options: [
        {
            name: 'name',
            type: 'STRING',
            description: 'Nhập tên mới của bạn',
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const user = interaction.user;
        const vang = 100;
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
        const newNickname = interaction.options.getString('name');
        const guildMember = interaction.member;

        try {
            const remainingVang = userData.vang - vang;
            if (remainingVang < 0) {
                const errorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription(`**Bạn không đủ 100 <:emoji:${emojiVang}> để đổi tên**`)
                    .setFooter({ text: `ID: ${user.id} • 👛 x ${userData.vang}` });
                await interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
                return;
            }

            await guildMember.setNickname(newNickname);
            userData.vang = remainingVang;
            await userData.save();

            const successEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`\`\`\`Đổi thành công: ${newNickname}\`\`\``)
                .setFooter({ text: `ID: ${user.id} • 👛 x ${userData.vang}` });
            await interaction.reply({
                embeds: [successEmbed],
                ephemeral: false,
            });
        } catch (error) {
            console.log(error);
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`\`\`\`Hãy tự đổi tên vì bạn có role cao hơn tôi 😥\`\`\``)
                .setFooter({ text: `ID: ${user.id} • 👛 x ${userData.vang}` });
            await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true,
            });
        }
    },
};