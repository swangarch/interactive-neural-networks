// Shared by ordinary browser scripts and the Node test adapter.
(() => {
// Small, inspectable neural network: one input, ReLU hidden layers, one output.
function dataset(kind) {
  return Array.from({length:25},(_,i)=>{
    const x=i/24, noise=Math.sin(i*17.13)*.025;
    return {x,y:kind==='classification' ? (x>.53?1:0) : kind==='linear' ? .2+.6*x+noise : kind==='uShape' ? .15+2.8*(x-.5)**2 : .5+.31*Math.sin(x*Math.PI*2)+.12*Math.sin(x*Math.PI*4)+noise};
  });
}
function createNetwork(depth=1,width=3,classification=false) {
  let seed=42; const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const sizes=[1,...Array(depth).fill(width),1];
  const layers=sizes.slice(1).map((n,l)=>Array.from({length:n},()=>({w:Array.from({length:sizes[l]},()=> (random()-.5)*2.8),b:(random()-.5)*.4})));
  // Spread first-layer hinges across the input domain so ReLUs start active
  // on different parts of the data instead of all starting dead or linear.
  layers[0].forEach((neuron,i)=>{neuron.w=[1];neuron.b=-i/width;});
  return {classification,layers};
}
function forward(net,x) {
  const activations=[[x]], sums=[];
  net.layers.forEach((layer,l)=>{
    const z=layer.map(n=>n.w.reduce((sum,w,j)=>sum+w*activations[l][j],n.b));
    sums.push(z);activations.push(z.map(v=>l<net.layers.length-1?Math.max(0,v):net.classification?1/(1+Math.exp(-v)):v));
  });
  return {value:activations.at(-1)[0],activations,sums};
}
function loss(net,data) {
  return data.reduce((sum,p)=>{const y=forward(net,p.x).value;return sum+(net.classification? -p.y*Math.log(Math.max(y,1e-12))-(1-p.y)*Math.log(Math.max(1-y,1e-12)):(y-p.y)**2);},0)/data.length;
}
function gradients(net,data) {
  const g=net.layers.map(layer=>layer.map(n=>({w:n.w.map(()=>0),b:0})));
  for(const p of data){
    const {value,activations}=forward(net,p.x);let delta=[net.classification?value-p.y:2*(value-p.y)];
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
globalThis.NeuronModel = {dataset,createNetwork,forward,loss,gradients,trainStep};
})();
