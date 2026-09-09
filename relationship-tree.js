const relationshipRoot=document.currentScript?.dataset.root||'.';
const relationshipMount=document.getElementById('relationshipTree');

if(relationshipMount){
const esc=value=>escapeResearchText(String(value));
const slug=value=>String(value).normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
const evolutionHierarchy={label:'Animalia',children:[
  {label:'Deuterostomia',children:[{label:'Chordata',children:[
    {label:'Aves',example:'Birds',statuses:['Ground']},
    {label:'Actinopterygii',example:'Northern Pipefish',scientific:'Syngnathus fuscus',statuses:['Tidal'],href:`${relationshipRoot}/species.html?sample=SSAJ56`}
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
            {label:'Altocrustacea',children:[{label:'Communostraca',children:[{label:'Malacostraca',children:[{label:'Decapoda',statuses:['Tidal','Intertidal','Transitional','Invasive']}]}]}]}
          ]}
        ]}
      ]}
    ]}
  ]}
]};

const evolutionWidth=1560,evolutionDepthStep=78,evolutionLeaves=[];
const collectLeaves=node=>node.children?.length?node.children.forEach(collectLeaves):evolutionLeaves.push(node);
collectLeaves(evolutionHierarchy);
evolutionLeaves.forEach((leaf,index)=>{leaf.x=82+index*((evolutionWidth-164)/(evolutionLeaves.length-1));});
const positionEvolution=(node,depth=0)=>{node.depth=depth;node.y=50+depth*evolutionDepthStep;node.children?.forEach(child=>positionEvolution(child,depth+1));if(node.children?.length)node.x=node.children.reduce((sum,child)=>sum+child.x,0)/node.children.length;};
positionEvolution(evolutionHierarchy);
const findNode=(node,label)=>node.label===label?node:(node.children||[]).map(child=>findNode(child,label)).find(Boolean);
const decapoda=findNode(evolutionHierarchy,'Decapoda');

const broadEdges=[],broadNodes=[];
const broadNodeMarkup=node=>{
  const hasStatuses=Boolean(node.statuses?.length),hasScientific=Boolean(node.scientific),height=hasScientific?88:(hasStatuses?70:(node.example?52:38));
  const width=node.scientific?.length>25?230:node.example&&node.example.length>23?200:node.statuses?.length>3?210:156;
  const titleY=hasScientific?-24:node.example?(hasStatuses?-14:-7):(hasStatuses?-7:5),exampleY=hasScientific?-6:(hasStatuses?3:11),statusY=hasScientific?28:23;
  const statuses=hasStatuses?`<text class="relationship-broad-status" text-anchor="middle" y="${statusY}">${node.statuses.map((status,index)=>`<tspan class="${status==='Invasive'?'relationship-invasive':`zone-${slug(status)}`}"${index?' dx="10"':''}>${esc(status)}</tspan>`).join('')}</text>`:'';
  const content=`<rect x="-${width/2}" y="-${height/2}" width="${width}" height="${height}"/><text text-anchor="middle" y="${titleY}">${esc(node.label)}</text>${node.example?`<text class="relationship-example" text-anchor="middle" y="${exampleY}">${esc(node.example)}</text>`:''}${hasScientific?`<text class="relationship-broad-scientific" text-anchor="middle" y="11">${esc(node.scientific)}</text>`:''}${statuses}`;
  const tag=node.href?'a':'g',href=node.href?` href="${node.href}" aria-label="${esc(node.example)}, ${esc(node.scientific)}, ${esc(node.statuses.join(', '))}"`:'';
  return `<${tag} class="relationship-node relationship-node-broad${node.label==='Animalia'?' relationship-node-root':''}${node.href?' relationship-broad-link':''}"${href} transform="translate(${node.x} ${node.y})">${content}</${tag}>`;
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

const taxonomy=SHRIMPINA_RESEARCH.taxonomyTree;
const ecology=SHRIMPINA_RESEARCH.taxonomyEcology;
const displayZone=zone=>zone==='Aquatic'?'Tidal':zone;
const speciesHref=scientific=>scientific==='Tumidotheres maculatus'?`${relationshipRoot}/research.html#species-${scientific.replace(/\W+/g,'-')}`:`${relationshipRoot}/groups/shrimpina.html?species=${encodeURIComponent(scientific)}#g-species`;
const detailRoot={rank:'Order',label:taxonomy.order,x:decapoda.x,y:decapoda.y,children:taxonomy.branches.map(branch=>({
  rank:'Infraorder',label:branch.name,note:branch.note,children:branch.families.map(family=>({
    rank:'Family',label:family.name,children:family.genera.map(genus=>({
      rank:'Genus',label:genus.name,children:genus.species.map(([common,scientific])=>({rank:'Species',label:common,scientific,ecology:ecology[scientific],href:speciesHref(scientific)}))
    }))
  }))
}))};
const detailLeaves=[];
const collectDetailLeaves=node=>node.children?.length?node.children.forEach(collectDetailLeaves):detailLeaves.push(node);
collectDetailLeaves(detailRoot);
const detailWidth=1660,detailStart=decapoda.x-detailWidth/2;
detailLeaves.forEach((leaf,index)=>{leaf.x=detailStart+92+index*((detailWidth-184)/(detailLeaves.length-1));});
const detailLevels=[decapoda.y,decapoda.y+126,decapoda.y+270,decapoda.y+410,decapoda.y+586];
const positionDetail=(node,depth=0)=>{node.depth=depth;node.y=detailLevels[depth];node.children?.forEach(child=>positionDetail(child,depth+1));if(node.children?.length&&depth>0)node.x=node.children.reduce((sum,child)=>sum+child.x,0)/node.children.length;};
positionDetail(detailRoot);

const wrapLabel=(label,max=19)=>{
  const words=label.split(' '),lines=[];let line='';
  words.forEach(word=>{const next=line?`${line} ${word}`:word;if(next.length>max&&line){lines.push(line);line=word;}else line=next;});
  if(line)lines.push(line);return lines.slice(0,2);
};
const detailEdges=[];
const buildDetailEdges=node=>(node.children||[]).forEach(child=>{const middle=node.y+(child.y-node.y)*.5,offset=child.rank==='Species'?53:20;detailEdges.push(`<path d="M ${node.x} ${node.y+20} V ${middle} H ${child.x} V ${child.y-offset}"/>`);buildDetailEdges(child);});
buildDetailEdges(detailRoot);
const detailNodes=[];
const buildDetailNodes=node=>{
  if(node.rank!=='Order'){
    if(node.rank==='Species'){
      const lines=wrapLabel(node.label),zone=esc(displayZone(node.ecology.zone)),invasive=node.ecology.invasive;
      const common=lines.map((line,index)=>`<tspan x="0" dy="${index?18:0}">${esc(line)}</tspan>`).join('');
      detailNodes.push(`<a class="relationship-node relationship-species habitat-${slug(displayZone(node.ecology.zone))}${invasive?' is-invasive':''}" href="${node.href}" aria-label="${esc(node.label)}, ${esc(node.scientific)}, ${zone}${invasive?', invasive':''}" transform="translate(${node.x} ${node.y})"><rect x="-78" y="-53" width="156" height="106"/><text class="relationship-common" text-anchor="middle" y="-${lines.length>1?28:19}">${common}</text><text class="relationship-scientific" text-anchor="middle" y="${lines.length>1?12:4}">${esc(node.scientific)}</text><text class="relationship-habitat zone-${slug(displayZone(node.ecology.zone))}" text-anchor="middle" y="31">${zone}</text>${invasive?`<text class="relationship-invasive" text-anchor="middle" y="45">Invasive</text>`:''}</a>`);
    }else{
      const className=`relationship-node relationship-node-${node.rank.toLowerCase()}`;
      detailNodes.push(`<g class="${className}" transform="translate(${node.x} ${node.y})"><rect x="-70" y="-24" width="140" height="48"/><text text-anchor="middle" y="${node.note?-5:5}">${esc(node.label)}</text>${node.note?`<text class="relationship-example" text-anchor="middle" y="12">${esc(node.note)}</text>`:''}</g>`);
    }
  }
  node.children?.forEach(buildDetailNodes);
};
buildDetailNodes(detailRoot);
const rankGuides=detailLevels.slice(1).map((y,index)=>`<g class="relationship-rank"><line x1="${detailStart}" y1="${y}" x2="${detailStart+detailWidth}" y2="${y}"/><text x="${detailStart+6}" y="${y-14}">${['Infraorder','Family','Genus','Species'][index]}</text></g>`).join('');

const semanticNode=node=>`<li>${node.href?`<a href="${node.href}">${esc(node.label)} — <i>${esc(node.scientific)}</i>, ${esc(displayZone(node.ecology.zone))}${node.ecology.invasive?', Invasive':''}</a>`:`${esc(node.label)}${node.note?` ${esc(node.note)}`:''}`}${node.children?.length?`<ol>${node.children.map(semanticNode).join('')}</ol>`:''}</li>`;
relationshipMount.innerHTML=`<div class="relationship-frame"><svg class="relationship-canvas" role="img" aria-labelledby="relationship-svg-title relationship-svg-desc" preserveAspectRatio="xMidYMid meet"><title id="relationship-svg-title">Crab relationships</title><desc id="relationship-svg-desc">Taxonomic context from Animalia to Decapoda, continuing through the ten crab species in the collection.</desc><g class="relationship-overview-layer"><g class="relationship-lines">${broadEdges.join('')}</g>${broadNodes.join('')}</g><g class="relationship-detail-layer" aria-hidden="true"><g class="relationship-ranks">${rankGuides}</g><g class="relationship-lines">${detailEdges.join('')}</g>${detailNodes.join('')}</g><g class="relationship-anchor">${broadNodeMarkup(decapoda)}</g></svg></div><p class="tree-summary">${esc(taxonomy.summary)}</p><div class="relationship-semantic"><ol>${semanticNode(detailRoot)}</ol></div>`;

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
const setZoom=async next=>{
  if(busy||next===zoomed)return;busy=true;toggle.disabled=true;detailLayer.removeAttribute('aria-hidden');
  if(next)speciesLinks.forEach(link=>link.setAttribute('tabindex','0'));
  await animateCamera(next?detailBox:overviewBox,next);zoomed=next;frame.classList.toggle('is-zoomed',zoomed);
  toggle.setAttribute('aria-pressed',String(zoomed));toggle.setAttribute('aria-label',zoomed?'Zoom out to the evolutionary tree':'Zoom in to the crab collection');toggle.innerHTML=`<span aria-hidden="true">${zoomed?'−':'+'}</span> Zoom ${zoomed?'out':'in'}`;
  level.textContent=zoomed?'Crab collection':'Evolutionary tree';pathLabel.textContent=zoomed?'Decapoda → 10 species':'Animalia → Decapoda';
  if(!zoomed){detailLayer.setAttribute('aria-hidden','true');speciesLinks.forEach(link=>link.setAttribute('tabindex','-1'));}toggle.disabled=false;busy=false;
};
toggle.addEventListener('click',()=>setZoom(!zoomed));

const pointers=new Map();let gesture=null;
const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
const midpoint=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
const clampDetail=box=>{const minWidth=detailBox.width*.42,maxWidth=detailBox.width*1.06;if(box.width<minWidth){const ratio=minWidth/box.width;box={x:box.x-(minWidth-box.width)/2,y:box.y-(box.height*ratio-box.height)/2,width:minWidth,height:box.height*ratio};}if(box.width>maxWidth){const ratio=maxWidth/box.width;box={x:box.x+(box.width-maxWidth)/2,y:box.y+(box.height-box.height*ratio)/2,width:maxWidth,height:box.height*ratio};}return box;};
frame.addEventListener('pointerdown',event=>{if(!zoomed||busy)return;pointers.set(event.pointerId,event);frame.setPointerCapture(event.pointerId);const values=[...pointers.values()];gesture=values.length===1?{type:'pan',point:values[0],box:copyBox(currentBox)}:{type:'pinch',distance:distance(values[0],values[1]),middle:midpoint(values[0],values[1]),box:copyBox(currentBox)};});
frame.addEventListener('pointermove',event=>{if(!pointers.has(event.pointerId)||!gesture)return;pointers.set(event.pointerId,event);const values=[...pointers.values()],rect=svg.getBoundingClientRect();if(values.length===1&&gesture.type==='pan'){const dx=(event.clientX-gesture.point.clientX)*gesture.box.width/rect.width,dy=(event.clientY-gesture.point.clientY)*gesture.box.height/rect.height;setBox({...gesture.box,x:gesture.box.x-dx,y:gesture.box.y-dy});}else if(values.length>1){if(gesture.type!=='pinch')gesture={type:'pinch',distance:distance(values[0],values[1]),middle:midpoint(values[0],values[1]),box:copyBox(currentBox)};const factor=gesture.distance/distance(values[0],values[1]),next=clampDetail({x:gesture.box.x+(gesture.box.width-gesture.box.width*factor)/2,y:gesture.box.y+(gesture.box.height-gesture.box.height*factor)/2,width:gesture.box.width*factor,height:gesture.box.height*factor});setBox(next);}});
const endPointer=event=>{pointers.delete(event.pointerId);gesture=null;};
frame.addEventListener('pointerup',endPointer);frame.addEventListener('pointercancel',endPointer);
frame.addEventListener('wheel',event=>{if(!zoomed||(!event.ctrlKey&&!event.metaKey))return;event.preventDefault();const factor=Math.exp(event.deltaY*.0012),rect=svg.getBoundingClientRect(),px=(event.clientX-rect.left)/rect.width,py=(event.clientY-rect.top)/rect.height,next=clampDetail({x:currentBox.x+currentBox.width*px*(1-factor),y:currentBox.y+currentBox.height*py*(1-factor),width:currentBox.width*factor,height:currentBox.height*factor});setBox(next);},{passive:false});
}
