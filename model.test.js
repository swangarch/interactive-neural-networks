import test from 'node:test';
import assert from 'node:assert/strict';
import {dataset,createNetwork,forward,loss,gradients,trainStep} from './model.mjs';

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
 assert.ok(loss(net,data)<.002);
});
test('nonlinear default network learns the café curve',()=>{
 const net=createNetwork(),data=dataset('nonlinear');for(let i=0;i<5000;i++)trainStep(net,data,.3);
 assert.ok(loss(net,data)<.008,`loss: ${loss(net,data)}`);
});
test('classification learns fruit categories with valid probabilities',()=>{
 const net=createNetwork(1,3,true),data=dataset('classification');for(let i=0;i<1800;i++)trainStep(net,data,.1);
 assert.ok(data.filter(p=>(forward(net,p.x).value>=.5?1:0)===p.y).length/data.length>=.96);
 assert.ok(data.every(p=>forward(net,p.x).value>=0&&forward(net,p.x).value<=1));
});
