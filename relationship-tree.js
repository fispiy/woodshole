const relationshipRoot=document.currentScript?.dataset.root||'.';
const relationshipMount=document.getElementById('relationshipTree');

if(relationshipMount){
const esc=value=>escapeResearchText(String(value));
const slug=value=>String(value).normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
const evolutionHierarchy={label:'Animalia',children:[
  {label:'Deuterostomia',children:[{label:'Chordata',children:[
    {label:'Aves',example:'Birds',statuses:['Ground']},
    {label:'Actinopterygii',example:'Northern Pipefish',scientific:'Syngnathus fuscus',statuses:['Aquatic'],href:`${relationshipRoot}/species.html?sample=SSAJ56`}
  ]}]},
  {label:'Protostomia',children:[
    {label:'Lophotrochozoa',children:[
      {label:'Annelida',example:'Plumed Worm',scientific:'Diopatra cuprea',statuses:['Intertidal'],href:`${relationshipRoot}/species.html?sample=SSAJ79`},
      {label:'Mollusca',example:'Periwinkles · mussels · clams',scientific:'Littorina · Geukensia · Mercenaria',statuses:['Intertidal']}
    ]},
    {label:'Ecdysozoa',children:[
      {label:'Nematoda',example:'Roundworms'},
      {label:'Arthropoda',children:[
        {label:'Chelicerata',example:'Atlantic Horseshoe Crab',scientific:'Limulus polyphemus',statuses:['Intertidal'],href:`${relationshipRoot}/species.html?sample=SSAJ57`},
        {label:'Mandibulata',children:[
          {label:'Myriapoda',example:'Centipedes · millipedes',statuses:['Ground']},
          {label:'Pancrustacea',children:[
            {label:'Hexapoda',example:'Insects',statuses:['Ground']},
            {label:'Altocrustacea',children:[{label:'Communostraca',children:[{label:'Malacostraca',children:[{label:'Decapoda',statuses:['Intertidal','Transitional','Aquatic','Invasive']}]}]}]}
          ]}
        ]}
      ]}
    ]}
  ]}
]};

const broadRankRows=['Kingdom','Clade','Clade','Phylum','Clade','Clade','Subphylum','Clade','Clade','Class','Order'];
const broadLevels={Animalia:0,Deuterostomia:1,Protostomia:1,Lophotrochozoa:2,Ecdysozoa:2,Chordata:3,Annelida:3,Mollusca:3,Nematoda:3,Arthropoda:3,Mandibulata:4,Pancrustacea:5,Chelicerata:6,Myriapoda:6,Hexapoda:6,Altocrustacea:7,Communostraca:8,Aves:9,Actinopterygii:9,Malacostraca:9,Decapoda:10};
const evolutionWidth=1560,evolutionDepthStep=82,evolutionLeaves=[];
const collectLeaves=node=>node.children?.length?node.children.forEach(collectLeaves):evolutionLeaves.push(node);
collectLeaves(evolutionHierarchy);
evolutionLeaves.forEach((leaf,index)=>{leaf.x=82+index*((evolutionWidth-164)/(evolutionLeaves.length-1));});
const positionEvolution=(node,depth=0)=>{node.depth=depth;node.rank=broadRankRows[broadLevels[node.label]];node.y=50+broadLevels[node.label]*evolutionDepthStep;node.children?.forEach(child=>positionEvolution(child,depth+1));if(node.children?.length)node.x=node.children.reduce((sum,child)=>sum+child.x,0)/node.children.length;};
positionEvolution(evolutionHierarchy);
const findNode=(node,label)=>node.label===label?node:(node.children||[]).map(child=>findNode(child,label)).find(Boolean);
const decapoda=findNode(evolutionHierarchy,'Decapoda');

const broadEdges=[],broadNodes=[];
const broadNodeMarkup=node=>{
  const hasStatuses=Boolean(node.statuses?.length),hasScientific=Boolean(node.scientific),height=hasScientific?88:(hasStatuses?70:(node.example?52:38));
  const width=node.scientific?.length>25?230:node.example&&node.example.length>23?200:node.statuses?.length>3?300:156;
  const titleY=hasScientific?-24:node.example?(hasStatuses?-14:-7):(hasStatuses?-7:5),exampleY=hasScientific?-6:(hasStatuses?3:11),statusY=hasScientific?28:23;
  const statuses=hasStatuses?`<text class="relationship-broad-status" text-anchor="middle" y="${statusY}">${node.statuses.map((status,index)=>`<tspan class="${status==='Invasive'?'relationship-invasive':`zone-${slug(status)}`}"${index?' dx="10"':''}>${esc(status)}</tspan>`).join('')}</text>`:'';
  const content=`<rect x="-${width/2}" y="-${height/2}" width="${width}" height="${height}"/><text text-anchor="middle" y="${titleY}">${esc(node.label)}</text>${node.example?`<text class="relationship-example" text-anchor="middle" y="${exampleY}">${esc(node.example)}</text>`:''}${hasScientific?`<text class="relationship-broad-scientific" text-anchor="middle" y="11">${esc(node.scientific)}</text>`:''}${statuses}`;
  const tag=node.href?'a':'g',href=node.href?` href="${node.href}" aria-label="${esc(node.example)}, ${esc(node.scientific)}, ${esc(node.statuses.join(', '))}"`:'';
  return `<${tag} data-rank="${node.rank}" data-taxon="${esc(node.label)}" class="relationship-node relationship-node-broad${node.label==='Animalia'?' relationship-node-root':''}${node.href?' relationship-broad-link':''}"${href} transform="translate(${node.x} ${node.y})">${content}</${tag}>`;
};
const buildBroad=node=>{
  if(node.label!=='Decapoda') broadNodes.push(broadNodeMarkup(node));
  (node.children||[]).forEach(child=>{
    const middle=node.y+(child.y-node.y)*.5;
    broadEdges.push(`<path d="M ${node.x} ${node.y+20} V ${middle} H ${child.x} V ${child.y-20}"/>`);
    buildBroad(child);
  });
};
buildBroad(evolutionHierarchy);
const broadRankGuides=broadRankRows.map((rank,index)=>{
  const y=50+index*evolutionDepthStep;
  return `<g class="relationship-rank" data-rank="${rank}"><text x="-95" y="${y+3}">${rank}</text><line x1="-10" y1="${y}" x2="${evolutionWidth}" y2="${y}"/></g>`;
}).join('');

const taxonomy=SHRIMPINA_RESEARCH.taxonomyTree;
const ecology=SHRIMPINA_RESEARCH.taxonomyEcology;
const displayZone=zone=>zone;
const speciesHref=scientific=>scientific==='Tumidotheres maculatus'?`${relationshipRoot}/research.html#species-${scientific.replace(/\W+/g,'-')}`:`${relationshipRoot}/groups/shrimpina.html?species=${encodeURIComponent(scientific)}#g-species`;
const detailRoot={rank:'Order',label:taxonomy.order,x:decapoda.x,y:decapoda.y,children:[{rank:'Suborder',label:taxonomy.suborder,children:taxonomy.branches.map(branch=>({
  rank:'Infraorder',label:branch.name,note:branch.note,children:branch.families.map(family=>({
    rank:'Family',label:family.name,children:family.genera.map(genus=>({
      rank:'Genus',label:genus.name,children:genus.species.map(([common,scientific])=>({rank:'Species',label:common,scientific,ecology:ecology[scientific],href:speciesHref(scientific)}))
    }))
  }))
}))}]};
const detailLeaves=[];
const collectDetailLeaves=node=>node.children?.length?node.children.forEach(collectDetailLeaves):detailLeaves.push(node);
collectDetailLeaves(detailRoot);
const detailWidth=1660,detailStart=decapoda.x-detailWidth/2;
detailLeaves.forEach((leaf,index)=>{leaf.x=detailStart+92+index*((detailWidth-184)/(detailLeaves.length-1));});
const detailLevels=[0,92,188,302,418,550].map(offset=>decapoda.y+offset);
const positionDetail=(node,depth=0)=>{node.depth=depth;node.y=detailLevels[depth];node.children?.forEach(child=>positionDetail(child,depth+1));if(node.children?.length&&depth>0)node.x=node.rank==='Suborder'?decapoda.x:node.children.reduce((sum,child)=>sum+child.x,0)/node.children.length;};
positionDetail(detailRoot);

const wrapLabel=(label,max=17)=>{
  const words=label.split(' '),lines=[];let line='';
  words.forEach(word=>{const next=line?`${line} ${word}`:word;if(next.length>max&&line){lines.push(line);line=word;}else line=next;});
  if(line)lines.push(line);return lines.slice(0,2);
};
const detailEdges=[];
const buildDetailEdges=node=>(node.children||[]).forEach(child=>{const middle=node.y+(child.y-node.y)*.5,offset=child.rank==='Species'?32:20;detailEdges.push(`<path d="M ${node.x} ${node.y+20} V ${middle} H ${child.x} V ${child.y-offset}"/>`);buildDetailEdges(child);});
buildDetailEdges(detailRoot);
const detailNodes=[];
const buildDetailNodes=node=>{
  if(node.rank!=='Order'){
    if(node.rank==='Species'){
      const lines=wrapLabel(node.label),zone=esc(displayZone(node.ecology.zone)),invasive=node.ecology.invasive;
      const common=lines.map((line,index)=>`<tspan x="0" dy="${index?18:0}">${esc(line)}</tspan>`).join('');
      detailNodes.push(`<a class="relationship-node relationship-species habitat-${slug(zone)}${invasive?' is-invasive':''}" data-scientific="${esc(node.scientific)}" data-habitat="${zone}" href="${node.href}" aria-label="${esc(node.label)}, ${esc(node.scientific)}, ${zone}${invasive?', invasive':''}" transform="translate(${node.x} ${node.y})">
        <title>${esc(node.label)} — ${zone}${invasive?' · Invasive':''}</title>
        <rect class="relationship-species-hit-area" x="-76" y="-32" width="152" height="76"/>
        <text class="relationship-common" text-anchor="middle" y="${lines.length>1?-16:-7}">${common}</text>
        <text class="relationship-scientific" text-anchor="middle" y="20">${esc(node.scientific)}</text>
        ${invasive?`<text class="relationship-invasive-label" text-anchor="middle" y="37">● Invasive</text>`:''}
      </a>`);
    }else{
      const className=`relationship-node relationship-node-${node.rank.toLowerCase()}`;
      detailNodes.push(`<g class="${className}" data-rank="${node.rank}" data-taxon="${esc(node.label)}" transform="translate(${node.x} ${node.y})"><rect x="-70" y="-24" width="140" height="48"/><text text-anchor="middle" y="${node.note?-5:5}">${esc(node.label)}</text>${node.note?`<text class="relationship-example" text-anchor="middle" y="12">${esc(node.note)}</text>`:''}</g>`);
    }
  }
  node.children?.forEach(buildDetailNodes);
};
buildDetailNodes(detailRoot);
const rankGuides=detailLevels.map((y,index)=>`<g class="relationship-rank" data-rank="${['Order','Suborder','Infraorder','Family','Genus','Species'][index]}"><text x="${detailStart-96}" y="${y+3}">${['Order','Suborder','Infraorder','Family','Genus','Species'][index]}</text><line x1="${detailStart-6}" y1="${y}" x2="${detailStart+detailWidth}" y2="${y}"/></g>`).join('');

const semanticNode=node=>`<li>${node.href?`<a href="${node.href}">${esc(node.label)} — <i>${esc(node.scientific)}</i>, ${esc(displayZone(node.ecology.zone))}${node.ecology.invasive?', Invasive':''}</a>`:`${esc(node.rank)}: ${esc(node.label)}${node.note?` ${esc(node.note)}`:''}`}${node.children?.length?`<ol>${node.children.map(semanticNode).join('')}</ol>`:''}</li>`;
relationshipMount.innerHTML=`<div class="relationship-frame"><svg class="relationship-canvas" role="img" aria-labelledby="relationship-svg-title relationship-svg-desc" preserveAspectRatio="xMidYMid meet"><title id="relationship-svg-title">Evolutionary Tree</title><desc id="relationship-svg-desc">Taxonomic context from Animalia to Decapoda, then suborder Pleocyemata, continuing through the ten crab species in the collection.</desc><defs><linearGradient id="relationship-transitional-fill" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#287db4" stop-opacity=".25"/><stop offset="100%" stop-color="#30975f" stop-opacity=".25"/></linearGradient><linearGradient id="relationship-transitional-strong" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#965b00"/><stop offset="100%" stop-color="#965b00"/></linearGradient></defs><g class="relationship-overview-layer"><g class="relationship-ranks">${broadRankGuides}</g><g class="relationship-lines">${broadEdges.join('')}</g>${broadNodes.join('')}</g><g class="relationship-detail-layer" aria-hidden="true"><g class="relationship-ranks">${rankGuides}</g><g class="relationship-lines">${detailEdges.join('')}</g>${detailNodes.join('')}</g><g class="relationship-anchor">${broadNodeMarkup(decapoda)}</g></svg></div><p class="tree-summary">${esc(taxonomy.summary)}</p><div class="relationship-semantic"><ol>${semanticNode(detailRoot)}</ol></div>`;

const svg=relationshipMount.querySelector('.relationship-canvas');
const frame=relationshipMount.querySelector('.relationship-frame');
const overviewLayer=svg.querySelector('.relationship-overview-layer');
const detailLayer=svg.querySelector('.relationship-detail-layer');
const anchorLayer=svg.querySelector('.relationship-anchor');
const toggle=document.getElementById('treeZoomToggle');
const level=document.getElementById('treeZoomLevel');
const pathLabel=document.getElementById('treeZoomPath');
const speciesLinks=[...detailLayer.querySelectorAll('a')];
speciesLinks.forEach(link=>link.setAttribute('tabindex','-1'));
const padBox=(box,padding)=>({x:box.x-padding,y:box.y-padding,width:box.width+padding*2,height:box.height+padding*2});
const unionBoxes=(a,b)=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),width:Math.max(a.x+a.width,b.x+b.width)-Math.min(a.x,b.x),height:Math.max(a.y+a.height,b.y+b.height)-Math.min(a.y,b.y)});
const copyBox=box=>({x:box.x,y:box.y,width:box.width,height:box.height});
let overviewBox,detailBox,currentBox,zoomed=false,busy=false;
const setBox=box=>{currentBox=copyBox(box);svg.setAttribute('viewBox',`${box.x} ${box.y} ${box.width} ${box.height}`);};
const measure=()=>{
  overviewBox=padBox(unionBoxes(overviewLayer.getBBox(),anchorLayer.getBBox()),48);
  detailBox=padBox(unionBoxes(detailLayer.getBBox(),anchorLayer.getBBox()),48);
  if(!currentBox)setBox(overviewBox);
};
measure();

const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const animateCamera=(target,toDetail)=>new Promise(resolve=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,start=copyBox(currentBox),duration=reduced?0:720,startTime=performance.now();
  const tick=now=>{const raw=duration?Math.min(1,(now-startTime)/duration):1,t=ease(raw);setBox({x:start.x+(target.x-start.x)*t,y:start.y+(target.y-start.y)*t,width:start.width+(target.width-start.width)*t,height:start.height+(target.height-start.height)*t});overviewLayer.style.opacity=String(toDetail?1-t:t);detailLayer.style.opacity=String(toDetail?t:1-t);if(raw<1)requestAnimationFrame(tick);else resolve();};
  requestAnimationFrame(tick);
});
const applyZoomState=next=>{
  zoomed=next;frame.classList.toggle('is-zoomed',zoomed);
  overviewLayer.style.opacity=zoomed?'0':'1';detailLayer.style.opacity=zoomed?'1':'0';
  overviewLayer.setAttribute('aria-hidden',String(zoomed));detailLayer.setAttribute('aria-hidden',String(!zoomed));
  overviewLayer.querySelectorAll('a').forEach(link=>link.setAttribute('tabindex',zoomed?'-1':'0'));
  speciesLinks.forEach(link=>link.setAttribute('tabindex',zoomed?'0':'-1'));
  toggle.setAttribute('aria-pressed',String(zoomed));toggle.setAttribute('aria-label',zoomed?'Zoom out to the evolutionary tree':'Zoom in to the crab collection');
  toggle.innerHTML=`<span aria-hidden="true">${zoomed?'−':'+'}</span> Zoom ${zoomed?'out':'in'}`;
  level.textContent=zoomed?'Crab collection':'Evolutionary tree';
  pathLabel.textContent=zoomed?'Decapoda → Pleocyemata → 10 species':'Animalia → Decapoda';
};
const setZoom=async next=>{
  if(busy||next===zoomed)return;busy=true;toggle.disabled=true;
  await animateCamera(next?detailBox:overviewBox,next);
  applyZoomState(next);toggle.disabled=false;busy=false;
};
toggle.addEventListener('click',()=>setZoom(!zoomed));
const initialDetail=new URLSearchParams(location.search).get('tree')!=='evolution';
setBox(initialDetail?detailBox:overviewBox);applyZoomState(initialDetail);

const pointers=new Map();let gesture=null;
const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
const midpoint=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
const clampDetail=box=>{const minWidth=detailBox.width*.42,maxWidth=detailBox.width*1.06;if(box.width<minWidth){const ratio=minWidth/box.width;box={x:box.x-(minWidth-box.width)/2,y:box.y-(box.height*ratio-box.height)/2,width:minWidth,height:box.height*ratio};}if(box.width>maxWidth){const ratio=maxWidth/box.width;box={x:box.x+(box.width-maxWidth)/2,y:box.y+(box.height-box.height*ratio)/2,width:maxWidth,height:box.height*ratio};}return box;};
frame.addEventListener('pointerdown',event=>{if(!zoomed||busy||event.target.closest('a'))return;pointers.set(event.pointerId,event);frame.setPointerCapture(event.pointerId);const values=[...pointers.values()];gesture=values.length===1?{type:'pan',point:values[0],box:copyBox(currentBox)}:{type:'pinch',distance:distance(values[0],values[1]),middle:midpoint(values[0],values[1]),box:copyBox(currentBox)};});
frame.addEventListener('pointermove',event=>{if(!pointers.has(event.pointerId)||!gesture)return;pointers.set(event.pointerId,event);const values=[...pointers.values()],rect=svg.getBoundingClientRect();if(values.length===1&&gesture.type==='pan'){const dx=(event.clientX-gesture.point.clientX)*gesture.box.width/rect.width,dy=(event.clientY-gesture.point.clientY)*gesture.box.height/rect.height;setBox({...gesture.box,x:gesture.box.x-dx,y:gesture.box.y-dy});}else if(values.length>1){if(gesture.type!=='pinch')gesture={type:'pinch',distance:distance(values[0],values[1]),middle:midpoint(values[0],values[1]),box:copyBox(currentBox)};const factor=gesture.distance/distance(values[0],values[1]),next=clampDetail({x:gesture.box.x+(gesture.box.width-gesture.box.width*factor)/2,y:gesture.box.y+(gesture.box.height-gesture.box.height*factor)/2,width:gesture.box.width*factor,height:gesture.box.height*factor});setBox(next);}});
const endPointer=event=>{pointers.delete(event.pointerId);gesture=null;};
frame.addEventListener('pointerup',endPointer);frame.addEventListener('pointercancel',endPointer);
frame.addEventListener('wheel',event=>{if(!zoomed||(!event.ctrlKey&&!event.metaKey))return;event.preventDefault();const factor=Math.exp(event.deltaY*.0012),rect=svg.getBoundingClientRect(),px=(event.clientX-rect.left)/rect.width,py=(event.clientY-rect.top)/rect.height,next=clampDetail({x:currentBox.x+currentBox.width*px*(1-factor),y:currentBox.y+currentBox.height*py*(1-factor),width:currentBox.width*factor,height:currentBox.height*factor});setBox(next);},{passive:false});
}
