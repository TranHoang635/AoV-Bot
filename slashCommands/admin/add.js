const { MessageEmbed } = require('discord.js')
const { User } = require('../../utils/schema')
const emojiVang = '1134532609993621524';

module.exports = {
    name: "add",
    description: "Thêm vàng cho người dùng",
    options: [
        {
            name: "vang",
            description: "Số vàng muốn thêm",
            type: 1, // 1 is type SUB_COMMAND
            options: [
                {
                    name: "user",
                    description: "Người cần thêm",
                    type: 6, // 6 is type USER
                    required: false
                },
                {
                    name: "number",
                    description: "Số vàng",
                    type: 10, // 10 is type INTEGER (NUMBER in application commands)
                    required: false
                }
            ]
        },
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user
        const number = interaction.options.getNumber('number') || interaction.number
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
        const embed = new MessageEmbed({ color: 'YELLOW' })

        // Hàm định dạng số vàng có dấu phẩy
        function formatVang(number) {
            return number.toLocaleString();
        }

        // Kiểm tra xem giá trị của number có phải là một số hợp lệ hay không
        if (isNaN(number)) {
            return interaction.reply({
                embeds: [embed.setDescription(`\`\`\`Bạn chưa điền tên hoặc số vàng!?\`\`\``)]
            })
        }

        if (number < 0) {
            const senderembed = new MessageEmbed({ color: 'RED' })
                .setDescription(`\`\`\`Số vàng không hợp lệ, hãy thử lại!!\`\`\``)
            return interaction.reply({ embeds: [senderembed], ephemeral: true });
        }

        userData.vang += number
        userData.save()

        return interaction.reply({
            embeds: [embed.setDescription(`Thêm thành công **__${formatVang(number)}__** <:emoji:${emojiVang}>`)]
        })
    }
}