const nickname = require('./shopnickname');
// const taixiu = require('./taixiu');
// const info = require('./info');

module.exports = {
    name: 'shop',
    description: 'Đổi tên của bạn (tốn 100 vàng)',
    type: 'SUB_COMMAND_GROUP',
    options: [
        {
            name: 'nickname',
            description: 'Đổi tên của bạn (tốn 100 vàng)',
            type: 'SUB_COMMAND',
            options: nickname.options
        },
        // {
        //     name: 'taixiu',
        //     description: 'tài xỉu chẵn lẻ bộ ba',
        //     type: 'SUB_COMMAND',
        //     options: taixiu.options
        // },
        // {
        //     name: 'info',
        //     description: 'Thông tin các lệnh của bot',
        //     type: 'SUB_COMMAND',
        //     options: info.options
        // }
    ],
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();// Lấy tên của tùy chọn con
        if (subcommand === 'nickname') {        // Xử lý logic tương ứng với tùy chọn con
            nickname.run(client, interaction);  // Xử lý tùy chọn nickname
         } //else if (subcommand === 'taixiu') {
        //     taixiu.run(client, interaction);    // Xử lý tùy chọn taixiu
        // } else if (subcommand === 'info') {
        //     info.run(client, interaction);      // Xử lý tùy chọn info
        // }
    }
};
