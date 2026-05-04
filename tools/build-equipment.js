#!/usr/bin/env node
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const sourceMd = path.join(repoRoot, 'tools', 'source', 'cnc-equipment.md');

const PACKS = {
  armor: path.join(repoRoot, 'packs-src', 'armor'),
  weapons: path.join(repoRoot, 'packs-src', 'weapons'),
  equipment: path.join(repoRoot, 'packs-src', 'equipment'),
};

const FOLDERS = {
  armor: ['Light', 'Medium', 'Heavy', 'Shields', 'Helms'],
  weapons: ['Melee', 'Missile'],
  equipment: [
    'Adventuring Gear',
    'Containers',
    'Instruments',
    'Scholarly',
    'Clothing',
    'Provisions',
    'Tack',
  ],
};

// Equipment table → folder routing. Items not listed default to Adventuring Gear.
const EQUIPMENT_FOLDERS = {
  Containers: new Set([
    'Backpack',
    'Barrel, Large',
    'Barrel, Small',
    'Basket',
    'Belt Pouch, Large',
    'Belt Pouch, Small',
    'Belt Pouch, Spell Component',
    'Bottle',
    'Bucket',
    'Canteen',
    'Case, Map or Scroll',
    'Casket',
    'Chest, Large',
    'Chest, Small',
    'Flask',
    'Gord',
    'Pack, Shoulder',
    'Quiver, Dozen',
    'Quiver, Score',
    'Sack, Large',
    'Sack, Small',
    'Trunk, travel',
    'Vial (1 ounce)',
    'Waterskin (1 gallon)',
  ]),
  Instruments: new Set([
    'Bagpipe',
    'Diggery-do',
    'Drum',
    'Fife',
    'Flute',
    'Gong',
    'Harp',
    'Horn',
    'Mandolin',
    'Panpipes',
    'Whistle',
    'Zither',
  ]),
  Scholarly: new Set([
    'Chalk (per piece)',
    'Ink (1 ounce)',
    'Lodestone',
    'Paper (10 sheets)',
    'Parchment (10 sheets)',
    'Quill',
    'Sealing Wax',
    'Vellum (10 sheets)',
  ]),
};

// Provisions & Lodging — items kept (carryable on adventure).
const PROVISIONS_KEEP = new Set([
  'Cheese, Block',
  'Grains, Bag',
  'Liquor, Cask',
  'Rations (1 day)',
  'Rations (1 week)',
  'Tea Leaves, 1 lb',
  'Tobacco, 1 lb',
  'Wine, Common (Bottle)',
  'Wine, Fine (Bottle)',
]);

// Transport & Tack — items kept (tack only, no transport).
const TACK_KEEP = new Set([
  'Barding, Chain',
  'Barding, Full Plate',
  'Barding, Leather',
  'Barding, Padded',
  'Barding, Studded',
  'Bit and Bridle',
  'Feed (per day)',
  'Harness',
  'Saddle',
  'Saddle Bags',
  'Saddle Blanket',
]);

const DESCRIPTIONS = {
  // Helms
  Armet: 'A fully enclosed late-medieval helmet with a hinged visor and rounded skull, offering excellent protection to the head and face.',
  Bacinet: 'A pointed steel skullcap, often worn under a great helm or fitted with a movable visor.',
  Benin: 'A simple open-faced cap of boiled leather or thin steel reinforced with bands.',
  Casquetel: 'An open-faced helmet with a brim and cheek pieces, popular among footmen.',
  'Coif, Chain Mail': 'A hood of riveted chain links worn over a padded cap, protecting the head, neck, and shoulders.',
  'Coif, Leather': 'A close-fitting hood of stiffened leather laced beneath the chin.',
  'Helm, Great': 'A flat-topped, fully enclosed helm worn over a padded cap or coif, offering the head total cover at the cost of vision.',
  'Helm, Normal': 'A standard steel helmet that covers the skull and protects the cheeks and back of the neck.',
  'Helm, Norman': 'A conical iron helm with a riveted nasal bar, common among Norman and early medieval warriors.',
  'Helm, Pot': 'A simple cylindrical iron helm with no visor — a soldier\'s plain head protection.',
  'War Hat': 'A wide-brimmed steel hat (kettle hat) that shelters the head and shoulders from blows from above.',

  // Armors
  'Padded Armor': 'A quilted coat of layered cloth, the cheapest of armors and a common base layer beneath heavier mail.',
  'Leather Coat': 'A heavy coat of soft leather offering minimal protection against light blows.',
  'Leather Armor': 'A jerkin and leggings of boiled and shaped leather, light and easy to wear.',
  'Ring Mail': 'Heavy leather sewn with metal rings, providing modest protection against slashing weapons.',
  Hide: 'Tough, untanned animal hides cured into rugged armor — heavy but easy to make.',
  'Studded Leather': 'Leather armor reinforced with tightly spaced metal studs to deflect cutting weapons.',
  'Laminar, Leather': 'Strips of hardened leather lashed together in horizontal bands, offering flexible protection.',
  'Chain Mail Shirt': 'A short-sleeved hauberk of interlocking riveted rings covering the torso and shoulders.',
  'Scale Mail': 'Overlapping metal scales sewn or laced to a leather backing, like the hide of a fish.',
  'Cuir Bouille': 'Heavy leather hardened in hot wax until it is nearly as rigid as wood.',
  'Breastplate, bronze': 'A solid bronze breastplate worn over a padded undergarment, evoking the panoplies of antiquity.',
  Brigadine: 'A jacket of cloth or leather lined with small overlapping steel plates riveted into place.',
  'Breastplate, steel': 'A finely shaped steel cuirass that protects the torso while leaving the limbs unencumbered.',
  'Chain Mail Hauberk': 'A long-sleeved coat of interlocking steel rings reaching to the knees.',
  'Coat of Plates': 'A heavy fabric coat lined with overlapping steel plates riveted on the inside.',
  'Ensemble, Greek (Bronze)': 'A bronze panoply: cuirass, greaves, vambraces, and a medium helm in the manner of a Greek hoplite.',
  'Banded Mail': 'Horizontal strips of overlapping steel banded together over a chain or padded undercoat.',
  'Splint Mail': 'Vertical strips of steel riveted to a leather or chain backing, worn over the limbs and torso.',
  'Ensemble, Greek (Iron)': 'A heavier Greek panoply made entirely of iron — cuirass, greaves, vambraces, and helm.',
  'Ensemble, Roman (Scale)': 'Roman scale armor with copper greaves, vambraces, and helmet — armor of an auxiliary soldier.',
  'Full Chain Suit': 'A full suit of chain mail covering the torso, limbs, and head with attached coif and chausses.',
  'Plate Mail': 'A combination of plate, mail, and padding covering the entire body — the standard armor of a knight.',
  'Ensemble, Roman (Segmented)': 'A complete suit of Roman segmented armor (lorica segmentata) with iron greaves, vambraces, and helmet.',
  'Full Plate': 'A full suit of articulated plate armor, fully enclosing the wearer in steel.',
  'Polish Hussar': 'A finely articulated plate harness in the style of a Polish winged hussar — among the finest armors made.',

  // Shields
  Buckler: 'A small steel disk strapped to the forearm, used to parry incoming blows.',
  'Shield, Small Steel': 'A small round steel shield used to block blows from a single foe at a time.',
  'Shield, Small Wooden': 'A small wooden shield reinforced with iron banding around the rim.',
  'Shield, Med. Steel': 'A round or kite-shaped steel shield large enough to deflect attacks from two foes in a round.',
  'Shield, Med. Wooden': 'A medium wooden shield faced with hide or leather and rimmed with iron.',
  'Shield, Large Steel': 'A large steel shield, the size of a small door — bulky to wield but excellent cover.',
  'Shield, Large Wooden': 'A large wooden shield, often kite-shaped, suited for foot soldiers and cavalry alike.',
  Pavis: 'A massive shield made to be planted on the ground and fired over, like a portable wall — favored by crossbowmen.',

  // Melee weapons
  'Axe, Battle': 'A single-bladed war axe well balanced for one-handed combat.',
  'Axe, Bearded': 'A long-bladed axe with a hooked lower edge that can catch shields and limbs.',
  'Axe, Hand/Throwing': 'A small balanced hatchet built for hurling at distant foes.',
  'Axe, Piercing': 'A war axe whose head ends in a spiked back, designed to punch through armor.',
  'Axe, Two-Handed': 'A great two-handed axe wielded with massive sweeping blows.',
  Bardiche: 'A long-hafted polearm with an enormous curved blade — a peasant\'s great axe.',
  'Bec De Corbin': 'A polearm tipped with a hammer, spike, and beak, made to crush and pierce plate armor.',
  'Bill or Billhook': 'A polearm with a curved cleaver-like blade and back-spike, evolved from the agricultural billhook.',
  'Brass Knuckles': 'A loop of cast brass worn over the knuckles to add weight and bite to a punch.',
  'Cat-O-Nine-Tails': 'A short whip with nine knotted leather tails, often weighted with bone or metal.',
  Cestus: 'A leather and metal hand wrap that adds bite to a fist; can be worn while wielding another weapon.',
  Cleaver: 'A heavy butcher\'s blade — a passable improvised weapon.',
  Club: 'A simple length of hardwood, the most common improvised weapon. Can also be hurled at close range.',
  Crowbill: 'A short hammer-like weapon with a long curved spike, made to puncture plate.',
  Dagger: 'A double-edged knife of about a foot in length, suitable for stabbing or throwing.',
  Dirk: 'A long thrusting knife favored as a sidearm and for close combat.',
  Fauchard: 'A polearm with a curved single-edged blade resembling a scythe set on a long pole.',
  'Fauchard Fork': 'A fauchard with an additional thrusting fork at the tip for added piercing capability.',
  Fist: 'An unarmed punch — the weapon you always have on you.',
  'Flail, Heavy': 'A long-hafted flail with a heavy spiked or studded head joined to the haft by chain.',
  'Flail, Light': 'A one-handed flail with a small chained head that swings around shields and parries.',
  'Flatchet (long knife)': 'An oversized knife or short cleaver, halfway between a dagger and a short sword.',
  'Fork, Military': 'A polearm tipped with a long pair of stout iron prongs.',
  'Gauntlet, Spiked': 'An armored glove fitted with spikes on the back of the hand and knuckles.',
  Glaive: 'A polearm with a single-edged blade fixed to a long shaft.',
  'Glaive Guisarme': 'A glaive combined with a guisarme — a slashing blade with a back hook for unhorsing riders.',
  Godentag: 'A spiked iron-shod club, much favored by Flemish footmen against mounted knights.',
  Guisarme: 'A polearm with a curved blade and a hook on the back for pulling riders from their saddles.',
  Halberd: 'A long polearm combining axe blade, top-spike, and rear hook — the soldier\'s polearm of choice.',
  'Hammer, Light': 'A small hammer balanced for one hand or for throwing at short range.',
  'Hammer, War': 'A heavy single-handed war hammer with a spike opposite the striking face.',
  Hatchet: 'A small one-handed axe with a short haft and broad cutting edge.',
  'Hook, hafted': 'A short polearm tipped with a curved iron hook used to drag and trip foes.',
  Katar: 'A push-dagger with a triangular blade and a horizontal grip, punched forward with the fist.',
  Knife: 'A common belt knife — short, single-edged, and adequate for close work or throwing.',
  'Lance, Heavy': 'A heavy cavalry lance designed to be couched under the arm and driven home with the weight of horse and rider.',
  'Lance, Light': 'A lighter cavalry lance, used by light horse and skirmishers.',
  'Lucerne Hammer': 'A polearm with a hammer head, top spike, and rear pick — a Swiss footman\'s weapon.',
  'Mace, Heavy': 'A heavy flanged mace meant to crush helms and break bones through armor.',
  'Mace, large': 'A two-handed cavalry mace with a long haft and a heavy head.',
  'Mace, Light': 'A light one-handed mace, balanced for swift strikes.',
  'Main Gauche': 'A long parrying dagger held in the off-hand to deflect blows and trap an opponent\'s blade.',
  'Man Catcher': 'A long polearm ending in a sprung hoop that snaps shut to trap a foe by the neck or limb.',
  Maul: 'A great two-handed sledge hammer suitable for bashing in helms or doors.',
  Morningstar: 'A spiked club with a star-shaped head fitted to a stout wooden haft.',
  Partisan: 'A spear with a broad triangular head and small projecting wings at its base.',
  'Pick, Heavy': 'A heavy war pick with a curved spike for punching through plate.',
  'Pick, Light': 'A one-handed war pick, narrow and balanced for quick strikes.',
  Pike: 'An exceptionally long thrusting spear, the chief weapon of massed footmen.',
  Poniard: 'A fine narrow stiletto designed for thrusting through armor gaps.',
  Ranseur: 'A polearm whose central spike is flanked by two crescent prongs for catching weapons and unhorsing foes.',
  Sap: 'A small leather-wrapped weight used to deal nonlethal blows and knock targets unconscious.',
  Scythe: 'A peasant\'s harvesting tool pressed into service as a sweeping two-handed weapon.',
  Sickle: 'A short curved farm blade — an improvised weapon and a favored ritual implement.',
  'Sleeve Tangler': 'An oddly weighted polearm built specifically to disarm an opponent.',
  Spear: 'A simple thrusting and throwing spear with a leaf-shaped head.',
  'Spear, Long': 'A two-handed thrusting spear, longer than a common spear and suitable for setting against a charge.',
  'Spear, Wolf': 'A spear with a crossbar below the head to keep impaled foes from running up the shaft.',
  Staff: 'A length of stout hardwood wielded as a quarterstaff.',
  'Sword, Bastard': 'A hand-and-a-half sword that can be used in either one or two hands.',
  'Sword, Broad': 'A heavy single-edged sword built for cleaving rather than finesse.',
  'Sword, Falchion': 'A single-edged curved sword with a broad cleaver-like blade.',
  'Sword, Flamberg': 'A two-handed sword with a wavy flame-shaped blade, made for sweeping cuts and feints.',
  'Sword, Hook': 'A curved Chinese-style sword with a hook at the tip for catching limbs and weapons.',
  'Sword, Long': 'A double-edged straight sword, the standard arm of knights and men-at-arms.',
  'Sword, 9 Ring Broad': 'A heavy single-edged Chinese broadsword with nine iron rings set along the spine.',
  'Sword, Rapier': 'A long, slender thrusting sword built for precision rather than power.',
  'Sword, Scimitar': 'A curved single-edged sword from the eastern lands, made for cutting strokes from horseback.',
  'Sword, Great Scimitar': 'An oversized two-handed scimitar with a deep curved blade.',
  'Sword, Short': 'A short, broad-bladed thrusting sword — the legionary\'s weapon.',
  'Sword, Two-Handed': 'A great two-handed sword nearly as tall as the wielder.',
  Trident: 'A three-pronged spear that can be wielded in melee or hurled at close range.',
  Tulwar: 'A curved single-edged sword from the Indian subcontinent with a disc-shaped pommel.',
  Voulge: 'A polearm with a heavy cleaver-like blade mounted on a long haft.',

  // Missile weapons
  Aclis: 'A short throwing club tethered by a leather strap so it can be retrieved after the cast.',
  'Arrows (20)': 'A bundle of twenty arrows for use with a bow.',
  'Arrows (12)': 'A bundle of twelve arrows for use with a bow.',
  'Arrow, Silver (2)': 'A pair of silver-tipped arrows, useful against creatures that resist mundane weapons.',
  Blowpipe: 'A long hollow tube used to puff small darts at unwary targets.',
  Bolas: 'Two or three weighted balls joined by cord, hurled to entangle the legs of a fleeing foe.',
  'Bolts (12)': 'A dozen short bolts for use with a crossbow.',
  'Bow, Long': 'A tall self-bow of yew or other hardwood, capable of long shots and heavy draws.',
  'Bow, Long Composite': 'A long bow built from layered wood, horn, and sinew for added power and range.',
  'Bow, Short': 'A short bow suited to hunting and skirmishing, easily used from horseback.',
  'Bow, Short Composite': 'A short composite bow of wood, horn, and sinew — favored by mounted archers.',
  'Crossbow, Light': 'A small crossbow that can be cocked by hand and fired one-handed.',
  'Crossbow, Hand': 'A miniature crossbow small enough to be concealed in a sleeve or coat.',
  'Crossbow, Heavy': 'A heavy crossbow drawn with a windlass or cranequin, slow to load but devastating.',
  Dart: 'A weighted thrown spike, usually carried in a quiver of several at a time.',
  Harpoon: 'A heavy barbed throwing spear attached to a line, used for hunting whales or great fish.',
  Javelin: 'A light throwing spear with a long iron head.',
  Rock: 'A throwable stone of fist size — the most ancient of missile weapons.',
  Sling: 'A strap of leather used to hurl small stones at distant foes.',
  Whip: 'A long braided leather lash used to strike, distract, or disarm an opponent.',

  // Tack (kept items from Transport & Tack)
  'Barding, Chain': 'A horse-sized hauberk of chain links, draping the mount in protective mail.',
  'Barding, Full Plate': 'A complete suit of horse plate armor — the panoply of a great warhorse.',
  'Barding, Leather': 'A horse caparison of stiffened leather plates — light barding for skirmishing.',
  'Barding, Padded': 'A quilted horse blanket worn beneath barding or as light protection on its own.',
  'Barding, Studded': 'Horse barding of leather reinforced with metal studs.',
  'Bit and Bridle': 'A standard riding bridle with iron bit and leather reins.',
  'Boat, Long': 'A long-hulled vessel with oars and a sail, suited to coastal voyages and river travel.',
  'Boat, Row': 'A small wooden rowing boat, easily portaged or stowed.',
  'Boat, Skiff': 'A lightweight sailing skiff for shallow waters and short crossings.',
  'Boat, Small': 'A small open vessel used by fishermen and ferrymen.',
  Canoe: 'A narrow paddled craft of wood or hide stretched over a frame.',
  Cart: 'A two-wheeled wooden cart drawn by a draft animal.',
  Chariot: 'A two-wheeled war chariot drawn by horses, with room for a driver and a fighter.',
  Coach: 'A large enclosed passenger coach drawn by a team of horses.',
  Donkey: 'A small surefooted pack animal valued for hardiness over speed.',
  'Feed (per day)': 'One day\'s ration of grain or hay for a riding or pack animal.',
  Harness: 'Leather straps and buckles for hitching a draft animal to a cart, plow, or sled.',
  'Horse, Heavy': 'A draft horse bred for pulling and carrying heavy loads.',
  'Horse, Light': 'A nimble riding horse, fast over distance but unsuited to heavy work.',
  Mule: 'A patient hybrid of horse and donkey, prized as a pack animal for difficult terrain.',
  Ox: 'A castrated bull broken to harness, used for plowing and hauling.',
  Pony: 'A small sturdy pony, ideal for halflings, gnomes, and dwarves.',
  Raft: 'A simple platform of lashed logs poled along rivers and lakes.',
  Saddle: 'A standard riding saddle with stirrups and girth straps.',
  'Saddle Bags': 'A pair of leather bags slung across the back of a saddle for carrying gear.',
  'Saddle Blanket': 'A woven blanket placed beneath the saddle to protect the mount\'s back.',
  Sled: 'A wooden sled drawn by horses or dogs for travel across snow and ice.',
  Wagon: 'A four-wheeled wagon drawn by a team of horses or oxen.',
  Walrus: 'A trained walrus mount or beast of burden, found among arctic peoples.',
  'Warhorse, Heavy': 'A large heavily built warhorse trained to bear an armored knight in the charge.',
  'Warhorse, Light': 'A lighter warhorse trained for combat and the lance.',
  Warpony: 'A small pony bred and trained for mounted combat, suited to halfling and gnome riders.',

  // Equipment table
  'Armor and Weapon Oil': 'A small flask of oil for cleaning, lubricating, and protecting steel from rust.',
  Awl: 'A pointed metal tool used to pierce leather and wood for sewing or fitting.',
  Backpack: 'A sturdy canvas or leather pack with shoulder straps for carrying gear on the trail.',
  Bagpipe: 'A folk wind instrument with a leather bag and several pipes — droning and unmistakable.',
  'Bandages (2 wounds)': 'Strips of clean linen sufficient to dress two wounds.',
  'Barrel, Large': 'A heavy wooden barrel for storing grain, ale, or salted provisions.',
  'Barrel, Small': 'A small wooden cask suitable for carrying water, wine, or salt pork.',
  Basket: 'A simple woven basket for carrying foodstuffs or small goods.',
  Bedroll: 'A rolled blanket and groundsheet for sleeping rough.',
  'Belt Pouch, Large': 'A large leather pouch worn on the belt, sized to hold a few small items.',
  'Belt Pouch, Small': 'A small leather pouch worn on the belt for coins or trinkets.',
  'Belt Pouch, Spell Component': 'A reinforced and partitioned pouch for organizing spell components.',
  'Blanket, Winter': 'A thick wool blanket sized for cold weather camping.',
  Bottle: 'A small glass or ceramic bottle stoppered with a cork.',
  Broom: 'An ordinary household broom of straw lashed to a wooden handle.',
  Bucket: 'A wooden bucket bound with iron bands and fitted with a rope handle.',
  'Candle (5 sticks)': 'A bundle of five tallow candles, each burning for about an hour.',
  Canteen: 'A flat metal or leather flask carried on a strap, sized to hold half a gallon of water.',
  'Case, Map or Scroll': 'A cylindrical leather or metal case for carrying maps and scrolls without folding.',
  Casket: 'A small wooden chest, often used for personal valuables.',
  'Chain (20 feet)': 'Twenty feet of stout iron chain links.',
  'Chalk (per piece)': 'A single piece of soft chalk for marking walls, doors, or maps.',
  'Chest, Large': 'A heavy wooden chest reinforced with iron banding, sized for traveling gear or treasure.',
  'Chest, Small': 'A wooden chest small enough to be carried by one person.',
  Chisel: 'A simple woodworking chisel.',
  'Cord (50 feet)': 'Fifty feet of strong cord, useful for binding gear or tying knots.',
  'Crowbar / Prybar': 'A heavy iron bar for prying open crates, lids, and stuck doors.',
  'Diggery-do': 'A long wooden droning pipe of an aboriginal tradition, played with circular breathing.',
  Drum: 'A taut skin drum stretched over a wooden frame and beaten with hands or sticks.',
  'Dust, Bag of': 'A small sack of fine dust, useful for revealing invisible foes or marking surfaces.',
  Fife: 'A small high-pitched transverse flute often used by marching soldiers.',
  File: 'A wood file for shaping and smoothing.',
  'File, Metal': 'A hardened steel file for shaping metalwork or sawing through softer iron.',
  'Firewood, per day': 'A bundle of split firewood sufficient to keep a small camp fire for a day.',
  'Fishing Gear (hook, line, etc.)': 'A wrapped kit of hooks, line, sinkers, and lure for catching fish.',
  Flask: 'A small glass or metal flask suitable for carrying oil, holy water, or strong drink.',
  'Flint and Steel': 'A piece of flint and a steel striker for starting fires.',
  Flute: 'A side-blown or end-blown wooden flute.',
  Gong: 'A round metal gong struck with a padded mallet — its tone carries far.',
  Gord: 'A dried hollow gourd used as a small cup or container.',
  'Grappling Hook': 'A multi-pronged iron hook with a ring for tying off rope.',
  'Grease, Crock (per pound)': 'A small crock of grease for waterproofing leather and lubricating mechanisms.',
  Hammer: 'A common claw-headed carpenter\'s hammer.',
  'Hammer, Sledge': 'A heavy two-handed sledge hammer for breaking stone or driving spikes.',
  Hammock: 'A length of cloth or netting strung between two anchors for sleeping above ground.',
  Harp: 'A small lap harp of wood and gut strings.',
  'Holy Symbol, Silver': 'A finely wrought silver holy symbol of a chosen deity, used to focus divine power.',
  'Holy Symbol, Wooden': 'A simple carved wooden holy symbol of a chosen deity.',
  'Holy Water, Flask': 'A flask of water blessed by a priest, harmful to undead and infernal creatures.',
  'Hook, Iron': 'A small iron hook of the sort used for hanging gear or fixing rigging.',
  Horn: 'A horn of brass or hollowed cattle horn used to sound signals.',
  'Incense, Stick': 'A stick of fragrant incense, often used in rituals or to sweeten the air of a tent.',
  'Ink (1 ounce)': 'A small pot of dark ink, sufficient for many pages of writing.',
  'Kettle, Iron': 'A small cast-iron kettle suited to boiling water over a campfire.',
  'Lamp, Open': 'A simple open-flame oil lamp with a single wick.',
  'Lantern, Bullseye': 'A lantern fitted with a single lens that focuses its light into a directed beam.',
  'Lantern, Hooded': 'An oil lantern with a hooded shutter to control the spread of light.',
  Lodestone: 'A naturally magnetized piece of iron ore — a curiosity to scholars and a pointer to north.',
  Manacles: 'A pair of iron wrist shackles joined by a short chain and lockable.',
  Mandolin: 'A small lute-like instrument with paired strings, played with a plectrum.',
  'Marbles (bag of 25)': 'A bag of twenty-five small marbles, useful for diversion or for tripping unsuspecting foes.',
  'Mirror, Small Steel': 'A small polished steel mirror, useful for signaling or peering around corners.',
  'Mortar and Pestle': 'A bowl and grinding tool for crushing herbs, spices, or alchemical reagents.',
  'Mug or Tankard': 'A common ceramic or wooden drinking mug.',
  'Nails, Iron (50)': 'A handful of fifty iron nails, useful for carpentry or improvised wedging.',
  'Oil, Flask of': 'A flask of lamp oil for refilling a lantern or pouring as a fire hazard.',
  'Pack, Shoulder': 'A canvas shoulder bag with a single strap.',
  'Padlock and Key': 'A sturdy iron padlock with a single key.',
  Panpipes: 'A row of bound reed pipes of varying length, played by blowing across the openings.',
  'Paper (10 sheets)': 'Ten sheets of fine paper for writing.',
  'Parchment (10 sheets)': 'Ten sheets of treated animal-skin parchment for writing.',
  "Pickaxe, miner's": 'A heavy two-handed pick for breaking stone and digging.',
  Pipe: 'A small wood or clay smoking pipe with a long stem.',
  'Pitons/Spikes (5)': 'Five iron spikes for wedging into rock cracks or holding doors shut.',
  'Pole (10 ft)': 'A ten-foot wooden pole — invaluable for poking suspicious floors and ceilings.',
  Pot: 'A common iron cooking pot.',
  'Prayer Beads': 'A string of beads used to mark prayers and meditations.',
  Quill: 'A trimmed feather quill for writing with ink.',
  'Quiver, Dozen': 'A leather quiver sized to hold twelve arrows or bolts.',
  'Quiver, Score': 'A larger quiver sized to hold twenty arrows or bolts.',
  Razor: 'A folding straight razor of sharpened steel.',
  "Rogue's Tools": 'A small case of picks, files, and probes for opening locks and disabling traps.',
  'Rope, Hemp (50 feet)': 'Fifty feet of stout hempen rope.',
  'Rope, Silk (50 feet)': 'Fifty feet of fine silk rope — lighter and stronger than hemp.',
  'Sack, Large': 'A large burlap sack for carrying loose goods.',
  'Sack, Small': 'A small burlap sack for carrying coins or sundries.',
  'Saw, Metal': 'A small handsaw with hardened teeth for cutting wood or soft metal.',
  'Sealing Wax': 'A stick of red wax for sealing letters and packets.',
  'Sewing Kit (needle, thread, etc.)': 'A small kit of needles, thread, and patches for mending clothing and gear.',
  Shovel: 'A standard digging shovel with a wooden haft and iron blade.',
  'Soap (per bar)': 'A bar of plain lye soap.',
  'String (50 feet)': 'Fifty feet of strong cord-string.',
  'Tent, large': 'A large pavilion tent that sleeps up to five.',
  'Tent, medium': 'A canvas tent that sleeps up to three.',
  'Tent, small': 'A simple wedge tent for one sleeper.',
  'Tinder Box (10 fires)': 'A small box of tinder, flint, and steel sufficient to start ten fires.',
  Tongs: 'A pair of iron tongs for handling hot metal or coals.',
  Torch: 'A pitch-soaked wooden brand that burns for about an hour.',
  'Trap, large animal, metal': 'A heavy steel jaw trap sized for bear or boar.',
  'Trap, medium animal, metal': 'A steel jaw trap sized for wolves or large dogs.',
  'Trap, Small animal, metal': 'A small steel jaw trap sized for foxes and rabbits.',
  'Trunk, travel': 'A traveling trunk with a hinged lid and leather strap handles.',
  'Vellum (10 sheets)': 'Ten sheets of fine vellum, smoother and more durable than parchment.',
  'Vial (1 ounce)': 'A small glass vial holding about an ounce, suitable for potions or reagents.',
  'Waterskin (1 gallon)': 'A leather skin holding about a gallon of water.',
  'Wedge, splitting': 'An iron splitting wedge driven by a sledge to split logs and stones.',
  Whetstone: 'A small whetstone for honing the edges of weapons and tools.',
  Whistle: 'A small wooden or bone whistle for signaling.',
  Wolvesbane: 'A bundle of dried wolfsbane (aconite), a herb said to ward against werewolves.',
  Zither: 'A flat stringed instrument played in the lap with picks and fingers.',

  // Clothing
  Belt: 'A standard leather belt with a metal buckle.',
  'Belt, Baldric': 'A heavy belt slung over the shoulder, used to carry a sword or horn at the hip.',
  'Boots, Heavy': 'A pair of heavy hobnailed boots suitable for marching and rough country.',
  'Boots, Soft': 'A pair of soft-soled boots for indoor wear or quiet walking.',
  Caftan: 'A long loose robe with full sleeves, common in eastern lands.',
  'Cap/Hat': 'An ordinary cloth cap or felt hat.',
  Cape: 'A short cloak that hangs over the shoulders.',
  Cloak: 'A long cloak with a hood and clasp at the throat.',
  Cowl: 'A monk\'s hood, often attached to a robe.',
  Dalmatic: 'A long ceremonial tunic with wide sleeves, often worn by clerics.',
  Doublet: 'A close-fitting padded jacket worn over a shirt.',
  Frock: 'A loose long robe — common dress for laborers and clergy.',
  Girdle: 'A wide cloth or leather sash worn about the waist.',
  'Gloves, Cloth': 'A pair of plain cloth gloves.',
  'Gloves, Leather': 'A pair of supple leather gloves.',
  Gown: 'A long flowing gown of fine cloth.',
  Jewelry: 'An ornament of gold, silver, or set with stones — value varies by craftsmanship.',
  Leggings: 'A pair of cloth or leather leggings worn beneath a tunic or robe.',
  Mantle: 'A short cloak or shawl worn over the shoulders.',
  Robe: 'A long flowing robe suited to scholars, clerics, and wizards.',
  Scarf: 'A length of cloth tied about the neck or head.',
  'Shoes, Normal': 'A pair of plain leather shoes.',
  'Signet Ring': 'A gold or silver ring engraved with a personal seal for marking wax.',
  Skirt: 'A simple cloth skirt.',
  Smock: 'A loose work shirt worn over other clothing to keep it clean.',
  Trousers: 'A pair of plain woven trousers.',
  Tunic: 'A simple knee-length tunic.',
  Vest: 'A sleeveless garment worn over a shirt or tunic.',
  'Winter Clothing, Set': 'A complete set of heavy winter clothing — cloak, hood, mittens, and lined boots.',

  // Provisions (kept)
  'Cheese, Block': 'A small block of hard aged cheese suitable for travel rations.',
  'Grains, Bag': 'A small bag of milled grain or oats — animal feed or porridge fixings.',
  'Liquor, Cask': 'A small cask of strong distilled liquor.',
  'Rations (1 day)': 'A day\'s worth of preserved travel rations: hardtack, dried meat, and the like.',
  'Rations (1 week)': 'A week\'s supply of preserved travel rations packed for the road.',
  'Tea Leaves, 1 lb': 'A pound of dried tea leaves.',
  'Tobacco, 1 lb': 'A pound of cured pipe tobacco.',
  'Wine, Common (Bottle)': 'A bottle of common table wine.',
  'Wine, Fine (Bottle)': 'A bottle of fine vintage wine.',
};

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function deterministicId(packName, itemSlug) {
  const hash = crypto
    .createHash('sha1')
    .update(`${packName}:${itemSlug}`)
    .digest('hex');
  return hash.slice(0, 16);
}

function deterministicFolderId(packName, folderName) {
  const hash = crypto
    .createHash('sha1')
    .update(`folder:${packName}:${folderName}`)
    .digest('hex');
  return hash.slice(0, 16);
}

function buildFolder(packName, folderName) {
  const id = deterministicFolderId(packName, folderName);
  return {
    _id: id,
    _key: `!folders!${id}`,
    name: folderName,
    type: 'Item',
    description: '',
    folder: null,
    sorting: 'a',
    color: null,
    sort: 0,
    flags: {},
  };
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripFootnotes(s) {
  // Remove leading/trailing markers like ¹ ² ³ * @ that aren't part of the value.
  return s.replace(/[¹²³⁴⁵⁶⁷⁸⁹*@]+/g, '').trim();
}

// Some source names use superscript digits as footnote pointers AND as variant
// indicators (Greek¹/Greek²/Roman³/Roman⁴). Map those to explicit names before
// generic footnote stripping runs.
const RENAME = {
  'Ensemble, Greek¹': 'Ensemble, Greek (Bronze)',
  'Ensemble, Greek²': 'Ensemble, Greek (Iron)',
  'Ensemble, Roman³': 'Ensemble, Roman (Scale)',
  'Ensemble, Roman⁴': 'Ensemble, Roman (Segmented)',
};

function normalizeName(s) {
  let name = s.replace(/^\s+|\s+$/g, '');
  if (RENAME[name]) return RENAME[name];
  // Strip footnote markers: *, @, and superscript digits anywhere in the name.
  name = name.replace(/[*@¹²³⁴⁵⁶⁷⁸⁹]+/g, '').trim();
  // Collapse runs of internal whitespace produced by stripping.
  name = name.replace(/\s{2,}/g, ' ');
  return name;
}

function parseTableRows(lines) {
  // lines: contiguous lines all starting with '|'. First is header, second is
  // alignment, rest are data.
  const splitRow = ln => {
    let s = ln.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);
    return s.split('|').map(c => c.trim());
  };
  const header = splitRow(lines[0]);
  const data = lines.slice(2).map(splitRow);
  return { header, data };
}

function parseSections(md) {
  // Returns array of { heading, tableRows } where heading is the ### heading
  // text and tableRows is an array of arrays (header + data) parsed from the
  // first markdown table that appears before the next ### heading.
  const lines = md.split(/\r?\n/);
  const sections = [];
  let i = 0;
  let currentHeading = null;
  let tableLines = null;

  const flush = () => {
    if (currentHeading && tableLines && tableLines.length >= 2) {
      const { header, data } = parseTableRows(tableLines);
      sections.push({ heading: currentHeading, header, data });
    }
    tableLines = null;
  };

  while (i < lines.length) {
    const ln = lines[i];
    const h3 = ln.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      flush();
      currentHeading = h3[1].trim();
      tableLines = null;
      i++;
      continue;
    }
    if (ln.startsWith('|')) {
      if (tableLines === null) tableLines = [];
      tableLines.push(ln);
      i++;
      continue;
    }
    // non-table, non-heading line — if we were collecting a table, end it.
    if (tableLines !== null && tableLines.length > 0) {
      flush();
    }
    i++;
  }
  flush();
  return sections;
}

function parseAcBonus(s) {
  // Strip footnotes and leading +
  const cleaned = stripFootnotes(s).replace(/^\+/, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
}

function parseWeight(s) {
  if (!s || s === '—' || s === '-') return '0';
  // Match a leading number (may include decimal)
  const m = s.match(/(\d+(?:\.\d+)?)/);
  return m ? m[1] : '0';
}

function parseEv(s) {
  if (!s || s === '—' || s === '-') return '0';
  const cleaned = stripFootnotes(s);
  // Some entries are "12 projectiles" or "20 projectiles" — strip non-numeric.
  const m = cleaned.match(/(\d+(?:\.\d+)?)/);
  return m ? m[1] : cleaned || '0';
}

function normalizeCost(s) {
  if (!s || s === '—' || s === '-') return '';
  // Insert space between number and unit if missing: "1gp" → "1 gp"
  return s.replace(/(\d)(gp|sp|cp|pp)\b/gi, '$1 $2').trim();
}

function descriptionFor(name) {
  const desc = DESCRIPTIONS[name];
  if (desc) return `<p>${escapeHtml(desc)}</p>`;
  return '<p>No description.</p>';
}

function buildArmorDoc(name, folderId, packName, costStr, acBonus, weightStr, evStr) {
  const slug = slugify(name);
  const id = deterministicId(packName, slug);
  return {
    fileSlug: slug,
    doc: {
      _id: id,
      _key: `!items!${id}`,
      name,
      type: 'armor',
      img: 'icons/svg/item-bag.svg',
      system: {
        description: descriptionFor(name),
        price: { value: normalizeCost(costStr), label: 'TLGCC.Price' },
        weight: { value: parseWeight(weightStr), label: 'TLGCC.Weight' },
        itemev: { value: parseEv(evStr), label: 'TLGCC.ItemEV' },
        armorClass: {
          value: acBonus,
          label: 'TLGCC.ArmorClass',
          abbr: 'TLGCC.ArmorClassAbbr',
        },
      },
      effects: [],
      folder: folderId,
      flags: {},
      ownership: { default: 0 },
    },
  };
}

function buildWeaponDoc(name, folderId, packName, costStr, damageStr, rangeStr, weightStr, evStr) {
  const slug = slugify(name);
  const id = deterministicId(packName, slug);
  let rangeValue;
  if (!rangeStr || rangeStr === '—' || rangeStr === '-') {
    rangeValue = 'Melee';
  } else {
    // Source range cells like "20 ft." or "+1 20 ft." — keep as-is, trimmed.
    rangeValue = rangeStr.trim();
  }
  return {
    fileSlug: slug,
    doc: {
      _id: id,
      _key: `!items!${id}`,
      name,
      type: 'weapon',
      img: 'icons/svg/item-bag.svg',
      system: {
        description: descriptionFor(name),
        price: { value: normalizeCost(costStr), label: 'TLGCC.Price' },
        weight: { value: parseWeight(weightStr), label: 'TLGCC.Weight' },
        itemev: { value: parseEv(evStr), label: 'TLGCC.ItemEV' },
        bonusAb: { value: 0, label: 'TLGCC.BonusAttackBonus' },
        damage: {
          value: damageStr.trim(),
          label: 'TLGCC.Damage',
          abbr: 'TLGCC.DamageAbbr',
        },
        range: { value: rangeValue, label: 'TLGCC.Range' },
        size: { value: 'M', label: 'TLGCC.Size' },
      },
      effects: [],
      folder: folderId,
      flags: {},
      ownership: { default: 0 },
    },
  };
}

function buildItemDoc(name, folderId, packName, costStr, weightStr, evStr) {
  const slug = slugify(name);
  const id = deterministicId(packName, slug);
  return {
    fileSlug: slug,
    doc: {
      _id: id,
      _key: `!items!${id}`,
      name,
      type: 'item',
      img: 'icons/svg/item-bag.svg',
      system: {
        description: descriptionFor(name),
        price: { value: normalizeCost(costStr), label: 'TLGCC.Price' },
        weight: { value: parseWeight(weightStr), label: 'TLGCC.Weight' },
        itemev: { value: parseEv(evStr), label: 'TLGCC.ItemEV' },
        quantity: { value: 1, label: 'TLGCC.Quantity' },
      },
      effects: [],
      folder: folderId,
      flags: {},
      ownership: { default: 0 },
    },
  };
}

async function clearOutputDir(dir) {
  if (!existsSync(dir)) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    if (entry.endsWith('.json')) {
      await rm(path.join(dir, entry));
    }
  }
}

function classifyArmorFolder(acBonus) {
  if (acBonus <= 3) return 'Light';
  if (acBonus <= 5) return 'Medium';
  return 'Heavy';
}

function classifyEquipmentFolder(name) {
  for (const folder of Object.keys(EQUIPMENT_FOLDERS)) {
    if (EQUIPMENT_FOLDERS[folder].has(name)) return folder;
  }
  return 'Adventuring Gear';
}

async function writePack(packName, folderIds, docs) {
  const dir = PACKS[packName];
  await mkdir(dir, { recursive: true });
  await clearOutputDir(dir);

  // Write folders
  for (const folderName of Object.keys(folderIds)) {
    const folder = buildFolder(packName, folderName);
    const filename = `__folder-${slugify(folderName)}.json`;
    await writeFile(
      path.join(dir, filename),
      JSON.stringify(folder, null, 2) + '\n',
    );
  }

  // Write items
  const writtenIds = new Set();
  const collisions = [];
  let count = 0;
  for (const { fileSlug, doc } of docs) {
    if (writtenIds.has(doc._id)) {
      collisions.push({ name: doc.name, id: doc._id });
      continue;
    }
    writtenIds.add(doc._id);
    await writeFile(
      path.join(dir, `${fileSlug}.json`),
      JSON.stringify(doc, null, 2) + '\n',
    );
    count++;
  }
  return { count, collisions };
}

async function main() {
  const md = await readFile(sourceMd, 'utf8');
  const sections = parseSections(md);

  // Build folder ID maps for each pack
  const folderIds = {
    armor: {},
    weapons: {},
    equipment: {},
  };
  for (const pack of Object.keys(FOLDERS)) {
    for (const folder of FOLDERS[pack]) {
      folderIds[pack][folder] = deterministicFolderId(pack, folder);
    }
  }

  const docs = { armor: [], weapons: [], equipment: [] };
  const skipped = [];
  const ambiguous = [];

  for (const section of sections) {
    const { heading, header, data } = section;

    if (heading === 'Helms') {
      // | Helm | Cost | AC* | Weight | EV |
      for (const row of data) {
        const [name, cost, ac, wt, ev] = row;
        const cleanName = normalizeName(name);
        const acBonus = parseAcBonus(ac);
        docs.armor.push(
          buildArmorDoc(cleanName, folderIds.armor['Helms'], 'armor', cost, acBonus, wt, ev),
        );
      }
    } else if (heading === 'Armors') {
      // | Armor | Cost | AC | Weight | EV |
      for (const row of data) {
        const [name, cost, ac, wt, ev] = row;
        const cleanName = normalizeName(name);
        const acBonus = parseAcBonus(ac);
        const folder = classifyArmorFolder(acBonus);
        docs.armor.push(
          buildArmorDoc(cleanName, folderIds.armor[folder], 'armor', cost, acBonus, wt, ev),
        );
      }
    } else if (heading === 'Shields') {
      // | Shield | Cost | AC | Weight | EV |
      for (const row of data) {
        const [name, cost, ac, wt, ev] = row;
        const cleanName = normalizeName(name);
        const acBonus = parseAcBonus(ac);
        docs.armor.push(
          buildArmorDoc(cleanName, folderIds.armor['Shields'], 'armor', cost, acBonus, wt, ev),
        );
      }
    } else if (heading === 'Weapons') {
      // | Weapon | Cost | Dmg. | Rng.¹ | Wgt. | EV |
      for (const row of data) {
        const [name, cost, dmg, rng, wt, ev] = row;
        const cleanName = normalizeName(name);
        docs.weapons.push(
          buildWeaponDoc(cleanName, folderIds.weapons['Melee'], 'weapons', cost, dmg, rng, wt, ev),
        );
      }
    } else if (heading === 'Missile & Ranged') {
      // | Weapon | Cost | Dmg. | Rng. | Wgt. | EV |
      for (const row of data) {
        const [name, cost, dmg, rng, wt, ev] = row;
        const cleanName = normalizeName(name);
        docs.weapons.push(
          buildWeaponDoc(cleanName, folderIds.weapons['Missile'], 'weapons', cost, dmg, rng, wt, ev),
        );
      }
    } else if (heading === 'Transport & Tack') {
      // | Item | AC | Cost | Wgt. | EV |
      for (const row of data) {
        const [name, ac, cost, wt, ev] = row;
        const cleanName = normalizeName(name);
        if (!TACK_KEEP.has(cleanName)) {
          skipped.push({ section: heading, name: cleanName });
          continue;
        }
        // Barding rows have AC values; others are tack with no AC. Treat all as
        // type 'item' so they appear under Equipment > Tack.
        docs.equipment.push(
          buildItemDoc(cleanName, folderIds.equipment['Tack'], 'equipment', cost, wt, ev),
        );
      }
    } else if (heading === 'Equipment') {
      // | Item | Cost | Wgt. | EV | Cap. |
      for (const row of data) {
        const [name, cost, wt, ev /* cap */] = row;
        const cleanName = normalizeName(name);
        const folder = classifyEquipmentFolder(cleanName);
        docs.equipment.push(
          buildItemDoc(cleanName, folderIds.equipment[folder], 'equipment', cost, wt, ev),
        );
      }
    } else if (heading === 'Clothing') {
      // | Item | Cost | Weight | EV |
      for (const row of data) {
        const [name, cost, wt, ev] = row;
        const cleanName = normalizeName(name);
        docs.equipment.push(
          buildItemDoc(cleanName, folderIds.equipment['Clothing'], 'equipment', cost, wt, ev),
        );
      }
    } else if (heading === 'Provisions & Lodging') {
      // | Item | Cost | Weight | EV |
      for (const row of data) {
        const [name, cost, wt, ev] = row;
        const cleanName = normalizeName(name);
        if (!PROVISIONS_KEEP.has(cleanName)) {
          skipped.push({ section: heading, name: cleanName });
          continue;
        }
        docs.equipment.push(
          buildItemDoc(cleanName, folderIds.equipment['Provisions'], 'equipment', cost, wt, ev),
        );
      }
    } else {
      // Unknown section — skip silently (other tables in the source like
      // Starting Gold or Encumbrance shouldn't yield items).
    }
  }

  const results = {};
  for (const packName of ['armor', 'weapons', 'equipment']) {
    results[packName] = await writePack(packName, folderIds[packName], docs[packName]);
  }

  console.log('\nGenerated compendium documents:');
  for (const packName of ['armor', 'weapons', 'equipment']) {
    const r = results[packName];
    console.log(`  ${packName}: ${r.count} items, ${Object.keys(folderIds[packName]).length} folders`);
    if (r.collisions.length) {
      console.log(`    collisions:`);
      for (const c of r.collisions) {
        console.log(`      ${c.name} (${c.id})`);
      }
    }
  }

  // Per-folder counts
  console.log('\nPer-folder breakdown:');
  for (const packName of ['armor', 'weapons', 'equipment']) {
    console.log(`  ${packName}:`);
    const counts = {};
    for (const folderName of Object.keys(folderIds[packName])) {
      counts[folderName] = 0;
    }
    for (const { doc } of docs[packName]) {
      const folderId = doc.folder;
      const folderName = Object.keys(folderIds[packName]).find(
        n => folderIds[packName][n] === folderId,
      );
      if (folderName) counts[folderName]++;
    }
    for (const [folderName, n] of Object.entries(counts)) {
      console.log(`    ${folderName}: ${n}`);
    }
  }

  if (skipped.length) {
    console.log(`\nIntentionally skipped (${skipped.length}):`);
    for (const s of skipped) {
      console.log(`  [${s.section}] ${s.name}`);
    }
  }

  // Report items without a description so we can fill them in.
  const missingDesc = [];
  for (const packName of ['armor', 'weapons', 'equipment']) {
    for (const { doc } of docs[packName]) {
      if (!DESCRIPTIONS[doc.name]) {
        missingDesc.push({ pack: packName, name: doc.name });
      }
    }
  }
  if (missingDesc.length) {
    console.log(`\nItems missing description (${missingDesc.length}):`);
    for (const m of missingDesc) {
      console.log(`  [${m.pack}] ${m.name}`);
    }
  } else {
    console.log('\nAll items have descriptions.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
