import test from 'node:test';
import assert from 'node:assert/strict';
import {dataset,createNetwork,forward,loss,gradients,trainStep,networkLossTarget,sigmoid,binaryCrossEntropyFromLogit} from './model.mjs';

test('backpropagation matches finite differences for regression and classification',()=>{
 for(const classification of [false,true]){
  // Central finite differences require differentiable points, away from ReLU's kink.
  const net=createNetwork(2,3,classification),data=dataset(classification?'classification':'nonlinear').map(p=>({...p,x:p.x+.0037})),g=gradients(net,data),epsilon=1e-5;
  net.layers.forEach((layer,l)=>layer.forEach((n,i)=>{
   for(const key of [...n.w.keys(),'b']){
    const original=key==='b'?n.b:n.w[key];const set=v=>{if(key==='b')n.b=v;else n.w[key]=v;};
    set(original+epsilon);const hi=loss(net,data);set(original-epsilon);const lo=loss(net,data);set(original);
    assert.ok(Math.abs((hi-lo)/(2*epsilon)-(key==='b'?g[l][i].b:g[l][i].w[key]))<1e-6);
   }
  }));
 }
});
test('ReLU keeps positives, zeros negatives, and uses zero gradient at the kink',()=>{
 const net={classification:false,layers:[[{w:[1],b:0}],[{w:[2],b:0}]]};
 assert.equal(forward(net,-1).value,0);
 assert.equal(forward(net,0).value,0);
 assert.equal(forward(net,2).value,4);
 for(const x of [-1,0]){
  const g=gradients(net,[{x,y:1}]);
  assert.equal(g[0][0].w[0],0);
  assert.equal(g[0][0].b,0);
 }
 assert.equal(gradients(net,[{x:2,y:1}])[0][0].w[0],24);
});
test('linear descent reaches the lesson goal without increasing loss',()=>{
 const net={classification:false,layers:[[{w:[.25],b:.12}]]},data=dataset('linear');
 for(let i=0;i<400;i++){const before=loss(net,data);trainStep(net,data,1);assert.ok(loss(net,data)<=before+1e-12);}
 assert.ok(loss(net,data)<.018);
 assert.ok(loss(net,data)>.01);
});
test('nonlinear default network learns the café curve',()=>{
 const net=createNetwork(1,9),data=dataset('nonlinear');for(let i=0;i<14000;i++)trainStep(net,data,.02);
 assert.ok(loss(net,data)<networkLossTarget(net),`loss: ${loss(net,data)}`);
});
test('classification learns fruit categories with valid probabilities',()=>{
 const net=createNetwork(1,3,true),data=dataset('classification');for(let i=0;i<2300;i++)trainStep(net,data,.05);
 assert.ok(data.filter(p=>(forward(net,p.x).value>=.5?1:0)===p.y).length/data.length===1);
 assert.ok(loss(net,data)<.08);
 assert.ok(data.every(p=>forward(net,p.x).value>=0&&forward(net,p.x).value<=1));
});

test('one output neuron fits a hinge only with ReLU enabled',()=>{
 const data=dataset('hinge'),net={classification:false,outputActivation:'relu',layers:[[{w:[1.2],b:-.4}]]};
 assert.equal(data.length,25);
 assert.equal(loss(net,data),0);
 assert.ok(loss({...net,outputActivation:'linear'},data)>.01);
 assert.equal(forward(net,0).value,0);
 for(const x of [0,1/3])assert.equal(gradients(net,[{x,y:1}])[0][0].b,0);
 for(const outputActivation of ['relu','linear']){
  net.outputActivation=outputActivation;net.layers[0][0]={w:[1],b:-.4};
  const g=gradients(net,data),n=net.layers[0][0],epsilon=1e-5;
  for(const key of ['w','b']){
   const original=key==='w'?n.w[0]:n.b,set=v=>key==='w'?n.w[0]=v:n.b=v;
   set(original+epsilon);const hi=loss(net,data);set(original-epsilon);const lo=loss(net,data);set(original);
   assert.ok(Math.abs((hi-lo)/(2*epsilon)-(key==='w'?g[0][0].w[0]:g[0][0].b))<1e-6);
  }
  for(let i=0;i<800;i++)trainStep(net,data,.1);
  assert.ok(outputActivation==='relu'?loss(net,data)<.00001:loss(net,data)>.002);
 }
});

test('the two-parameter MSE surface has the displayed partial derivatives and downhill direction',()=>{
 const data=dataset('linear'),epsilon=1e-5;
 for(const [w,b] of [[.25,.12],[-1,1],[1.2,-.4],[0,0]]){
  const net={classification:false,layers:[[{w:[w],b}]]},g=gradients(net,data)[0][0];
  const surface=(weight,bias)=>data.reduce((sum,p)=>sum+(weight*p.x+bias-p.y)**2,0)/data.length;
  assert.ok(Math.abs(surface(w,b)-loss(net,data))<1e-12);
  assert.ok(Math.abs((surface(w+epsilon,b)-surface(w-epsilon,b))/(2*epsilon)-g.w[0])<1e-8);
  assert.ok(Math.abs((surface(w,b+epsilon)-surface(w,b-epsilon))/(2*epsilon)-g.b)<1e-8);
  assert.ok(surface(w-.01*g.w[0],b-.01*g.b)<surface(w,b));
 }
});

test('student data have a positive overall trend with substantial scatter and exceptions',()=>{
 assert.equal(dataset('linear').length,15);
 assert.equal(dataset('nonlinear').length,25);
 assert.equal(dataset('classification').length,25);
 const data=dataset('linear'),mean=data.reduce((s,p)=>s+p.y,0)/data.length;
 assert.ok(data.every(p=>p.y>=0&&p.y<=1));
 assert.ok(data.reduce((s,p)=>s+(p.x-.5)*(p.y-mean),0)>0);
 assert.ok(data.some((p,i)=>data.slice(i+5).some(q=>q.y<p.y)));
 assert.ok(data.reduce((s,p)=>s+(p.y-(.2+.6*p.x))**2,0)/data.length>.01);
 assert.deepEqual(data,dataset('linear'));
});

test('network loss targets decrease for every increase in depth or width',()=>{
 for(const classification of [false,true]){
  assert.equal(networkLossTarget(createNetwork(1,3,classification)),classification?.08:.003);
  for(let depth=1;depth<=3;depth++)for(let width=1;width<=9;width++){
   const target=networkLossTarget(createNetwork(depth,width,classification));
   assert.ok(target>0);
   if(depth<3)assert.ok(networkLossTarget(createNetwork(depth+1,width,classification))<target);
   if(width<9)assert.ok(networkLossTarget(createNetwork(depth,width+1,classification))<target);
  }
 }
});

test('sigmoid and cross-entropy distinguish confidence and give a downhill logit step',()=>{
 assert.equal(sigmoid(0),.5);
 for(const y of [0,1])for(const z of [-6,-2,0,2,6]){
  const p=sigmoid(z),epsilon=1e-5;
  assert.ok(p>0&&p<1);
  const derivative=(binaryCrossEntropyFromLogit(z+epsilon,y)-binaryCrossEntropyFromLogit(z-epsilon,y))/(2*epsilon);
  assert.ok(Math.abs(derivative-(p-y))<1e-8);
  assert.ok(binaryCrossEntropyFromLogit(z-.5*(p-y),y)<binaryCrossEntropyFromLogit(z,y));
 }
 assert.ok(binaryCrossEntropyFromLogit(6,0)>binaryCrossEntropyFromLogit(0,0));
 assert.ok(binaryCrossEntropyFromLogit(6,1)<binaryCrossEntropyFromLogit(0,1));
 assert.equal(binaryCrossEntropyFromLogit(1000,0),1000);
 assert.equal(binaryCrossEntropyFromLogit(-1000,1),1000);
});
test('cafe data contain three separate daily peaks',()=>{
 const d=dataset('nonlinear');
 assert.ok(d.every(p=>p.y>=0&&p.y<=1));
 const peaks=d.filter((p,i)=>i>0&&i<d.length-1&&p.y>d[i-1].y&&p.y>d[i+1].y);
 assert.equal(peaks.length,3);
});

import {fruitPrediction,fruitSamples,fruitPrototypes,languagePrompts,nextTokenOptions,chooseToken,tokenLabels} from './advanced-model.mjs';
test('multiclass probabilities compete while multilabel probabilities are independent',()=>{
 fruitPrototypes.forEach((features,i)=>{
  const output=fruitPrediction(features);
  assert.ok(Math.abs(output.categories.reduce((a,b)=>a+b,0)-1)<1e-12);
  assert.equal(output.categories.indexOf(Math.max(...output.categories)),i);
 });
 const labels=fruitPrediction([.5,1,1,1]).labels;
 assert.ok(labels.every(p=>p>.9));
 assert.ok(labels.reduce((a,b)=>a+b,0)>2.7);
 assert.ok(fruitSamples().every(s=>s.features.length===4&&s.features.every(v=>v>=0&&v<=1)));
});
test('unplotted inputs can change classification at the same two-dimensional position',()=>{
 const a=[.2,.7,.9,.2],b=[.2,.7,.2,.9];
 assert.deepEqual(a.slice(0,2),b.slice(0,2));
 assert.notDeepEqual(fruitPrediction(a).categories,fruitPrediction(b).categories);
});
test('all illustrative decoding branches have normalized probabilities and terminate',()=>{
 function visit(prefix){
  assert.ok(prefix.length<16);
  const options=nextTokenOptions(prefix);
  if(!options.length){assert.equal(prefix.at(-1),'eos');return;}
  assert.ok(Math.abs(options.reduce((sum,o)=>sum+o.p,0)-1)<1e-12);
  for(const option of options){assert.ok(option.p>0&&option.p<=1);assert.ok(tokenLabels.en[option.token]);assert.ok(tokenLabels.zh[option.token]);visit([...prefix,option.token]);}
 }
 languagePrompts.forEach(visit);
});
test('next-token probabilities use earlier context and support greedy or sampled choices',()=>{
 const sunny=nextTokenOptions(languagePrompts[1]),rainy=nextTokenOptions(languagePrompts[2]);
 assert.equal(languagePrompts[1].at(-1),languagePrompts[2].at(-1));
 assert.notDeepEqual(sunny,rainy);
 assert.equal(chooseToken(sunny).token,'park');
 assert.equal(chooseToken(rainy).token,'library');
 assert.equal(chooseToken(sunny,'sample',()=>.99).token,'library');
 assert.equal(chooseToken([]),null);
});
