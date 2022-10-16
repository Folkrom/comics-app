const Comic = require('../models/comic');

const existeComicPorId = async(id) => {
    const existeProducto = await Comic.findById( id );
    if (!existeProducto) {
        throw new Error(`El id ${id} no existe.`)
    }
}

module.exports = {
    existeComicPorId
}
