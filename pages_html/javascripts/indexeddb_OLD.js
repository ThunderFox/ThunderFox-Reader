/** D�claration*/
 var TableauFlux= new Array();

/**
 * fonction charg�e de cr�er la base de donn�e si elle n'existe pas
 * ou si elle n�cessite une mise � jour.
 * Appell�e sur le onupgradeneeded � l'ouverture de la base
 */
function createDatabase(event) {
    var db = event.target.transaction.db;
    
    // cr�ation d'un object store (similaire � une table en SQL)
    // la cl� d'un enregistrement se trouve dans la propri�t� id
    // de l'enregistrement, et initialis� automatiquement � l'insertion
    // avec une valeur d'un compteur auto incr�ment�
    var fluxStore = db.createObjectStore("table_flux",
                                            { keyPath: "id",
                                              autoIncrement: true });

    // cr�ation d'un index sur cet object store, sur la propri�t� modele
    // des objets enregistr�s
}

/**
 * le callback quand il y a une erreur � l'ouverture
 */
function errorOpen(event) {
    window.alert("Erreur ouverture !");
}

    

/**
 * fonction appel�e lors de la soumission du formulaire.
 * ajoute un enregistrement dans la base
 */
function saveRecord(form) {
    // cr�ation d'un objet contenant les donn�es
    // il sert d'"enregistrement" dans la base
    var flux = {
        flux_link:  form.elements['flux_link'].value,
		titre:  form.elements['titre'].value,
        categorie:   form.elements['categorie'].value
    }

    // on ouvre la base, et on d�clare les listeners
    var request = window.webkitIndexedDB.open("BDFlux", 1);
    request.onerror = errorOpen;
    request.onupgradeneeded = createDatabase;

    request.onsuccess = function(event) {
        // ici la base a �t� ouverte avec succ�s, il faut ajouter l'enregistrement

        // on r�cup�re l'objet database
        var db = event.target.result; 

        // on ouvre une transaction qui permettra d'effectuer
        // les op�rations sur la base
        var transaction = db.transaction(["table_flux"], "readwrite");
        transaction.oncomplete = function(event) {
            displayList(db);
            window.alert("Flux sauvegard�");
        };

        transaction.onerror = function(event) {
           window.alert('erreur de transaction ');
        };

        // on r�cup�re l'object store dans lequel on veut stocker l'objet
        var fluxStore = transaction.objectStore("table_flux");

        // on cr�� l'ordre d'ajouter un enregistrement
        // sera effectivement execut� lors de la fermeture de la transaction
        var req = fluxStore.add(flux);
        req.onsuccess = function(event) {
            
        }
        req.onerror = function(event) {
            window.alert('erreur ajout');
        }
    }
}


/**
 * fonction qui efface tout le contenu de la base, quand on
 * clique sur le bouton "effacer" de la page
 */
function deleteAllRecords() {
    // on ouvre la base, et on d�clare les listeners
    var request = window.webkitIndexedDB.open("BDFlux", 1);
    request.onerror = errorOpen;
    request.onupgradeneeded = createDatabase;

    request.onsuccess = function(event) {
        var db = event.target.result;

        // on ouvre une transaction qui permettra d'effectuer la suppression
        var transaction = db.transaction(["table_flux"], "readwrite");
        transaction.oncomplete = function(event) {displayList(db);};
        transaction.onerror = function(event) {
           window.alert('erreur de transaction suppression');
        };

        var fluxStore = transaction.objectStore("table_flux");
        var req = fluxStore.clear();
        req.onsuccess = function(event) {
        }
        req.onerror = function(event) {
            window.alert('erreur suppression');
        }
    }
}
	  
	  
// on ajoute un listener sur le load de la fen�tre, pour remplir
// la liste des flux, si pr�sent
// Listenner pour affichage
window.addEventListener('load', function(event) {
    // on ouvre la base, et on d�clare les listeners
    var request = window.webkitIndexedDB.open("BDFlux", 1);
    request.onerror = errorOpen;
    request.onupgradeneeded = createDatabase;

    request.onsuccess = function(event) {
        displayList(event.target.result);
		
    }
}, false);

/**
 * fonction qui efface la ligne s�l�ctionn�e (avec le bouton supprimer)
 */
function delete_flux(id){
	console.log(typeof(id));
	var id=parseInt(id);
	
	var request2 = window.webkitIndexedDB.open("BDFlux", 1);
    request2.onerror = errorOpen;
    request2.onupgradeneeded = createDatabase;
	request2.onsuccess=function(event){
	
	var db = event.target.result; 
	var transaction = db.transaction(["table_flux"], "readwrite");

	var fluxStore = transaction.objectStore("table_flux");	var request=fluxStore.delete(id);

    request.onsuccess=function (e){
		displayList(event.target.result);
		
    }
    request.onerror = function(e) {
		console.log(e+"error");
	}

}
}

/**
 * fonction qui permet d'afficher le contenu de la BD
 */
function displayList(db) {

    // on ouvre une transaction qui permettra d'effectuer
    // la lecture. uniquement de la lecture -> "readonly"
    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    
    // r�cup�ration de la table html
    var list = document.getElementById("listFlux");
    
    // on y efface tout
    list.innerHTML = '';

    // on r�cup�re l'object store que l'on veut lire
    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; // un enregistrement
			
            // cr�ation de la ligne html dans le tableau
			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;
            tr.appendChild(tdFluxLink);

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			tr.appendChild(tdTitre);
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;
            tr.appendChild(tdCategorie);
			
			var tdSuppresion=document.createElement('td');
			tdSuppresion.innerHTML='<input type="button" value="supprimer" onclick="delete_flux('+_flux.id+');" />';
			tr.appendChild(tdSuppresion);
	
            list.appendChild(tr);
			
            // on avance le curseur -> la callback onsuccess
            // sera appel�e � nouveau
			i++;
            cursor.continue();
        }
    }

}

