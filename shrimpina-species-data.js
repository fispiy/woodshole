const SHRIMPINA_REPORTS = {
  hermit: [
    'The long-clawed hermit crab is a decapod in the family Paguridae. Its soft, coiled abdomen is protected inside an empty snail shell.',
    'It is native to the western Atlantic and occurs from Atlantic Canada through the northeastern United States and south into warmer coastal water.',
    'It lives in shallow bays, salt marshes, mudflats, eelgrass, and protected beaches. Individuals change shells as they grow.',
    'Long-clawed hermit crabs scavenge animal remains and graze algae and detritus from the bottom.',
    'Females carry eggs beneath the abdomen. After hatching, the larvae develop in open water before settling and finding a small shell.',
    'Fish, birds, and larger crabs eat them. Their constant use and exchange of empty shells connects them closely to local snail populations.'
  ],
  grassShrimp: [
    'The eastern grass shrimp is a small, nearly transparent decapod in the family Palaemonidae. Its long rostrum, stalked eyes, and clear segmented body are visible in the SSAJ14 measurement photograph.',
    'It is native to the eastern United States. Although often associated with freshwater and low-salinity habitat, it also occurs in tidal coastal systems.',
    'It shelters among submerged plants, marsh edges, roots, and other shallow structure where its transparent body provides camouflage.',
    'Eastern grass shrimp eat algae, detritus, zooplankton, and small invertebrates. They also scavenge organic material.',
    'Females carry eggs beneath the abdomen during the breeding season. Larvae hatch into the water before developing into bottom-dwelling juveniles.',
    'Small fish and larger crustaceans feed on grass shrimp. They transfer energy from plant material and detritus to predators higher in the food web.'
  ],
  asianShore: [
    'The Asian shore crab is a decapod in the family Varunidae. Its square carapace has three teeth along each side behind the eye.',
    'It is native to the western Pacific. It appeared on the Atlantic coast of North America in the late 1980s and is now established from North Carolina into Atlantic Canada.',
    'It lives beneath rocks on cobble beaches, jetties, docks, and other hard intertidal habitat. At low tide it stays in damp shelter.',
    'Asian shore crabs eat algae, mussels, snails, worms, small crustaceans, and carrion.',
    'Females may carry several broods during the warm season. Larvae develop in open water before settling back onto the shore.',
    'In New England it competes with native crabs and consumes young shellfish. Fish, birds, and larger crabs also prey on it.'
  ],
  blueCrab: [
    'The Atlantic blue crab is a swimming crab in the family Portunidae. The shell is blue-green, the claws are bright blue, and the rear legs form broad paddles.',
    'It is native to the Atlantic coast of the Americas, from Atlantic Canada to Argentina, including the Gulf coast.',
    'Blue crabs use eelgrass, oyster reefs, marsh creeks, and open estuarine bottom. Their habitat changes with age, sex, season, and salinity.',
    'They eat clams, oysters, mussels, worms, fish, plant material, carrion, and other crabs.',
    'A female mates around her final molt and can produce hundreds of thousands to millions of eggs. Larvae develop in high-salinity coastal water before juveniles return to estuaries.',
    'Blue crabs are major predators, important prey, and a valuable fishery species. Large fish, birds, sea turtles, and people consume them.'
  ],
  spiderCrab: [
    'The longnose spider crab is a decapod with a pear-shaped carapace, long walking legs, and two pointed projections at the front of the shell.',
    'It is native to the western Atlantic coast of North America, from New England south through the Gulf coast.',
    'It lives on sand, mud, eelgrass, shell, and rocky bottom from shallow estuaries into coastal water.',
    'Longnose spider crabs eat algae, detritus, carrion, mollusks, worms, and other small bottom animals.',
    'Young crabs often attach algae, sponge, or debris to hooked hairs on the shell. This decoration breaks up the outline of the body and improves camouflage.',
    'Fish, octopuses, and larger crabs prey on spider crabs. Their scavenging and grazing help recycle material on the seafloor.'
  ],
  pipefish: [
    'The northern pipefish is a slender fish in the seahorse family, Syngnathidae. Bony rings encircle the body, and the long tubular snout ends in a small mouth.',
    'It is native to the western Atlantic coast from the Gulf of St. Lawrence south to northeastern Florida and the northern Gulf coast.',
    'Northern pipefish live among eelgrass, widgeon grass, algae, and salt-marsh edges where their narrow bodies resemble plant stems.',
    'They draw tiny crustaceans and other plankton into the mouth with a rapid suction movement.',
    'The female places eggs into a brood pouch on the male. The male carries the embryos until fully formed young pipefish emerge.',
    'Pipefish consume small crustaceans and are eaten by larger fish and birds. Healthy submerged vegetation gives them both feeding ground and cover.'
  ],
  horseshoe: [
    'The Atlantic horseshoe crab is a marine chelicerate, more closely related to spiders than to true crabs. Its body has a broad front shell, a hinged rear section, and a long telson.',
    'It is native to the Atlantic coast of North America and the Gulf coast, with the largest spawning concentrations in the Mid-Atlantic.',
    'Adults live on sandy and muddy bottoms. In spring and early summer they move into shallow water and onto beaches to spawn around high tides.',
    'Horseshoe crabs eat worms, small clams, crustaceans, and other animals found in bottom sediment.',
    'Females bury clusters of eggs in beach sand. The young pass through repeated molts and take several years to reach maturity.',
    'Their eggs feed migrating shorebirds, especially in Delaware Bay. Fish, sea turtles, and birds also eat eggs or young horseshoe crabs.'
  ]
};

const SHRIMPINA_SAND_FIDDLER = {
  ...SPECIES.find(species => species.id === 'crab-01'),
  id:'ssaj-sand-fiddler-series', code:'SSAJ54–55 · SSAJ67', sampleNumbers:[54,55,67],
  common:'Atlantic Sand Fiddler Crab', sci:'Leptuca pugilator', family:'Ocypodidae',
  morph:'', eco:'', ecologyReport:[],
  refs:['Shrimpina specimen register, SSAJ54, SSAJ55, and SSAJ67, 2026.']
};
const SHRIMPINA_MARSH_FIDDLER = {
  ...SHRIMPINA_SAND_FIDDLER,
  id:'ssaj20-series', code:'SSAJ20–26', sampleNumbers:[20,21,22,23,24,25,26],
  common:'Atlantic Mud Fiddler Crab', sci:'Minuca pugnax',
  refs:['Shrimpina specimen register, SSAJ20–26, 2026.']
};
const SHRIMPINA_GREEN_CRAB = SPECIES.find(species => species.id === 'crab-02');
const SHRIMPINA_LADY_CRAB = SPECIES.find(species => species.id === 'crab-03');

const SHRIMPINA_SPECIES = [
  {
    id: 'ssaj-hermit-series', code: 'SSAJ1-13 / 36-51', sampleNumbers: [...Array.from({length:13},(_,i)=>i+1), ...Array.from({length:16},(_,i)=>i+36)], group: 'crab', phylumKey: 'arthropoda-crustacea', groupProject: 'shrimpina',
    common: 'Long-clawed Hermit Crab', sci: 'Pagurus longicarpus', phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Paguridae', status: 'Native', lat: 41.5928, lng: -70.6446,
    morph: 'A small hermit crab with long, narrow claws, dark bands on the claw tips, stalked eyes, and a soft asymmetrical abdomen held inside an empty snail shell.', eco: SHRIMPINA_REPORTS.hermit[2], ecologyReport: SHRIMPINA_REPORTS.hermit,
    photos: ['assets/shrimpina-specimens/long-clawed-hermit.jpg'], heroPhoto: 'assets/shrimpina-specimens/long-clawed-hermit.jpg', pop: [['2026',29]], refs: ['Shrimpina specimen log, SSAJ1-13 and SSAJ36-51, 2026.', 'Chesapeake Bay Program field guide: Hermit Crabs.', 'World Register of Marine Species: Pagurus longicarpus.']
  },
  {
    id: 'ssaj14', code: 'SSAJ14', sampleNumbers: [14], group: 'shrimp', phylumKey: 'arthropoda-crustacea', groupProject: 'shrimpina',
    common: 'Eastern Grass Shrimp', sci: 'Palaemon paludosus', phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Palaemonidae', status: 'Native', lat: 41.5958, lng: -70.6438,
    morph: 'A small, nearly transparent shrimp with a laterally compressed body, long antennae, stalked eyes, and a toothed rostrum. The SSAJ14 photograph records the body beside a metric ruler.', eco: SHRIMPINA_REPORTS.grassShrimp[2], ecologyReport: SHRIMPINA_REPORTS.grassShrimp,
    photos: ['assets/shrimpina-specimens/ssaj14-eastern-grass-shrimp.jpg'], heroPhoto: 'assets/shrimpina-specimens/ssaj14-eastern-grass-shrimp.jpg', pop: [['2026',6]], refs: ['Shrimpina specimen log, SSAJ14-19, 2026.', 'World Register of Marine Species: Palaemon paludosus.']
  },
  SHRIMPINA_SAND_FIDDLER,
  {...SHRIMPINA_MARSH_FIDDLER, id:'ssaj20', code:'SSAJ20', sampleNumbers:[20], callouts:undefined, photos:['assets/shrimpina-specimens/ssaj20-marsh-fiddler-crab.jpg'], heroPhoto:'assets/shrimpina-specimens/ssaj20-marsh-fiddler-crab.jpg'},
  {
    id: 'ssaj27', code: 'SSAJ27', sampleNumbers: [27], group: 'crab', phylumKey: 'arthropoda-crustacea', groupProject: 'shrimpina',
    common: 'Asian Shore Crab', sci: 'Hemigrapsus sanguineus', phylum: 'Arthropoda', cls: 'Malacostraca', order: 'Decapoda', family: 'Varunidae', status: 'Invasive', lat: 41.5885, lng: -70.6462,
    morph: 'A small crab with a square carapace, three teeth along each side, banded walking legs, and claws that may be pale at the tips.', eco: SHRIMPINA_REPORTS.asianShore[2], ecologyReport: SHRIMPINA_REPORTS.asianShore,
    photos: ['assets/shrimpina-specimens/ssaj27-asian-shore-crab.jpg'], heroPhoto: 'assets/shrimpina-specimens/ssaj27-asian-shore-crab.jpg', pop: [['2026',6]], refs: ['Shrimpina specimen log, SSAJ27-32, 2026.', 'Smithsonian NEMESIS species summary: Hemigrapsus sanguineus.']
  },
  {...SHRIMPINA_LADY_CRAB, id:'ssaj33', code:'SSAJ33', sampleNumbers:[33], groupProject:'shrimpina', common:'Ocellate Lady Crab', photos:['assets/shrimpina-specimens/ssaj33-ocellate-lady-crab.jpg'], heroPhoto:'assets/shrimpina-specimens/ssaj33-ocellate-lady-crab.jpg', pop:[['2026',1]], refs:['Shrimpina specimen log, SSAJ33, 2026.','World Register of Marine Species: Ovalipes ocellatus.']},
  {
    id:'ssaj35', code:'SSAJ35', sampleNumbers:[35], group:'crab', phylumKey:'arthropoda-crustacea', groupProject:'shrimpina',
    common:'Atlantic Blue Crab', sci:'Callinectes sapidus', phylum:'Arthropoda', cls:'Malacostraca', order:'Decapoda', family:'Portunidae', status:'Native', lat:41.5885, lng:-70.6462,
    morph:'A broad blue-green carapace with a long spine at each side, bright blue claws, and flattened paddle-shaped rear legs used for swimming.', eco:SHRIMPINA_REPORTS.blueCrab[2], ecologyReport:SHRIMPINA_REPORTS.blueCrab,
    photos:['assets/shrimpina-specimens/ssaj34-atlantic-blue-crab.jpg'], heroPhoto:'assets/shrimpina-specimens/ssaj34-atlantic-blue-crab.jpg', pop:[['2026',1]], refs:['Shrimpina specimen log, SSAJ35, 2026.','NOAA Fisheries species profile: Blue Crab.']
  },
  {...SHRIMPINA_GREEN_CRAB, id:'ssaj34', code:'SSAJ34', sampleNumbers:[34], groupProject:'shrimpina', photos:['assets/shrimpina-specimens/ssaj35-european-green-crab.jpg'], heroPhoto:'assets/shrimpina-specimens/ssaj35-european-green-crab.jpg', pop:[['2026',1]], refs:['Shrimpina specimen log, SSAJ34, 2026.','Smithsonian NEMESIS species summary: Carcinus maenas.']},
  {
    id:'ssaj53', code:'SSAJ53', sampleNumbers:[53], group:'crab', phylumKey:'arthropoda-crustacea', groupProject:'shrimpina',
    common:'Longnose Spider Crab', sci:'Libinia dubia', phylum:'Arthropoda', cls:'Malacostraca', order:'Decapoda', family:'Epialtidae', status:'Native', lat:41.5958, lng:-70.6438,
    morph:'A pear-shaped, rough carapace with two pointed projections at the front and long, slender walking legs. Algae and debris may cling to hooked hairs on the shell.', eco:SHRIMPINA_REPORTS.spiderCrab[2], ecologyReport:SHRIMPINA_REPORTS.spiderCrab,
    photos:['assets/shrimpina-specimens/ssaj53-longnose-spider-crab.jpg'], heroPhoto:'assets/shrimpina-specimens/ssaj53-longnose-spider-crab.jpg', pop:[['2026',5]], refs:['Shrimpina specimen log, SSAJ52-53 and SSAJ58-60, 2026.','World Register of Marine Species: Libinia dubia.']
  },
  {
    id:'ssaj56', code:'SSAJ56', sampleNumbers:[56], group:'fish', phylumKey:'chordata', groupProject:'shrimpina',
    common:'Northern Pipefish', sci:'Syngnathus fuscus', phylum:'Chordata', cls:'Actinopterygii', order:'Syngnathiformes', family:'Syngnathidae', status:'Native', lat:41.5885, lng:-70.6462,
    morph:'A very slender fish enclosed by bony rings, with a long tubular snout, small fins, and a body shaped for hiding upright among eelgrass blades.', eco:SHRIMPINA_REPORTS.pipefish[2], ecologyReport:SHRIMPINA_REPORTS.pipefish,
    photos:['assets/shrimpina-specimens/ssaj56-northern-pipefish.jpg'], heroPhoto:'assets/shrimpina-specimens/ssaj56-northern-pipefish.jpg', pop:[['2026',1]], refs:['Shrimpina specimen log, SSAJ56, 2026.','World Register of Marine Species: Syngnathus fuscus.']
  },
  {
    id:'ssaj57', code:'SSAJ57', sampleNumbers:[57], group:'horseshoe', phylumKey:'arthropoda-chelicerata', groupProject:'shrimpina',
    common:'Atlantic Horseshoe Crab', sci:'Limulus polyphemus', phylum:'Arthropoda', cls:'Xiphosura', order:'Xiphosurida', family:'Limulidae', status:'Native', lat:41.5958, lng:-70.6438,
    morph:'A broad domed prosoma, a smaller hinged rear section, five pairs of walking legs beneath the shell, and a long pointed telson used to right the body.', eco:SHRIMPINA_REPORTS.horseshoe[2], ecologyReport:SHRIMPINA_REPORTS.horseshoe,
    photos:['assets/shrimpina-specimens/ssaj57-atlantic-horseshoe-crab.jpg'], heroPhoto:'assets/shrimpina-specimens/ssaj57-atlantic-horseshoe-crab.jpg', pop:[['2026',1]], refs:['Shrimpina specimen log, SSAJ57, 2026.','U.S. Fish and Wildlife Service: Atlantic Horseshoe Crab.']
  }
];

SHRIMPINA_SPECIES.push({
  ...SHRIMPINA_SPECIES.find(species => species.id === 'ssaj53'),
  id: 'ssaj58', code: 'SSAJ58', sampleNumbers: [58], lat: 41.5885, lng: -70.6462,
  photos: ['assets/shrimpina-specimens/ssaj58-longnose-spider-crab.jpg'],
  heroPhoto: 'assets/shrimpina-specimens/ssaj58-longnose-spider-crab.jpg',
  refs: ['Shrimpina specimen log, SSAJ58, 2026.', 'World Register of Marine Species: Libinia dubia.']
});

const SHRIMPINA_EXTRA_REPORTS = {
  periwinkle: [
    'The common periwinkle is a marine snail with a thick, rounded shell and a low pointed spire. Shell color ranges from gray and brown to nearly black.',
    'It is native to the northeastern Atlantic. It became established along the Atlantic coast of North America during the nineteenth century.',
    'Common periwinkles live on rocky shores, pilings, cobble, and salt-marsh edges. They close the shell opening with an operculum when exposed at low tide.',
    'They graze films of algae from hard surfaces with a toothed radula.',
    'Egg capsules are released into the water. The larvae develop in the plankton before settling onto the shore.',
    'Their grazing can change algal cover and marsh vegetation. Crabs, fish, birds, and sea stars eat them.'
  ],
  oyster: [
    'The eastern oyster is a bivalve with two rough, unequal shells. The lower valve is cupped and cements to a firm surface.',
    'It is native to the Atlantic and Gulf coasts of North America.',
    'Eastern oysters live in estuaries and form reefs where shells accumulate across generations.',
    'They feed by filtering plankton and suspended particles from the water.',
    'Adults release eggs and sperm into the water. After a planktonic larval stage, young oysters attach permanently to shell or another hard surface.',
    'Oyster reefs provide habitat for fish and invertebrates, stabilize bottom sediments, and are important to coastal fisheries.'
  ]
};

const SHRIMPINA_PHOTO_TEMPLATES = {
  'Long-Clawed Hermit': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj-hermit-series'),
  'Eastern Grass Shrimp': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj14'),
  'Marsh Fiddler Crab': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj20'),
  'Atlantic Sand Fiddler Crab': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj-sand-fiddler-series'),
  'Asian Shore Crab': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj27'),
  'Ocellate Lady Crab': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj33'),
  'Atlantic Blue Crab': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj35'),
  'European Green Crab': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj34'),
  'Longnose Spider Crab': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj53'),
  'Northern Pipefish': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj56'),
  'Atlantic Horseshoe Crab': SHRIMPINA_SPECIES.find(species => species.id === 'ssaj57')
};

const SHRIMPINA_SPECIAL_TEMPLATES = {
  'Common Periwinkle': {
    id:'common-periwinkle-series', code:'Species collection', sampleNumbers:[], group:'mussel', phylumKey:'mollusca-gastropoda', groupProject:'shrimpina',
    common:'Common Periwinkle', sci:'Littorina littorea', phylum:'Mollusca', cls:'Gastropoda', order:'Littorinimorpha', family:'Littorinidae', status:'Introduced', lat:41.5885, lng:-70.6462,
    morph:'A thick, rounded spiral shell with a low pointed spire, a large oval opening, and fine growth lines. Color varies from gray and brown to nearly black.', eco:SHRIMPINA_EXTRA_REPORTS.periwinkle[2], ecologyReport:SHRIMPINA_EXTRA_REPORTS.periwinkle, pop:[['2026','grouped']], refs:['Shrimpina photograph archive, 2026.']
  },
  'Eastern Oyster': {
    id:'ssaj61', code:'SSAJ61', sampleNumbers:[61], group:'mussel', phylumKey:'mollusca-bivalvia', groupProject:'shrimpina',
    common:'Eastern Oyster', sci:'Crassostrea virginica', phylum:'Mollusca', cls:'Bivalvia', order:'Ostreida', family:'Ostreidae', status:'Native', lat:41.5885, lng:-70.6462,
    morph:'Two rough, irregular valves, with a deeply cupped lower shell and a flatter upper shell. The shell surface records layered growth around the hinge.', eco:SHRIMPINA_EXTRA_REPORTS.oyster[2], ecologyReport:SHRIMPINA_EXTRA_REPORTS.oyster, pop:[['2026',1]], refs:['Shrimpina photograph archive, SSAJ61, 2026.']
  }
};

SHRIMPINA_PHOTO_LIBRARY.forEach(entry => {
  const sampleNumber = /^SSAJ\d+$/.test(entry.sample) ? Number(entry.sample.slice(4)) : null;
  let record = sampleNumber === null
    ? (entry.animal === 'Long-Clawed Hermit' ? SHRIMPINA_PHOTO_TEMPLATES[entry.animal] : SHRIMPINA_SPECIAL_TEMPLATES[entry.animal])
    : SHRIMPINA_SPECIES.find(species => species.code === entry.sample);
  if (!record) {
    const template = SHRIMPINA_PHOTO_TEMPLATES[entry.animal] || SHRIMPINA_SPECIAL_TEMPLATES[entry.animal];
    if (!template) return;
    record = { ...template, id: entry.sample.toLowerCase(), code: entry.sample, sampleNumbers:[sampleNumber], callouts:undefined,
      refs:[`Shrimpina photograph archive, ${entry.sample}, 2026.`, ...(template.refs || []).slice(1)] };
    SHRIMPINA_SPECIES.push(record);
  } else if (!SHRIMPINA_SPECIES.includes(record)) {
    record = { ...record };
    SHRIMPINA_SPECIES.push(record);
  }
  record.photos = entry.photos.map(photo => photo.src);
  record.photoLabels = entry.photos.map(photo => photo.label);
  record.heroPhoto = record.photos[0];
});

const SHRIMPINA_LADY_74 = SHRIMPINA_PHOTO_LIBRARY.find(entry => entry.sample === 'SSAJ74');
if (SHRIMPINA_LADY_74 && !SHRIMPINA_SPECIES.some(species => species.code === 'SSAJ74')) {
  const template = SHRIMPINA_PHOTO_TEMPLATES['Ocellate Lady Crab'];
  SHRIMPINA_SPECIES.push({ ...template, id:'ssaj74', code:'SSAJ74', sampleNumbers:[74], callouts:undefined,
    photos:SHRIMPINA_LADY_74.photos.map(photo => photo.src), photoLabels:SHRIMPINA_LADY_74.photos.map(photo => photo.label), heroPhoto:SHRIMPINA_LADY_74.photos[0].src,
    refs:['Shrimpina photograph archive, SSAJ74, 2026.', ...(template.refs || []).slice(1)] });
}

const SHRIMPINA_LADY_33 = SHRIMPINA_SPECIES.find(species => species.code === 'SSAJ33');
if (SHRIMPINA_LADY_33) {
  SHRIMPINA_LADY_33.morphologyViews = [
    {
      label:'Dorsal',
      src:'assets/shrimpina-morphology/ssaj33-lady-crab-dorsal-labeled.png',
      alt:'Student-labeled dorsal view of an ocellate lady crab',
      caption:'Student-labeled upper surface',
      callouts:[]
    },
    {
      label:'Ventral',
      src:'assets/shrimpina-morphology/ssaj33-lady-crab-ventral-labeled.png',
      alt:'Student-labeled ventral view of an ocellate lady crab',
      caption:'Student-labeled underside',
      callouts:[]
    }
  ];
}

const SHRIMPINA_ASIAN_SHORE_27 = SHRIMPINA_SPECIES.find(species => species.code === 'SSAJ27');
if (SHRIMPINA_ASIAN_SHORE_27) {
  SHRIMPINA_ASIAN_SHORE_27.morphologyViews = [
    {
      label:'Dorsal',
      src:'assets/shrimpina-morphology/ssaj27-asian-shore-crab-dorsal-labeled-v2.png',
      alt:'Student-labeled dorsal view of an Asian shore crab',
      caption:'Student-labeled upper surface',
      callouts:[]
    },
    {
      label:'Ventral',
      src:'assets/shrimpina-morphology/ssaj27-asian-shore-crab-ventral-labeled-v2.png',
      alt:'Student-labeled ventral view of an Asian shore crab',
      caption:'Student-labeled underside',
      callouts:[]
    }
  ];
}

const SHRIMPINA_BLUE_CRAB_35 = SHRIMPINA_SPECIES.find(species => species.code === 'SSAJ35');
const SHRIMPINA_GREEN_CRAB_34 = SHRIMPINA_SPECIES.find(species => species.code === 'SSAJ34');
if (SHRIMPINA_GREEN_CRAB_34) {
  SHRIMPINA_GREEN_CRAB_34.morphologyViews = [
    {
      label:'Dorsal',
      src:'assets/shrimpina-morphology/ssaj34-european-green-crab-dorsal-labeled.png',
      alt:'Student-labeled dorsal view of a European green crab',
      caption:'Student-labeled upper surface',
      callouts:[]
    },
    {
      label:'Ventral',
      src:'assets/shrimpina-morphology/ssaj34-european-green-crab-ventral-labeled.png',
      alt:'Student-labeled ventral view of a European green crab',
      caption:'Student-labeled underside',
      callouts:[]
    }
  ];
}
if (SHRIMPINA_BLUE_CRAB_35) {
  SHRIMPINA_BLUE_CRAB_35.morphologyViews = [
    {
      label:'Ventral',
      src:'assets/shrimpina-morphology/ssaj35-atlantic-blue-crab-ventral-labeled.png',
      alt:'Student-labeled ventral view of Atlantic blue crab SSAJ35',
      caption:'Student-labeled underside',
      callouts:[]
    },
    {
      label:'Dorsal',
      src:'assets/shrimpina-morphology/ssaj35-atlantic-blue-crab-dorsal-labeled.png',
      alt:'Student-labeled dorsal view of Atlantic blue crab SSAJ35',
      caption:'Student-labeled upper surface',
      callouts:[]
    },
    {
      label:'Ruler view',
      src:'assets/shrimpina-morphology/ssaj35-atlantic-blue-crab-ruler.png',
      alt:'Ruler photograph of Atlantic blue crab SSAJ35',
      caption:'Scale-reference photograph from the labeled morphology slide',
      measurement:'Approx. 15 cm across · read from ruler',
      callouts:[]
    }
  ];
}

const SHRIMPINA_SAMPLE_MORPHOLOGY = {
  SSAJ1: [
    {
      label:'Measured lateral',
      src:'assets/shrimpina-morphology/ssaj1-hermit-crab-measured-lateral-labeled.png',
      alt:'Student-labeled measured lateral view of long-clawed hermit crab SSAJ1',
      caption:'Student-labeled measured view',
      measurement:'Approx. 2.2 cm overall · read from ruler',
      callouts:[]
    },
    {
      label:'Ventral',
      src:'assets/shrimpina-morphology/ssaj1-hermit-crab-ventral-labeled.png',
      alt:'Student-labeled ventral view of long-clawed hermit crab SSAJ1',
      caption:'Student-labeled underside',
      measurement:'Approx. 2.2 cm overall · ruler view',
      callouts:[]
    }
  ],
  SSAJ6: [
    {
      label:'Labeled specimen',
      src:'assets/shrimpina-morphology/ssaj6-hermit-crab-labeled.png',
      alt:'Student-labeled view of long-clawed hermit crab SSAJ6',
      caption:'Student-labeled specimen view',
      measurement:'Approx. 0.8 cm overall · read from ruler',
      callouts:[]
    },
    {
      label:'Ruler view',
      src:'assets/shrimpina-morphology/ssaj6-hermit-crab-ruler.png',
      alt:'Ruler view of long-clawed hermit crab SSAJ6 with student-labeled dactylus',
      caption:'Measurement photograph',
      measurement:'Approx. 0.8 cm overall · read from ruler',
      callouts:[]
    }
  ],
  SSAJ8: [
    {
      label:'Labeled specimen',
      src:'assets/shrimpina-morphology/ssaj8-hermit-crab-labeled.png',
      alt:'Student-labeled view of long-clawed hermit crab SSAJ8',
      caption:'Student-labeled specimen view',
      measurement:'Approx. 2.0 cm overall · read from ruler',
      callouts:[]
    },
    {
      label:'Ruler view',
      src:'assets/shrimpina-morphology/ssaj8-hermit-crab-ruler.png',
      alt:'Ruler view of long-clawed hermit crab SSAJ8',
      caption:'Measurement photograph',
      measurement:'Approx. 2.0 cm overall · read from ruler',
      callouts:[]
    }
  ],
  SSAJ13: [
    {
      label:'Labeled specimen',
      src:'assets/shrimpina-morphology/ssaj13-hermit-crab-labeled.png',
      alt:'Student-labeled view of long-clawed hermit crab SSAJ13',
      caption:'Student-labeled specimen view',
      measurement:'Approx. 2.4 cm overall · read from ruler',
      callouts:[]
    },
    {
      label:'Ruler view',
      src:'assets/shrimpina-morphology/ssaj13-hermit-crab-ruler.png',
      alt:'Ruler view of long-clawed hermit crab SSAJ13',
      caption:'Measurement photograph',
      measurement:'Approx. 2.4 cm overall · read from ruler',
      callouts:[]
    }
  ],
  SSAJ14: [
    {
      label:'Ruler view',
      src:'assets/shrimpina-morphology/ssaj14-grass-shrimp-ruler-labeled.png',
      alt:'Student-labeled ruler view of eastern grass shrimp SSAJ14',
      caption:'Student-labeled measurement view',
      measurement:'Approx. 2.7 cm body length · antennae excluded',
      callouts:[]
    },
    {
      label:'Close view',
      src:'assets/shrimpina-morphology/ssaj14-grass-shrimp-close-labeled.png',
      alt:'Student-labeled close view of eastern grass shrimp SSAJ14',
      caption:'Student-labeled close view',
      measurement:'Approx. 2.7 cm body length · read from ruler',
      callouts:[]
    }
  ],
  SSAJ15: [
    {
      label:'Ruler view',
      src:'assets/shrimpina-morphology/ssaj15-grass-shrimp-ruler.png',
      alt:'Ruler view of grass shrimp SSAJ15',
      caption:'Measurement photograph',
      measurement:'Approx. 3.4 cm body length · antennae excluded',
      callouts:[]
    },
    {
      label:'Labeled specimen',
      src:'assets/shrimpina-morphology/ssaj15-grass-shrimp-labeled.png',
      alt:'Student-labeled anatomical view of grass shrimp SSAJ15',
      caption:'Student-labeled specimen view',
      measurement:'Approx. 3.4 cm body length · read from ruler',
      callouts:[]
    }
  ],
  SSAJ16: [
    {
      label:'Close view',
      src:'assets/shrimpina-morphology/ssaj16-grass-shrimp-close-labeled.png',
      alt:'Student-labeled close view of grass shrimp SSAJ16',
      caption:'Student-labeled close view',
      measurement:'Approx. 2.7 cm body length · antennae excluded',
      callouts:[]
    },
    {
      label:'Ruler view',
      src:'assets/shrimpina-morphology/ssaj16-grass-shrimp-ruler-labeled.png',
      alt:'Student-labeled ruler view of grass shrimp SSAJ16',
      caption:'Student-labeled measurement view',
      measurement:'Approx. 2.7 cm body length · antennae excluded',
      callouts:[]
    }
  ],
  SSAJ17: [
    {
      label:'Ruler view',
      src:'assets/shrimpina-morphology/ssaj17-grass-shrimp-ruler.png',
      alt:'Ruler view of grass shrimp SSAJ17',
      caption:'Measurement photograph',
      measurement:'Approx. 2.9 cm body length · antennae excluded',
      callouts:[]
    },
    {
      label:'Close view',
      src:'assets/shrimpina-morphology/ssaj17-grass-shrimp-close-labeled.png',
      alt:'Student-labeled close view of grass shrimp SSAJ17',
      caption:'Student-labeled specimen view',
      measurement:'Approx. 2.9 cm body length · read from ruler',
      callouts:[]
    }
  ],
  SSAJ21: [
    {
      label:'Labeled specimen',
      src:'assets/shrimpina-morphology/ssaj21-marsh-fiddler-crab-labeled.png',
      alt:'Student-labeled morphology view of marsh fiddler crab SSAJ21',
      caption:'Student-labeled specimen view',
      callouts:[]
    },
    {
      label:'Propodus detail',
      src:'assets/shrimpina-morphology/ssaj21-marsh-fiddler-propodus-labeled.png',
      alt:'Student-labeled propodus detail for marsh fiddler crab SSAJ21',
      caption:'Student-labeled appendage detail',
      callouts:[]
    }
  ],
  SSAJ27: SHRIMPINA_ASIAN_SHORE_27?.morphologyViews || [],
  SSAJ33: SHRIMPINA_LADY_33?.morphologyViews || [],
  SSAJ34: SHRIMPINA_GREEN_CRAB_34?.morphologyViews || [],
  SSAJ35: SHRIMPINA_BLUE_CRAB_35?.morphologyViews || []
};

const SHRIMPINA_MORPHOLOGY_SOURCES = {
  SSAJ1:{ slide:12, note:'SSAJ1', media:['image96.png','image92.png'] },
  SSAJ6:{ slide:13, note:'SSAJ6', media:['image92.png','image93.png','image106.png'] },
  SSAJ8:{ slide:14, note:'SSAJ8', media:['image102.png','image97.png'] },
  SSAJ13:{ slide:15, note:'SSAJ13', media:['image99.png'] },
  SSAJ14:{ slide:17, note:'SSAJ14', media:['image98.png','image131.jpg'] },
  SSAJ15:{ slide:18, note:'SSAJ15', media:['image101.png','image107.png'] },
  SSAJ16:{ slide:19, note:'SSAJ16', media:['image103.png','image115.png'] },
  SSAJ17:{ slide:20, note:'SSAJ17', media:['image105.png','image104.png'] },
  SSAJ21:{ slide:25, note:'SSAJ21', media:['image113.png','image112.png'] },
  SSAJ27:{ slide:11, note:'SSAJ27', media:['image88.png','image94.png'] },
  SSAJ33:{ slide:7, note:'SSAJ33', media:['image91.png','image90.png'] },
  SSAJ34:{ slide:10, note:'Greene crab', media:['image85.png','image87.png'], mappingBasis:'Species identity and sole matching register record' },
  SSAJ35:{ slide:27, note:'SSAJ35', media:['image133.png','image122.png','image135.png'] }
};

Object.entries(SHRIMPINA_SAMPLE_MORPHOLOGY).forEach(([sample, views]) => {
  const source = SHRIMPINA_MORPHOLOGY_SOURCES[sample];
  if (!source) return;
  views.forEach(view => Object.assign(view, {
    sourceSlide:source.slide,
    sourceNote:source.note,
    sourceMedia:[...source.media],
    mappingBasis:source.mappingBasis || 'Exact SSAJ code in slide speaker notes'
  }));
});

const ALL_SPECIES = [...SPECIES.filter(base => !SHRIMPINA_SPECIES.some(species => species.id === base.id)), ...SHRIMPINA_SPECIES];
