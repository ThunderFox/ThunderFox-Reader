
/**
 * fonction chargée de créer la base de donnée si elle n'existe pas
 * ou si elle nécessite une mise à jour.
 * Appellée sur le onupgradeneeded à l'ouverture de la base
 */
function createDatabase(event) {
    var db = event.target.transaction.db;
    
    // création d'un object store (similaire à une table en SQL)
    // la clé d'un enregistrement se trouve dans la propriété id
    // de l'enregistrement, et initialisé automatiquement à l'insertion
    // avec une valeur d'un compteur auto incrémenté
    var fluxStore = db.createObjectStore("table_flux",
                                            { keyPath: "id",
                                              autoIncrement: true });

    // création d'un index sur cet object store, sur la propriété modele
    // des objets enregistrés
}

/**
 * le callback quand il y a une erreur à l'ouverture
 */
function errorOpen(event) {
    window.alert("Erreur ouverture !");
}

    

/**
 * fonction appelée lors de la soumission du formulaire.
 * ajoute un enregistrement dans la base
 */
function saveRecord(form) {
    // création d'un objet contenant les données
    // il sert d'"enregistrement" dans la base
    var flux = {
        flux_link:  form.elements['flux_link'].value,
        categorie:   form.elements['categorie'].value
    }

    // on ouvre la base, et on déclare les listeners
    var request = window.webkitIndexedDB.open("BDFlux", 1);
    request.onerror = errorOpen;
    request.onupgradeneeded = createDatabase;

    request.onsuccess = function(event) {
        // ici la base a été ouverte avec succés, il faut ajouter l'enregistrement

        // on récupère l'objet database
        var db = event.target.result; 

        // on ouvre une transaction qui permettra d'effectuer
        // les opérations sur la base
        var transaction = db.transaction(["table_flux"], "readwrite");
        transaction.oncomplete = function(event) {
            displayList(db);
            window.alert("Flux sauvegardé");
        };

        transaction.onerror = function(event) {
           window.alert('erreur de transaction ');
        };

        // on récupère l'object store dans lequel on veut stocker l'objet
        var fluxStore = transaction.objectStore("table_flux");

        // on créé l'ordre d'ajouter un enregistrement
        // sera effectivement executé lors de la fermeture de la transaction
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
    // on ouvre la base, et on déclare les listeners
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
/**
 * fonction qui efface la ligne 
 */
window.indexedDB.deleteTodo = function(e) {
        var db = window.indexedDB.db;
        var transaction = db.transaction(["table_flux"], "readwrite");
        var store = transaction.objectStore("table_flux");
      
        var request = store.delete(e.target.result);
      
        request.onsuccess = function(e) {
         displayList(event.target.result);
        };
      
        request.onerror = function(e) {
          console.log("Error Adding: ", e);
        };
      };
	  
	  
// on ajoute un listener sur le load de la fenêtre, pour remplir
// la liste des flux, si présent
// Listenner pour affichage
window.addEventListener('load', function(event) {
    // on ouvre la base, et on déclare les listeners
    var request = window.webkitIndexedDB.open("BDFlux", 1);
    request.onerror = errorOpen;
    request.onupgradeneeded = createDatabase;

    request.onsuccess = function(event) {
        displayList(event.target.result);
    }
}, false);


function displayList(db) {

    // on ouvre une transaction qui permettra d'effectuer
    // la lecture. uniquement de la lecture -> "readonly"
    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    // on efface le formulaire
    var form = document.getElementById('fluxform');
    form.elements['flux_link'].value = ''
    form.elements['categorie'].value = ''
    
    // récupération de la table html
    var list = document.getElementById("listFlux");
    
    // on y efface tout
    list.innerHTML = '';

    // on récupère l'object store que l'on veut lire
    var fluxStore = transaction.objectStore("table_flux");
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	var tdSuppresion=document.createElement('td');
	
	//Listenner pour suppression
	tdSuppresion.addEventListener('click', function() {
	
			// on ouvre la base, et on déclare les listeners
		var request = window.webkitIndexedDB.open("BDFlux", 1);
		request.onerror = errorOpen;
		request.onupgradeneeded = createDatabase;

		request.onsuccess = function(event) {
		window.webkitIndexedDB.clear();
		}
	
	}, false);
	
        if (cursor) {
	
            var _flux = cursor.value; // un enregistrement
			
            // création de la ligne html dans le tableau
			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;
            tr.appendChild(tdFluxLink);

            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;
            tr.appendChild(tdCategorie);
			
			
			tdSuppresion.textContent= "[supprimer]";
			tr.appendChild(tdSuppresion);
			
            list.appendChild(tr);
			
			
            // on avance le curseur -> la callback onsuccess
            // sera appelée à nouveau
           cursor.continue();
        }
    }

}
   
 
