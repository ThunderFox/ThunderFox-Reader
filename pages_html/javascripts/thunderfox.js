// PARTIE RSS


(function($){
	$.fn.FeedEk=function(opt){
		var def={FeedUrl:'',MaxCount:5,titre:''};
		if(opt){$.extend(def,opt)}
		var idd=$(this).attr('id');
		if(def.FeedUrl==null||def.FeedUrl==''){
			$('#'+idd).empty();return
		}
		var pubdt;
		//$('#'+idd).empty().append('<div style="text-align:left; padding:3px;"><img src="loader.gif" /></div>');
		$.ajax({url:'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+def.MaxCount+'&output=json&q='+encodeURIComponent(def.FeedUrl)+'&callback=?',dataType:'json',success:function(data){
			$('#'+idd).empty();
			$.each(data.responseData.feed.entries,function(i,entry){
				pubdt=new Date(entry.publishedDate);
				var content = escapeHtml(entry.content);
				//console.log(entry.content);
				var title = escapeHtml(entry.title);
				//console.log(title);
				var source = escapeHtml(def.titre);
				/*var uriSource = window.location;
				var parameters = uriSource.split("&");
				var i = O;
				while(parameters[i]!=null)
				{
					i++;
				}
				var temp = parameters[i];
				var pagesource = decodeURI(temp);
				alert("page source = "+pagesource);*/
				$('#'+idd).append('<li><a href=\"./article.html?title='+title+'&content='+content+'&source='+source+'&date='+pubdt.toLocaleDateString()+'&hours='+pubdt.toLocaleTimeString()+'\" style=\"text-decoration:none\"><em class\"aside\"></em><em class="aside end"><time>'+dateFrance(pubdt)+'</br>'+pubdt.getHours()+":"+pubdt.getMinutes()+'</time></em><dl><dt>'+entry.title+'</dt><dd><span>'+def.titre+'</span></dd></dl></a></li>');
			})
			$('#'+idd).append('</li>');
		}})
	}
})
(jQuery);

function dateFrance(d) {

	var date = "";
	var mois = "";
	if(d.getMonth()<10){
		mois = "0"+(d.getMonth()+1)
	}
	else{
	mois = (d.getMonth()+1)
	}
	
	date = d.getDate()+"/"+mois+"/"+d.getFullYear();
	
	return date;
}

//if(pubdt.getMonth()<10){"0"+pubdt.getMonth()+1}else{pubdt.getMonth()+1}


function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "et")
	  .replace(/#/g, "")
	  .replace(/=/, "")
	  .replace(/$/, "")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}


// PARTIE INDEXDB

/** D�claration*/
var indexedDB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

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
	  
// on ajoute un listener sur le load de la fen�tre, pour remplir
// la liste des flux, si pr�sent
// Listenner pour affichage
window.addEventListener('load', function(event) {
    // on ouvre la base, et on d�clare les listeners
    var request = indexedDB.open("BDFlux", 1);
    request.onerror = errorOpen;
    request.onupgradeneeded = createDatabase;

    request.onsuccess = function(event) {
		var page = document.getElementById('page'); 
		if(page.getAttribute('name') == 'all')
			displayList_all(event.target.result);
		else if(page.getAttribute('name') == 'actualites')
			displayList_actu(event.target.result);	
		else if(page.getAttribute('name') == 'technologies')
			displayList_tech(event.target.result);
		else if(page.getAttribute('name') == 'sport')
			displayList_sport(event.target.result);	
		else if(page.getAttribute('name') == 'economie')
			displayList_economie(event.target.result);		
		else if(page.getAttribute('name') == 'culture')
			displayList_culture(event.target.result);	
		else if(page.getAttribute('name') == 'cinema')
			displayList_cinema(event.target.result);		
		else if(page.getAttribute('name') == 'people')
			displayList_people(event.target.result);	
    }
}, false);


function displayList_all(db) {

    // on ouvre une transaction qui permettra d'effectuer
    // la lecture. uniquement de la lecture -> "readonly"
    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };


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

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;

			
			//ON AFFICHE LES FLUX RSS (au chargement de la page) ICI !!!
			var new_div = document.createElement('div');
			var categorie = tdCategorie.textContent.substring(0,4);
			
			if(categorie == 'Actu'){
				var reference_flux = document.getElementById('menu_0');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"news\">';
			}
			else if(categorie == 'Spor'){
				var reference_flux = document.getElementById('menu_1');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"sport\">';
			}
			else if(categorie == 'Econ'){
				var reference_flux = document.getElementById('menu_2');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"economie\">';
			}	
			else if(categorie == 'Tech'){
				var reference_flux = document.getElementById('menu_3');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"technologie\">';
			}	
			else if(categorie == 'Cult'){
				var reference_flux = document.getElementById('menu_4');	
				var rss_li = '<li data-state=\"withSource\" data-tag=\"culture\">';
			}	
			else if(categorie == 'Cine'){
				var reference_flux = document.getElementById('menu_5');	
				var rss_li = '<li data-state=\"withSource\" data-tag=\"cinema\">';
			}
			else if(categorie == 'Peop'){
				var reference_flux = document.getElementById('menu_6');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"people\">';
			}	
			else{
				var reference_flux = document.getElementById('menu_7');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"divers\">';
			}
			
			rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
			new_div.innerHTML = rss_li;
			reference_flux.appendChild(new_div);

			  
			$('#divRss'+i).FeedEk({
			   FeedUrl : tdFluxLink.textContent,
			   MaxCount : 3,
			   titre : tdTitre.textContent
			});
			  
			
            // on avance le curseur -> la callback onsuccess
            // sera appel�e � nouveau
			i++;
            cursor.continue();
        }
    }
}


function displayList_actu(db) {

    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; 

			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;

			
			var new_div = document.createElement('div');
			var categorie = tdCategorie.textContent.substring(0,4);
			
			if(categorie == 'Actu'){
				var reference_flux = document.getElementById('flux_rss');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"news\">';
				rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
				new_div.innerHTML = rss_li;
				reference_flux.appendChild(new_div);

				  
				$('#divRss'+i).FeedEk({
					FeedUrl : tdFluxLink.textContent,
				    MaxCount : 5,
					titre : tdTitre.textContent
				});
			}		
			
			i++;
            cursor.continue();
        }
    }
}


function displayList_tech(db) {

    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; 

			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;

			
			var new_div = document.createElement('div');
			var categorie = tdCategorie.textContent.substring(0,4);
			
			if(categorie == 'Tech'){
				var reference_flux = document.getElementById('flux_rss');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"technologie\">';
				rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
				new_div.innerHTML = rss_li;
				reference_flux.appendChild(new_div);

				  
				$('#divRss'+i).FeedEk({
					FeedUrl : tdFluxLink.textContent,
				    MaxCount : 5,
					titre : tdTitre.textContent
				});
			}		
			
			i++;
            cursor.continue();
        }
    }
}

function displayList_sport(db) {

    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; 

			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;

			
			var new_div = document.createElement('div');
			var categorie = tdCategorie.textContent.substring(0,4);
			
			if(categorie == 'Spor'){
				var reference_flux = document.getElementById('flux_rss');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"sport\">';
				rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
				new_div.innerHTML = rss_li;
				reference_flux.appendChild(new_div);

				  
				$('#divRss'+i).FeedEk({
					FeedUrl : tdFluxLink.textContent,
				    MaxCount : 5,
					titre : tdTitre.textContent
				});
			}		
			
			i++;
            cursor.continue();
        }
    }
}


function displayList_economie(db) {

    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; 

			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;

			
			var new_div = document.createElement('div');
			var categorie = tdCategorie.textContent.substring(0,4);
			
			if(categorie == 'Econ'){
				var reference_flux = document.getElementById('flux_rss');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"technologie\">';
				rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
				new_div.innerHTML = rss_li;
				reference_flux.appendChild(new_div);

				  
				$('#divRss'+i).FeedEk({
					FeedUrl : tdFluxLink.textContent,
				    MaxCount : 5,
					titre : tdTitre.textContent
				});
			}		
			
			i++;
            cursor.continue();
        }
    }
}


function displayList_culture(db) {

    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; 

			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;

			
			var new_div = document.createElement('div');
			var categorie = tdCategorie.textContent.substring(0,4);
			
			if(categorie == 'Cult'){
				var reference_flux = document.getElementById('flux_rss');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"culture\">';
				rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
				new_div.innerHTML = rss_li;
				reference_flux.appendChild(new_div);

				  
				$('#divRss'+i).FeedEk({
					FeedUrl : tdFluxLink.textContent,
				    MaxCount : 5,
					titre : tdTitre.textContent
				});
			}		
			
			i++;
            cursor.continue();
        }
    }
}


function displayList_cinema(db) {

    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; 

			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;

			
			var new_div = document.createElement('div');
			var categorie = tdCategorie.textContent.substring(0,4);
			
			if(categorie == 'Cine'){
				var reference_flux = document.getElementById('flux_rss');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"cinema\">';
				rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
				new_div.innerHTML = rss_li;
				reference_flux.appendChild(new_div);

				  
				$('#divRss'+i).FeedEk({
					FeedUrl : tdFluxLink.textContent,
				    MaxCount : 5,
					titre : tdTitre.textContent
				});
			}		
			
			i++;
            cursor.continue();
        }
    }
}


function displayList_people(db) {

    var transaction = db.transaction(["table_flux"], "readonly");
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {
       window.alert('erreur de transaction lecture ');
    };

    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; 

			var tr = document.createElement('tr');
		
            var tdFluxLink = document.createElement('td');
            tdFluxLink.textContent = _flux.flux_link;

			var tdTitre = document.createElement('td');
			tdTitre.textContent = _flux.titre;
			
            var tdCategorie = document.createElement('td');
            tdCategorie.textContent = _flux.categorie;

			
			var new_div = document.createElement('div');
			var categorie = tdCategorie.textContent.substring(0,4);
			
			if(categorie == 'Peop'){
				var reference_flux = document.getElementById('flux_rss');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"people\">';
				rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
				new_div.innerHTML = rss_li;
				reference_flux.appendChild(new_div);

				  
				$('#divRss'+i).FeedEk({
					FeedUrl : tdFluxLink.textContent,
				    MaxCount : 5,
					titre : tdTitre.textContent
				});
			}		
			
			i++;
            cursor.continue();
        }
    }
}