// Shared by ordinary browser scripts and the Node test adapter.
(() => {
// Small, inspectable neural network: one input, ReLU hidden layers, one output.
function dataset(kind) {
  const count=kind==='linear'?15:25;
  return Array.from({length:count},(_,i)=>{
    const x=i/(count-1), noise=Math.sin(i*17.13)*.025;
    return {x,y:kind==='classification' ? (x>.53?1:0) : kind==='linear' ? Math.min(.98,Math.max(.03,.2+.6*x+Math.sin(i*17.13)*.16+Math.cos(i*5.7)*.09)) : kind==='hinge' ? Math.max(0,1.2*x-.4) : kind==='uShape' ? .15+2.8*(x-.5)**2 : .12+.58*Math.exp(-(((x-.2)/.095)**2))+.4*Math.exp(-(((x-.51)/.13)**2))+.66*Math.exp(-(((x-.79)/.09)**2))+.012*Math.sin(i*17.13)};
  });
}
function createNetwork(depth=1,width=3,classification=false) {
  let seed=42; const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const sizes=[1,...Array(depth).fill(width),1];
  const layers=sizes.slice(1).map((n,l)=>Array.from({length:n},()=>({w:Array.from({length:sizes[l]},()=> (random()-.5)*2.8),b:(random()-.5)*.4})));
  // Spread first-layer hinges across the input domain so ReLUs start active
  // on different parts of the data instead of all starting dead or linear.
  layers[0].forEach((neuron,i)=>{neuron.w=[1];neuron.b=-i/width;});
  // Equivalent rescaling preserves the initial function but keeps wide spline
  // features spread out while their output weights learn sharper local peaks.
  if(!classification&&depth===1&&width>=6){
    layers[0].forEach(n=>{n.w=n.w.map(w=>w*6);n.b*=6;});
    layers[1].forEach(n=>{n.w=n.w.map(w=>w/6);});
  }
  return {classification,layers};
}
function sigmoid(z){return z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));}
function binaryCrossEntropyFromLogit(z,y){return Math.max(z,0)-z*y+Math.log1p(Math.exp(-Math.abs(z)));}
function forward(net,x) {
  const activations=[[x]], sums=[];
  net.layers.forEach((layer,l)=>{
    const z=layer.map(n=>n.w.reduce((sum,w,j)=>sum+w*activations[l][j],n.b));
    sums.push(z);activations.push(z.map(v=>l<net.layers.length-1?Math.max(0,v):net.classification?sigmoid(v):net.outputActivation==='relu'?Math.max(0,v):v));
  });
  return {value:activations.at(-1)[0],activations,sums};
}
function loss(net,data) {
  return data.reduce((sum,p)=>{const prediction=forward(net,p.x),y=prediction.value;return sum+(net.classification?binaryCrossEntropyFromLogit(prediction.sums.at(-1)[0],p.y):(y-p.y)**2);},0)/data.length;
}
function gradients(net,data) {
  const g=net.layers.map(layer=>layer.map(n=>({w:n.w.map(()=>0),b:0})));
  for(const p of data){
    const {value,activations}=forward(net,p.x);let delta=[net.classification?value-p.y:2*(value-p.y)*(net.outputActivation==='relu'?(value>0?1:0):1)];
    for(let l=net.layers.length-1;l>=0;l--){
      for(let i=0;i<delta.length;i++){g[l][i].b+=delta[i]/data.length;net.layers[l][i].w.forEach((_,j)=>{g[l][i].w[j]+=delta[i]*activations[l][j]/data.length;});}
      // At the ReLU kink (zero), use the conventional zero subgradient.
      if(l>0) delta=activations[l].map((a,j)=>net.layers[l].reduce((s,n,i)=>s+n.w[j]*delta[i],0)*(a>0?1:0));
    }
  }return g;
}
function trainStep(net,data,rate){
  const g=gradients(net,data);const before=loss(net,data);const backup=structuredClone(net.layers);let accepted=false,usedRate=rate;
  // Backtracking keeps the beginner's learning-rate experiments numerically stable.
  for(let attempt=0;attempt<14;attempt++){
    net.layers.forEach((layer,l)=>layer.forEach((n,i)=>{n.b=backup[l][i].b-usedRate*g[l][i].b;n.w=n.w.map((_,j)=>backup[l][i].w[j]-usedRate*g[l][i].w[j]);}));
    if(Number.isFinite(loss(net,data))&&loss(net,data)<=before){accepted=true;break;}usedRate/=2;
  }
  if(!accepted)net.layers=backup;return {gradients:g,usedRate:accepted?usedRate:0};
}
// The default 1 x 3 hidden layer has 10 trainable weights and biases.
// More parameters tighten the loss target continuously, with no time-based stop.
function networkLossTarget(net){
 const parameters=net.layers.reduce((sum,layer)=>sum+layer.reduce((n,neuron)=>n+neuron.w.length+1,0),0);
 return (net.classification?.08:.003)*Math.sqrt(10/parameters);
}
globalThis.NeuronModel = {dataset,createNetwork,forward,loss,gradients,trainStep,networkLossTarget,sigmoid,binaryCrossEntropyFromLogit};
})();
