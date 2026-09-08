const GROUP_LABEL = { crab: 'CR', shrimp: 'SH', mussel: 'MU', algae: 'SL', fish: 'FI', horseshoe: 'HC' };
const GROUP_PARTS = {
  crab: ['Carapace', 'Chelae (claws)', 'Walking legs', 'Eyestalks', 'Abdomen (folded)'],
  shrimp: ['Rostrum', 'Antennae', 'Tail fan (uropods)', 'Pereiopods', 'Carapace'],
  mussel: ['Umbo', 'Byssal threads', 'Growth rings', 'Shell valve', 'Ligament'],
  algae: ['Blade', 'Holdfast', 'Margin', 'Thallus'],
  fish: ['Snout', 'Bony rings', 'Dorsal fin', 'Tail'],
  horseshoe: ['Prosoma', 'Opisthosoma', 'Telson', 'Walking legs']
};
const GROUP_FILL = {
  crab: 'var(--color-accent-700)',
  shrimp: 'var(--color-accent-500)',
  mussel: 'var(--color-accent-2-700)',
  algae: 'color-mix(in srgb, var(--color-accent-700) 55%, #6f8f4a 45%)',
  fish: '#53757f',
  horseshoe: '#8d6d58'
};
const STATUS_COLOR = {
  'Invasive': 'var(--color-accent-900)',
  'Native: Least Concern': 'var(--color-accent-500)',
  'Native: Not Evaluated': 'var(--color-neutral-500)'
};

// Phyla covered by the survey's master directory, per the Revised Keys to Marine
// Invertebrates of the Woods Hole Region (LaBarbera, ed., Univ. of Chicago).
const PHYLA = [
  { id: 'porifera', name: 'Porifera', common: 'Sponges', chapter: 'Ch. 1', blurb: 'Simple, pore-bearing filter feeders: the oldest branch on the animal tree.' },
  { id: 'cnidaria', name: 'Cnidaria', common: 'Hydroids, Jellies & Anemones', chapter: 'Ch. 2–4', blurb: 'Radially symmetric animals built around stinging cells (cnidocytes).' },
  { id: 'ctenophora', name: 'Ctenophora', common: 'Comb Jellies', chapter: 'Ch. 5', blurb: 'Gelatinous drifters that swim on rows of beating cilia rather than muscle.' },
  { id: 'platyhelminthes', name: 'Platyhelminthes', common: 'Flatworms', chapter: 'Ch. 6', blurb: 'Flattened, unsegmented worms: free-living turbellarians and polyclads.' },
  { id: 'nemertea', name: 'Nemertea', common: 'Ribbon Worms', chapter: 'Ch. 7', blurb: 'Long, extensible worms armed with an eversible proboscis for catching prey.' },
  { id: 'annelida', name: 'Annelida', common: 'Segmented Worms', chapter: 'Ch. 9', blurb: 'Segmented worms: bristly polychaetes make up most of the local diversity.' },
  { id: 'arthropoda-chelicerata', name: 'Arthropoda: Chelicerata', common: 'Sea Spiders & Mites', chapter: 'Ch. 10', blurb: 'Pycnogonids and other chelicerates found clinging to hydroids and algae.' },
  { id: 'arthropoda-crustacea', name: 'Arthropoda: Crustacea', common: 'Crabs, Shrimp & Barnacles', chapter: 'Ch. 11+', blurb: 'Our most-collected group: decapods, barnacles, and their relatives.' },
  { id: 'mollusca', name: 'Mollusca', common: 'Mussels, Snails & Clams', chapter: 'later chapters', blurb: 'Soft-bodied animals in hard shells: bivalves are common on every dock and jetty.' },
  { id: 'echinodermata', name: 'Echinodermata', common: 'Sea Stars & Urchins', chapter: 'later chapters', blurb: 'Five-fold symmetric animals moving on hundreds of tiny tube feet.' },
  { id: 'chlorophyta', name: 'Chlorophyta', common: 'Green Algae', chapter: 'not in the invertebrate key', blurb: 'Green macroalgae like sea lettuce, tracked alongside the invertebrate survey.' }
];

const SPECIES = [
  {
    id: 'crab-01', code: 'SSAJ55', group: 'crab', phylumKey: 'arthropoda-crustacea', groupProject: 'shrimpina',
    common: 'Atlantic Sand Fiddler Crab', sci: 'Leptuca pugilator',
    phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Ocypodidae',
    status: 'Native', lat: 41.5958, lng: -70.6438,
    morph: '', eco: '', ecologyReport: [],
    photos: ['assets/crab-above.jpg', 'assets/crab-front.jpg', 'assets/crab-left.jpg'],
    heroPhoto: 'assets/crab-front.jpg',
    callouts: [
      { label: 'Carapace', x: 40, y: 38 },
      { label: 'Eyestalks', x: 32, y: 42 },
      { label: 'Chela (claw)', x: 68, y: 40 },
      { label: 'Walking legs', x: 16, y: 68 },
      { label: 'Mouthparts', x: 42, y: 60 }
    ],
    pop: [ ['2023', 0], ['2024', 0], ['2025', 0], ['2026', 9] ],
    refs: ['Shrimpina specimen register, SSAJ55, 2026.']
  },
  {
    id: 'crab-02', code: 'CR-02', group: 'crab', phylumKey: 'arthropoda-crustacea', groupProject: null,
    common: 'European Green Crab', sci: 'Carcinus maenas',
    phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Carcinidae',
    status: 'Invasive', lat: 41.5958, lng: -70.6438,
    morph: 'Five sharp teeth sit along each side of the broad carapace, with three rounded lobes between the eyes. Color is unreliable for identification: adults range from mottled green and brown to orange or red beneath.',
    eco: 'Established on the Atlantic coast since the 1800s. It burrows in mud and sand around eelgrass beds and marsh creeks and preys on juvenile shellfish.',
    ecologyReport: [
      "The European green crab is a decapod in the family Carcinidae. Its five side teeth and three rounded lobes between the eyes separate it from the other crabs in this collection.",
      "It is native to Europe and northern Africa. Ship traffic carried it to North America, where it has been established on the Atlantic coast since the nineteenth century and later spread to the Pacific coast.",
      "Green crabs occupy sheltered intertidal and shallow subtidal water, including mudflats, marsh creeks, rocky shores, and eelgrass beds. They tolerate broad changes in temperature and salinity.",
      "They are active predators and scavengers that eat clams, mussels, snails, worms, small crustaceans, and algae. A crab can dig through sediment to reach buried prey.",
      "Mating and larval release are seasonal and vary with local temperature. The planktonic larvae pass through several stages before settling to the bottom.",
      "Dense populations can reduce young shellfish and disturb eelgrass while foraging. Larger fish, birds, lobsters, and other crabs prey on green crabs."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 6], ['2024', 5], ['2025', 8], ['2026', 7] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'Smithsonian Environmental Research Center, NEMESIS species summary: Carcinus maenas.', 'NOAA Fisheries literature on the biology and life history of Carcinus maenas.']
  },
  {
    id: 'crab-03', code: 'CR-03', group: 'crab', phylumKey: 'arthropoda-crustacea', groupProject: null,
    common: 'Lady Crab', sci: 'Ovalipes ocellatus',
    phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Ovalipidae',
    status: 'Native', lat: 41.5971, lng: -70.6425,
    morph: 'Pale, sandy carapace patterned with purple-lavender rings: hence the nickname "calico crab." The rearmost pair of legs is paddle-shaped for swimming, and sharp lateral spines guard each side of the shell.',
    eco: 'A fast, nocturnal predator of sandy subtidal zones. Buries itself in sand by day and swims out at dusk to hunt small invertebrates: one of the few local crabs equally at home swimming and burrowing.',
    ecologyReport: [
      "The lady crab is a swimming crab in the family Ovalipidae. Purple-red rings on the shell and paddle-shaped rear legs make an adult easy to recognize.",
      "It is native to the western Atlantic, from Atlantic Canada through the northeastern United States and south to Florida. Woods Hole lies near the northern part of its regular coastal range.",
      "Lady crabs favor open sand in bays, estuaries, and the shallow ocean. They bury deeply with only the eyes and antennae exposed, then leave the sand to swim and forage.",
      "They eat clams, smaller crabs, fish, worms, and other animals living on or beneath the seafloor. Studies of surf-clam beds identify lady crabs as important shellfish predators.",
      "Reproduction occurs in warmer months. Eggs are carried beneath the female's abdomen, and the newly hatched larvae enter the plankton before returning to the bottom.",
      "Lady crabs move energy from buried invertebrates to larger predators. Coastal fish, rays, and larger crabs eat them, while their own digging stirs the upper layer of sand."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 2], ['2024', 3], ['2025', 3], ['2026', 5] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'NOAA Northeast Fisheries Science Center literature on Ovalipes ocellatus.', 'World Register of Marine Species: Ovalipes ocellatus.']
  },
  {
    id: 'shrimp-01', code: 'SH-01', group: 'shrimp', phylumKey: 'arthropoda-crustacea', groupProject: null,
    common: 'Marsh Grass Shrimp', sci: 'Palaemonetes vulgaris',
    phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Palaemonidae',
    status: 'Native', lat: 41.5889, lng: -70.6449,
    morph: 'A slender, near-transparent body 3–5 cm long with a long, toothed rostrum projecting forward and long, whip-like antennae: built for hiding in plain sight among eelgrass blades.',
    eco: 'Abundant wherever there\'s eelgrass or marsh grass to hide in. Grazes on algae and detritus and is itself a key forage item for juvenile fish: a small but critical link in the marsh food web.',
    ecologyReport: [
      "The marsh grass shrimp is a small, nearly transparent decapod in the family Palaemonidae. Orange pigment on the eyestalks and a long toothed rostrum are useful field marks.",
      "It is native to the western Atlantic coast of North America, from Massachusetts south through Florida and into the Gulf of Mexico.",
      "It lives in shallow estuaries among eelgrass, algae, oyster beds, and salt-marsh edges. Its clear body helps it disappear among stems and reflected light.",
      "Marsh grass shrimp pick at algae, detritus, tiny crustaceans, and animal remains. They feed both as grazers and as small predators.",
      "Females carry eggs attached beneath the abdomen during the warm breeding season. The larvae hatch into the water and develop through several planktonic stages.",
      "These shrimp are common prey for juvenile fish and larger crustaceans. By eating detritus and then being eaten, they move marsh production into the estuarine food web."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 12], ['2024', 15], ['2025', 11], ['2026', 16] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'World Register of Marine Species: Palaemonetes vulgaris.', 'Marine Biological Laboratory field identification materials.']
  },
  {
    id: 'shrimp-02', code: 'SH-02', group: 'shrimp', phylumKey: 'arthropoda-crustacea', groupProject: null,
    common: 'Sevenspine Bay Shrimp', sci: 'Crangon septemspinosa',
    phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Crangonidae',
    status: 'Native', lat: 41.5965, lng: -70.6431,
    morph: 'A flattened, mottled sandy-gray body built for camouflage against the seafloor, with a short, stout rostrum rather than the long spike seen in grass shrimp.',
    eco: 'Burrows into sandy substrate by day and emerges at night to feed. Tolerates a wide range of temperature and salinity, and is an important prey species for bottom-feeding fish.',
    ecologyReport: [
      "The sevenspine bay shrimp, also called the sand shrimp, is a crangonid shrimp. Its body is low and mottled, its rostrum is short, and the tail fan carries the spines named in its common name.",
      "It is native to the northwestern Atlantic. Its range extends from the Gulf of St. Lawrence south along the United States coast, with records into Florida.",
      "It lives on sand and mixed sediment from estuaries to coastal water. The shrimp can rapidly bury itself, leaving little more than its eyes visible.",
      "Sevenspine bay shrimp eat worms, small crustaceans, mollusks, and other bottom-dwelling prey. They usually forage most actively when light levels are low.",
      "Their abundance and movement change with season, water temperature, and salinity. Females carry eggs beneath the abdomen, and larvae develop in the water column.",
      "They are an important food source for bottom-feeding fish. Their own predation on small animals also makes them an active part of the shallow seafloor community."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 5], ['2024', 8], ['2025', 6], ['2026', 9] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'World Register of Marine Species: Crangon septemspinosa.', 'Fisheries literature on northwestern Atlantic sand shrimp ecology.']
  },
  {
    id: 'shrimp-03', code: 'SH-03', group: 'shrimp', phylumKey: 'arthropoda-crustacea', groupProject: null,
    common: 'Daggerblade Grass Shrimp', sci: 'Palaemonetes pugio',
    phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Palaemonidae',
    status: 'Native', lat: 41.5977, lng: -70.6419,
    morph: 'Very similar to the marsh grass shrimp but with a shorter rostrum and a greenish, translucent cast to the body: the two are often confused in the field without a hand lens.',
    eco: 'The dominant shrimp species in Woods Hole\'s salt marshes. An omnivorous scavenger and a widely used indicator species for marsh health in coastal research.',
    ecologyReport: [
      "The daggerblade grass shrimp is a small, translucent decapod in the family Palaemonidae. A toothed rostrum and small claws distinguish it from the broader, sand-colored crangonid shrimp.",
      "It is native to Atlantic and Gulf coast estuaries of North America. It is especially common in protected marshes and creeks from New England southward.",
      "It occupies shallow brackish water around marsh grass, submerged vegetation, oyster reefs, and woody debris. It can tolerate salinity ranging from brackish water to full seawater.",
      "Daggerblade grass shrimp eat detritus, algae, zooplankton, and small invertebrates. They also scavenge, so their diet changes with what the tide delivers.",
      "Females brood their eggs beneath the abdomen for about two weeks before hatching. Warm-season females may produce more than one brood, and the larvae develop in open water.",
      "Blue crabs, striped bass, mummichogs, and many other estuarine predators eat grass shrimp. Researchers also use this species to study how pollutants affect molting, behavior, and reproduction."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 9], ['2024', 10], ['2025', 13], ['2026', 12] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'NOAA and peer-reviewed literature on Palaemonetes pugio life history and estuarine ecology.', 'World Register of Marine Species: Palaemonetes pugio.']
  },
  {
    id: 'mussel-01', code: 'MU-01', group: 'mussel', phylumKey: 'mollusca', groupProject: null,
    common: 'Blue Mussel', sci: 'Mytilus edulis',
    phylum: 'Mollusca', cls: 'Bivalvia', order: 'Mytilida', family: 'Mytilidae',
    status: 'Native', lat: 41.5876, lng: -70.6438,
    morph: 'A smooth, elongated shell in deep blue-black, anchored to hard surfaces by a bundle of tough byssal threads spun from a gland at its foot.',
    eco: 'Forms dense beds on docks, pilings, and jetty rock. A filter feeder that processes large volumes of water: its health is a useful proxy for local water quality.',
    ecologyReport: [
      "The blue mussel is a bivalve in the family Mytilidae. Its smooth shell is usually blue-black or dark brown outside and pale, sometimes pearly, inside.",
      "It is native to cool North Atlantic coasts of North America and Europe. Related mussels overlap and hybridize in parts of the North Atlantic, which can complicate identification by shell alone.",
      "Blue mussels attach to rock, pilings, ropes, and one another with strong byssal threads. Dense beds occur from the lower intertidal zone into shallow subtidal water.",
      "A mussel pumps water across its gills and captures phytoplankton and suspended organic particles. Feeding slows when it closes its shell during exposure or stressful water conditions.",
      "Spawning generally occurs from spring into summer as the water warms. Eggs and sperm enter the water, and planktonic larvae drift before settling and attaching to a hard surface.",
      "Mussel beds filter water and create shelter for worms, snails, small crustaceans, and juvenile animals. Sea stars, crabs, birds, and people are important predators."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 40], ['2024', 35], ['2025', 38], ['2026', 30] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'Animal Diversity Web: Mytilus edulis.', 'World Register of Marine Species: Mytilus edulis.']
  },
  {
    id: 'mussel-02', code: 'MU-02', group: 'mussel', phylumKey: 'mollusca', groupProject: null,
    common: 'Ribbed Mussel', sci: 'Geukensia demissa',
    phylum: 'Mollusca', cls: 'Bivalvia', order: 'Mytilida', family: 'Mytilidae',
    status: 'Native', lat: 41.5860, lng: -70.6428,
    morph: 'Larger than the blue mussel, with a yellowish-brown shell marked by coarse radiating ribs running from hinge to edge.',
    eco: 'Roots itself in Spartina salt-marsh peat rather than open rock, helping bind and stabilize marsh sediment. Tolerates long stretches of air exposure at low tide better than most bivalves.',
    ecologyReport: [
      "The ribbed mussel is a bivalve in the family Mytilidae. Its thick brown shell has strong ribs that radiate from the hinge toward the outer edge.",
      "It is native to the Atlantic and Gulf coasts of North America, from the Gulf of St. Lawrence south to Florida and around the Gulf of Mexico.",
      "Ribbed mussels cluster among salt-marsh grasses, oyster reefs, and sheltered structures. Byssal threads fasten them to roots, shells, sediment, and neighboring mussels.",
      "They filter plankton and suspended detritus from tidal water. When the marsh drains at low tide, the shell closes and the mussel waits for the next flood.",
      "Spawning is concentrated in summer. Fertilization occurs in the water, planktonic larvae disperse with currents, and young mussels settle into marsh and reef habitat.",
      "Ribbed mussels add nitrogen used by marsh grass and help hold peat together. Their clusters form habitat, while blue crabs, mud crabs, rails, and other predators feed on them."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 22], ['2024', 26], ['2025', 24], ['2026', 29] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'Animal Diversity Web: Geukensia demissa.', 'World Register of Marine Species: Geukensia demissa.']
  },
  {
    id: 'algae-01', code: 'SL-01', group: 'algae', phylumKey: 'chlorophyta', groupProject: null,
    common: 'Sea Lettuce', sci: 'Ulva lactuca',
    phylum: 'Chlorophyta', cls: 'Ulvophyceae', order: 'Ulvales', family: 'Ulvaceae',
    status: 'Recorded locally', lat: 41.5868, lng: -70.6455,
    morph: 'Thin, bright-green sheet-like blades only two cell layers thick, with soft, ruffled edges: it tears easily between your fingers.',
    eco: 'Grows on rocks and mudflats and blooms fastest where nutrient runoff is high. Grazed by periwinkles, isopods, and geese, and used as an early signal of nutrient loading.',
    ecologyReport: [
      "Sea lettuce belongs to the green-algal genus Ulva. A mature blade is a flat sheet only two cell layers thick, attached at its base by a small holdfast.",
      "Names in the Ulva lactuca group have changed as genetic studies have separated look-alike species. A field label based only on blade shape should be treated as a working identification until DNA or microscopic characters confirm it.",
      "Sheet-form Ulva grows on rock, shell, wood, docks, and mud from the intertidal zone into shallow water. It tolerates changing salinity and can grow quickly in protected coves.",
      "Like other green algae, it uses sunlight, carbon dioxide, and dissolved nutrients to grow. Snails, amphipods, isopods, waterfowl, and other grazers eat its blades.",
      "Ulva alternates between microscopic reproductive cells and the familiar green blade. Spores or gametes disperse in water and attach to a surface before a new blade develops.",
      "Moderate growth provides food, oxygen, and cover. Heavy nutrient inputs can produce dense green tides whose decay lowers oxygen and changes habitat for animals beneath them."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 60], ['2024', 55], ['2025', 70], ['2026', 65] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'AlgaeBase: Ulva lactuca and the genus Ulva.', 'World Register of Marine Species: Ulva lactuca.']
  },
  {
    id: 'algae-02', code: 'SL-02', group: 'algae', phylumKey: 'chlorophyta', groupProject: null,
    common: 'Gutweed', sci: 'Ulva intestinalis',
    phylum: 'Chlorophyta', cls: 'Ulvophyceae', order: 'Ulvales', family: 'Ulvaceae',
    status: 'Recorded locally', lat: 41.5983, lng: -70.6412,
    morph: 'Tubular, inflated fronds that twist and coil. Unlike true sea lettuce, the blades are not flat.',
    eco: 'A fast-growing early colonizer of bare rock and pilings after disturbance, often the first visible green on a cleared surface.',
    ecologyReport: [
      "Gutweed is a green alga in the family Ulvaceae. Its narrow frond forms a hollow tube, often inflated or twisted, instead of the flat sheet seen in sea lettuce.",
      "Ulva intestinalis is widely recorded on temperate coasts. Its simple shape overlaps with related Ulva species, so microscopic or genetic work may be needed for a firm identification.",
      "It is common high in the intertidal zone, in rock pools, salt marshes, and places reached by freshwater runoff. It tolerates large swings in both salinity and exposure.",
      "Gutweed grows by photosynthesis and absorbs dissolved nitrogen and phosphorus directly from the water. Small snails, amphipods, and other grazers feed on it.",
      "Its life cycle includes attached blades and waterborne reproductive cells. Rapid growth allows it to colonize recently cleared rock and other open surfaces.",
      "Patches provide food and cover for small shoreline animals. When nutrient levels are high, thick accumulations can trap sediment and lose oxygen as older tissue decomposes."
    ],
    photos: [], heroPhoto: null,
    pop: [ ['2023', 18], ['2024', 21], ['2025', 19], ['2026', 25] ],
    refs: ['Woods Hole Biodiversity Survey field log, 2026.', 'AlgaeBase: Ulva intestinalis.', 'World Register of Marine Species: Ulva intestinalis.']
  }
];
