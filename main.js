window.onload = initAll;
var xhr = false;
var tree = new PrefixTree();
var choicesArray = new Array();

function initAll() {
	document.getElementById("searchField").onfocus = searchSuggest;
	document.getElementById("searchField").onblur = function () {
		setTimeout(function () { document.getElementById("popups").style.display = "none"; }, 100)
	}

	document.getElementById("searchField").onkeyup = searchSuggest;


	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	}
	else {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e) { }
		}
	}

	if (xhr) {
		xhr.onreadystatechange = setchoicesArray;
		xhr.open("GET", "choices.txt", true);
		xhr.send(null);
	}
	else {
		alert("Sorry, but I couldn't create an XMLHttpRequest");
	}
}

function setchoicesArray() {
	if (xhr.readyState == 4) {
		if (xhr.status == 200) {
			choicesArray = xhr.responseText.split("\n");
			tree = new PrefixTree();
			for (var i = 0; i < choicesArray.length; i++) {
				tree.addWord(choicesArray[i]);
			}
		}
		else {
			alert("There was a problem with the request " + xhr.status);
		}
	}
}

function searchSuggest() {
	var str = document.getElementById("searchField").value;
	document.getElementById("searchField").className = "";
	document.getElementById("popups").style.display = "block";

	document.getElementById("popups").innerHTML = "";

	var filtered = tree.predictWord(str);
	for (var i = 0; i < filtered.length; i++) {
		var tempDiv = document.createElement("div");
		tempDiv.className = "suggestions";
		/*
		if(str.length != 0){
			tempDiv.innerHTML = "<span class = \"match\">" + str + "</span><span class=\"notMatch\">" + filtered[i].slice(str.length) + "</span>";
		}else{
			tempDiv.innerHTML = filtered[i];
		}
		*/
		tempDiv.innerHTML = "<span class = \"match\">" + str + "</span><span class=\"notMatch\">" + filtered[i].slice(str.length) + "</span>";
		tempDiv.onclick = makeChoice;
		document.getElementById("popups").appendChild(tempDiv);
	}
}

function makeChoice(evt) {
	var thisDiv = (evt) ? evt.target : window.event.srcElement;
	if(thisDiv.childNodes.length != 2){
		thisDiv = thisDiv.parentNode;
	}
	document.getElementById("searchField").value = thisDiv.childNodes[0].innerHTML + thisDiv.childNodes[1].innerHTML;
	document.getElementById("popups").innerHTML = "";
}
