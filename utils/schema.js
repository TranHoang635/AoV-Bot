const mongoose = require("mongoose")

const User = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    vang: { type: Number, default: 0 },
    cooldowns: {
        daily: { type: Date }
    }
});

// Thêm phương thức để định dạng số vàng có dấu phẩy
User.methods.formatVang = function () {
    return this.vang.toLocaleString();
};

module.exports = { User: mongoose.model('User', User) };
