var mongoose = require("../database/mongoose");

var medicoesSchema = new mongoose.Schema({
    idDispositivo: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
}, { strict: false });

module.exports = mongoose.model('medicoes', medicoesSchema);