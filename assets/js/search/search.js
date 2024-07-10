var currentSearchSelection = null;

// search_aliases in search_index mergen
for (let alias of Object.keys(search_aliases)) {
	let name = search_aliases[alias]
	search_index[name] = { ...search_index[name], ...search_index[alias] }
	delete search_index[alias]
}

// search_index_new in search_index mergen
for (let year of Object.keys(search_index_new)) {
	for (let cls of Object.keys(search_index_new[year])) {
		for (let pupil of search_index_new[year][cls].pupils) {
			pupil = pupil.replace(', ', ' ').trim()
			search_index[pupil] = {...search_index[pupil]}
			search_index[pupil][year] = cls
		}
	}
}

function toggleSearch() {
	get("search").classList.toggle("hidden")
	get("search").classList.toggle("shown")
	if (get("search").classList.contains("shown")) {
		currentSearchSelection = null;
		get("search-input").value = ""
		get("search-input").placeholder = "Name..."
		get("search-input").focus()
		let resultsDOM = get("search-results")
		while (resultsDOM.children[0]) {
			resultsDOM.removeChild(resultsDOM.children[0])
		}
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
	if (text === "" && !currentSearchSelection) {
		return
	}
	
	let results = [];
	if (currentSearchSelection) {
		for (let year of Object.keys(currentSearchSelection)) {
			let value = `Klasse ${currentSearchSelection[year]} (19${year})`
			if (matches(text, value.toLowerCase())) {
				results.push([year, currentSearchSelection[year]])
			}
		}
	} else {
		for (let name of Object.keys(search_index)) {
			if (matches(text, name.toLowerCase())) {
				results.push(name)
			}
		}
		for (let name of Object.keys(search_aliases)) {
			let alias = search_aliases[name]
			if (matches(text, name.toLowerCase()) && !matches(text, alias.toLowerCase() /* nicht 2x anzeigen */)) {
				results.push(alias)
			}
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
			if (currentSearchSelection) {
				let cls = res[0]
				if (cls.length < 4) {
					cls = '19' + cls + '-19' + (parseInt(cls) + 1)
				}

				a.innerText = `Klasse ${res[1]} (${cls})`;
				a.onclick=() => {
					if (res[0].length < 4) {
						gotoBefore2000(res)
					} else {
						gotoAfter2000(res)
					}
					closeSearch()
				}
			} else {
				a.innerText = res;
				a.onclick=() => {
					currentSearchSelection = search_index[res]
					get("search-input").placeholder = "Klasse..."
					get("search-input").value = ""
					search({})
				}
			}

			resultsDOM.append(a);
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
