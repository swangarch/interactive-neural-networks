(() => {
const {dataset,createNetwork,forward,loss,gradients,trainStep,networkLossTarget,sigmoid,binaryCrossEntropyFromLogit} = globalThis.NeuronModel;

const $=id=>document.getElementById(id);
const copy={
zh:{about:'关于这个项目',tagline:'机器学习 · 交互笔记',eyebrow:'一个可以动手的机器学习入门',title:'交互式神经网络',subtitle:'从线性回归到分类。调整参数，观察模型如何学习。',reset:'↺ 复位',dataTitle:'观察数据',observations:'真实观测',prediction:'模型预测',lossTitle:'看见误差',steps:'训练步数',networkTitle:'走进网络',parameters:'动手调参数',calculation:'逐个神经元的计算',sample:'选择样本',tryTitle:'轮到你了',footer:'从好奇开始，从实验理解。',synthetic:'全部数据均为教学合成数据 · 在浏览器本地计算',next:'下一关 →',again:'回到第一关 ↗',bias:'偏置',weight:'权重',input:'输入',output:'输出',hidden:'隐藏层',layers:'隐藏层数',neurons:'每层神经元',rate:'学习率',step:'走一步',play:'自动训练',pause:'暂停训练',normalized:'为了方便计算，输入和输出均缩放至 0–1。',manual:'拖动滑块，观察预测线和误差如何一起变化。',trainHint:'梯度告诉我们调整方向；学习率决定每一步走多远。',lossHint:'越低越好。曲线记录本次实验的每一次参数调整。',empty:'调整参数后，误差轨迹会出现在这里',history:'参数调整次数',details:'展开各层神经元的实际计算',positive:'柚子',negative:'橙子',success:'✓ 已达到本关目标！也可以继续探索参数的影响。'},
en:{about:'About this project',tagline:'Machine learning · Interactive notes',eyebrow:'A hands-on introduction to machine learning',title:'Interactive Neural Networks',subtitle:'From linear regression to classification. Adjust the parameters and observe how a model learns.',reset:'↺ Reset',dataTitle:'Explore the data',observations:'Observations',prediction:'Model prediction',lossTitle:'Watch the error',steps:'Training steps',networkTitle:'Inside the network',parameters:'Make an adjustment',calculation:'Neuron-by-neuron calculations',sample:'Data point',tryTitle:'Your turn to experiment',footer:'Stay curious. Learn by doing.',synthetic:'Synthetic teaching data · Computed locally in your browser',next:'Next lesson →',again:'Back to lesson one ↗',bias:'Bias',weight:'Weight',input:'Input',output:'Output',hidden:'Hidden',layers:'Hidden layers',neurons:'Neurons per layer',rate:'Learning rate',step:'Take one step',play:'Auto-train',pause:'Pause training',normalized:'Inputs and outputs are scaled to 0–1 to make computation easier.',manual:'Move the sliders and watch the prediction and error change together.',trainHint:'The gradient gives a direction. The learning rate sets the size of the step.',lossHint:'Lower is better. This curve records each parameter adjustment in this experiment.',empty:'Adjust a parameter to start an error trail',history:'Parameter adjustments',details:'See the actual calculations inside each neuron',positive:'Pomelo',negative:'Orange',success:'✓ Lesson goal reached! Keep exploring how the parameters affect the model.'}
};
const lessons={zh:[['线性回归','手动拟合','用一条线，认识预测。','学习时间越长，成绩会怎样变化？调整斜率和偏置，让预测线靠近这些学生的数据。','尝试让均方误差低于 0.018。斜率控制线的倾斜，偏置控制它的上下位置。'],['梯度下降','让直线学习','让误差，指引下一步。','还是同一组学生。现在看看梯度指向哪里，点击「走一步」，让模型自己调整参数。','点击走一步，观察参数的变化；再开启自动训练，让误差降到 0.018 以下。'],['非线性回归','搭建小网络','一条直线不够时呢？','从一个简单的 U 形滑道开始：两侧高，中间低。调整神经元，让预测线跟随滑道的高度变化。','试试不同的层数、神经元数量和权重。隐藏层用 ReLU 将负数归零、保留正数，组合出分段直线；先观察形状，不必手动拟合完美。'],['网络的梯度下降','学习弯曲的规律','让整个网络，一起学习。','模型会把误差逐层传回，为每个权重计算调整方向。这就是反向传播。','用默认结构开启自动训练，争取将均方误差降到 0.003 以下；比较不同学习率的速度。'],['分类','从数值到概率','这次，预测一个类别。','只看水果重量，判断它是橙子还是柚子。输出不再是成绩，而是「属于柚子」的概率。','让分类准确率达到 100%，并将交叉熵降到 0.08 以下。预测概率超过 50% 时判断为柚子；观察中间边界的变化。']],en:[['Linear regression','Fit it yourself','A line. A little intuition.','How does study time relate to a test score? Adjust the slope and bias to bring your line closer to the students.','Try to get mean squared error below 0.018. Slope tilts the line; bias moves it up and down.'],['Gradient descent','Teach a line','Let the error show the way.','The same students, a new tool. Inspect the gradient and take one step to let the model adjust its own parameters.','Take a step and watch the parameters change. Then auto-train until the error drops below 0.018.'],['Nonlinear regression','Build a network','When a straight line isn’t enough.','Start with a simple U-shaped ramp: high at both ends and low in the middle. Adjust the neurons to follow its height along the track.','Try different layer counts, neuron counts and weights. Hidden layers use ReLU to zero negative values and keep positive values, creating piecewise linear curves; explore shapes without needing a perfect manual fit.'],['Neural gradient descent','Learn the curve','A whole network, learning together.','The model passes the error backward through its layers to find an adjustment for every weight. That is backpropagation.','Auto-train the default network toward a mean squared error below 0.003. Compare how different learning rates affect progress.'],['Classification','Think in probabilities','This time, predict a category.','Use only fruit weight to distinguish oranges from pomelos. The output now means the probability of being a pomelo.','Reach 100% accuracy and cross-entropy below 0.08. Above 50% probability, the model predicts pomelo. Watch the boundary shift as it learns.']]};
let lang;try{lang=localStorage.getItem('neuron-language')||'zh';}catch{lang='zh';}if(!copy[lang])lang='zh';
const scenarios={
 zh:[
  '你想根据学生的学习时长，预测他们的考试成绩。',
  '你想让模型从学生的学习时长与成绩中，自动学会预测考试成绩。',
  '你正在设计一条 U 形滑道，想根据水平位置预测滑道的高度。',
  '你经营一家咖啡店，需要预测早、午、晚三次客流高峰与高峰之间的低谷，以安排员工排班。',
  '你想让水果分拣机只根据重量，判断一个水果是橙子还是柚子。'
 ],
 en:[
  'You want to predict a student’s test score based on their study time.',
  'You want a model to learn from students’ study times and test scores to predict future scores.',
  'You are designing a U-shaped ramp and want to predict its height from the horizontal position.',
  'You run a café and want to predict three daily traffic peaks and the quieter periods between them to plan staff shifts.',
  'You want a fruit-sorting machine to distinguish oranges from pomelos using only their weight.'
 ]
};
lessons.zh.splice(2,0,['激活函数','让一个神经元折一下','加一个 ReLU，直线就能折一下。','假设停车前 2 小时免费，之后每小时 6 欧元，连续计费且不封顶。费用 F = max(0, 6t − 12)。ReLU 把负费用归零，超出免费时长后保留线性增长。','切换激活函数，比较同一组参数的两条线。试着把 w 调到 1.2、b 调到 −0.4，拟合这条折线；再改变 b，观察拐点 x = −b/w 如何移动（w ≠ 0）。']);
lessons.en.splice(2,0,['Activation function','Give a neuron a bend','One ReLU. One bend.','Imagine parking is free for the first 2 hours, then costs €6 per hour, billed continuously with no cap. The fee is F = max(0, 6t − 12). ReLU zeros negative fees and preserves linear growth after the free period.','Toggle activation to compare identical parameters. Try w = 1.2 and b = −0.4 to fit the data, then change b to move the hinge at x = −b/w (w ≠ 0).']);
scenarios.zh.splice(2,0,'你想用一个神经元，根据停车时长预测「前 2 小时免费，之后每小时 6 欧元」的停车费。');
scenarios.en.splice(2,0,'Use one neuron to predict parking fees: the first 2 hours are free, then each additional hour costs €6.');
lessons.zh.splice(1,1,['梯度下降','沿着误差曲面学习','看清坡度，让模型一步步下山。','还是第一关的学生数据。每一组权重 w 和偏置 b 都对应一个 Loss，把它们画出来，就是一张碗状曲面。梯度由两个偏导数组成：分别固定另一个参数，观察 Loss 对这个参数的瞬时变化率。','拖动 w、b 或点击曲面选择位置，再旋转视角。观察两个偏导数的正负：正值意味着增大该参数会让 Loss 局部上升。负梯度指向参数平面中局部下降最快的方向，点击「走一步」验证。']);
lessons.en.splice(1,1,['Gradient descent','Learn on the loss surface','Read the slope. Learn one step at a time.','Use the same students as lesson one. Every weight w and bias b gives a Loss: together they form a bowl-shaped surface. The gradient contains two partial derivatives, each measuring the instantaneous change in Loss while the other parameter stays fixed.','Move w and b or click the surface, then rotate the view. A positive partial derivative means increasing that parameter locally increases Loss. The negative gradient points toward the steepest local decrease in parameter space. Take one step to try it.']);
scenarios.zh.splice(1,1,'预测线只有两个参数：把它们当作地面坐标，把误差当作高度，看看应该往哪走。');
scenarios.en.splice(1,1,'Treat the two parameters as ground coordinates and the prediction error as height to see which way to move.');
lessons.zh.splice(1,0,['MSE 损失','从误差到一个数字','预测差多少，怎样算清楚？','沿用第一关的学生数据。先用预测值减去真实值，再把每个误差平方，最后对全部样本求平均，这就是均方误差（MSE）。','点击右侧误差项或左侧数据点选择样本，拖动 w 和 b。观察一个样本的平方误差如何变化，以及它怎样贡献到整个数据集的 MSE。试着让 MSE 小于 0.018。']);
lessons.en.splice(1,0,['MSE loss','Turn errors into a number','How wrong is a prediction?','Keep the students from lesson one. Subtract each actual value from its prediction, square each error, then average over all samples. This is mean squared error (MSE).','Select an error term or data point, then move w and b. Watch its squared error and contribution to the full dataset’s MSE. Try to get MSE below 0.018.']);
scenarios.zh.splice(1,0,'同一条预测线可能高估一些成绩、低估另一些成绩。我们需要一个不会让正负误差相互抵消的分数。');
scenarios.en.splice(1,0,'A line may overestimate some scores and underestimate others. We need a score that prevents positive and negative errors from canceling.');
const transitions={
 zh:[
  ['学习时间越长，成绩就越好吗？','假设你收集了 15 位学生的学习时长和成绩。先亲手调整一条预测线，看看它们之间有什么关系。'],
  ['如何精确衡量预测线与数据的匹配程度？','有些成绩被高估，有些被低估。我们需要一个数字，公平地衡量所有预测的偏差。'],
  ['我们能否自动找到这些参数？','手动尝试之后，让误差告诉模型该往哪走。从曲面的高处出发，观察每一步怎样接近低点。'],
  ['前两小时免费，之后按小时收费，怎么预测停车费？','假设超出 2 小时的部分按每小时 6 欧元连续计费，不设封顶。费用最低为零，之后随时长线性增长：让一个神经元学会这次转折。'],
  ['如果规律不止折一次，一个神经元还够吗？','一条 U 形滑道先下降、再上升。把多个神经元组合起来，试着搭出更丰富的形状。'],
  ['网络变复杂了，还能自己学会吗？','咖啡店有早高峰、午间小高峰和晚高峰，还有局部波动。让误差穿过整个网络，为每个权重和偏置找到调整方向。'],
  ['如果我们想预测的，不是数值，而是类别呢？','给你一个水果的重量：它是橙子，还是柚子？让网络用概率表达判断。']
 ],
 en:[
  ['Does more study time mean a better score?','Imagine collecting study times and test scores from 15 students. Adjust a prediction line by hand to explore their relationship.'],
  ['How can we measure how well the prediction line fits the data?','Some scores are overestimated; others are underestimated. We need one number that measures all those misses fairly.'],
  ['Can we find these parameters automatically?','After adjusting them by hand, let the error guide the model. Start high on the surface and watch each step move toward the minimum.'],
  ['Two hours free, then an hourly fee. How do we predict the cost?','Imagine parking costs €6 per hour after the first 2 hours, billed continuously with no cap. The fee stays at zero first, then grows linearly. Give one neuron this bend.'],
  ['What if one bend is not enough?','A U-shaped ramp goes down, then up. Combine several neurons to build a richer shape.'],
  ['Can a more complex network still learn by itself?','Café traffic has morning, lunch and evening peaks with smaller local fluctuations. Pass the error through the network to find an adjustment for every weight and bias.'],
  ['What if the answer is a category, not a number?','Given a fruit’s weight, is it an orange or a pomelo? Let the network express its answer as a probability.']
 ]
};
lessons.zh.splice(6,0,['Sigmoid 与交叉熵','从分数到概率','判断有多自信，错了有多贵？','先不训练整张网络。把一个水果的原始输出 z 变成「是柚子」的概率 p，再用真实标签衡量这个概率的交叉熵损失。','拖动 z，切换真实标签。比较 p = 0.1、0.5、0.9，再试着走一步：自信地判断错误，比不确定付出的代价更大。']);
lessons.en.splice(6,0,['Sigmoid & cross-entropy','From scores to probabilities','How confident? How costly when wrong?','Before training a whole network, turn a fruit’s raw output z into its probability p of being a pomelo. Use the true label to measure cross-entropy loss.','Move z and switch the true label. Compare p = 0.1, 0.5 and 0.9, then take one step. Being confidently wrong costs more than being unsure.']);
scenarios.zh.splice(6,0,'同一个预测概率，对橙子和柚子的好坏评价完全相反。损失必须考虑真实标签。');
scenarios.en.splice(6,0,'The same probability can be good for a pomelo and bad for an orange. Loss must account for the true label.');
transitions.zh.splice(6,0,['模型说「很像柚子」，这到底是多大把握？','把任意分数变成 0 到 1 的概率，再问：如果它自信地猜错了，我们应该怎样惩罚？']);
transitions.en.splice(6,0,['“Probably a pomelo.” How sure is the model?','Turn any raw score into a probability between 0 and 1. Then ask: how much should a confidently wrong prediction cost?']);
lessons.zh.push(['多维与多标签','一份输入，多种答案','四条信息，怎样变成多个判断？','从只看重量，变成同时看重量、甜度、含水量和硬度。比较「品种三选一」与「多个特征同时成立」，不必把四维空间全部画出来。','切换二维图的坐标轴，再改变图上没有显示的两项输入。位置不变时，预测还会变吗？随后比较单选类别与多选标签。'],['自回归生成','一次只预测下一个','一句话，是怎样一个词一个词长出来的？','把已有文字交给一个神经网络，得到下一个词的概率。选一个，接回原文，再把整段文字交给同一个神经网络。重复，直到出现结束标记。','先手动选择候选词，再试自动生成。比较晴天和雨天的计划；试试总选最可能的词，和按概率抽取。']);
lessons.en.push(['Many inputs & labels','One input, several answers','Four measurements. Several decisions.','Go beyond weight: use sweetness, water content and firmness too. Compare choosing one variety with predicting several traits at once, without trying to draw all four dimensions.','Switch the plot axes, then adjust a feature the plot does not show. Can the prediction change while the point stays still? Compare one class with several independent labels.'],['Autoregressive generation','Predict just the next token','How does text grow one token at a time?','Give the existing text to a neural network and receive next-token probabilities. Choose one, append it, and feed the whole text back into the same network. Repeat until an end marker appears.','Choose candidates manually, then try automatic generation. Compare sunny and rainy plans, and compare picking the most likely token with sampling.']);
scenarios.zh.push('一个水果只能属于一个示例品种，但可以同时具有甜、多汁、偏硬等多个标签。','生成文字也是分类：候选词就是类别，而刚生成的词会成为下一轮的新输入。');
scenarios.en.push('A fruit belongs to one example variety, but can have several traits: sweet, juicy and firm.','Generating text is also classification: candidate tokens are classes, and the chosen token becomes part of the next input.');
transitions.zh.push(['如果输入不止一个数字，答案也不止一种呢？','我们可以同时观察一个水果的多条信息，再问不同的问题。看不见全部维度，并不妨碍理解它们怎样参与判断。'],['如果把「类别」换成「下一个词」，会怎样？','已有文字 → 神经网络 → 下一个词的概率。每次只选一个，然后把新文字再次送进去。']);
transitions.en.push(['What if there are many inputs—and several answers?','Observe several measurements of one fruit and ask different questions. You can understand how the features matter without seeing every dimension at once.'],['What if the classes are possible next tokens?','Existing text → a neural network → next-token probabilities. Choose just one, then feed the new text back in.']);
let probabilityZ=0,probabilityY=1,probabilitySteps=0;
let welcomeOpen=true,welcomeFromAbout=false;
try{welcomeOpen=localStorage.getItem('interactive-neural-networks-welcome')!=='seen';}catch{}
function renderWelcome(){
 $('transition-topic').textContent=dual('关于这个项目','About this project');
 $('transition-question').textContent=dual('动手试一试，看懂神经网络怎样学习。','Understand how neural networks learn. By trying it yourself.');
 $('transition-context').textContent=dual('这个项目希望把神经网络中看不见的学习过程变成可以观察、可以操作的小实验。拖动一个参数，看预测怎样变化；让模型自己调整，再看误差怎样下降。一步一步建立理解。','This project makes the learning process inside a neural network visible and interactive. Move a parameter and watch the prediction change. Let the model adjust itself and see the error fall. Build your understanding one small experiment at a time.');
 $('transition-chapter').textContent=dual('交互式神经网络','Interactive learning');
 $('transition-progress').textContent=dual('10 个交互实验','10 INTERACTIVE EXPERIMENTS');
 $('transition-next-label').textContent=dual('无需编程基础 · 按自己的节奏探索','No coding experience needed · Explore at your own pace');
 $('transition-enter').textContent=welcomeFromAbout?dual('继续探索 →','Continue exploring →'):dual('从第一关开始 →','Start the first lesson →');
 const steps=lang==='zh'?[['从一条线开始','用学习时间和成绩，理解预测、误差和梯度。'],['让网络学会弯曲','加入激活函数和更多神经元，看模型怎样拟合复杂规律。'],['从分类走向语言','理解概率、多维输入，以及逐个预测词语的生成过程。']]:[['Start with a line','Use study time and test scores to explore predictions, error and gradients.'],['Let the network bend','Add activation functions and neurons to fit more complex patterns.'],['From categories to language','Explore probabilities, multiple inputs, and text generated one token at a time.']];
 $('welcome-details').innerHTML=steps.map(([title,body],i)=>`<div><span class="eyebrow">0${i+1}</span><h3>${title}</h3><p>${body}</p></div>`).join('');
}
function renderTransition(){
 $('welcome-details').hidden=!welcomeOpen;
 $('lesson-transition').classList.toggle('welcome-screen',welcomeOpen);
 const [question,context]=transitions[lang][lesson];
 $('transition-question').textContent=question;$('transition-context').textContent=context;
 $('transition-topic').textContent=lessons[lang][lesson][0];
 $('transition-chapter').textContent=dual('一个问题，一次实验','One question, one experiment');
 $('transition-progress').textContent=`${String(lesson+1).padStart(2,'0')} / ${String(lessons[lang].length).padStart(2,'0')}`;
 $('transition-next-label').textContent=dual('从好奇开始，从实验理解。','Stay curious. Learn by doing.');
 $('transition-enter').textContent=dual('开始探索 →','Explore →');
 $('transition-language').textContent=lang==='zh'?'EN / 中文':'中文 / EN';
 $('transition-language').setAttribute('aria-label',dual('切换至英文','Switch to Chinese'));
 if(welcomeOpen)renderWelcome();
}
function enterExperiment(){
 if(welcomeOpen){
  welcomeOpen=false;try{localStorage.setItem('interactive-neural-networks-welcome','seen');}catch{}
  if(!welcomeFromAbout){renderTransition();$('lesson-transition').scrollTop=0;$('transition-enter').focus();return;}
  welcomeFromAbout=false;
 }
 $('lesson-transition').close();document.body.classList.remove('transition-open');
 $('lesson-intro').scrollIntoView({block:'start'});$('lesson-intro').focus({preventScroll:true});
}
let surfaceAngle=35,surfaceDrag=null,surfaceDragged=false,surfaceFrame=null;
let sidebarCollapsed=window.matchMedia('(max-width: 600px)').matches;
try{const saved=localStorage.getItem('neuron-sidebar');if(saved)sidebarCollapsed=saved==='collapsed';}catch{}
let inspectedLayer=0,inspectedNeuron=0;
let lesson=0,net,data,history=[],steps=0,selected=12,rate=.1,timer=null,depth=1,width=3,adjustments=0,lastRate=null;
const t=k=>copy[lang][k],dual=(zh,en)=>lang==='zh'?zh:en,fmt=(n,d=3)=>Number(n).toFixed(d),isLinear=()=>lesson<3,isMse=()=>lesson===1,isGradient=()=>lesson===2,isActivation=()=>lesson===3,isAdvanced=()=>lesson>=8,isProbability=()=>lesson===6,isClass=()=>lesson===7,canTrain=()=>[2,3,5,7].includes(lesson);
function stop(){globalThis.AdvancedLessons.stop();clearInterval(timer);timer=null;const b=$('play');if(b)b.textContent='▶ '+t('play');}
function createActivationStart(){
 // Randomize a visibly underfitting line while keeping some ReLUs active.
 const w=.35+Math.random()*.2,hinge=.55+Math.random()*.2;
 return {classification:false,outputActivation:'relu',layers:[[{w:[w],b:-w*hinge}]]};
}
function startLesson(index,showTransition=true){stop();inspectedLayer=0;inspectedNeuron=0;lesson=index;globalThis.AdvancedLessons.reset(lesson===9?'decode':'multi');probabilityZ=0;probabilityY=1;probabilitySteps=0;surfaceAngle=35;surfaceDragged=false;surfaceDrag=null;depth=1;width=lesson===5?9:3;selected=12;rate=lesson<=3||lesson===5?.02:.05;net=isActivation()?createActivationStart():isLinear()?{classification:false,layers:[[{w:[isGradient()?-1:.25],b:isGradient()?-.6:.12}]]}:createNetwork(depth,width,isClass());data=dataset(isActivation()?'hinge':isLinear()?'linear':isClass()?'classification':lesson===4?'uShape':'nonlinear');selected=Math.floor(data.length/2);history=[loss(net,data)];steps=0;adjustments=0;lastRate=null;render();if(showTransition){renderTransition();document.body.classList.add('transition-open');$('lesson-transition').showModal();if(welcomeOpen){$('transition-question').tabIndex=-1;$('transition-question').focus({preventScroll:true});$('lesson-transition').scrollTop=0;}}}
function render(){
 document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
 $('language').textContent=lang==='zh'?'EN / 中文':'中文 / EN';
 $('lessons').innerHTML=lessons[lang].map((l,i)=>`<button class="lesson-button ${i===lesson?'active':''}" data-lesson="${i}" title="${l[0]}" aria-label="${i+1}. ${l[0]}" ${i===lesson?'aria-current="step"':''}><span class="num">${String(i+1).padStart(2,'0')}</span><span class="lesson-label">${l[0]}<small>${l[1]}</small></span></button>`).join('');
 $('lessons').querySelectorAll('button').forEach(b=>b.onclick=()=>startLesson(+b.dataset.lesson));
 $('chapter').textContent=`${dual('实验','EXPERIMENT')} ${String(lesson+1).padStart(2,'0')} / ${String(lessons[lang].length).padStart(2,'0')}`;$('lesson-title').textContent=lessons[lang][lesson][2];$('lesson-description').textContent=lessons[lang][lesson][3];$('challenge').textContent=lessons[lang][lesson][4];
 $('lesson-scenario').textContent=scenarios[lang][lesson];
 $('standard-workspace').hidden=isProbability()||isAdvanced();document.querySelector('.calculation').hidden=isProbability()||isAdvanced();
 $('advanced-lessons').hidden=!isAdvanced();
 $('probability-lesson').hidden=!isProbability();
 if(isAdvanced()){
  $('activation-comparison').hidden=true;$('next').textContent=t(lesson===lessons[lang].length-1?'again':'next');$('achievement').textContent='';
  renderSidebar();globalThis.AdvancedLessons.render(lesson===9?'decode':'multi',lang);
  if($('lesson-transition').open)renderTransition();return;
 }
 if(isProbability()){
  $('activation-comparison').hidden=true;$('next').textContent=t('next');renderSidebar();renderProbability();
  if($('lesson-transition').open)renderTransition();return;
 }

 $('dataset-tag').textContent=isActivation()?dual('25 次停车 · 前 2 小时免费','25 parking stays · 2 hours free'):isLinear()?dual('15 位学生','15 students'):isClass()?dual('25 个水果','25 fruits'):lesson===4?dual('25 个位置 · U 形','25 positions · U-shape'):dual('25 个时段 · 三次高峰','25 time slots · Three peaks');
 $('data-caption').textContent=dual('点击数据点查看计算 · ','Click a data point to inspect it · ')+(isActivation()?dual('模型输入 x = 时长 ÷ 6 小时，输出 y = 费用 ÷ 30 欧元；免费时长 2 小时对应 x = 1/3。','Model input x = hours ÷ 6; output y = fee ÷ €30. The 2-hour free period ends at x = 1/3.'):t('normalized'));
 $('loss-type').textContent=isClass()?dual('交叉熵','Cross-entropy'):dual('均方误差 · MSE','Mean squared error');$('loss-caption').textContent=isGradient()?dual('曲面高度 = 全部 15 个样本的 MSE；红点 = 当前参数；蓝箭头 = 负梯度方向（示意长度）。','Height = MSE over all 15 samples; red point = current parameters; blue arrow = negative gradient (illustrative length).'):t('lossHint');
 document.querySelector('[data-i18n=lossTitle]').textContent=isMse()?dual('把差距变成 MSE','From gaps to MSE'):isGradient()?dual('误差的三维地图','A 3D map of loss'):t('lossTitle');
 $('surface-controls').hidden=!isGradient();
 $('gradient-details').hidden=!isGradient();
 $('loss-caption').hidden=isGradient()||isMse();
 document.querySelector('.loss-card').classList.toggle('mse-card',isMse());
 if(isMse())$('loss-caption').textContent=dual('左图每条虚线的长度是 |ŷ − y|。平方后相加，再除以 15，才是 MSE。','Each dashed gap on the left is |ŷ − y|. Square all gaps, add them, then divide by 15 to get MSE.');
 document.querySelector('.loss-stats').hidden=isGradient();
 document.querySelector('[data-i18n=calculation]').textContent=isMse()?dual('MSE：误差、平方、平均','MSE: error, square, average'):isGradient()?dual('理解梯度：从坡度到更新','Understanding gradients: from slopes to updates'):t('calculation');
 $('surface-angle').value=surfaceAngle;
 $('surface-angle-label').textContent=dual('左右旋转','Rotate horizontally');
 $('next').textContent=t(lesson===lessons[lang].length-1?'again':'next');
 $('reset').title=dual('恢复本关初始结构、参数、学习率和样本，清空训练记录','Restore this lesson’s initial architecture, parameters, learning rate and sample; clear training history');
 $('sample').innerHTML=data.map((_,i)=>`<option value="${i}">#${String(i+1).padStart(2,'0')}</option>`).join('');$('sample').value=selected;
 $('architecture').innerHTML=(isLinear()||isActivation())?'':`<label>${t('layers')}<select id="depth">${[1,2,3].map(n=>`<option ${n===depth?'selected':''}>${n}</option>`).join('')}</select></label><label>${t('neurons')}<select id="width">${Array.from({length:9},(_,i)=>i+1).map(n=>`<option ${n===width?'selected':''}>${n}</option>`).join('')}</select></label>`;
 for(const id of ['depth','width'])if($(id))$(id).onchange=()=>{stop();inspectedLayer=0;inspectedNeuron=0;depth=+$('depth').value;width=+$('width').value;net=createNetwork(depth,width,isClass());history=[loss(net,data)];steps=0;adjustments=0;lastRate=null;render();};
 renderSidebar();renderParameters();renderTraining();update();if($('lesson-transition').open)renderTransition();
}
function renderProbability(){
 $('probability-lesson').innerHTML=`<div class="workspace probability-grid">
 <section class="card"><div class="card-top"><h3><span class="section-number">01</span>Sigmoid</h3><span id="probability-value" class="pill"></span></div><div id="sigmoid-chart" class="chart"></div></section>
 <section class="card"><div class="card-top"><h3><span class="section-number">02</span>${dual('交叉熵','Cross-entropy')}</h3><span id="probability-loss" class="pill"></span></div><div id="entropy-chart" class="chart"></div></section>
 <section class="card"><div class="card-top"><h3><span class="section-number">03</span>${dual('同一标签，三种把握','One label, three confidence levels')}</h3></div><div class="confidence-cards">${[.1,.5,.9].map(p=>`<button class="confidence-card" data-probability="${p}"><strong>p = ${p}</strong><span data-confidence-loss="${p}"></span><small data-confidence-label="${p}"></small></button>`).join('')}</div><div class="probability-meter"><span id="probability-fill"></span></div><p id="probability-verdict"></p></section>
 <section class="card controls-card"><div class="card-top"><h3><span class="section-number">04</span>${dual('动手试一试','Try it yourself')}</h3></div><button id="probability-step" class="primary">${dual('沿梯度走一步','Take a gradient step')}</button><div class="parameter"><div class="parameter-title"><label for="logit-control">${dual('原始输出','Raw output')} z</label><output id="logit-value"></output></div><input id="logit-control" type="range" min="-6" max="6" step="0.01" value="${probabilityZ}"><div class="range-labels"><span>−6</span><span>0</span><span>+6</span></div></div><p class="probability-label">${dual('真实标签 y','True label y')}</p><div class="label-buttons"><button class="secondary" data-true-label="0">${dual('橙子','Orange')} · y = 0</button><button class="secondary" data-true-label="1">${dual('柚子','Pomelo')} · y = 1</button></div><p id="probability-gradient" class="train-note"></p></section>
 </div><section class="card probability-explanation"><div class="card-top"><h3><span class="section-number">05</span>${dual('从 z 到概率，再到损失','From z to probability to loss')}</h3></div><div id="probability-math"></div></section>`;
 $('logit-control').oninput=()=>{probabilityZ=+$('logit-control').value;probabilitySteps=0;updateProbability();};
 $('probability-lesson').querySelectorAll('[data-true-label]').forEach(button=>button.onclick=()=>{probabilityY=+button.dataset.trueLabel;probabilitySteps=0;updateProbability();});
 $('probability-lesson').querySelectorAll('[data-probability]').forEach(button=>button.onclick=()=>{const p=+button.dataset.probability;probabilityZ=Math.log(p/(1-p));probabilitySteps=0;updateProbability();});
 $('probability-step').onclick=()=>{probabilityZ=Math.max(-6,Math.min(6,probabilityZ-.5*(sigmoid(probabilityZ)-probabilityY)));probabilitySteps++;updateProbability();};
 updateProbability();
}
function updateProbability(){
 const p=sigmoid(probabilityZ),ce=binaryCrossEntropyFromLogit(probabilityZ,probabilityY),gradient=p-probabilityY;
 $('logit-control').value=probabilityZ;$('logit-value').textContent=fmt(probabilityZ,3);
 $('probability-value').textContent=`p = ${fmt(p,4)}`;$('probability-loss').textContent=`Loss = ${fmt(ce,4)}`;
 $('probability-fill').style.width=`${p*100}%`;
 $('probability-verdict').textContent=dual(`是柚子的概率 ${(p*100).toFixed(1)}% · 真实类别：${probabilityY?'柚子':'橙子'}`,`${(p*100).toFixed(1)}% probability of pomelo · True class: ${probabilityY?'Pomelo':'Orange'}`);
 $('probability-gradient').textContent=`∂L/∂z = p − y = ${fmt(gradient,4)} · ${dual('步数','Steps')} ${probabilitySteps}`;
 $('probability-step').disabled=(probabilityY===1&&probabilityZ>=6)||(probabilityY===0&&probabilityZ<=-6);
 $('probability-lesson').querySelectorAll('[data-true-label]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.trueLabel===probabilityY)));
 $('probability-lesson').querySelectorAll('[data-probability]').forEach(button=>{
  const q=+button.dataset.probability,score=binaryCrossEntropyFromLogit(Math.log(q/(1-q)),probabilityY);
  button.setAttribute('aria-pressed',String(Math.abs(q-p)<1e-6));
  button.querySelector('[data-confidence-loss]').textContent=`Loss ${fmt(score,3)}`;
  button.querySelector('[data-confidence-label]').textContent=q===.5?dual('不确定','Unsure'):(q>.5?1:0)===probabilityY?dual('更自信且正确','Confident and correct'):dual('更自信但错误','Confident but wrong');
 });
 const W=460,H=260,left=45,right=444,top=28,bottom=223;
 const draw=(entropy)=>{
  const X=x=>left+(entropy?x:(x+6)/12)*(right-left),Y=y=>bottom-y/(entropy?6:1)*(bottom-top);
  let s=chartBase(W,H,entropy?'p':'z',entropy?'Loss':'p',entropy?6:1);
  for(let i=0;i<=4;i++)s+=svgText(X(entropy?i/4:-6+i*3),H-19,entropy?fmt(i/4,2):-6+i*3,'text-anchor="middle"');
  if(entropy){for(const y of [0,1]){const points=Array.from({length:161},(_,i)=>{const q=sigmoid(-6+12*i/160);return `${i?'L':'M'}${X(q)},${Y(binaryCrossEntropyFromLogit(Math.log(q/(1-q)),y))}`;});s+=`<path d="${points.join(' ')}" fill="none" stroke="${y?'#26466b':'#9b4146'}" stroke-width="${y===probabilityY?2.5:1.3}" opacity="${y===probabilityY?1:.35}" ${y===probabilityY?'':'stroke-dasharray="4 4"'}/>`;}s+=svgText(65,45,'y = 1')+svgText(365,45,'y = 0');}
  else{s+=`<path d="${Array.from({length:161},(_,i)=>{const z=-6+12*i/160;return `${i?'L':'M'}${X(z)},${Y(sigmoid(z))}`;}).join(' ')}" fill="none" stroke="#26466b" stroke-width="2.5"/>`;s+=`<path d="M${X(0)} ${top} V${bottom}" stroke="#d8d6d0" stroke-dasharray="3 4"/>`;}
  const px=X(entropy?p:probabilityZ),py=Y(entropy?ce:p);
  s+=`<path d="M${left} ${py} H${px} V${bottom}" stroke="#9b4146" stroke-dasharray="4 4" fill="none"/><circle cx="${px}" cy="${py}" r="5" fill="#9b4146" stroke="white" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${entropy?dual('概率与交叉熵，两条曲线分别对应真实标签 0 和 1','Probability and cross-entropy for true labels 0 and 1'):dual('Sigmoid 将原始输出映射到概率','Sigmoid maps raw output to probability')}">${s}</svg>`;
 };
 $('sigmoid-chart').innerHTML=draw(false);$('entropy-chart').innerHTML=draw(true);
 $('probability-math').innerHTML=`<div class="mse-stages"><div><strong>Sigmoid</strong><p class="mse-formula">p = 1 / (1 + e⁻ᶻ)<br>z = ${fmt(probabilityZ,3)} → p = ${fmt(p,4)}</p><p>${dual('任意实数 z 都映射到 0 与 1 之间。z = 0 时 p = 0.5；两端逐渐变平。','Any real z maps between 0 and 1. At z = 0, p = 0.5; the curve flattens toward either end.')}</p></div><div><strong>${dual('二元交叉熵','Binary cross-entropy')}</strong><p class="mse-formula">L = −y ln(p) − (1−y) ln(1−p)<br>y = ${probabilityY} → L = ${probabilityY?'−ln(p)':'−ln(1−p)'}<br>= ${fmt(ce,4)}</p><p>${dual('ln 是自然对数。给真实类别的概率越低，损失越大；自信地猜错会受到更重惩罚。','ln is the natural logarithm. Lower probability for the true class means higher loss; confidently wrong predictions incur a larger penalty.')}</p></div><div><strong>${dual('一步怎样改变预测','What a gradient step changes')}</strong><p class="mse-formula">∂L/∂z = p − y = ${fmt(gradient,4)}<br>z ← z − 0.5(p − y)</p><p>${dual('这里只调整一个 z，学习率为 0.5；滑块限制 z 在 −6 到 6。下一关把同一个梯度传回权重和偏置，对所有水果的交叉熵求平均。','Here we adjust only z with learning rate 0.5, limited to −6…6. The next lesson passes this gradient back to weights and biases and averages cross-entropy across all fruits.')}</p></div></div>`;
 $('achievement').textContent=probabilitySteps?dual('观察：走一步后，给真实类别的概率提高，交叉熵下降。','Notice: a step raises the probability of the true class and lowers cross-entropy.'):'';
}

function renderSidebar(){
 $('app-layout').classList.toggle('sidebar-collapsed',sidebarCollapsed);
 const label=sidebarCollapsed?dual('展开选关栏','Expand lessons'):dual('收起选关栏','Collapse lessons');
 $('sidebar-toggle').textContent=sidebarCollapsed?'☰':dual('‹  收起选关栏','‹  Collapse lessons');
 $('sidebar-toggle').setAttribute('aria-label',label);$('sidebar-toggle').title=label;$('sidebar-toggle').setAttribute('aria-expanded',String(!sidebarCollapsed));
 $('lessons').setAttribute('aria-label',dual('选择关卡','Choose a lesson'));
}
function drawComparison(){
 const panel=$('activation-comparison');panel.hidden=!isActivation();if(!isActivation())return;
 const on=net.outputActivation==='relu',n=net.layers[0][0],onNet={...net,outputActivation:'relu'},offNet={...net,outputActivation:'linear'};
 panel.innerHTML=`<div class="comparison-heading"><h3>${dual('同样的参数，只改变激活函数','Same parameters, only activation changes')}</h3><button id="activation-toggle" class="secondary" role="switch" aria-checked="${on}">${dual('ReLU 激活函数','ReLU activation')} · ${on?dual('开启','ON'):dual('关闭','OFF')}</button></div><div class="comparison-metrics"><div><strong>${dual('开启 · 一条折线','ON · A bent line')}</strong><p>ŷ = max(0, wx + b)</p><span>MSE <b>${fmt(loss(onNet,data),4)}</b></span></div><div><strong>${dual('关闭 · 一条直线','OFF · A straight line')}</strong><p>ŷ = wx + b</p><span>MSE <b>${fmt(loss(offNet,data),4)}</b></span></div></div><p>${dual('蓝色实线：当前模式；红色虚线：另一模式。切换保留 w、b，训练仅调整当前模式。','Solid blue: current mode; dashed red: other mode. Toggling preserves w and b; training updates the current mode.')} ${dual('当前拐点','Current hinge')}: ${Math.abs(n.w[0])<1e-9?dual('w = 0，没有拐点','w = 0, no hinge'): 'x = '+fmt(-n.b/n.w[0])}。</p>`;
 $('activation-toggle').onclick=()=>{stop();net.outputActivation=on?'linear':'relu';history=[loss(net,data)];steps=0;adjustments=0;lastRate=null;update();};
}
function parameterName(l,i,j){return parameterSymbol(l,i,j)+' · '+(j==='b'?t('bias'):t('weight'))+' · '+neuronLabel(l,i);}
function renderParameters(){
 let html='';net.layers.forEach((layer,l)=>layer.forEach((n,i)=>{const keys=isLinear()?['b',0]:[...n.w.keys(),'b'];keys.forEach(j=>{const value=j==='b'?n.b:n.w[j],id=`p-${l}-${i}-${j}`,range=Math.max(isLinear()?2:4,Math.ceil(Math.abs(value)));html+=`<div class="parameter ${j==='b'?'bias-parameter':'weight-parameter'}"><div class="parameter-title"><label for="${id}">${parameterName(l,i,j)}</label><output id="${id}-value">${fmt(value)}</output></div><input type="range" id="${id}" data-l="${l}" data-i="${i}" data-j="${j}" min="${-range}" max="${range}" step="0.001" value="${value}"><div class="range-labels"><span>−${range}</span><span class="gradient" id="${id}-gradient"></span><span>+${range}</span></div></div>`;});}));
 $('parameter-controls').innerHTML=html;$('parameter-controls').querySelectorAll('input').forEach(el=>el.oninput=()=>{stop();inspectedLayer=+el.dataset.l;inspectedNeuron=+el.dataset.i;const n=net.layers[el.dataset.l][el.dataset.i];if(el.dataset.j==='b')n.b=+el.value;else n.w[el.dataset.j]=+el.value;adjustments++;history.push(loss(net,data));lastRate=null;update();});
}
function renderTraining(){
 $('training').innerHTML=canTrain()?`<div class="train-row"><button class="primary" id="play">${timer?'Ⅱ '+t('pause'):'▶ '+t('play')}</button><button class="secondary" id="step">↘ ${t('step')}</button></div><p id="training-target" class="training-target"></p><div class="parameter"><div class="parameter-title"><label for="rate">${t('rate')}</label><output id="rate-value">${fmt(rate,2)}</output></div><input id="rate" type="range" min="0.01" max="1" step="0.01" value="${rate}"></div><p class="train-note" id="train-note">${t('trainHint')}</p>`:`<p class="train-note">${t('manual')}</p>`;
 if(canTrain()){$('rate').oninput=()=>{rate=+$('rate').value;$('rate-value').textContent=fmt(rate,2);};$('step').onclick=()=>{stop();advance(1);};$('play').onclick=()=>{if(timer){stop();return;}if(reachedGoal())return;timer=setInterval(()=>{advance(trainingBatch());if(reachedGoal())stop();},lesson<=3?120:isClass()?110:100);$('play').textContent='Ⅱ '+t('pause');};}
}
// Increase work per frame gradually; only the learning objective stops training.
function trainingBatch(){
 if(isActivation())return Math.ceil(1+Math.min(40,steps*.06));
 if(isGradient())return Math.ceil(1+Math.min(8,steps*.04));
 if(lesson===5)return Math.ceil(8+Math.min(210,steps*.06));
 if(isClass())return Math.ceil(3+Math.min(35,steps*.06));
 return 1;
}
function reachedGoal(){return isClass()?data.filter(p=>(forward(net,p.x).value>=.5?1:0)===p.y).length/data.length===1&&loss(net,data)<networkLossTarget(net):lesson===4?adjustments>=5:loss(net,data)<(isLinear()?.018:lesson===5?networkLossTarget(net):.0005);}
function advance(count){for(let i=0;i<count;i++){lastRate=trainStep(net,data,rate).usedRate;steps++;history.push(loss(net,data));}update();}
function update(){
 const current=loss(net,data);$('loss-value').textContent=fmt(current,4);$('step-value').textContent=steps;
 if($('training-target')){
  const target=(lesson===5||isClass())?networkLossTarget(net):isLinear()?.018:.0005;
  $('training-target').dataset.lossTarget=target;
  $('training-target').textContent=dual('停止目标：','Stop at: ')+(isClass()?dual('准确率 100% 且交叉熵','100% accuracy and cross-entropy'):'MSE')+' < '+fmt(target,6);
 }
 if(lesson===5||isClass())$('challenge').textContent=dual('当前结构越深、参数越多，目标 Loss 越低。按当前目标达标后自动暂停；可以继续手动走一步。','Deeper networks with more parameters have lower loss targets. Auto-training pauses at the current target; you can still take individual steps.');
 const g=canTrain()?gradients(net,data):null;
 $('parameter-controls').querySelectorAll('input').forEach(el=>{const {l,i,j}=el.dataset,n=net.layers[l][i],value=j==='b'?n.b:n.w[j];if(Math.abs(value)>+el.max){const bound=Math.ceil(Math.abs(value));el.min=-bound;el.max=bound;el.nextElementSibling.firstElementChild.textContent='−'+bound;el.nextElementSibling.lastElementChild.textContent='+'+bound;}el.closest('.parameter').classList.toggle('inspected',+l===inspectedLayer&&+i===inspectedNeuron);el.value=value;$(el.id+'-value').textContent=fmt(value);if(g){const gradient=j==='b'?g[l][i].b:g[l][i].w[j];$(el.id+'-gradient').textContent=`${dual('梯度','gradient')} ${fmt(gradient)} · ${Math.abs(gradient)<.00001?'≈ 0':gradient>0?'←':'→'}`;}});
 if($('train-note'))$('train-note').textContent=t('trainHint');
 drawComparison();drawData();drawLoss();drawNetwork();drawCalculation();
 const accuracy=data.filter(p=>(forward(net,p.x).value>=.5?1:0)===p.y).length/data.length;
 const complete=reachedGoal();
 $('achievement').textContent=complete?t('success'):isClass()?dual(`当前准确率：${Math.round(accuracy*100)}%`,`Current accuracy: ${Math.round(accuracy*100)}%`):'';
}
const svgText=(x,y,text,extra='')=>`<text x="${x}" y="${y}" font-size="11" fill="#596273" ${extra}>${text}</text>`;
function chartBase(w,h,xLabel,yLabel,yMax=1,yMin=0){let s='';for(let i=0;i<=4;i++){const y=28+(h-65)*i/4;s+=`<line x1="45" y1="${y}" x2="${w-16}" y2="${y}" stroke="#e6e9ef"/>`+svgText(36,y+3,fmt(yMax-(yMax-yMin)*i/4,yMax>10?0:2),'text-anchor="end"');}s+=svgText(45,12,yLabel)+svgText(w-16,h-3,xLabel,'text-anchor="end"');return s;}
function drawData(){
 const w=550,h=260,left=45,right=w-16,top=28,bottom=h-37;
 const points=Array.from({length:121},(_,i)=>({x:i/120,y:forward(net,i/120).value}));
 const counterpart=isActivation()?{...net,outputActivation:net.outputActivation==='relu'?'linear':'relu'}:null;
 const otherPoints=counterpart?points.map(p=>({x:p.x,y:forward(counterpart,p.x).value})):[];
 const values=[...points,...otherPoints].map(p=>p.y),yMin=Math.min(0,...values),yMax=Math.max(1,...values),X=x=>left+x*(right-left),Y=y=>bottom-(y-yMin)/(yMax-yMin)*(bottom-top);
 const xLabel=isActivation()?dual('停车时长（小时）','Parking duration (hours)'):isLinear()?dual('学习时间（小时）','Study time (hours)'):isClass()?dual('水果重量（克）','Fruit weight (g)'):lesson===4?dual('水平位置（厘米）','Horizontal position (cm)'):dual('时间（时）','Time of day (h)');
 const yLabel=isActivation()?dual('停车费（÷ 30 欧元）','Parking fee (÷ €30)'):isLinear()?dual('成绩（缩放至 0–1）','Test score (scaled to 0–1)'):isClass()?dual('柚子的概率','Probability of pomelo'):lesson===4?dual('高度（缩放至 0–1）','Height (scaled to 0–1)'):dual('客流（缩放至 0–1）','Footfall (scaled to 0–1)');
 let s=chartBase(w,h,xLabel,yLabel,yMax,yMin);
 if(isClass())s+=`<rect x="${left}" y="${Y(1)}" width="${right-left}" height="${Y(.5)-Y(1)}" fill="#f3f5f8" opacity=".65"/><line x1="${left}" y1="${Y(.5)}" x2="${right}" y2="${Y(.5)}" stroke="#9ca3af" stroke-dasharray="4 5"/>`+svgText(right-4,Y(.5)-5,'50%','text-anchor="end"');
 for(let i=0;i<=4;i++)s+=svgText(X(i/4),h-20,isActivation()?fmt(i*1.5,1):isLinear()?fmt(i*2,0):isClass()?fmt(100+i*125,0):lesson===4?fmt(i*25,0):fmt(6+i*4,0),'text-anchor="middle"');
 if(isActivation())s+=`<path d="${otherPoints.map((p,i)=>`${i?'L':'M'}${X(p.x)},${Y(p.y)}`).join(' ')}" fill="none" stroke="#9b4146" stroke-width="2" stroke-dasharray="6 4"/>`;
 if(!isClass())for(const [i,p] of data.entries()){if(!isMse()&&i!==selected)continue;s+=`<line data-residual="${i}" x1="${X(p.x)}" y1="${Y(p.y)}" x2="${X(p.x)}" y2="${Y(forward(net,p.x).value)}" stroke="${i===selected?'#9b4146':'#929baa'}" stroke-width="${i===selected?2:1.2}" stroke-dasharray="4 4"/>`;}
 s+=`<path d="${points.map((p,i)=>`${i?'L':'M'}${X(p.x)},${Y(p.y)}`).join(' ')}" fill="none" stroke="#26466b" stroke-width="2.5"/>`;
 data.forEach((p,i)=>{s+=`<circle data-point="${i}" role="button" aria-label="${dual('样本','Sample')} ${i+1}" tabindex="0" cx="${X(p.x)}" cy="${Y(p.y)}" r="${selected===i?6:4}" fill="${isClass()&&p.y===0?'#ffffff':'#647084'}" stroke="${selected===i?'#26466b':isClass()?'#647084':'white'}" stroke-width="${selected===i?2:1.5}" style="cursor:pointer"><title>${dual('样本','Sample')} ${i+1}: ${fmt(p.x)}, ${fmt(p.y)}</title></circle>`;});
 $('data-chart').innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${xLabel}, ${yLabel}">${s}</svg>`;
 $('data-chart').querySelectorAll('[data-point]').forEach(el=>{const choose=()=>{selected=+el.dataset.point;$('sample').value=selected;update();};el.onclick=choose;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};});
}
function drawSurface(viewOnly=false){
 const n=net.layers[0][0],gw=gradients(net,data)[0][0],weight=n.w[0],bias=n.b;
 // Exact quadratic MSE, evaluated on the same samples as the prediction chart.
 const mse=(w,b)=>data.reduce((sum,p)=>sum+(w*p.x+b-p.y)**2,0)/data.length;
 const bound=Math.max(2,Math.ceil(Math.abs(weight)),Math.ceil(Math.abs(bias))),cells=24,delta=2*bound/cells;
 const zMax=Math.max(...[-bound,bound].flatMap(w=>[-bound,bound].map(b=>mse(w,b))));
 const angle=surfaceAngle*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
 const project=(w,b,z)=>({x:260+(w*c-b*s)/bound*130,y:242+(w*s+b*c)/bound*49-z/zMax*150,depth:w*s+b*c});
 const path=points=>points.map((p,i)=>`${i?'L':'M'}${fmt(p.x)},${fmt(p.y)}`).join(' ');
 const line=(points,color,extra='')=>`<path d="${path(points)}" fill="none" stroke="${color}" ${extra}/>`;
 let svg='<defs><marker id="descent-arrow" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#26466b"/></marker></defs>';
 const floor=[[-bound,-bound],[bound,-bound],[bound,bound],[-bound,bound]].map(([w,b])=>project(w,b,0));
 svg+=`<path d="${path(floor)} Z" fill="#f6f4f0" stroke="#d8d6d0"/>`;
 const faces=[];
 for(let i=0;i<cells;i++)for(let j=0;j<cells;j++){
  const w=-bound+i*delta,b=-bound+j*delta,coords=[[w,b],[w+delta,b],[w+delta,b+delta],[w,b+delta]];
  const points=coords.map(([x,y])=>project(x,y,mse(x,y))),height=mse(w+delta/2,b+delta/2)/zMax;
  faces.push({depth:points.reduce((a,p)=>a+p.depth,0)/4,markup:`<path data-surface-w="${w+delta/2}" data-surface-b="${b+delta/2}" d="${path(points)} Z" fill="rgb(${Math.round(239-height*80)},${Math.round(241-height*67)},${Math.round(243-height*49)})" stroke="#9daab8" stroke-width=".45"><title>w = ${fmt(w+delta/2,2)}, b = ${fmt(b+delta/2,2)}, MSE = ${fmt(mse(w+delta/2,b+delta/2),4)}</title></path>`});
 }
 svg+=faces.sort((a,b)=>a.depth-b.depth).map(f=>f.markup).join('');
 // These two surface sections hold the other parameter fixed.
 const samples=Array.from({length:81},(_,i)=>-bound+2*bound*i/80);
 svg+=line(samples.map(w=>project(w,bias,mse(w,bias))),'#26466b','stroke-width="1.8" opacity=".8"');
 svg+=line(samples.map(b=>project(weight,b,mse(weight,b))),'#9b4146','stroke-width="1.8" opacity=".8"');
 const point=project(weight,bias,mse(weight,bias)),base=project(weight,bias,0);
 svg+=line([base,point],'#9b4146','stroke-width="1" stroke-dasharray="3 3"');
 // Partial derivatives are slopes of local tangents, not vertical Loss values.
 for(const [axis,slope,color] of [['w',gw.w[0],'#26466b'],['b',gw.b,'#9b4146']]){
  const coordinate=axis==='w'?weight:bias,lo=Math.max(-.5,-bound-coordinate),hi=Math.min(.5,bound-coordinate);
  const tangent=t=>project(weight+(axis==='w'?t:0),bias+(axis==='b'?t:0),mse(weight,bias)+slope*t);
  const end=tangent(hi),marker=`partial-${axis}`;
  svg+=`<defs><marker id="${marker}" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${color}"/></marker></defs>`;
  svg+=line([tangent(lo),end],'white','stroke-width="5" pointer-events="none"');
  svg+=line([tangent(lo),end],color,`data-partial="${axis}" data-slope="${slope}" stroke-width="2.5" marker-end="url(#${marker})" pointer-events="none"`);
  svg+=`<text x="${end.x+(axis==='w'?10:-10)}" y="${end.y-10}" text-anchor="${axis==='w'?'start':'end'}" font-size="12" fill="${color}" stroke="white" stroke-width="3" paint-order="stroke" pointer-events="none">+${axis}</text>`;
  svg+=`<text x="${axis==='w'?40:285}" y="360" font-size="13" fill="${color}" data-partial-value="${axis}">∂L/∂${axis} = ${fmt(slope,4)}</text>`;
 }
 const norm=Math.hypot(gw.w[0],gw.b);
 if(norm>1e-7){
  // Scale the display arrow without changing its direction; keep it inside the plot.
  let length=Math.min(.48,.15*norm),dw=-gw.w[0]/norm,db=-gw.b/norm;
  for(const [v,d] of [[weight,dw],[bias,db]])if(d)length=Math.min(length,(d>0?bound-v:-bound-v)/d);
  const endW=weight+dw*length,endB=bias+db*length;
  svg+=line(Array.from({length:13},(_,i)=>{const w=weight+(endW-weight)*i/12,b=bias+(endB-bias)*i/12;return project(w,b,mse(w,b));}),'#26466b','stroke-width="3" marker-end="url(#descent-arrow)"');
 }
 svg+=`<circle cx="${point.x}" cy="${point.y}" r="5" fill="#9b4146" stroke="white" stroke-width="2"/>`;
 const zOrigin=project(-bound,-bound,0),zTop=project(-bound,-bound,zMax);
 svg+=line([zOrigin,zTop],'#9b4146','stroke-width="1"');
 for(const fraction of [0,.5,1]){const p=project(-bound,-bound,zMax*fraction);svg+=svgText(p.x-7,p.y+3,fmt(zMax*fraction,1),'text-anchor="end"');}
 svg+=svgText(zTop.x,zTop.y-12,'Loss · MSE','text-anchor="middle"');
 for(const [axis,color] of [['w','#26466b'],['b','#9b4146']]){
  const pts=axis==='w'?[project(-bound,bound,0),project(bound,bound,0)]:[project(bound,-bound,0),project(bound,bound,0)];
  svg+=line(pts,color,'stroke-width="1.5"');
  for(const v of [-bound,0,bound]){const p=axis==='w'?project(v,bound,0):project(bound,v,0);svg+=svgText(p.x,p.y+14,fmt(v,0),'text-anchor="middle"');}
  const mid=axis==='w'?project(0,bound,0):project(bound,0,0);
  svg+=`<text x="${mid.x}" y="${mid.y+31}" fill="${color}" text-anchor="middle" font-size="12">${axis} · ${axis==='w'?t('weight'):t('bias')}</text>`;
 }
 const derivative=(name,value)=>`<div><strong class="${name==='w'?'weight-symbol':'bias-symbol'}">∂L/∂${name} = ${fmt(value,4)}</strong><p>${Math.abs(value)<.0001?dual('这个方向的坡度接近零。','Almost flat in this direction.'):value>0?dual(`固定另一参数，增大 ${name} 会让 Loss 局部上升。`,`Holding the other parameter fixed, increasing ${name} locally raises Loss.`):dual(`固定另一参数，增大 ${name} 会让 Loss 局部下降。`,`Holding the other parameter fixed, increasing ${name} locally lowers Loss.`)}</p></div>`;
 if($('loss-surface'))$('loss-surface').innerHTML=svg;
 else $('loss-chart').innerHTML=`<svg id="loss-surface" viewBox="0 0 520 370" role="img" aria-label="${dual('权重、偏置与均方误差的三维曲面；左右拖动旋转，固定俯仰角；可通过参数滑块改变红点位置','3D weight, bias and MSE surface; drag horizontally to rotate with fixed elevation; use parameter sliders to move the red point')}">${svg}</svg>`;
 if(!viewOnly)$('gradient-details').innerHTML=`<p class="gradient-map-key">${$('loss-caption').textContent}</p><div class="surface-readout"><span class="weight-symbol">w = ${fmt(weight)}</span><span class="bias-symbol">b = ${fmt(bias)}</span><span>L = ${fmt(mse(weight,bias),4)}</span></div><div class="gradient-explanation"><p class="gradient-formula">L(w, b) = ¹⁄₁₅ Σ(wxᵢ + b − yᵢ)²</p><p>${dual('蓝色截线：固定 b，只改 w。红色截线：固定 w，只改 b。两条细箭头是红点处的局部切线，分别朝 +w、+b 方向；其坡度就是对应偏导数。它们不是两份 Loss。粗蓝箭头仍表示负梯度下降方向。','Blue section: hold b fixed and vary w. Red section: hold w fixed and vary b. The thin arrows are local tangents at the red point, pointing toward +w and +b. Their slopes are the partial derivatives, not separate amounts of Loss. The thick blue arrow still shows the negative-gradient descent direction.')}</p><div class="gradient-components">${derivative('w',gw.w[0])}${derivative('b',gw.b)}</div><p class="gradient-formula">∇L = (${fmt(gw.w[0],4)}, ${fmt(gw.b,4)})</p><p>${dual('梯度指向局部上升最快的方向；走下坡要取反。','The gradient points toward the steepest local increase; negate it to go downhill.')}</p><p class="gradient-formula">w ← w − η · ∂L/∂w<br>b ← b − η · ∂L/∂b</p><p>${dual('η 是学习率。梯度接近零时，脚下接近平坦；对这个凸二次曲面，零梯度处就是全局最低点。','η is the learning rate. Near-zero gradients mean nearly flat ground; for this convex quadratic surface, a zero gradient marks the global minimum.')}</p></div>`;
 $('loss-surface').querySelectorAll('[data-surface-w]').forEach(el=>el.onclick=()=>{if(surfaceDragged)return;stop();n.w[0]=+el.dataset.surfaceW;n.b=+el.dataset.surfaceB;adjustments++;lastRate=null;history.push(loss(net,data));update();});
}

function drawMseBars(){
 const errors=data.map(p=>forward(net,p.x).value-p.y),e=errors[selected],gap=Math.abs(e),square=e*e,mean=loss(net,data),sum=mean*data.length;
 const side=90*gap/Math.max(.01,...errors.map(Math.abs)),bottom=25+side;
 $('loss-chart').innerHTML=`<svg viewBox="0 0 460 145" role="img" aria-label="${dual('虚线差距的长度作为正方形边长；正方形面积就是平方误差','The dashed gap becomes the side of a square; its area is squared error')}">
 <text x="50" y="14" font-size="12" fill="#596273">#${selected+1}</text>
 <line x1="70" y1="25" x2="70" y2="${bottom}" stroke="#9b4146" stroke-width="2" stroke-dasharray="4 4"/>
 <circle cx="70" cy="25" r="4" fill="#647084"/><circle cx="70" cy="${bottom}" r="4" fill="#26466b"/>
 <text x="87" y="${25+side/2}" font-size="13" fill="#9b4146">|e| = ${fmt(gap,4)}</text>
 <text x="210" y="72" font-size="22" fill="#666764">→</text>
 <rect x="275" y="25" width="${side}" height="${side}" fill="#f5eaea" stroke="#9b4146" stroke-width="1.5"/>
 <text x="275" y="${bottom+20}" font-size="12" fill="#9b4146">e² = ${fmt(square,5)}</text>
 </svg>
 <div class="mse-terms-label">${dual('平方误差 · 点击选样本','Squared errors · Select a sample')}</div>
 <div class="mse-terms">${errors.map((value,i)=>`<button data-error="${i}" aria-pressed="${i===selected}" aria-label="${dual('样本','Sample')} ${i+1}: ${fmt(value*value,5)}"><small>#${i+1}</small><span>${fmt(value*value,4)}</span></button>`).join('')}</div>
 <div class="mse-total"><strong>MSE = ${fmt(sum,5)} ÷ 15 = ${fmt(mean,5)}</strong></div>`;
 $('loss-chart').querySelectorAll('[data-error]').forEach(el=>el.onclick=()=>{selected=+el.dataset.error;$('sample').value=selected;update();});
}
function drawMseExplanation(){
 const p=data[selected],prediction=forward(net,p.x).value,error=prediction-p.y,squared=error**2,mean=loss(net,data),sum=mean*data.length;
 $('calculation').innerHTML=`<p>${dual('MSE = Mean Squared Error，即均方误差。先逐点衡量预测偏离了多少，再汇总成一个越小越好的数字。','MSE means Mean Squared Error. Measure how far each prediction misses, then combine those errors into one number: lower is better.')}</p><p class="mse-diagram-note">${dual('左图虚线表示预测与真实值的差距；右图将这段长度作为正方形边长，面积就是平方误差。所有样本使用同一比例，15 项相加后除以 15 得到 MSE。','The dashed lines show prediction gaps. On the right, each gap becomes a square’s side and its area is squared error. All samples share one scale; add the 15 squared errors and divide by 15 to get MSE.')}</p><div class="mse-stages"><div><strong>${dual('1 · 计算当前样本的误差','1 · Find this sample’s error')}</strong><p>${dual('样本','Sample')} #${selected+1} · x = ${fmt(p.x,4)}</p><p class="mse-formula">e = ŷ − y<br>= ${fmt(prediction,4)} − ${fmt(p.y,4)}<br>= ${fmt(error,4)}</p></div><div><strong>${dual('2 · 把误差平方','2 · Square the error')}</strong><p>${dual('消除正负号，并更重地惩罚大误差。','Remove the sign and penalize larger misses more.')}</p><p class="mse-formula">e² = (${fmt(error,4)})²<br>= ${fmt(squared,6)}</p></div><div><strong>${dual('3 · 对全部样本求平均','3 · Average all samples')}</strong><p>${dual('全部 15 个平方误差之和 ÷ 15。','Sum all 15 squared errors, then divide by 15.')}</p><p class="mse-formula">MSE = ¹⁄₁₅ Σ(ŷᵢ − yᵢ)²<br>= ${fmt(sum,6)} ÷ 15<br>= ${fmt(mean,6)}</p></div></div><p>${dual(`当前样本对 MSE 的贡献是 ${fmt(squared/data.length,6)}。只选中一个样本不会改变总 MSE；调整参数才会改变预测。`,`This sample contributes ${fmt(squared/data.length,6)} to MSE. Selecting a sample does not change the total; adjusting parameters changes predictions.`)}</p><p class="mse-note">${dual('为什么不直接平均误差？+0.2 和 −0.2 会抵消为 0，但平方后的平均值是 0.04，能如实保留两次偏差。MSE = 0 表示每个预测都正确。学生数据有分散与例外，一条直线不必也无法穿过每个点。这里用缩放后的数值计算，显示值已四舍五入。RMSE = √MSE，是另一个指标。','Why not average raw errors? +0.2 and −0.2 cancel to 0, but their mean squared error is 0.04. MSE = 0 means every prediction is correct. These scattered student data include exceptions; one line cannot pass through every point. Calculations use scaled values and displayed numbers are rounded. RMSE = √MSE is a different metric.')}</p>`;
}

function drawLoss(){
 if(isMse()){drawMseBars();return;}
 if(isGradient()){drawSurface();return;}
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
  s+=svgText(layer[0].x,diagramHeight-12,l===0?'':l===a.length-1?(isClass()?'sigmoid':net.outputActivation==='relu'?'ReLU':dual('线性输出','Linear output')):'ReLU','text-anchor="middle"');
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
 if(isMse()){drawMseExplanation();return;}
 const token=(l,i,j)=>`<button class="equation-parameter ${j==='b'?'bias-symbol':'weight-symbol'}" data-parameter="${l}-${i}-${j}" title="${parameterName(l,i,j)}" aria-label="${parameterName(l,i,j)}">${parameterSymbol(l,i,j)}</button>`;
 let html=`<div class="equation-intro"><p>${dual('每行对应一个神经元。点击 w 或 b，定位右侧对应滑块。','One row per neuron. Select a w or b to locate its slider.')}</p><div class="equation-legend"><span class="weight-symbol">w · ${t('weight')}</span><span class="bias-symbol">b · ${t('bias')}</span><span>X · ${t('input')}</span></div></div><div class="equation-list">`;
 net.layers.forEach((layer,l)=>{
  html+=`<div class="equation-layer">${l===net.layers.length-1?t('output'):`${t('hidden')} ${l+1}`}</div>`;
  layer.forEach((n,i)=>{
   const out=l===net.layers.length-1,activation=out?(isClass()?'sigmoid':net.outputActivation==='relu'?'ReLU':''):'ReLU';
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
 const surfaceHost=$('loss-chart');
 surfaceHost.addEventListener('pointerdown',event=>{
  if(!isGradient()||event.button!==0||!event.isPrimary)return;
  event.preventDefault();
  surfaceDragged=false;
  surfaceDrag={id:event.pointerId,x:event.clientX,y:event.clientY,angle:surfaceAngle};
  surfaceHost.setPointerCapture(event.pointerId);
 });
 surfaceHost.addEventListener('pointermove',event=>{
  if(!surfaceDrag||event.pointerId!==surfaceDrag.id)return;
  const dx=event.clientX-surfaceDrag.x,dy=event.clientY-surfaceDrag.y;
  if(Math.hypot(dx,dy)>4)surfaceDragged=true;
  if(!surfaceDragged||Math.abs(dx)<4)return;
  surfaceAngle=((surfaceDrag.angle+dx*.5+180)%360+360)%360-180;
  $('surface-angle').value=surfaceAngle;
  surfaceHost.classList.add('rotating');
  if(surfaceFrame===null)surfaceFrame=requestAnimationFrame(()=>{surfaceFrame=null;if(isGradient())drawSurface(true);});
 });
 const endSurfaceDrag=event=>{
  if(!surfaceDrag||event.pointerId!==surfaceDrag.id)return;
  // Capture targets the persistent chart container, which survives SVG redraws.
  // A stationary click still selects the tile under the pointer.
  if(event.type==='pointerup'&&!surfaceDragged){
   const tile=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-surface-w]');
   if(tile&&surfaceHost.contains(tile))tile.click();
  }
  surfaceDragged=true;
  surfaceDrag=null;surfaceHost.classList.remove('rotating');
  if(surfaceHost.hasPointerCapture(event.pointerId))surfaceHost.releasePointerCapture(event.pointerId);
 };
 surfaceHost.addEventListener('pointerup',endSurfaceDrag);
 surfaceHost.addEventListener('pointercancel',endSurfaceDrag);
 surfaceHost.addEventListener('lostpointercapture',()=>{surfaceDrag=null;surfaceHost.classList.remove('rotating');});
 $('surface-angle').oninput=()=>{surfaceAngle=+$('surface-angle').value;drawSurface(true);};
 $('language').onclick=()=>{lang=lang==='zh'?'en':'zh';try{localStorage.setItem('neuron-language',lang);}catch{}render();};$('reset').onclick=()=>startLesson(lesson,false);$('next').onclick=()=>{startLesson((lesson+1)%lessons[lang].length);$('lesson-intro').scrollIntoView({behavior:'smooth',block:'start'});};$('sample').onchange=()=>{selected=+$('sample').value;update();};
 $('sidebar-toggle').onclick=()=>{sidebarCollapsed=!sidebarCollapsed;try{localStorage.setItem('neuron-sidebar',sidebarCollapsed?'collapsed':'expanded');}catch{}renderSidebar();};
 $('about-project').onclick=()=>{stop();welcomeOpen=true;welcomeFromAbout=true;renderTransition();document.body.classList.add('transition-open');$('lesson-transition').showModal();if(welcomeOpen){$('transition-question').tabIndex=-1;$('transition-question').focus({preventScroll:true});$('lesson-transition').scrollTop=0;}};
 $('transition-enter').onclick=enterExperiment;
 $('transition-language').onclick=()=>$('language').click();
 $('lesson-transition').addEventListener('cancel',event=>{event.preventDefault();enterExperiment();});
 startLesson(0);
})();
