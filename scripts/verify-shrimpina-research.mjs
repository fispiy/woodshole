#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const normalize = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

function imageDimensions(filepath) {
  const data = fs.readFileSync(filepath);
  if (data.subarray(1, 4).toString() === 'PNG') return { width:data.readUInt32BE(16), height:data.readUInt32BE(20) };
  if (data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < data.length) {
      if (data[offset] !== 0xff) { offset += 1; continue; }
      const marker = data[offset + 1];
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        return { height:data.readUInt16BE(offset + 5), width:data.readUInt16BE(offset + 7) };
      }
      if (marker === 0xd9 || marker === 0xda) break;
      offset += 2 + data.readUInt16BE(offset + 2);
    }
  }
  return { width:0, height:0 };
}

function loadConst(filename, name, context = {}) {
  const filepath = path.join(root, filename);
  const source = `${fs.readFileSync(filepath, 'utf8')}\n;globalThis.__value = ${name};`;
  const sandbox = { URL, ...context };
  vm.runInNewContext(source, sandbox, { filename:filepath });
  return sandbox.__value;
}

const register = loadConst('shrimpina-sample-register.js', 'SHRIMPINA_SAMPLE_REGISTER');
const photoLibrary = loadConst('shrimpina-photo-library.js', 'SHRIMPINA_PHOTO_LIBRARY');
const researchPath = path.join(root, 'shrimpina-research-data.js');
const research = loadConst('shrimpina-research-data.js', 'SHRIMPINA_RESEARCH', {
  document:{ currentScript:{ src:pathToFileURL(researchPath).href } }
});

const expectedDna = {
  SSAJ13:['Pagurus longicarpus',39,42], SSAJ20:['Minuca pugnax',43,45],
  SSAJ27:['Hemigrapsus sanguineus',46,49], SSAJ39:['Pagurus longicarpus',50,52],
  SSAJ43:['Pagurus longicarpus',53,57], SSAJ48:['Pagurus longicarpus',58,59],
  SSAJ51:['Pagurus longicarpus',60,62], SSAJ52:['Libinia dubia',63,68],
  SSAJ53:['Libinia dubia',69,73], SSAJ54:['Leptuca pugilator',74,75],
  SSAJ55:['Leptuca pugilator',76,78], SSAJ65:['Littorina littorea',79,80],
  SSAJ66:['Littorina littorea',81,82], SSAJ67:['Leptuca pugilator',83,85]
};

check(register.length === 83, `Expected 83 register records, found ${register.length}`);
check(Object.keys(research.dnaBySample).length === 14, `Expected 14 DNA entries, found ${Object.keys(research.dnaBySample).length}`);

for (const [code, [scientific, start, end]] of Object.entries(expectedDna)) {
  const dna = research.dnaBySample[code];
  const specimen = register.find(item => item.code === code);
  check(Boolean(dna), `${code}: missing from DNA data`);
  check(Boolean(specimen), `${code}: missing from specimen register`);
  if (!dna || !specimen) continue;
  check(dna.pages[0] === start && dna.pages.at(-1) === end, `${code}: expected PDF pages ${start}-${end}`);
  check(normalize(specimen.sci) === normalize(scientific), `${code}: register species is ${specimen.sci}, expected ${scientific}`);
  const startText = fs.readFileSync(path.join(root, dna.textFiles[0]), 'utf8');
  check(normalize(startText).includes(normalize(code)), `${code}: starting page does not contain its SSAJ code`);
  check(normalize(startText).includes(normalize(scientific)), `${code}: starting page does not contain ${scientific}`);
  for (const figure of dna.figures) {
    const filepath = path.join(root, figure);
    check(fs.existsSync(filepath) && fs.statSync(filepath).size > 0, `${code}: missing or empty figure ${figure}`);
  }
}

for (const code of ['SSAJ54','SSAJ55']) {
  const specimen = register.find(item => item.code === code);
  check(specimen?.common === 'Atlantic Sand Fiddler Crab', `${code}: common name must be Atlantic Sand Fiddler Crab`);
  check(specimen?.sci === 'Leptuca pugilator', `${code}: scientific name must be Leptuca pugilator`);
}

const morphologyManifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/shrimpina-morphology/manifest.json'), 'utf8'));
const expectedMorphology = {SSAJ1:12,SSAJ6:13,SSAJ8:14,SSAJ13:15,SSAJ14:17,SSAJ15:18,SSAJ16:19,SSAJ17:20,SSAJ21:25,SSAJ27:11,SSAJ33:7,SSAJ34:10,SSAJ35:27};
for (const [code, slide] of Object.entries(expectedMorphology)) {
  const item = morphologyManifest.specimens.find(entry => entry.sample === code);
  check(item?.slide === slide, `${code}: morphology source must be slide ${slide}`);
  for (const output of item?.outputs || []) {
    const filename = typeof output === 'string' ? output : output.file;
    const filepath = path.join(root, 'assets/shrimpina-morphology', filename);
    check(fs.existsSync(filepath) && fs.statSync(filepath).size > 0, `${code}: missing morphology asset ${filename}`);
    if (fs.existsSync(filepath)) {
      const dimensions = imageDimensions(filepath);
      check(dimensions.width > 0 && dimensions.height > 0, `${code}: unreadable morphology asset ${filename}`);
    }
  }
}

const sandFiddlerReference = morphologyManifest.speciesReferences?.find(entry => entry.scientificName === 'Leptuca pugilator');
check(sandFiddlerReference?.pages?.join(',') === '1,2', 'Atlantic Sand Fiddler Crab: labeled source must contain PDF pages 1 and 2');
for (const filename of sandFiddlerReference?.outputs || []) {
  const filepath = path.join(root, 'assets/shrimpina-morphology', filename);
  check(fs.existsSync(filepath) && fs.statSync(filepath).size > 0, `Atlantic Sand Fiddler Crab: missing morphology asset ${filename}`);
  if (fs.existsSync(filepath)) {
    const dimensions = imageDimensions(filepath);
    check(dimensions.width === 1400 && dimensions.height === 787, `Atlantic Sand Fiddler Crab: ${filename} must preserve native 1400x787 dimensions`);
  }
}

const comparisonManifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/shrimpina-research/comparisons/manifest.json'), 'utf8'));
check(comparisonManifest.plates.length === 4, 'Laboratory: expected four comparative morphology plates');
for (const plate of comparisonManifest.plates) {
  const filepath = path.join(root, 'assets/shrimpina-research/comparisons', plate.file);
  check(fs.existsSync(filepath) && fs.statSync(filepath).size > 0, `Laboratory: missing comparison plate ${plate.file}`);
  if (fs.existsSync(filepath)) {
    const dimensions = imageDimensions(filepath);
    check(dimensions.width === plate.width && dimensions.height === plate.height, `Laboratory: ${plate.file} dimensions do not match manifest`);
  }
}

const mapManifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/shrimpina-map/manifest.json'), 'utf8'));
for (const item of mapManifest.records) {
  const filepath = path.join(root, 'assets/shrimpina-map', item.localFile);
  check(fs.existsSync(filepath) && fs.statSync(filepath).size > 0, `${item.code}: missing cached map thumbnail ${item.localFile}`);
  if (fs.existsSync(filepath)) {
    const dimensions = imageDimensions(filepath);
    check(dimensions.width > 0 && dimensions.height > 0, `${item.code}: cached map thumbnail has no readable dimensions`);
  }
}

// Field photographs must remain specimen-specific. Species prose and taxonomy
// may be shared, but an SSAJ profile must never inherit another record's media.
for (const entry of photoLibrary) {
  const exactSample = /^SSAJ\d+$/.test(entry.sample);
  for (const photo of entry.photos) {
    const filepath = path.join(root, photo.src);
    check(fs.existsSync(filepath) && fs.statSync(filepath).size > 0, `${entry.sample}: missing field photograph ${photo.src}`);
    if (exactSample) {
      check(photo.src.toLowerCase().includes(`/${entry.sample.toLowerCase()}/`), `${entry.sample}: photograph belongs to a different specimen path: ${photo.src}`);
    }
    if (fs.existsSync(filepath)) {
      const dimensions = imageDimensions(filepath);
      check(dimensions.width > 0 && dimensions.height > 0, `${entry.sample}: unreadable field photograph ${photo.src}`);
    }
  }
}
const ladyCrab74 = photoLibrary.find(entry => entry.sample === 'SSAJ74');
check(ladyCrab74?.photos.length === 1, 'SSAJ74 must have exactly one verified specimen photograph');
check(ladyCrab74?.photos[0]?.src.endsWith('/ssaj74/01-measurement.png'), 'SSAJ74 must use its verified ruler photograph');
check(!photoLibrary.some(entry => entry.photos.some(photo => photo.src.endsWith('/ssaj74/01-dorsal.jpg'))), 'SSAJ74 must not use the rejected contact-sheet image');

const film = research.researchMedia?.marshFilm;
check(Boolean(film), 'Missing marsh film data');
for (const mediaPath of [film?.src, film?.poster].filter(Boolean)) {
  const filepath = path.join(root, mediaPath);
  check(fs.existsSync(filepath) && fs.statSync(filepath).size > 0, `Missing media asset ${mediaPath}`);
}

const overviewSource = fs.readFileSync(path.join(root, 'groups/shrimpina.html'), 'utf8');
const guideSource = fs.readFileSync(path.join(root, 'research.html'), 'utf8');
const labSource = fs.readFileSync(path.join(root, 'lab.html'), 'utf8');
check(!overviewSource.includes('id="g-comparisons"'), 'Overview still contains the comparison section');
check(!overviewSource.includes('comparisonTables'), 'Overview still renders comparison tables');
check(overviewSource.includes('class="phylogeny-branch'), 'Overview is missing the SVG phylogeny branches');
check(overviewSource.includes('class="phylogeny-leaf'), 'Overview is missing the linked phylogeny terminals');
check(overviewSource.includes('aria-label="Scrollable final specimen phylogeny"'), 'Overview is missing accessible phylogeny navigation');
check(!overviewSource.includes('class="tree-row"'), 'Overview still contains the deprecated table-like taxonomy rows');
check(overviewSource.includes('<h2>Final Phylogeny Tree</h2>'), 'Overview is missing the final phylogeny heading');
check(overviewSource.includes('id="phylogenyTree"'), 'Overview is missing the final phylogeny renderer');
check(guideSource.includes('SHRIMPINA_RESEARCH.comparisons[0]') && guideSource.includes('SHRIMPINA_RESEARCH.comparisons[2]'), 'Research Guide does not render all comparison groups');
check(guideSource.includes("scientific.replace(/\\W+/g,'-')"), 'Research Guide is missing scientific-name anchors');
for (const lineage of ['Animalia','Deuterostomia','Protostomia','Lophotrochozoa','Ecdysozoa','Arthropoda','Pancrustacea','Malacostraca','Decapoda','Caridea','Anomura','Brachyura']) {
  check(labSource.includes(`label:'${lineage}'`), `Laboratory evolutionary context is missing ${lineage}`);
}
check(labSource.includes('id="labEvolutionTree"'), 'Laboratory is missing the expanded evolutionary tree');
check(labSource.includes('id="labTaxonomyTree"'), 'Laboratory is missing the detailed crab classification tree');

const branches = research.taxonomyTree.branches;
const families = new Set(branches.flatMap(branch => branch.families.map(family => family.name)));
const genera = new Set(branches.flatMap(branch => branch.families.flatMap(family => family.genera.map(genus => genus.name))));
const treeSpecies = branches.flatMap(branch => branch.families.flatMap(family => family.genera.flatMap(genus => genus.species)));
const expectedTreeSpecies = [
  'Ovalipes ocellatus',
  'Callinectes sapidus',
  'Carcinus maenas',
  'Minuca pugnax',
  'Leptuca pugilator',
  'Hemigrapsus sanguineus',
  'Tumidotheres maculatus',
  'Pagurus pollicaris',
  'Pagurus longicarpus'
];
check(research.taxonomyTree.phylum === 'Arthropoda', 'Taxonomy phylum must be Arthropoda');
check(research.taxonomyTree.className === 'Malacostraca', 'Taxonomy class must be Malacostraca');
check(research.taxonomyTree.order === 'Decapoda', 'Taxonomy order must be Decapoda');
check(branches.map(branch => branch.name).join(',') === 'Brachyura,Anomura', 'Taxonomy branches must be Brachyura followed by Anomura');
check(families.size === 5, `Expected 5 taxonomy families, found ${families.size}`);
check(genera.size === 8, `Expected 8 taxonomy genera, found ${genera.size}`);
check(treeSpecies.length === 9, `Expected 9 taxonomy species, found ${treeSpecies.length}`);
check(treeSpecies.map(species => species[1]).join('|') === expectedTreeSpecies.join('|'), 'Taxonomy species order does not match PDF page 35');
check(research.taxonomyTree.summary === "Within the Decapods, we've identified 5 families and 8 genera across 9 species", 'Taxonomy summary does not match PDF page 35');

const phylogenyLeaves = [];
const collectPhylogenyLeaves = node => node.children?.length ? node.children.forEach(collectPhylogenyLeaves) : phylogenyLeaves.push(node);
collectPhylogenyLeaves(research.phylogenyTree.root);
const expectedPhylogenyCodes = ['SSAJ51','SSAJ39','SSAJ36','SSAJ13','SSAJ48','SSAJ43','SSAJ52','SSAJ53','SSAJ27','SSAJ55','SSAJ54','SSAJ67','SSAJ21','SSAJ20'];
check(JSON.stringify(phylogenyLeaves.filter(leaf => leaf.code).map(leaf => leaf.code)) === JSON.stringify(expectedPhylogenyCodes), 'Final phylogeny terminals do not match the supplied tree');
check(phylogenyLeaves.at(-1)?.common === 'Marsh Grass Shrimp' && phylogenyLeaves.at(-1)?.outgroup, 'Final phylogeny is missing the Marsh Grass Shrimp outgroup');
for (const code of expectedPhylogenyCodes) check(register.some(sample => sample.code === code), `Final phylogeny references missing register specimen ${code}`);

for (const filename of ['groups/shrimpina.html','journal.html','conditions.html','lab.html']) {
  const source = fs.readFileSync(path.join(root, filename), 'utf8');
  check(source.includes('research.html') && source.includes('Research Guide'), `${filename}: missing Research Guide navigation`);
}
const profileSource = fs.readFileSync(path.join(root, 'profile-render.js'), 'utf8');
check(profileSource.includes('researchGuideHref(s)'), 'Specimen morphology is missing its Research Guide link');
const specimenPageSource = fs.readFileSync(path.join(root, 'species.html'), 'utf8');
check(!specimenPageSource.includes(': (s.photos || [])'), 'Specimen profiles can still inherit another record’s species-level photographs');
check(specimenPageSource.includes("heroPhoto:photos[0] || ''"), 'Specimen profiles can still inherit another record’s hero photograph');

if (failures.length) {
  console.error(`Shrimpina verification failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Shrimpina verification passed: ${register.length} specimens, ${Object.keys(research.dnaBySample).length} DNA records, ${morphologyManifest.specimens.length} morphology sources, ${mapManifest.records.length} cached map thumbnails.`);
