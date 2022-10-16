const { response } = require('express');
const Comic = require('../models/comic');

/**
 * It takes a request from the client, checks if the comic already exists in the database, and if it
 * doesn't, it creates a new comic in the database.
 * 
 * The problem is that the function is not working as intended.
 * 
 * The function is supposed to check if the comic already exists in the database, and if it does, it's
 * supposed to mark the comic as "repetido" (repeated) and return a message to the client.
 * 
 * However, the function is not checking if the comic already exists in the database.
 * 
 * I've tried to debug the function, but I can't find the problem.
 * 
 * I've also tried to rewrite the function, but I can't find a solution.
 * 
 * I've also tried to search for a solution, but I can't find one.
 * 
 * I've also tried to ask for help, but I
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param [res] - response
 * @returns The data object.
 */
const registrarComic = async(req, res = response) => {
    try {
        const { titulo, editorial, ...body } = req.body;

        const nuevoTitulo = titulo.split(' ')
                                .map( palabra => palabra[0].toUpperCase() + palabra.substring(1))
                                .join(' ');
    
        const comicDB = await Comic.findOne({ titulo: nuevoTitulo });
        if ( comicDB ) {
            await Comic.findByIdAndUpdate(comicDB._id, { repetido: true }, { new: true });
            return res.status(201).json({
                msg: `El comic '${comicDB.titulo}' ya existe, pero se marco como repetido.`,
            });
        }
    
        const data = {
            titulo: nuevoTitulo,
            editorial: editorial.toUpperCase(),
            ...body
        };
        
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
