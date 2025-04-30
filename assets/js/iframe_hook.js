if (!window.IFRAME_TIMER_HOOKED) {
	window.IFRAME_TIMER_HOOKED = true

	// Aktivitäts-Erkennung für Timer (Events innerhalb des iframes werden nicht vom Root-Frame erkannt)
	for (let event of ['click', 'touchstart', 'mousemove', 'scroll', 'keydown']) {
		document.addEventListener(event, () => {
			window.top.postMessage('reset_timer', '*')
		}, false)
	}
}
