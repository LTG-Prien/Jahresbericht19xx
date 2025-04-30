const get = id => document.getElementById(id)


// Leitet messages ans content-Frame weiter.
// (Siehe script in index.htm)
window.addEventListener("message", (event) => {
	if (event.data === "redirect") {
		window.location.href = NEW_PAGE
	} else
		get("content").contentWindow.postMessage(event.data, '*')
});


// Home-Button
window.addEventListener("load", () => {
	get("btn-new-page").href = NEW_PAGE;
	get("content").contentWindow.postMessage("page_url\n" + NEW_PAGE, "*")
});


// Timer um nach einer Minute Inaktivität zur Startseite zu leiten
(function () {
	let path = window.location.pathname;
	if (path === "/" || path.startsWith("/wp-")) {
		return;
	}
	
	let cb = () => window.location.href = NEW_PAGE;
	let ms = 1 * 60 * 1000;
	let idleTimeout = setTimeout(cb, ms);
	
	for (let event of ['click', 'touchstart', 'mousemove', 'scroll', 'keydown']) {
		document.addEventListener(event, () => {
			clearTimeout(idleTimeout);
			idleTimeout = setTimeout(cb, ms);
		}, false)
	}
})()
