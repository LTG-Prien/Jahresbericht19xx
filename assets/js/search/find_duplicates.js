let names = Object.keys(search_index);

let start = Date.now(), hits = 0;
let duplicates = [];
for (let i = 0; i < names.length; i++) {
	for (let j = i + 1; j < names.length; j++) {
		hits++
		if (levenshtein(names[i].toLowerCase(), names[j].toLowerCase()) < 3) {
			duplicates.push([names[i], names[j]])
		}
	}
}
let end = Date.now();
console.log("Duplicates:", duplicates)
console.log("Found", duplicates.length, "duplicates in", (end - start), "ms (eq. ", hits, "ops)")
