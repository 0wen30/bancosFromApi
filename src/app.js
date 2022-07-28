const filtrarDatos = (bancos, pagina = 1, cantidad = 10) => {
   return bancos.filter(({ code, name, country }, index) => {
      return index < cantidad * pagina && index >= cantidad * (pagina - 1);
   });
}

const eliminaHijos = (parent,child = null) => {
	if (!child) {
		while (parent.firstChild) {
	      parent.removeChild(parent.firstChild);
	   }
	}else{
		parent.removeChild(child);
	}
}

let ascendente = true;

const ordenarDatos = (bancos,orden) => {
	const datosOrdenados = bancos.sort((a,b)=>{
   	if (a[orden] > b[orden]) return ascendente ? -1 : 1;
		if (a[orden] < b[orden]) return ascendente ? 1 : -1;
		return 0;
   });
   ascendente = !ascendente;
   return datosOrdenados;
}

const aplicarFiltros = (bancos,head = "name") => {
	let tbody = document.createElement("tbody");
	let bancosOrdenados = ordenarDatos(bancos,head);
   let bancosFiltrados = filtrarDatos(bancosOrdenados);
   bancosFiltrados.forEach(({ code, name, country }) => {
      tbody.innerHTML += `<tr><td>${code}</td><td>${name}</td><td>${country}</td></td>`;
   });
   return tbody;
}

const agregarEventos = (tabla,tbody,bancos) => {
	const encabezados = document.createElement("thead");
	["code","name","country"].forEach((head)=>{
   	const th = document.createElement("th");
   	th.textContent = head
   	th.addEventListener("click",()=>{
   		eliminaHijos(tabla,tbody)
   		tbody = aplicarFiltros(bancos,head);
   		tabla.appendChild(tbody);
   	})
   	encabezados.appendChild(th);
   });
   return encabezados;
}

const crearTabla = (bancos) => {
	const tabla = document.createElement("table");
   const tbody = aplicarFiltros(bancos);
 	const thead = agregarEventos(tabla,tbody,bancos);
   tabla.appendChild(thead);
   tabla.appendChild(tbody);
   return tabla;
}

const traerInfo = async () => {
   const myInit = {
      headers: {
         "X-API-Key": "4H34kfiWPcySuqAWGburnHX53U44gazkbWUfC4mSG9axJ2jtQ0P3Edjgum84GsyJ",
         "Accept": "application/json, text/plain, */*"
      }
   };
   const respuesta = await fetch("https://banking.sandbox.prometeoapi.com/provider/", myInit);
   const { providers } = await respuesta.json();
   return providers;
}

export const main = async (app) => {
   const bancos = await traerInfo();
   const tabla = crearTabla(bancos);
   app.appendChild(tabla);
}