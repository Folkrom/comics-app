const { Schema, model } = require('mongoose');

const ComicSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
        unique: false
    },
    editorial: {
        type: String,
        required: [true, 'La editorial es obligatoria']
    },
    repetido: {
        type: Boolean,
        required: false,
        default: false
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});

ComicSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Comic', ComicSchema );
