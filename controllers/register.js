const { response, query } = require('express');
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
        const nuevaEditorial = editorial.toUpperCase();
    
        const comicDB = await Comic.findOne({ titulo: nuevoTitulo, editorial: nuevaEditorial });
        
        if (comicDB) {
            const actualizacion = {
                repetido: true,
                estado: true
            };
            let mensaje = `El comic '${comicDB.titulo}' ya existe, pero se marco como repetido.`;
            if (!comicDB.estado) {
                actualizacion.repetido = false;
                mensaje = `El comic '${comicDB.titulo}' fue encontrado, pero estaba inactivo. Ahora se ha activado.`;
            }
            await Comic.findByIdAndUpdate(comicDB._id, actualizacion, { new: true });
            return res.status(201).json({
                msg: mensaje,
            });
        }
    
        const data = {
            titulo: nuevoTitulo,
            editorial: nuevaEditorial,
            ...body
        };
        
        const comic = new Comic( data );
    
        // Guardar en DB
        await comic.save();
    
        res.status(201).json(data);
    } catch (error) {
        res.status(409).json({ msg: 'Ha ocurrido un error, revisa los datos' });
        console.log(error);
    }
}

/**
 * This function deletes a comic from the database and updates its status based on whether it is a
 * duplicate or not.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const borrarComic = async(req, res) => {
    const { id } = req.params; 
    const comicDB = await Comic.findOne({ _id: id });
    const params = comicDB.repetido 
                    ? { estado: true, repetido: false } 
                    : { estado: false } ;
    const deletedComic = await Comic.findByIdAndUpdate( id, params , { new: true } );
    
    res.status(200).json({
        msg: 'Comic borrado',
        deletedComic
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
