Q5.modules.display = ($) => {
	if (!$.canvas || $._isGraphics) return;

	let c = $.canvas;

	$.MAXED = 'maxed';
	$.SMOOTH = 'smooth';
	$.PIXELATED = 'pixelated';

	if (Q5._instanceCount == 0 && !Q5._server) {
		document.head.insertAdjacentHTML(
			'beforeend',
			`<style>
html, body {
	margin: 0;
	padding: 0;
}
.q5Canvas {
	outline: none;
	-webkit-touch-callout: none;
	-webkit-text-size-adjust: none;
	-webkit-user-select: none;
	overscroll-behavior: none;
}
.q5-pixelated {
	image-rendering: pixelated;
	font-smooth: never;
	-webkit-font-smoothing: none;
}
.q5-centered,
.q5-maxed {
  display: flex;
	align-items: center;
	justify-content: center;
}
main.q5-centered,
main.q5-maxed {
	height: 100vh;
}
main {
	overscroll-behavior: none;
}
</style>`
		);
	}

	$._adjustDisplay = (forced) => {
		let s = c.style;
		// if the canvas doesn't have a style,
		// it may be a server side canvas, so return
		if (!s) return;
		if (c.displayMode == 'normal') {
			// unless the canvas needs to be resized, return
			if (!forced) return;
			s.width = c.w * c.displayScale + 'px';
			s.height = c.h * c.displayScale + 'px';
		} else {
			let parent = c.parentElement.getBoundingClientRect();
			if (c.w / c.h > parent.width / parent.height) {
				if (c.displayMode == 'centered') {
					s.width = c.w * c.displayScale + 'px';
					s.maxWidth = '100%';
				} else s.width = '100%';
				s.height = 'auto';
				s.maxHeight = '';
			} else {
				s.width = 'auto';
				s.maxWidth = '';
				if (c.displayMode == 'centered') {
					s.height = c.h * c.displayScale + 'px';
					s.maxHeight = '100%';
				} else s.height = '100%';
			}
		}
	};

	$.displayMode = (displayMode = 'normal', renderQuality = 'smooth', displayScale = 1) => {
		if (Q5._server) return;

		if (typeof displayScale == 'string') {
			displayScale = parseFloat(displayScale.slice(1));
		}
		if (displayMode == 'fullscreen') displayMode = 'maxed';
		if (displayMode == 'center') displayMode = 'centered';

		if (c.displayMode) {
			c.parentElement.classList.remove('q5-' + c.displayMode);
			c.classList.remove('q5-pixelated');
		}

		c.parentElement.classList.add('q5-' + displayMode);

		if (renderQuality == 'pixelated') {
			c.classList.add('q5-pixelated');
			$.pixelDensity(1);
			$.defaultImageScale(1);
			if ($.noSmooth) $.noSmooth();
			if ($.textFont) $.textFont('monospace');
		}

		Object.assign(c, { displayMode, renderQuality, displayScale });

		if ($.ctx) $.pushStyles();
		$._adjustDisplay(true);
		if ($.ctx) $.popStyles();
	};

	$.fullscreen = (v) => {
		if (v == undefined) return document.fullscreenElement;
		if (v) document.body.requestFullscreen();
		else document.exitFullscreen();
	};
};
