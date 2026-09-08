const relationshipRoot=document.currentScript?.dataset.root||'.';
const evolutionHierarchy={label:'Animalia',tone:'root',children:[
  {label:'Deuterostomia',tone:'context',children:[{label:'Chordata',tone:'context',children:[
    {label:'Aves',tone:'bird',zone:'Ground'},
    {label:'Actinopterygii',example:'Northern Pipefish',tone:'context',zone:'Tidal water'}
  ]}]},
  {label:'Protostomia',tone:'context',children:[
    {label:'Lophotrochozoa',tone:'context',children:[
      {label:'Annelida',example:'Plumed Worm',tone:'context',zone:'Intertidal'},
      {label:'Mollusca',example:'Periwinkles · mussels · clams',tone:'context',zone:'Intertidal'}
    ]},
    {label:'Ecdysozoa',tone:'arthropod',children:[
      {label:'Nematoda',example:'Roundworms',tone:'context'},
      {label:'Arthropoda',tone:'arthropod',children:[
        {label:'Chelicerata',example:'Atlantic Horseshoe Crab',tone:'arthropod',zone:'Intertidal'},
        {label:'Mandibulata',tone:'crab-path',children:[
          {label:'Myriapoda',example:'Centipedes · millipedes',tone:'arthropod',zone:'Ground'},
          {label:'Pancrustacea',tone:'crab-path',children:[
            {label:'Hexapoda',example:'Insects',tone:'arthropod',zone:'Ground'},
            {label:'Altocrustacea',tone:'crab-path',children:[{label:'Communostraca',tone:'crab-path',children:[{label:'Malacostraca',tone:'crab-path',children:[{label:'Decapoda',tone:'decapod',children:[
              {label:'Caridea',example:'Shrimp',tone:'decapod',zone:'Tidal water'},
              {label:'Anomura',example:'Hermit crabs',tone:'anomura',zone:'Intertidal'},
              {label:'Brachyura',example:'True crabs',tone:'brachyura',zone:'Intertidal'}
            ]}]}]}]}
          ]}
        ]}
      ]}
    ]}
  ]}
]};
const evolutionWidth=1440,evolutionLeaves=[];
const collectEvolutionLeaves=node=>node.children?.length?node.children.forEach(collectEvolutionLeaves):evolutionLeaves.push(node);collectEvolutionLeaves(evolutionHierarchy);
const evolutionHeight=980,evolutionDepthStep=78;
evolutionLeaves.forEach((leaf,index)=>{leaf.x=86+index*((evolutionWidth-172)/(evolutionLeaves.length-1));});
const positionEvolution=(node,depth=0)=>{node.y=55+depth*evolutionDepthStep;node.children?.forEach(child=>positionEvolution(child,depth+1));if(node.children?.length)node.x=node.children.reduce((sum,child)=>sum+child.x,0)/node.children.length;};positionEvolution(evolutionHierarchy);
const findEvolutionNode=(node,label)=>node.label===label?node:(node.children||[]).map(child=>findEvolutionNode(child,label)).find(Boolean),evolutionDecapoda=findEvolutionNode(evolutionHierarchy,'Decapoda'),evolutionZoomOrigin=`${(evolutionDecapoda.x/evolutionWidth*100).toFixed(2)}% ${(evolutionDecapoda.y/evolutionHeight*100).toFixed(2)}%`;
const evolutionEdges=[];const collectEvolutionEdges=node=>(node.children||[]).forEach(child=>{const middleY=node.y+(child.y-node.y)*.5;evolutionEdges.push(`<path class="evolution-edge evolution-edge-${child.tone}" d="M ${node.x} ${node.y+20} V ${middleY} H ${child.x} V ${child.y-20}"/>`);collectEvolutionEdges(child);});collectEvolutionEdges(evolutionHierarchy);
const evolutionSlug=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-');
const evolutionNodes=[];const collectEvolutionNodes=(node,depth=0)=>{const hasZone=Boolean(node.zone),boxHeight=hasZone?68:(node.example?52:38);evolutionNodes.push(`<g class="evolution-node evolution-node-${node.tone} evolution-depth-${depth}${hasZone?` evolution-habitat-${evolutionSlug(node.zone)}`:''}" transform="translate(${node.x} ${node.y})"><rect x="-64" y="-${boxHeight/2}" width="128" height="${boxHeight}" rx="0"/><text text-anchor="middle" y="${node.example?-8:5}">${escapeResearchText(node.label)}</text>${node.example?`<text class="evolution-example" text-anchor="middle" y="10">${escapeResearchText(node.example)}</text>`:''}${hasZone?`<text class="evolution-zone" text-anchor="middle" y="27">${escapeResearchText(node.zone)}</text>`:''}</g>`);node.children?.forEach(child=>collectEvolutionNodes(child,depth+1));};collectEvolutionNodes(evolutionHierarchy);
const evolutionTree=document.getElementById('labEvolutionTree');
evolutionTree.innerHTML=`<div class="evolution-diagram tree-map"><div class="evolution-scroll-region tree-map-viewport" tabindex="0" aria-label="Evolutionary tree fitted to show the complete hierarchy"><div class="evolution-stage-wrap"><svg class="evolution-stage" viewBox="0 0 ${evolutionWidth} ${evolutionHeight}" role="img" aria-labelledby="evolution-svg-title"><title id="evolution-svg-title">Evolutionary Tree</title><g>${evolutionEdges.join('')}</g><g>${evolutionNodes.join('')}</g></svg></div></div></div>`;
const evolutionScroller=evolutionTree.querySelector('.evolution-scroll-region'),evolutionStage=evolutionTree.querySelector('.evolution-stage'),evolutionWrap=evolutionTree.querySelector('.evolution-stage-wrap');
const evolutionFitScale=()=>Math.min(1,evolutionScroller.clientWidth/evolutionWidth,evolutionScroller.clientHeight/evolutionHeight),sizeEvolution=()=>{const scale=evolutionFitScale();evolutionStage.style.width=`${evolutionWidth*scale}px`;evolutionStage.style.height=`${evolutionHeight*scale}px`;evolutionWrap.style.width=`${evolutionWidth*scale}px`;evolutionWrap.style.height=`${evolutionHeight*scale}px`;evolutionWrap.style.margin='auto';};
new ResizeObserver(sizeEvolution).observe(evolutionScroller);

const taxonomy=SHRIMPINA_RESEARCH.taxonomyTree,taxonomyEcology=SHRIMPINA_RESEARCH.taxonomyEcology;
const taxonomySlug=value=>String(value).normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
const taxonomyHref=scientific=>scientific==='Tumidotheres maculatus'?`${relationshipRoot}/research.html#species-${scientific.replace(/\W+/g,'-')}`:`${relationshipRoot}/groups/shrimpina.html?species=${encodeURIComponent(scientific)}#g-species`;
const taxonomyHierarchy={
  id:`lab-order-${taxonomySlug(taxonomy.order)}`,rank:'Order',label:taxonomy.order,
  children:taxonomy.branches.map(branch=>({
        id:`lab-infraorder-${taxonomySlug(branch.name)}`,rank:'Infraorder',label:branch.name,note:branch.note,tone:taxonomySlug(branch.name),
        children:branch.families.map(family=>({
          id:`lab-family-${taxonomySlug(family.name)}`,rank:'Family',label:family.name,tone:taxonomySlug(branch.name),
          children:family.genera.map(genus=>({
            id:`lab-genus-${taxonomySlug(genus.name)}`,rank:'Genus',label:genus.name,tone:taxonomySlug(branch.name),
            children:genus.species.map(([common,scientific])=>({
              id:`lab-species-${taxonomySlug(scientific)}`,rank:'Species',label:common,scientific,tone:taxonomySlug(branch.name),href:taxonomyHref(scientific),ecology:taxonomyEcology[scientific]
            }))
          }))
        }))
      }))
};
const taxonomyWidth=1440,taxonomyHeight=780,taxonomyLevels=[62,182,330,486,658],taxonomyLeaves=[];
const collectTaxonomyLeaves=node=>node.children?.length?node.children.forEach(collectTaxonomyLeaves):taxonomyLeaves.push(node);collectTaxonomyLeaves(taxonomyHierarchy);
taxonomyLeaves.forEach((leaf,index)=>{leaf.x=112+index*((taxonomyWidth-224)/(taxonomyLeaves.length-1));});
const positionTaxonomy=(node,depth=0,parentTone='root')=>{node.y=taxonomyLevels[depth];node.tone||=parentTone;node.children?.forEach(child=>positionTaxonomy(child,depth+1,node.tone));if(node.children?.length)node.x=node.children.reduce((sum,child)=>sum+child.x,0)/node.children.length;};positionTaxonomy(taxonomyHierarchy);
const taxonomyEdges=[];const collectTaxonomyEdges=node=>(node.children||[]).forEach(child=>{const middleY=node.y+(child.y-node.y)*.52,childOffset=child.rank==='Species'?50:20;taxonomyEdges.push(`<path class="taxonomy-edge taxonomy-edge-${child.tone}" d="M ${node.x.toFixed(2)} ${node.y+20} V ${middleY.toFixed(2)} H ${child.x.toFixed(2)} V ${child.y-childOffset}"/>`);collectTaxonomyEdges(child);});collectTaxonomyEdges(taxonomyHierarchy);
const taxonomyMarkup=node=>`<li>${node.href?`<a class="taxonomy-node taxonomy-node-species taxonomy-tone-${node.tone} habitat-${taxonomySlug(node.ecology.zone)}${node.ecology.invasive?' is-invasive':''}" id="${node.id}" href="${node.href}" style="--node-x:${node.x}px;--node-y:${node.y}px" aria-label="${escapeResearchText(node.label)}, ${escapeResearchText(node.scientific)}, ${escapeResearchText(node.ecology.zone)}, ${node.ecology.invasive?'invasive':'not invasive'}"><strong>${escapeResearchText(node.label)}</strong><i>${escapeResearchText(node.scientific)}</i><span class="taxonomy-meta"><em class="zone-${taxonomySlug(node.ecology.zone)}">${escapeResearchText(node.ecology.zone)}</em><b class="status-${node.ecology.invasive?'invasive':'not-invasive'}">${node.ecology.invasive?'Invasive':'Not invasive'}</b></span></a>`:`<span class="taxonomy-node taxonomy-node-${node.rank.toLowerCase()} taxonomy-tone-${node.tone}" id="${node.id}" style="--node-x:${node.x}px;--node-y:${node.y}px"><strong>${escapeResearchText(node.label)}</strong>${node.note?`<i>${escapeResearchText(node.note)}</i>`:''}</span>`}${node.children?.length?`<ol>${node.children.map(taxonomyMarkup).join('')}</ol>`:''}</li>`;
const taxonomyGuides=taxonomyLevels.map((y,index)=>`<g class="taxonomy-rank-guide"><line x1="22" y1="${y}" x2="1418" y2="${y}"/><text x="22" y="${y-11}">${['Order','Infraorder','Family','Genus','Species'][index]}</text></g>`).join('');
document.getElementById('labTaxonomyTree').innerHTML=`<div class="taxonomy-diagram tree-map"><div class="taxonomy-scroll-region tree-map-viewport" tabindex="0" aria-label="Crab collection tree continuing from Decapoda to the nine species"><div class="taxonomy-stage-wrap"><div class="taxonomy-stage" style="--tree-width:${taxonomyWidth}px;--tree-height:${taxonomyHeight}px"><svg class="taxonomy-connectors" viewBox="0 0 ${taxonomyWidth} ${taxonomyHeight}" aria-hidden="true" focusable="false">${taxonomyGuides}<g>${taxonomyEdges.join('')}</g></svg><ol class="taxonomy-node-layer" aria-label="Taxonomic hierarchy from Decapoda to the nine crab species">${taxonomyMarkup(taxonomyHierarchy)}</ol></div></div></div><p class="tree-summary">${escapeResearchText(taxonomy.summary)}</p></div>`;
const taxonomyTree=document.getElementById('labTaxonomyTree'),taxonomyScroller=taxonomyTree.querySelector('.taxonomy-scroll-region'),taxonomyStage=taxonomyTree.querySelector('.taxonomy-stage'),taxonomyStageWrap=taxonomyTree.querySelector('.taxonomy-stage-wrap');
const taxonomyFitScale=()=>Math.min(1,taxonomyScroller.clientWidth/taxonomyWidth,taxonomyScroller.clientHeight/taxonomyHeight),sizeTaxonomy=()=>{const scale=taxonomyFitScale();taxonomyStage.style.transform=`scale(${scale})`;taxonomyStageWrap.style.width=`${taxonomyWidth*scale}px`;taxonomyStageWrap.style.height=`${taxonomyHeight*scale}px`;taxonomyStageWrap.style.margin='auto';};
new ResizeObserver(sizeTaxonomy).observe(taxonomyScroller);

const treeZoomToggle=document.getElementById('treeZoomToggle'),treeZoomLevel=document.getElementById('treeZoomLevel'),treeZoomPath=document.getElementById('treeZoomPath'),evolutionPanel=document.getElementById('tree-view-evolution'),collectionPanel=document.getElementById('tree-view-collection');let collectionZoomed=false,treeZoomBusy=false;
const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
async function setTreeZoom(zoomed){if(treeZoomBusy||zoomed===collectionZoomed)return;treeZoomBusy=true;treeZoomToggle.disabled=true;const outgoing=zoomed?evolutionPanel:collectionPanel,incoming=zoomed?collectionPanel:evolutionPanel,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,outOrigin=zoomed?evolutionZoomOrigin:'50% 8%',inOrigin=zoomed?'50% 8%':evolutionZoomOrigin;outgoing.style.transformOrigin=outOrigin;if(!reduced)await outgoing.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:`scale(${zoomed?1.16:.86})`}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}).finished.catch(()=>{});outgoing.hidden=true;incoming.hidden=false;collectionZoomed=zoomed;treeZoomToggle.setAttribute('aria-pressed',String(zoomed));treeZoomToggle.setAttribute('aria-label',zoomed?'Zoom out to the evolutionary tree':'Zoom in to the crab collection');treeZoomToggle.innerHTML=`<span aria-hidden="true">${zoomed?'−':'+'}</span> Zoom ${zoomed?'out':'in'}`;treeZoomLevel.textContent=zoomed?'Crab collection':'Evolutionary tree';treeZoomPath.textContent=zoomed?'Decapoda → 9 species':'Animalia → Decapoda';zoomed?sizeTaxonomy():sizeEvolution();await nextFrame();incoming.style.transformOrigin=inOrigin;if(!reduced)await incoming.animate([{opacity:0,transform:`scale(${zoomed?.86:1.16})`},{opacity:1,transform:'scale(1)'}],{duration:360,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'}).finished.catch(()=>{});treeZoomToggle.disabled=false;treeZoomBusy=false;}
treeZoomToggle.addEventListener('click',()=>setTreeZoom(!collectionZoomed));
