const { response } = require('express');
const Comic = require('../models/comic');


/**
 * "If the comic exists, mark it as a duplicate and return the comic data. If the comic doesn't exist,
 * create it and return the comic data."
 * </code>
 * @param req - request
 * @param [res] - response
 * @returns The comicDB object is being returned.
 */
const registrarComic = async(req, res = response) => {
    try {
        const { titulo, editorial, ...body } = req.body;

        const nuevoTitulo = titulo.split(' ')
                                .map( palabra => palabra[0].toUpperCase() + palabra.substring(1))
                                .join(' ');
    
        const comicDB = await Comic.findOne({ titulo: nuevoTitulo });
        if ( comicDB.estado ) {
            await Comic.findByIdAndUpdate(comicDB._id, { repetido: true, estado: true }, { new: true });
            return res.status(201).json({
                msg: `El comic '${comicDB.titulo}' ya existe, pero se marco como repetido.`,
            });
        }
    
        const data = {
            titulo: nuevoTitulo,
            editorial: editorial.toUpperCase(),
            ...body
        };

        if ( !comicDB.estado ) {
            await Comic.findByIdAndUpdate(comicDB._id, { repetido: false, estado: true }, { new: true });
            return res.status(201).json(data);
        }
        
        const comic = new Comic( data );
    
        // Guardar en DB
        await comic.save();
    
        res.status(201).json(data);
    } catch (error) {
        res.status(409).json({ msg: 'Ha ocurrido un error, revisa los datos' })
    }
}

/**
 * It takes the id of a comic, finds it in the database, and sets its estado property to false.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const borrarComic = async(req, res) => {
    const { id } = req.params; 
    const item = await Comic.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.status(200).json({
        msg: 'Comic borrado',
        item
    });
}

/**
 * It finds a comic by id, checks if it's active, and if it is, it updates it with the new data.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The comic object.
 */
const editarComic = async(req, res) => {
    const { id } = req.params;
    const { estado, ...data } = req.body;
    
    const comicDB = await Comic.findById(id);
    if (!comicDB.estado) return res.status(400).json({msg: 'Este registro no se encuentra activo.'});

    const comic = await Comic.findByIdAndUpdate( id, data, { new: true } );
    
    res.json( comic );
}

module.exports = {
    borrarComic,
    editarComic,
    registrarComic
};
