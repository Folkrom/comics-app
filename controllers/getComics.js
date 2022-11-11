const { response } = require('express');

const Comic = require('../models/comic');

const obtenerComics = async(req, res = response) => {
    const { limite = 10, desde = 0 } = req.body;
    const query = { estado: true };

    const [ total, comics ] = await Promise.all([
        Comic.countDocuments( query ),
        Comic.find( query )
            .sort({ _id: -1 })
            .skip( Number(desde) )
            .limit( Number(limite) )
    ]);
    // const total = await Comic.countDocuments(query);
    // const comics = await Comic.find(query).limit(5);

    res.json({
        total,
        comics
    });
}

const obtenerComic = async(req, res) => {
    const { titulo } = req.params;
    const busqueda = new RegExp(titulo, 'i');

    const comic = await Comic.find({ titulo: busqueda, estado: true }); //await Comic.find( {titulo} );

    if (comic == 0) return res.status(200).json({ msg: 'No se encontro ninguna coincidencia' });

    res.status(200).json( comic );
}

module.exports = {
    obtenerComic,
    obtenerComics
}
