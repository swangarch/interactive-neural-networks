(() => {
const clamp=v=>Math.max(0,Math.min(1,v));
const softmax=values=>{const max=Math.max(...values),scores=values.map(v=>Math.exp(v-max)),sum=scores.reduce((a,b)=>a+b,0);return scores.map(v=>v/sum);};
const sigmoid=z=>1/(1+Math.exp(-z));
// Fixed illustrative weights: a ReLU feature layer and two different output heads.
function fruitPrediction(features){
 const [w,s,j,f]=features.map(clamp),h=[w,1-w,s,1-s,j,1-j,f,1-f].map(v=>Math.max(0,v));
 const categories=softmax([2.4*h[1]+2*h[4]+.6*h[2]-1.2*h[6]+.2,4*h[0]+1.2*h[4]-.8*h[2]-.5*h[6],2.5*h[6]+1.7*h[1]-1.3*h[4]+.4*h[2]]);
 const labels=[sigmoid(8*(h[2]-.55)),sigmoid(8*(h[4]-.55)),sigmoid(8*(h[6]-.55))];
 return {categories,labels};
}
const fruitPrototypes=[[.18,.65,.84,.28],[.86,.48,.72,.4],[.24,.72,.36,.88]];
function fruitSamples(){return fruitPrototypes.flatMap((features,category)=>Array.from({length:7},(_,i)=>({category,features:features.map((v,j)=>clamp(v+.11*Math.sin((i+1)*7.1+j*2.6)))})));}
const tokenLabels={
 zh:{today:'今天',weather:'天气',sunny:'晴朗',rainy:'下雨',cloudy:'多云',comma:'，',we:'我们',i:'我',go:'去',stay:'在',park:'公园',library:'图书馆',cafe:'咖啡馆',home:'家里',walk:'散步',play:'玩耍',read:'看书',study:'学习',coffee:'喝咖啡',chat:'聊天',rest:'休息',period:'。',eos:'结束'},
 en:{today:'Today',weather:'the weather is',sunny:'sunny',rainy:'rainy',cloudy:'cloudy',comma:',',we:'so we',i:'so I',go:'go to the',stay:'stay at the',park:'park',library:'library',cafe:'café',home:'house',walk:'to walk',play:'to play',read:'to read',study:'to study',coffee:'to have coffee',chat:'to chat',rest:'to rest',period:'.',eos:'End'}
};
const languagePrompts=[['today','weather'],['today','weather','sunny','comma','we','go'],['today','weather','rainy','comma','we','go']];
// A deliberately small conditional distribution for illustrating decoding.
// It is not a trained general-purpose language model; the UI identifies it as a demonstration.
function nextTokenOptions(prefix){
 const last=prefix.at(-1),rain=prefix.includes('rainy');let options;
 switch(last){
 case 'weather':options=[['sunny',.5],['rainy',.3],['cloudy',.2]];break;
 case 'sunny':case 'rainy':case 'cloudy':options=[['comma',1]];break;
 case 'comma':options=[['we',.7],['i',.3]];break;
 case 'we':case 'i':options=rain?[['stay',.6],['go',.4]]:[['go',.8],['stay',.2]];break;
 case 'go':options=rain?[['library',.65],['cafe',.3],['park',.05]]:[['park',.65],['cafe',.2],['library',.15]];break;
 case 'stay':options=[['home',.65],['library',.2],['cafe',.15]];break;
 case 'park':options=[['walk',.7],['play',.3]];break;
 case 'library':options=[['read',.75],['study',.25]];break;
 case 'cafe':options=[['coffee',.65],['chat',.35]];break;
 case 'home':options=[['read',.6],['rest',.4]];break;
 case 'walk':case 'play':case 'read':case 'study':case 'coffee':case 'chat':case 'rest':options=[['period',1]];break;
 case 'period':options=[['eos',1]];break;
 case 'eos':return [];
 default:return [];
 }
 return options.map(([token,p])=>({token,p}));
}
function chooseToken(options,mode='greedy',random=Math.random){
 if(!options.length)return null;
 if(mode==='greedy')return options.reduce((a,b)=>a.p>=b.p?a:b);
 let r=random();for(const item of options){r-=item.p;if(r<0)return item;}return options.at(-1);
}
globalThis.AdvancedModel={fruitPrediction,fruitSamples,fruitPrototypes,tokenLabels,languagePrompts,nextTokenOptions,chooseToken};
})();
