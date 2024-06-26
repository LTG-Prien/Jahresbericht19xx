function toggleSearch() {
	get("search").classList.toggle("hidden")
	get("search").classList.toggle("shown")
	if (get("search").classList.contains("shown")) {
		get("search-input").value = ""
		get("search-input").focus()
	}
}

function closeSearch() {
	let resultsDOM = get("search-results")
	while (resultsDOM.children[0]) {
		resultsDOM.removeChild(resultsDOM.children[0])
	}

	get("search").classList.add("hidden")
	get("search").classList.remove("shown")
}

function search(event) {
	if (event.key === "Enter") {
		event.preventDefault();
	}

	if (event.key === "Escape") {
		closeSearch()
		return;
	}

	get("search-input").focus()

	let resultsDOM = get("search-results")
	while (resultsDOM.children[0]) {
		resultsDOM.removeChild(resultsDOM.children[0])
	}

	let text = get("search-input").value.trim().toLowerCase()
	if (text === "") {
		return
	}
	
	let results = [];
	for (let name of Object.keys(search_index)) {
		if (matches(text, name.toLowerCase())) {
			results.push(name)
		}
	}
	
	if (results.length == 0) {
		let span = document.createElement("span")
		span.innerText = `Keine Ergebnisse`;
		resultsDOM.append(span);
	} else {
		let resultsDOM = get("search-results")

		let hr = document.createElement("hr")
		resultsDOM.append(hr);
		let limit = results.length > 11 ? 10 : 11; // "1 weitere" vermeiden, da kann gleich der Name angezeigt werden

		for (let res of results.slice(0, limit)) {
			let a = document.createElement("a")
			a.innerText = res;
			resultsDOM.append(a);
			a.onclick=() => {
				let sr = search_index[res]
				sr = [Object.keys(sr)[0], Object.values(sr)[0].replace(/\D/, "")] // TODO
				get("content").contentWindow.postMessage('search_hit\n'+window.location+'\n'+sr[0]+'\n'+sr[1], '*')
				closeSearch()
			}
		}

		if (results.length > 11) {
			let span = document.createElement("span")
			span.innerText = `${results.length - 10} weitere`;
			resultsDOM.append(span);
		}
	}
}

function matches(search, name) {
	let nParts = name.split(" ")

	search:
	for (let sPart of search.split(" ")) {
		for (let nPart of nParts) {
			if (nPart.includes(sPart)) {
				// Teil gefunden
				continue search;
			}
		}

		// Teil nicht gefunden
		return false
	}

	// Alle Teile gefunden
	return true
}

window.addEventListener("load", () => {
	get("btn-toggle-search").addEventListener("click", toggleSearch)
	get("btn-close-search").addEventListener("click", closeSearch)
	get("search-input").addEventListener("keyup", search);
});
