(() => {
const {dataset,createNetwork,forward,loss,gradients,trainStep} = globalThis.NeuronModel;

const $=id=>document.getElementById(id);
const copy={
zh:{tagline:'机器学习 · 交互笔记',eyebrow:'一个可以动手的机器学习入门',title:'理解神经网络',subtitle:'从线性回归到分类。调整参数，观察模型如何学习。',reset:'↺ 复位',dataTitle:'观察数据',observations:'真实观测',prediction:'模型预测',lossTitle:'看见误差',steps:'训练步数',networkTitle:'走进网络',parameters:'动手调参数',calculation:'逐个神经元的计算',sample:'选择样本',tryTitle:'轮到你了',footer:'从好奇开始，从实验理解。',synthetic:'全部数据均为教学合成数据 · 在浏览器本地计算',next:'下一关 →',again:'回到第一关 ↗',bias:'偏置',weight:'权重',input:'输入',output:'输出',hidden:'隐藏层',layers:'隐藏层数',neurons:'每层神经元',rate:'学习率',step:'走一步',play:'自动训练',pause:'暂停训练',normalized:'为了方便计算，输入和输出均缩放至 0–1。',manual:'拖动滑块，观察预测线和误差如何一起变化。',trainHint:'梯度告诉我们调整方向；学习率决定每一步走多远。',lossHint:'越低越好。曲线记录本次实验的每一次参数调整。',empty:'调整参数后，误差轨迹会出现在这里',history:'参数调整次数',details:'展开各层神经元的实际计算',positive:'柚子',negative:'橙子',success:'✓ 已达到本关目标！也可以继续探索参数的影响。'},
en:{tagline:'Machine learning · Interactive notes',eyebrow:'A hands-on introduction to machine learning',title:'Understanding neural networks',subtitle:'From linear regression to classification. Adjust the parameters and observe how a model learns.',reset:'↺ Reset',dataTitle:'Explore the data',observations:'Observations',prediction:'Model prediction',lossTitle:'Watch the error',steps:'Training steps',networkTitle:'Inside the network',parameters:'Make an adjustment',calculation:'Neuron-by-neuron calculations',sample:'Data point',tryTitle:'Your turn to experiment',footer:'Stay curious. Learn by doing.',synthetic:'Synthetic teaching data · Computed locally in your browser',next:'Next lesson →',again:'Back to lesson one ↗',bias:'Bias',weight:'Weight',input:'Input',output:'Output',hidden:'Hidden',layers:'Hidden layers',neurons:'Neurons per layer',rate:'Learning rate',step:'Take one step',play:'Auto-train',pause:'Pause training',normalized:'Inputs and outputs are scaled to 0–1 to make computation easier.',manual:'Move the sliders and watch the prediction and error change together.',trainHint:'The gradient gives a direction. The learning rate sets the size of the step.',lossHint:'Lower is better. This curve records each parameter adjustment in this experiment.',empty:'Adjust a parameter to start an error trail',history:'Parameter adjustments',details:'See the actual calculations inside each neuron',positive:'Pomelo',negative:'Orange',success:'✓ Lesson goal reached! Keep exploring how the parameters affect the model.'}
};
const lessons={zh:[['线性回归','手动拟合','用一条线，认识预测。','学习时间越长，成绩会怎样变化？调整斜率和偏置，让预测线靠近这些学生的数据。','尝试让均方误差低于 0.002。斜率控制线的倾斜，偏置控制它的上下位置。'],['梯度下降','让直线学习','让误差，指引下一步。','还是同一组学生。现在看看梯度指向哪里，点击「走一步」，让模型自己调整参数。','点击走一步，观察参数的变化；再开启自动训练，让误差降到 0.002 以下。'],['非线性回归','搭建小网络','一条直线不够时呢？','从一个简单的 U 形滑道开始：两侧高，中间低。调整神经元，让预测线跟随滑道的高度变化。','试试不同的层数、神经元数量和权重。隐藏层用 ReLU 将负数归零、保留正数，组合出分段直线；先观察形状，不必手动拟合完美。'],['网络的梯度下降','学习弯曲的规律','让整个网络，一起学习。','模型会把误差逐层传回，为每个权重计算调整方向。这就是反向传播。','用默认结构开启自动训练，争取将均方误差降到 0.008 以下；比较不同学习率的速度。'],['分类','从数值到概率','这次，预测一个类别。','只看水果重量，判断它是橙子还是柚子。输出不再是成绩，而是「属于柚子」的概率。','让分类准确率达到 96%。预测概率超过 50% 时判断为柚子；观察中间边界的变化。']],en:[['Linear regression','Fit it yourself','A line. A little intuition.','How does study time relate to a test score? Adjust the slope and bias to bring your line closer to the students.','Try to get mean squared error below 0.002. Slope tilts the line; bias moves it up and down.'],['Gradient descent','Teach a line','Let the error show the way.','The same students, a new tool. Inspect the gradient and take one step to let the model adjust its own parameters.','Take a step and watch the parameters change. Then auto-train until the error drops below 0.002.'],['Nonlinear regression','Build a network','When a straight line isn’t enough.','Start with a simple U-shaped ramp: high at both ends and low in the middle. Adjust the neurons to follow its height along the track.','Try different layer counts, neuron counts and weights. Hidden layers use ReLU to zero negative values and keep positive values, creating piecewise linear curves; explore shapes without needing a perfect manual fit.'],['Neural gradient descent','Learn the curve','A whole network, learning together.','The model passes the error backward through its layers to find an adjustment for every weight. That is backpropagation.','Auto-train the default network toward a mean squared error below 0.008. Compare how different learning rates affect progress.'],['Classification','Think in probabilities','This time, predict a category.','Use only fruit weight to distinguish oranges from pomelos. The output now means the probability of being a pomelo.','Reach 96% accuracy. Above 50% probability, the model predicts pomelo. Watch the boundary shift as it learns.']]};
let lang;try{lang=localStorage.getItem('neuron-language')||'zh';}catch{lang='zh';}if(!copy[lang])lang='zh';
const scenarios={
 zh:[
  '你想根据学生的学习时长，预测他们的考试成绩。',
  '你想让模型从学生的学习时长与成绩中，自动学会预测考试成绩。',
  '你正在设计一条 U 形滑道，想根据水平位置预测滑道的高度。',
  '你经营一家咖啡店，想根据一天中的时间预测客流量，以安排员工排班。',
  '你想让水果分拣机只根据重量，判断一个水果是橙子还是柚子。'
 ],
 en:[
  'You want to predict a student’s test score based on their study time.',
  'You want a model to learn from students’ study times and test scores to predict future scores.',
  'You are designing a U-shaped ramp and want to predict its height from the horizontal position.',
  'You run a café and want to predict customer traffic by time of day to plan staff shifts.',
  'You want a fruit-sorting machine to distinguish oranges from pomelos using only their weight.'
 ]
};
let inspectedLayer=0,inspectedNeuron=0;
let lesson=0,net,data,history=[],steps=0,selected=12,rate=.1,timer=null,depth=1,width=3,adjustments=0,lastRate=null;
const t=k=>copy[lang][k],dual=(zh,en)=>lang==='zh'?zh:en,fmt=(n,d=3)=>Number(n).toFixed(d),isLinear=()=>lesson<2,isClass=()=>lesson===4,canTrain=()=>[1,3,4].includes(lesson);
function stop(){clearInterval(timer);timer=null;const b=$('play');if(b)b.textContent='▶ '+t('play');}
function startLesson(index){stop();inspectedLayer=0;inspectedNeuron=0;lesson=index;depth=1;width=3;selected=12;rate=lesson===3?.3:.1;net=isLinear()?{classification:false,layers:[[{w:[.25],b:.12}]]}:createNetwork(depth,width,isClass());data=dataset(isLinear()?'linear':isClass()?'classification':lesson===2?'uShape':'nonlinear');history=[loss(net,data)];steps=0;adjustments=0;lastRate=null;render();}
function render(){
 document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
 $('language').textContent=lang==='zh'?'EN / 中文':'中文 / EN';
 $('lessons').innerHTML=lessons[lang].map((l,i)=>`<button class="lesson-button ${i===lesson?'active':''}" data-lesson="${i}" ${i===lesson?'aria-current="step"':''}><span class="num">0${i+1}</span><span>${l[0]}<small>${l[1]}</small></span></button>`).join('');
 $('lessons').querySelectorAll('button').forEach(b=>b.onclick=()=>startLesson(+b.dataset.lesson));
 $('chapter').textContent=`${dual('实验','EXPERIMENT')} 0${lesson+1} / 05`;$('lesson-title').textContent=lessons[lang][lesson][2];$('lesson-description').textContent=lessons[lang][lesson][3];$('challenge').textContent=lessons[lang][lesson][4];
 $('lesson-scenario').textContent=scenarios[lang][lesson];
 $('dataset-tag').textContent=isLinear()?dual('25 位学生','25 students'):isClass()?dual('25 个水果','25 fruits'):lesson===2?dual('25 个位置 · U 形','25 positions · U-shape'):dual('25 个时段','25 time slots');
 $('data-caption').textContent=dual('点击数据点查看计算 · ','Click a data point to inspect it · ')+t('normalized');
 $('loss-type').textContent=isClass()?dual('交叉熵','Cross-entropy'):dual('均方误差 · MSE','Mean squared error');$('loss-caption').textContent=t('lossHint');
 $('next').textContent=t(lesson===4?'again':'next');
 $('reset').title=dual('恢复本关初始结构、参数、学习率和样本，清空训练记录','Restore this lesson’s initial architecture, parameters, learning rate and sample; clear training history');
 $('sample').innerHTML=data.map((_,i)=>`<option value="${i}">#${String(i+1).padStart(2,'0')}</option>`).join('');$('sample').value=selected;
 $('architecture').innerHTML=isLinear()?'':`<label>${t('layers')}<select id="depth">${[1,2,3].map(n=>`<option ${n===depth?'selected':''}>${n}</option>`).join('')}</select></label><label>${t('neurons')}<select id="width">${Array.from({length:10},(_,i)=>i+1).map(n=>`<option ${n===width?'selected':''}>${n}</option>`).join('')}</select></label>`;
 for(const id of ['depth','width'])if($(id))$(id).onchange=()=>{stop();inspectedLayer=0;inspectedNeuron=0;depth=+$('depth').value;width=+$('width').value;net=createNetwork(depth,width,isClass());history=[loss(net,data)];steps=0;adjustments=0;lastRate=null;render();};
 renderParameters();renderTraining();update();
}
function parameterName(l,i,j){return parameterSymbol(l,i,j)+' · '+(j==='b'?t('bias'):t('weight'))+' · '+neuronLabel(l,i);}
function renderParameters(){
 let html='';net.layers.forEach((layer,l)=>layer.forEach((n,i)=>{const keys=isLinear()?['b',0]:[...n.w.keys(),'b'];keys.forEach(j=>{const value=j==='b'?n.b:n.w[j],id=`p-${l}-${i}-${j}`,range=Math.max(isLinear()?2:4,Math.ceil(Math.abs(value)));html+=`<div class="parameter ${j==='b'?'bias-parameter':'weight-parameter'}"><div class="parameter-title"><label for="${id}">${parameterName(l,i,j)}</label><output id="${id}-value">${fmt(value)}</output></div><input type="range" id="${id}" data-l="${l}" data-i="${i}" data-j="${j}" min="${-range}" max="${range}" step="0.001" value="${value}"><div class="range-labels"><span>−${range}</span><span class="gradient" id="${id}-gradient"></span><span>+${range}</span></div></div>`;});}));
 $('parameter-controls').innerHTML=html;$('parameter-controls').querySelectorAll('input').forEach(el=>el.oninput=()=>{stop();inspectedLayer=+el.dataset.l;inspectedNeuron=+el.dataset.i;const n=net.layers[el.dataset.l][el.dataset.i];if(el.dataset.j==='b')n.b=+el.value;else n.w[el.dataset.j]=+el.value;adjustments++;history.push(loss(net,data));lastRate=null;update();});
}
function renderTraining(){
 $('training').innerHTML=canTrain()?`<div class="parameter"><div class="parameter-title"><label for="rate">${t('rate')}</label><output id="rate-value">${fmt(rate,2)}</output></div><input id="rate" type="range" min="0.01" max="1" step="0.01" value="${rate}"></div><div class="train-row"><button class="primary" id="play">${timer?'Ⅱ '+t('pause'):'▶ '+t('play')}</button><button class="secondary" id="step">↘ ${t('step')}</button></div><p class="train-note" id="train-note">${t('trainHint')}</p>`:`<p class="train-note">${t('manual')}</p>`;
 if(canTrain()){$('rate').oninput=()=>{rate=+$('rate').value;$('rate-value').textContent=fmt(rate,2);};$('step').onclick=()=>{stop();advance(1);};$('play').onclick=()=>{if(timer){stop();return;}timer=setInterval(()=>advance(lesson===3?12:3),60);$('play').textContent='Ⅱ '+t('pause');};}
}
function advance(count){for(let i=0;i<count;i++){lastRate=trainStep(net,data,rate).usedRate;steps++;history.push(loss(net,data));}update();}
function update(){
 const current=loss(net,data);$('loss-value').textContent=fmt(current,4);$('step-value').textContent=steps;
 const g=canTrain()?gradients(net,data):null;
 $('parameter-controls').querySelectorAll('input').forEach(el=>{const {l,i,j}=el.dataset,n=net.layers[l][i],value=j==='b'?n.b:n.w[j];if(Math.abs(value)>+el.max){const bound=Math.ceil(Math.abs(value));el.min=-bound;el.max=bound;el.nextElementSibling.firstElementChild.textContent='−'+bound;el.nextElementSibling.lastElementChild.textContent='+'+bound;}el.closest('.parameter').classList.toggle('inspected',+l===inspectedLayer&&+i===inspectedNeuron);el.value=value;$(el.id+'-value').textContent=fmt(value);if(g){const gradient=j==='b'?g[l][i].b:g[l][i].w[j];$(el.id+'-gradient').textContent=`${dual('梯度','gradient')} ${fmt(gradient)} · ${Math.abs(gradient)<.00001?'≈ 0':gradient>0?'←':'→'}`;}});
 if($('train-note'))$('train-note').textContent=t('trainHint')+(lastRate!==null&&lastRate<rate?dual(` 本步为保持稳定，实际学习率为 ${fmt(lastRate,4)}。`,` This step uses ${fmt(lastRate,4)} for stability.`):'');
 drawData();drawLoss();drawNetwork();drawCalculation();
 const accuracy=data.filter(p=>(forward(net,p.x).value>=.5?1:0)===p.y).length/data.length;
 const complete=isClass()?accuracy>=.96:lesson===2?adjustments>=5:current<(lesson===3?.008:.002);
 $('achievement').textContent=complete?t('success'):isClass()?dual(`当前准确率：${Math.round(accuracy*100)}%`,`Current accuracy: ${Math.round(accuracy*100)}%`):'';
}
const svgText=(x,y,text,extra='')=>`<text x="${x}" y="${y}" font-size="11" fill="#596273" ${extra}>${text}</text>`;
function chartBase(w,h,xLabel,yLabel,yMax=1,yMin=0){let s='';for(let i=0;i<=4;i++){const y=28+(h-65)*i/4;s+=`<line x1="45" y1="${y}" x2="${w-16}" y2="${y}" stroke="#e6e9ef"/>`+svgText(36,y+3,fmt(yMax-(yMax-yMin)*i/4,yMax>10?0:2),'text-anchor="end"');}s+=svgText(45,12,yLabel)+svgText(w-16,h-3,xLabel,'text-anchor="end"');return s;}
function drawData(){
 const w=550,h=260,left=45,right=w-16,top=28,bottom=h-37;
 const points=Array.from({length:121},(_,i)=>({x:i/120,y:forward(net,i/120).value}));
 const values=points.map(p=>p.y),yMin=Math.min(0,...values),yMax=Math.max(1,...values),X=x=>left+x*(right-left),Y=y=>bottom-(y-yMin)/(yMax-yMin)*(bottom-top);
 const xLabel=isLinear()?dual('学习时间（小时）','Study time (hours)'):isClass()?dual('水果重量（克）','Fruit weight (g)'):lesson===2?dual('水平位置（厘米）','Horizontal position (cm)'):dual('时间（时）','Time of day (h)');
 const yLabel=isLinear()?dual('成绩（缩放至 0–1）','Test score (scaled to 0–1)'):isClass()?dual('柚子的概率','Probability of pomelo'):lesson===2?dual('高度（缩放至 0–1）','Height (scaled to 0–1)'):dual('客流（缩放至 0–1）','Footfall (scaled to 0–1)');
 let s=chartBase(w,h,xLabel,yLabel,yMax,yMin);
 if(isClass())s+=`<rect x="${left}" y="${Y(1)}" width="${right-left}" height="${Y(.5)-Y(1)}" fill="#f3f5f8" opacity=".65"/><line x1="${left}" y1="${Y(.5)}" x2="${right}" y2="${Y(.5)}" stroke="#9ca3af" stroke-dasharray="4 5"/>`+svgText(right-4,Y(.5)-5,'50%','text-anchor="end"');
 for(let i=0;i<=4;i++)s+=svgText(X(i/4),h-20,isLinear()?fmt(i*2,0):isClass()?fmt(100+i*125,0):lesson===2?fmt(i*25,0):fmt(6+i*4,0),'text-anchor="middle"');
 if(!isClass()){const p=data[selected];s+=`<line x1="${X(p.x)}" y1="${Y(p.y)}" x2="${X(p.x)}" y2="${Y(forward(net,p.x).value)}" stroke="#596273" stroke-width="2" stroke-dasharray="4 4"/>`;}
 s+=`<path d="${points.map((p,i)=>`${i?'L':'M'}${X(p.x)},${Y(p.y)}`).join(' ')}" fill="none" stroke="#26466b" stroke-width="2.5"/>`;
 data.forEach((p,i)=>{s+=`<circle data-point="${i}" role="button" aria-label="${dual('样本','Sample')} ${i+1}" tabindex="0" cx="${X(p.x)}" cy="${Y(p.y)}" r="${selected===i?6:4}" fill="${isClass()&&p.y===0?'#ffffff':'#647084'}" stroke="${selected===i?'#26466b':isClass()?'#647084':'white'}" stroke-width="${selected===i?2:1.5}" style="cursor:pointer"><title>${dual('样本','Sample')} ${i+1}: ${fmt(p.x)}, ${fmt(p.y)}</title></circle>`;});
 $('data-chart').innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${xLabel}, ${yLabel}">${s}</svg>`;
 $('data-chart').querySelectorAll('[data-point]').forEach(el=>{const choose=()=>{selected=+el.dataset.point;$('sample').value=selected;update();};el.onclick=choose;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};});
}
function drawLoss(){
 const w=460,h=212,max=history.reduce((a,b)=>Math.max(a,b),.01),X=i=>45+i/Math.max(1,history.length-1)*(w-61),Y=v=>h-37-v/max*(h-65);
 let s=chartBase(w,h,t('history'),dual('误差','Loss'),max);
 // Keep the full experiment, but draw at most 460 representative points.
 const stride=Math.max(1,Math.ceil(history.length/460)),indices=history.map((_,i)=>i).filter(i=>i%stride===0||i===history.length-1);
 if(history.length>1){const path=indices.map((i,j)=>`${j?'L':'M'}${X(i)},${Y(history[i])}`).join(' ');s+=`<path d="${path} L${X(history.length-1)},${h-37} L45,${h-37} Z" fill="#f5eaea"/><path d="${path}" fill="none" stroke="#9b4146" stroke-width="2"/>`;}else{s+=svgText(w/2,h/2,t('empty'),'text-anchor="middle" font-size="9"');}
 s+=`<circle cx="${X(history.length-1)}" cy="${Y(history.at(-1))}" r="3.5" fill="#9b4146"/>`;
 const tickCount=Math.min(4,history.length-1);
 for(let i=0;i<=tickCount;i++){const index=Math.round(i/Math.max(1,tickCount)*(history.length-1));s+=svgText(X(index),h-19,index,'text-anchor="middle"');}
 $('loss-chart').innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${t('lossTitle')}">${s}</svg>`;
}
function drawNetwork(){
 const a=forward(net,data[selected].x).activations;
 const maxNodes=Math.max(...a.map(layer=>layer.length)),diagramHeight=Math.max(225,(maxNodes-1)*34+90);
 const positions=a.map((layer,l)=>layer.map((_,i)=>({x:65+l/(a.length-1)*420,y:diagramHeight/2+(i-(layer.length-1)/2)*34})));
 let s='';
 net.layers.forEach((layer,l)=>layer.forEach((n,i)=>n.w.forEach((weight,j)=>{
  const p=positions[l][j],q=positions[l+1][i],active=l===inspectedLayer&&i===inspectedNeuron;
  s+=`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="${active?'#26466b':'#9ca3af'}" stroke-width="${maxNodes>5&&!active?1:Math.min(4,1+Math.abs(weight))}" stroke-dasharray="${weight<0?'5 4':''}" opacity="${active?1:maxNodes>5?.18:.5}"><title>${parameterName(l,i,j)}</title></line>`;
 })));
 positions.forEach((layer,l)=>{
  s+=svgText(layer[0].x,17,l===0?t('input'):l===a.length-1?t('output'):`${t('hidden')} ${l}`,'text-anchor="middle"');
  layer.forEach((p,i)=>{
   const active=l>0&&l-1===inspectedLayer&&i===inspectedNeuron,label=l===0?'x':l===a.length-1?'ŷ':String(i+1);
   s+=`<g ${l>0?`data-neuron="${l-1}-${i}" role="button" tabindex="0" aria-label="${neuronLabel(l-1,i)}" aria-pressed="${active}" style="cursor:pointer"`:''}><circle cx="${p.x}" cy="${p.y}" r="${layer.length>3?14:20}" fill="${active?'#26466b':'white'}" stroke="${active?'#26466b':'#929baa'}" stroke-width="1.5"/><text x="${p.x}" y="${p.y+4}" text-anchor="middle" fill="${active?'white':'#364152'}" font-size="12">${label}</text></g>`;
  });
  s+=svgText(layer[0].x,diagramHeight-12,l===0?'':l===a.length-1?(isClass()?'sigmoid':dual('线性输出','Linear output')):'ReLU','text-anchor="middle"');
 });
 $('network-chart').innerHTML=`<svg viewBox="0 0 550 ${diagramHeight}" style="min-width:${maxNodes>5?440:0}px" role="group" aria-label="${t('networkTitle')}">${s}</svg>`;
 $('network-tag').textContent=a.map(x=>x.length).join(' → ');
 $('network-caption').textContent=dual('点击神经元查看下方对应计算。实线：正权重；虚线：负权重；粗细：权重大小。','Select a neuron to highlight its calculation below. Solid: positive weight; dashed: negative; thickness: strength.');
 $('network-chart').querySelectorAll('[data-neuron]').forEach(el=>{
  const choose=()=>{[inspectedLayer,inspectedNeuron]=el.dataset.neuron.split('-').map(Number);update();revealParameters();};
  el.onclick=choose;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};
 });
}
function parameterSymbol(l,i,j){
 let weights=0,neurons=0;
 for(let ll=0;ll<=l;ll++)for(let ii=0;ii<net.layers[ll].length;ii++){
  if(ll===l&&ii===i)return (j==='b'?'b':'w')+subscript(j==='b'?neurons+1:weights+Number(j)+1);
  weights+=net.layers[ll][ii].w.length;neurons++;
 }
}
function subscript(n){return String(n).split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[+d]).join('');}
function signalSymbol(l,i){
 if(l<0)return 'X'+subscript(i+1);
 if(l===net.layers.length-1)return 'ŷ';
 return 'h'+subscript(net.layers.slice(0,l).reduce((s,layer)=>s+layer.length,0)+i+1);
}
function drawCalculation(){
 const token=(l,i,j)=>`<button class="equation-parameter ${j==='b'?'bias-symbol':'weight-symbol'}" data-parameter="${l}-${i}-${j}" title="${parameterName(l,i,j)}" aria-label="${parameterName(l,i,j)}">${parameterSymbol(l,i,j)}</button>`;
 let html=`<div class="equation-intro"><p>${dual('每行对应一个神经元。点击 w 或 b，定位右侧对应滑块。','One row per neuron. Select a w or b to locate its slider.')}</p><div class="equation-legend"><span class="weight-symbol">w · ${t('weight')}</span><span class="bias-symbol">b · ${t('bias')}</span><span>X · ${t('input')}</span></div></div><div class="equation-list">`;
 net.layers.forEach((layer,l)=>{
  html+=`<div class="equation-layer">${l===net.layers.length-1?t('output'):`${t('hidden')} ${l+1}`}</div>`;
  layer.forEach((n,i)=>{
   const out=l===net.layers.length-1,activation=out?(isClass()?'sigmoid':''):'ReLU';
   const products=n.w.map((_,j)=>`<span class="equation-term">${token(l,i,j)}<span class="operator"> × </span><span class="signal-symbol">${signalSymbol(l-1,j)}</span></span>`).join('<span class="operator"> + </span>');
   html+=`<div class="equation-row ${l===inspectedLayer&&i===inspectedNeuron?'selected':''}" data-equation="${l}-${i}"><div class="equation-label">${out?dual('预测','Prediction'):dual(`神经元 ${i+1}`,`Neuron ${i+1}`)}</div><div class="equation"><span class="equation-result">${signalSymbol(l,i)}</span><span class="operator"> = </span>${activation?`<span class="activation-name">${activation}</span><span class="bracket">(</span>`:''}${products}<span class="operator"> + </span>${token(l,i,'b')}${activation?'<span class="bracket">)</span>':''}</div></div>`;
  });
 });
 html+=`</div><p class="equation-footnote">${dual('X₁ 是原始输入；h 是隐藏神经元的输出，传给下一层。ReLU 保留正值，将负值变为零。权重和偏置的编号与滑块一一对应。','X₁ is the original input. Each h is a hidden neuron’s output passed to the next layer. ReLU keeps positive values and turns negatives into zero. Every weight and bias has a matching slider.')}</p>`;
 $('calculation').innerHTML=html;
 $('calculation').querySelectorAll('[data-parameter]').forEach(el=>el.onclick=()=>{
  const [l,i,j]=el.dataset.parameter.split('-');inspectedLayer=+l;inspectedNeuron=+i;update();
  const slider=$(`p-${l}-${i}-${j}`);$('parameter-controls').scrollTop=Math.max(0,slider.closest('.parameter').offsetTop-7);slider.focus({preventScroll:true});
 });
}
function neuronLabel(l,i){return l===net.layers.length-1?dual('输出神经元','Output neuron'):dual(`隐藏层 ${l+1} · 神经元 ${i+1}`,`Hidden layer ${l+1} · neuron ${i+1}`);}
function revealParameters(){
 const el=$(`p-${inspectedLayer}-${inspectedNeuron}-${isLinear()?'b':0}`);
 if(el)$('parameter-controls').scrollTop=Math.max(0,el.closest('.parameter').offsetTop-7);
}
 $('language').onclick=()=>{lang=lang==='zh'?'en':'zh';try{localStorage.setItem('neuron-language',lang);}catch{}render();};$('reset').onclick=()=>startLesson(lesson);$('next').onclick=()=>{startLesson((lesson+1)%5);$('lessons').scrollIntoView({behavior:'smooth',block:'start'});};$('sample').onchange=()=>{selected=+$('sample').value;update();};
 startLesson(0);
})();
