// PARTIE RSS

$(document).ready(function(){
  
			
});

function OpenBox()
{
$('.divSrc').toggle();
}

function changeFeedUrl(numRss)
{
var cnt= 5;
var showDate=new Boolean();
showDate=true;

var showDescription=new Boolean();
showDescription=true;

if($('#txtCount'+numRss).val()!="") cnt=parseInt($('#txtCount'+numRss).val());
if (! $('#chkDate'+numRss).attr('checked')) showDate=false;
if (! $('#chkDesc'+numRss).attr('checked')) showDescription=false;

 $('#divRss'+numRss).FeedEk({
   FeedUrl : $('#txtUrl'+numRss).val(),
   MaxCount : cnt,
   ShowDesc : showDescription,
   ShowPubDate: showDate
  });
}


(function($){
	$.fn.FeedEk=function(opt){
		var def={FeedUrl:'',MaxCount:5};
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
				$('#'+idd).append('<li><em class\"aside\"></em><em class="aside end"><time>'+pubdt.toLocaleDateString()+'</time></em><dl><dt>'+entry.title+'</dt><dd><span>'+entry.content+'</span></dd></dl></li>');
			})
			$('#'+idd).append('</li>');
		}})
	}
})
(jQuery);

//Fonction qui gère les onglets
function multiClass(eltId) {
		arrLinkId = new Array('_1','_2','_3','_4','_5','_6');
		intNbLinkElt = new Number(arrLinkId.length);
		arrClassLink = new Array('current','ghost');
		strContent = new String()
		for (i=0; i<intNbLinkElt; i++) {
			strContent = "menu"+arrLinkId[i];
			if ( arrLinkId[i] == eltId ) {
				document.getElementById(arrLinkId[i]).className = arrClassLink[0];
				document.getElementById(strContent).className = 'on content';
			} else {
				document.getElementById(arrLinkId[i]).className = arrClassLink[1];
				document.getElementById(strContent).className = 'off content';
			}
		}
	}
	
	
	

// PARTIE INDEXDB

/** Déclaration*/
 var TableauFlux= new Array();

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


    // on récupère l'object store que l'on veut lire
    var fluxStore = transaction.objectStore("table_flux");
	var i = 1;
	
    fluxStore.openCursor().onsuccess = function (event) {

    var cursor = event.target.result;
	
        if (cursor) {
	
            var _flux = cursor.value; // un enregistrement
			
            // création de la ligne html dans le tableau
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
				var reference_flux = document.getElementById('menu_1');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"new\">';
			}
			else if(categorie == 'Spor'){
				var reference_flux = document.getElementById('menu_2');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"sport\">';
			}
			else if(categorie == 'Econ'){
				var reference_flux = document.getElementById('menu_3');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"economie\">';
			}	
			else if(categorie == 'Tech'){
				var reference_flux = document.getElementById('menu_4');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"technologie\">';
			}	
			else if(categorie == 'Cult'){
				var reference_flux = document.getElementById('menu_5');	
				var rss_li = '<li data-state=\"withSource\" data-tag=\"culture\">';
			}	
			else{
				var reference_flux = document.getElementById('menu_6');
				var rss_li = '<li data-state=\"withSource\" data-tag=\"people\">';
			}	
			
			rss_li += '<div id=\"divRss'+i+'\" style="width:100%"></div>';
			
			new_div.innerHTML = rss_li;
			reference_flux.appendChild(new_div);

			  
			$('#divRss'+i).FeedEk({
				FeedUrl : tdFluxLink.textContent,
			   MaxCount : 3,
			});
			  
			
            // on avance le curseur -> la callback onsuccess
            // sera appelée à nouveau
			i++;
            cursor.continue();
        }
    }

}

