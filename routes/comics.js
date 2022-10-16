const { Router } = require('express');
const { check } = require('express-validator');

const { obtenerComics, obtenerComic } = require('../controllers/getComics');
const { registrarComic, borrarComic, editarComic } = require('../controllers/register');
const { existeComicPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/show', obtenerComics);

router.get('/show/:titulo', obtenerComic);

router.post('/register', [
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('editorial', 'La editorial es obligatoria').not().isEmpty(),
    validarCampos
], registrarComic);


router.put('/edit/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeComicPorId ),
    validarCampos
], editarComic);

router.delete('/delete/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeComicPorId ),
    validarCampos
], borrarComic);


module.exports = router;
