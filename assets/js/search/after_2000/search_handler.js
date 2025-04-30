// Such-Weiterleitung auf der neuen Seite
function gotoBefore2000(res) {
	window.location.href = OLD_PAGE + `/#${res[0]},${res[1]}`
}

function gotoAfter2000(res) {
	window.location.href = NEW_PAGE + `/schuljahr/${res[0]}/#flipbook-df_${flipbook_ids[res[0]]}/${search_index_new[res[0]][res[1]].page}/`
}
