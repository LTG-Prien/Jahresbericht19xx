const NEW_PAGE = "https://ltgarchiv.wanderl.com/";
const OLD_PAGE = "https://ltg-prien.github.io/Jahresbericht19xx/";

const IS_NEW_PAGE = true;
const get = id => document.getElementById(id)
let link = document.createElement("link");
link.href = OLD_PAGE + "/assets/css/style.css";
link.rel = "stylesheet";
document.head.appendChild(link);

let div = document.createElement("div");
div.classList.add("overlay-actions");
div.innerHTML = `
			<div class="floating actions">
				<a href="#" id="btn-toggle-search">
					<!-- MIT License, (c) 2015-present Ionic (http://ionic.io) -->
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon s-ion-icon" viewBox="0 0 512 512">
						<path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" stroke-miterlimit="10"></path>
						<path stroke-linecap="round" stroke-miterlimit="10" d="M338.29 338.29L448 448"></path>
					</svg>
				</a>
				<a id="btn-new-page">
					<!-- MIT License, (c) 2015-present Ionic (http://ionic.io) -->
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon s-ion-icon" viewBox="0 0 512 512">
						<path d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212" stroke-linecap="round" stroke-linejoin="round"></path>
						<path d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256M400 179V64h-48v69" stroke-linecap="round" stroke-linejoin="round"></path>
					</svg>
				</a>
			</div>
`;
document.body.appendChild(div);

div = document.createElement("div");
div.classList.add("overlay-search");
div.classList.add("hidden");
div.id = "search";
div.innerHTML = `
			<div class="floating search">
				<div class="floating-inner">
					<input id="search-input"></input>
					<a href="#" id="btn-close-search">
						<!-- MIT License, (c) 2015-present Ionic (http://ionic.io) -->
						<svg xmlns="http://www.w3.org/2000/svg" class="ionicon s-ion-icon" viewBox="0 0 512 512">
							<path d="M400 145.49L366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z" stroke-miterlimit="10" class="sharp"></path>
						</svg>
					</a>
				</div>
				<div id="search-results"></div>
			</div>
`;
document.body.appendChild(div);
