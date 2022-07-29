export class App{

	constructor(){
		this.thead = document.createElement("thead");
		this.tabla = document.createElement("table");
		this.tbody = document.createElement("tbody");
		this.ascendente = true;
		this.bancos = [];
	}

	agregarEventos(){
		["code","name","country"].forEach((head)=>{
	   	const th = document.createElement("th");
	   	th.textContent = head;
	   	const cuerpo = this.tbody;
	   	th.addEventListener("click",()=>{
	   		this.aplicarFiltros(head);
	   	})
	   	this.thead.appendChild(th);
	   });
	}

	filtrarDatos(bancosOrdenados,pagina = 1, cantidad = 25){
	   return bancosOrdenados.filter(({ code, name, country }, index) => {
	      return index < cantidad * pagina && index >= cantidad * (pagina - 1);
	   });
	}

	ordenarDatos(orden){
		const datosOrdenados = this.bancos.sort((a,b)=>{
	   	if (a[orden] > b[orden]) return this.ascendente ? -1 : 1;
			if (a[orden] < b[orden]) return this.ascendente ? 1 : -1;
			return 0;
	   });
	   this.ascendente = !this.ascendente;
	   return datosOrdenados;
	}

	aplicarFiltros(head = "name"){
		let bancosOrdenados = this.ordenarDatos(head);
	   let bancosFiltrados = this.filtrarDatos(bancosOrdenados);
	   this.tbody.innerHTML = "";
	   bancosFiltrados.forEach(({ code, name, country }) => {
	      this.tbody.innerHTML += `<tr><td>${code}</td><td>${name}</td><td>${country}</td></td>`;
	   });
	}

	crearTabla(){
	   this.aplicarFiltros();
	 	this.agregarEventos();
	   this.tabla.appendChild(this.thead);
	   this.tabla.appendChild(this.tbody);
	}

	async traerInfo(){
	   const myInit = {
	      headers: {
	         "X-API-Key": "4H34kfiWPcySuqAWGburnHX53U44gazkbWUfC4mSG9axJ2jtQ0P3Edjgum84GsyJ",
	         "Accept": "application/json, text/plain, */*"
	      }
	   };
	   const respuesta = await fetch("https://banking.sandbox.prometeoapi.com/provider/", myInit);
	   await respuesta.json().then((res)=>{
	   	this.bancos = res.providers;
	   })
	}

	async main(app){
	   await this.traerInfo();
	   this.crearTabla();
	   app.appendChild(this.tabla);
	}

}