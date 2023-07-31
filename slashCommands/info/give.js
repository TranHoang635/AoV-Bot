const { MessageEmbed } = require('discord.js');
const { User } = require('../../utils/schema');
const emojiVang = '1134532609993621524';

const userSendLimits = new Map();

module.exports = {
    name: 'give',
    description: 'Chuyển tiền cho người khác',
    options: [
        {
            name: 'vang',
            description: 'Chuyển tiền cho người khác',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Người bạn muốn chuyển',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'vang',
                    description: 'vang',
                    type: 'INTEGER',
                    required: true,
                    constraints: {
                        min: 1,
                        max: 800, // Chỉ cho phép tối đa 800 vang mỗi lần chuyển
                        integer: true
                    }
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const vang = interaction.options.getInteger('vang');
        const senderData = await User.findOne({ id: interaction.user.id }) || new User({ id: interaction.user.id });
        const receiverData = await User.findOne({ id: user.id }) || new User({ id: user.id });

        if (vang < 0) {
            const senderembed = new MessageEmbed({ color: 'RED' })
                .setDescription(`\`\`\`Số tiền chuyển không hợp lệ!!\`\`\``)
            return interaction.reply({ embeds: [senderembed], ephemeral: true });
        }

        // Kiểm tra nếu người dùng đã gửi/nhận 2 lần trong cùng một ngày
        const today = new Date().toDateString();
        const userSendInfo = userSendLimits.get(interaction.user.id) || { count: 0, lastSent: '', totalSentToday: 0 };

        if (userSendInfo.lastSent === today && userSendInfo.count >= 2) {
            const senderembed = new MessageEmbed({ color: 'RED' })
                .setDescription(`\`\`\`Bạn đã đạt giới hạn 2 lần gửi trong ngày\`\`\``)
            return interaction.reply({ embeds: [senderembed], ephemeral: true });
        }

        if (userSendInfo.lastSent === today && userSendInfo.totalSentToday + vang > 800) {
            const senderembed = new MessageEmbed({ color: 'RED' })
                .setDescription(`**Tổng số <:emoji:${emojiVang}> gửi trong ngày không thể vượt quá 800`)
            return interaction.reply({ embeds: [senderembed], ephemeral: true });
        }

        // Kiểm tra số vang người gửi còn đủ không
        if (senderData.vang < vang) {
            const senderembed = new MessageEmbed({ color: 'RED' })
                .setDescription(`**<:emoji:${emojiVang}> không đủ ${vang} để chuyển**`)
            return interaction.reply({ embeds: [senderembed], ephemeral: true });
        }

        // Kiểm tra số vang người nhận còn đủ không
        if (receiverData.vang + vang > 800) {
            const senderembed = new MessageEmbed({ color: 'RED' })
                .setDescription(`**Người nhận đã đạt đến giới hạn 800 <:emoji:${emojiVang}>**`)
            return interaction.reply({ embeds: [senderembed], ephemeral: true });
        }

        // Tiến hành giao dịch chuyển vang
        senderData.vang -= vang;
        receiverData.vang += vang;

        try {
            await senderData.save();
            await receiverData.save();
        } catch (error) {
            const senderembed = new MessageEmbed({ color: 'RED' })
                .setDescription(`\`\`\`Đã xảy ra lỗi khi thực hiện giao dịch\`\`\``)
            return interaction.reply({ embeds: [senderembed], ephemeral: true });
        }

        // Nếu giao dịch thành công, cập nhật thông tin số lần gửi và thời gian gửi gần nhất của người dùng
        if (userSendInfo.lastSent !== today) {
            userSendInfo.lastSent = today;
            userSendInfo.count = 1;
        } else {
            userSendInfo.count++;
        }
        userSendInfo.totalSentToday += vang;
        userSendLimits.set(interaction.user.id, userSendInfo);

        const embed = new MessageEmbed({ color: 'WHITE' })
            .setDescription(`**💳 | Chuyển thành công __${vang}__ <:emoji:${emojiVang}> cho ${user.username}**`)
        return interaction.reply({ embeds: [embed] });
    }
};
