
// Obtener comics
const getComics = async () => {
  const totalComics = document.getElementById('total-comics');
  const listaComics = document.getElementById('lista-comics');

  let data;
  await fetch('/api/show')
    .then((res) => res.json())
    .then((res) => (data = res))
    .catch((e) => console.log(e));

  listaComics.innerHTML = ``;
  const { total, comics } = data;

  totalComics.innerText = `Total de comics registrados: ${total}`;

  for (const comic in comics) {
    const { titulo, editorial, repetido, _id: id } = comics[comic];
    const isRepeated = repetido ? '<p>(Repetido)</p>' : '';

    listaComics.innerHTML += `
          <div class="Card">
              <div class="Card-title">
                  <h1 class="Titulo" id="set-titulo">${titulo}</h1>
                  ${isRepeated}
              </div>
              <div class="Card-editorial">
                  <h1 class="Editorial" id="set-editorial">${editorial}</h1>
              </div>
              <div class="Card-button">
              <p id="c-${comic}" style="display: none;">${id}</p>
              <button class="Card-button_delete" onclick=" deleteComic( 'c-${comic}' ) " >
              Borrar
              </button>
              </div>
          </div>
      `;
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const titulo = document.getElementById("titulo");
  const editorial = document.getElementById("editorial");
  const status = document.getElementById("submit-status");
  let cleanTitle = titulo.value;
  let cleanEditorial = editorial.value;

  if (cleanTitle === "" || cleanEditorial === "") {
    status.innerText = "Debes completar ambos campos!";
    status.style = "color: #e98a15";
    return false;
  }

  if (titulo[0] === " ") cleanTitle = titulo.slice(1);
  if (cleanTitle[cleanTitle.length - 1] === " ")
    cleanTitle = cleanTitle.slice(0, -1);
  if (editorial[0] === " ") cleanEditorial = editorial.slice(1);
  if (cleanEditorial[cleanEditorial.length - 1] === " ")
    cleanEditorial = cleanEditorial.slice(0, -1);

  try {
    const rawResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ titulo: cleanTitle, editorial: cleanEditorial }),
    });
    const response = await rawResponse.json();
    const { titulo, editorial } = response;

    if (response.msg) {
      status.innerText = response.msg;
      status.style = 'color: #FAE079';
      getComics();
      return;
    }

    status.innerText = `El comic: ${titulo} (${editorial}) ha sido agregado correctamente.`;
    status.style = 'color: #039548';
    titulo.value = '';
    editorial.value = '';

    getComics();
    
  } catch (error) {
    console.info(error);
    status.innerText = 'Ha ocurrido un error al registrar el comic.';
    status.style = 'color: #EF233C';
  } 
};

const deleteComic = ( comic ) => {
  const id = document.getElementById(`${comic}`).innerText;

  fetch('/api/delete/' + id, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then( res => { 
    res.json();
    getComics();
  } )
  .catch( e => console.info(e) );

}
