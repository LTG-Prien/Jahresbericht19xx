// Such-Weiterleitung auf der alten Seite
function gotoBefore2000(res) {
	let classCode = res[1].replaceAll(/\D/g, "")
	if (parseInt(res[0]) < 65) {
		classCode = "0" + classCode
	}
	get("content").contentWindow.postMessage('search_hit\n'+window.location+'\n'+res[0]+'\n'+classCode+'\n'+res[1], '*')
}

function gotoAfter2000(res) {
	window.location.href = NEW_PAGE + `/schuljahr/${res[0]}/#flipbook-df_${flipbook_ids[res[0]]}/${search_index_new[res[0]][res[1]].page}/`
}

window.addEventListener("message", (event) => {
	if (!event.data.split) { return }
	let parts = event.data.split("\n")

	if (parts[0] === "load_info") {
		if (window.location.hash.length > 1) {
			gotoBefore2000(window.location.hash.substring(1).split(","))
		}
		window.location.hash = ""
	}

});
