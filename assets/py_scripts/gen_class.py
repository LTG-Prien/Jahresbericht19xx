text = """
Q12

Abel, Ludwig
Alakesh, Amjad
Auer, Samuel
Bachmaier, Eva Maria
Bachmann, Tim
Badenberg, Julia
Bauer, Hannah
Baumgartner, Kilian
Berquet, Antonio
Brandmiller, Carolin
Brandstetter, Anthony
Breitrainer, Simon
Brenner, Lilli
Cruz Reif, Daniel
Daxenberger, Lukas
Decker, Lucas
Demmel, Leonie
Demmel, Regina
Dietze, Emilia
Doleschal, Lukas
Dreikorn, Magdalena
Eberl, Elisabeth
Ebner, Elias
Eckenberger, Chiara
Eckstein, Irene
Ehrl, Alina
Fellner, Philipp
Fieber, Anna-Lena
Fleischer, Martin
Frank, Laura
Gladigau, Moritz
Grasmeier, Emilia
Grimminger, Amélie
Gropp, Fenia
Gsell, Cyrill
Haaser, Amelie
Habl, Genoveva
Hacker, Patrick
Hartl, Rebecca
Hartl, Tobias
Hein, Maximiliane
Hofmann, Viktoria
Q12 Martin Böswald, Christian Karl
Holub, Anna
Höper, Florian
Huber, Raphael
Hübl, Marinus
Igel, Sophia
Kapser, Lukas
Keller, Sebastian
Kemna, Lena
Ketnakrop, Aphinat
Kink, Dominic
Kollmannsberger, Vitus
Krechtner, Julian
Kremser, Simon
Kulle, Matilda
Laser, Valentin
Leube, Isabella
Luesebrink, Maximilian
Maier, Léonie
Mette, Johannes
Moll, Raphael
Moll, Roman
Mutlucan, Dilara
Natterer, Luis
Novomestská, Nona
Nowotny, Julia
Oprea, Dariana
Pertl, Florian
Pertl, Maria
Pfaffinger, Lena
Pfaffinger, Marinus
Rackow, Florian
Ramsauer, Nele
Reichold, Lea
Reininger, Amelie
Reitzenstein, Alexandra
Riffel, Sofia
Römer, Ben
Römer, Luca
Rost, Julia
Rotter, Lukas
Rüsseler, Mara
Baron von Sass, Leopold
Sawaizumi, Sara
Schenk, Sebastian
Schlöricke, Josef
Schmid, Johannes
Schnebel, Ferdinand
Schultheiß, Till
Schütze, Maximilian
Söllner, Finn
Sommer, Elisa
Stadler, Hannah
Stangl, Lea
Stattrop, Tim
Stelmach, Nathalie
Stettner, Leonie
Sulzer, Anna-Maria
Vokrri, Leonit
Wagner, Benedikt
Weigand, Natalie
Weiser, Christian
Weiser, Nicola
Weißenbacher, Benjamin
Westermeyr, Valentin
Winkler, Rafaela
Zangl, Simon
Zanier, Felix
Ritter von Zumbusch, Severin
"""

import re

texts = []
for part in text.strip().split('\n'):
    if not part.strip() or part.startswith("Leiter: "):
        continue

    part = re.sub(r" \d\d\.\d\d\.\d\d\d\d", "", part)
    texts = [*texts, part]

if "Klasse" in texts[0]:
    title = re.match(r"^\d*Klasse (\d+[a-e])$", texts[0])[1]
elif "Kollegstufe" in texts[0]:
    title = re.match(r"^\d*Kollegstufe (K\d+)$", texts[0])[1]
else:
    title = texts[0]
print('"' +title + '":{"page":00,"pupils":' + repr(texts[1:]).replace("'", '"') + '},')
