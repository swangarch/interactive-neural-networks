# Interactive Neural Networks

A bilingual, interactive introduction to neural networks. Built with plain HTML, CSS, and JavaScript, with no runtime dependencies, external fonts, or remote services. The interface supports English and Chinese. Monetary examples use euros (€); measurements use metric units and hours.

## Run locally

Open `index.html` in a browser to use the app offline. No installation or server is required.

Alternatively, with Node.js/npm and Python 3 installed, run:

```sh
npm start
```

Visit http://127.0.0.1:4173 while the server is running. Any static file server can also serve this directory.

## Deploy to GitHub Pages

In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the source. Push to `main`, or run **Deploy to GitHub Pages** manually from the Actions tab.

The workflow runs the model tests, packages only the six browser assets, and publishes the site after the tests pass. No dependencies or compilation are required. Relative asset URLs support GitHub Pages project paths as well as local files. Future pushes to `main` deploy automatically.

## Ten experiments

| Lesson | What you explore |
| --- | --- |
| 1. Linear regression | Manually adjust a single neuron's weight and bias to predict test scores from study time. |
| 2. MSE loss | Select a sample, inspect its signed error and squared error, then average all 15 squared errors. |
| 3. Gradient descent | Explore the exact weight–bias–MSE surface and its gradients, then take individual steps or automatically train the linear model. |
| 4. Activation function | Give a single neuron a bend with ReLU. Toggle activation and compare straight and bent predictions using identical parameters. |
| 5. Nonlinear regression | Explore a U-shaped ramp with 1–3 hidden layers and 1–9 neurons per layer. Adjust every weight and bias. |
| 6. Neural gradient descent | Fit three daily café traffic peaks and local fluctuations with a default nine-neuron hidden layer. |
| 7. Sigmoid & cross-entropy | Adjust a raw score, switch the true label, compare confidence levels, and take a gradient step. |
| 8. Classification | Predict fruit categories from weight using sigmoid probabilities, binary cross-entropy, and classification accuracy. |
| 9. Many inputs & labels | Explore four fruit features through a selectable 2D projection, a three-class prediction, and independent trait labels. |
| 10. Autoregressive generation | Choose a next token, append it to the text, and repeat with updated conditional probabilities. |

### MSE: error, square, average

The second lesson explains loss using the first lesson’s student data. Every data point connects vertically to the prediction line with a dashed residual. The right card turns the selected gap into a square, whose area represents squared error, then lists all 15 squared terms and their sum divided by 15. Click an error term or data point to select a sample; section 05 shows its signed error, squared error, contribution to MSE, and the sum divided by 15. Moving the parameters updates the full calculation. Selecting a sample alone does not change the loss. MSE does not take a square root; RMSE is the square root of MSE. Student data have a positive overall trend with larger deterministic scatter and exceptions. The linear lessons target MSE below 0.018; their best-fitting line still has residual error.

### Gradient: a map of the loss

The third lesson keeps the first lesson's student data and linear model, but starts farther from the minimum at `w = −1`, `b = −0.6` so the descent is easier to observe. The upper-right card replaces loss history with a three-dimensional surface: weight and bias are ground coordinates, and height is the exact MSE over all 15 samples.

Drag horizontally on the plot to rotate the view (the elevation stays fixed), or use the camera slider, click a surface tile to select its center's parameters, or use the weight and bias sliders (also keyboard accessible). A red point marks the current model. Blue and red cross-sections hold bias and weight fixed respectively; their slopes at the current point are the two partial derivatives. Thin tangent arrows point toward increasing w and b, with both derivative values shown directly on the plot. The thick arrow shows descent along the negative gradient. Explanations, formulas, and live derivative values appear below the workspace in section 05, leaving the upper-right card focused on the plot and view control. The blue arrow illustrates the negative gradient direction, with display length scaled for readability. Take a training step to see the model move downhill.

The gradient points toward the steepest local increase in the parameter plane; its negative points downhill. This example has a convex quadratic loss surface, so its stationary point is the global minimum. The surface uses a linear height scale, and rotating the camera changes only the view, not the parameters.

### Activation: one neuron, one bend

The fourth lesson uses 25 synthetic parking stays: the first 2 hours are free, then parking costs €6 per additional hour, billed continuously with no cap. The real-world fee is `F = max(0, 6t - 12)`. For the model, `x = t / 6` and `y = F / 30`, giving:

```text
x ∈ [0, 1]
y = max(0, 1.2x − 0.4)
```

With activation disabled, the neuron predicts `ŷ = wx + b`. Enabling ReLU changes its output to `ŷ = max(0, wx + b)`: negative values become zero, while positive values remain unchanged. For a nonzero weight, the bend occurs at `x = −b/w`.

Both predictions appear on the same chart: solid blue for the current mode and dashed red for the other mode. The comparison panel shows each mode's MSE for the same weight and bias. Toggling activation preserves these parameters and starts a fresh training history. Manual adjustments, single training steps, and automatic training update the comparison immediately. Setting `w = 1.2` and `b = −0.4` reproduces the target exactly with ReLU enabled. On entry or reset, the lesson samples a weight between 0.35 and 0.55 and a hinge between 0.55 and 0.75, setting `b = -w * hinge`. This produces a clearly underfitting start with an active region, so ReLU can learn. Toggling activation preserves the sampled parameters.

### Complex traffic: three daily peaks

Lesson 06 uses 25 deterministic samples with morning, lunch, and evening peaks, quiet intervals, and small local fluctuations. Its default architecture is one hidden layer of nine neurons with learning rate 0.02. The architecture-dependent MSE target is about 0.001793. In browser checks, the default experiment reached that target in approximately 10.4 seconds; stopping still depends only on the objective.

For single-layer regression networks with at least six neurons, initialization multiplies first-layer weights and biases by six and divides output weights by six. This preserves the initial prediction function while helping the wider network learn local peaks without collapsing its first-layer features together.

### Sigmoid and cross-entropy

The new lesson 07 bridges regression and classification with a single raw score `z` and a true fruit label `y`:

- Drag `z` from -6 to 6 to move along `p = sigmoid(z)` and the corresponding cross-entropy curve.
- Switch the true label between orange (`y = 0`) and pomelo (`y = 1`) without changing the prediction.
- Select probabilities 0.1, 0.5, and 0.9 to compare uncertain, confidently correct, and confidently wrong predictions.
- Take a step with `z ← z - 0.5(p - y)` and watch the probability assigned to the true class increase as loss decreases. This demonstration clamps z to the slider range.

The two top charts show Sigmoid and binary cross-entropy. Section 05 connects their equations and explains the natural logarithm and the gradient `p - y`. For example, `p = 0.9` gives loss about 0.105 for a pomelo but 2.303 for an orange. The following classification lesson averages this loss across its fruit dataset.

### Multidimensional inputs, multiclass outputs, and multilabel outputs

Lesson 09 uses four normalized fruit measurements: weight, sweetness, water content, and firmness. A fixed illustrative ReLU network has two output heads. The variety head uses Softmax to distribute 100% across orange, pomelo, and apple. The trait head uses independent Sigmoids for sweet, juicy, and firm, so several labels may be present at once and their probabilities do not have to sum to 100%.

Adjust all four input sliders or select a synthetic fruit. Choose which two features appear on the scatter plot. The selection ring matches the selected fruit’s category; custom inputs use the predicted category color. A live network diagram shows four inputs, eight hidden neurons, and three outputs. Node intensity reflects activation, and output colors match the probability bars. Switching between variety and traits displays the corresponding output connections. Changing an unplotted feature can change the prediction without moving the point, illustrating why a 2D projection cannot show the entire input. This lesson uses fixed example weights, not an automatically trained fruit identifier.

### Autoregressive decoding: classify, append, repeat

Lesson 10 visualizes existing text → a neural-network illustration → next-token probabilities. Choose a candidate manually, take one generation step, or auto-generate. Compare always selecting the most likely candidate with sampling by probability, and compare sunny-day and rainy-day prompts. Generated tokens are appended to the input; every subsequent distribution is recomputed from the updated prefix. A step history records each choice and its probability. Undo removes the last choice; generation stops on the end marker and pauses when leaving the lesson.

This is a small, explicitly illustrative vocabulary with preset context-dependent probabilities, not a trained general-purpose language model. It isolates the decoding loop without introducing any particular language-model architecture. English and Chinese labels share the same token choices and probability state. Tokens are displayed as words or short phrases to make the process legible.

## Interface and interaction

- **Question transitions:** Each lesson opens with a full-screen, bilingual question that sets up its experiment. Choose “Explore” (or press Escape) to enter. Reset restores the experiment directly without replaying the transition; the activation lesson draws a new initial weight and bias. The activation question introduces free parking followed by an hourly fee, matching the zero floor and linear growth of ReLU.
- **Collapsible left navigation:** Switch freely between all ten lessons. Collapse the sidebar to numbered buttons; hover or use accessible button labels to identify each lesson. Narrow screens default to collapsed navigation unless a saved preference exists.
- **Live charts:** Adjust sliders to update predictions and loss. Select a data point to inspect its connection to the network.
- **Network and equations:** Each neuron has an explicit equation, such as `h₁ = ReLU(w₁ × X₁ + b₁)`. Later layers reference earlier outputs. Select a neuron to highlight its equation, or click a weight or bias in an equation to focus its slider.
- **Training controls:** The auto-train and single-step buttons sit at the top of the parameter card, above the learning rate, architecture, and parameter sliders. The current stopping target is displayed directly below the buttons. Train one step at a time or automatically, with an adjustable learning rate in supported lessons. The linear gradient descent and activation lessons default to a learning rate of 0.02, with updates every 120 ms. Activation pauses below MSE 0.0005; the noisy student regression pauses below 0.018. The complex network regression defaults to 0.02 and classification to 0.05. Auto-training gradually increases the number of steps per frame for all trainable lessons, including the randomized activation experiment. It pauses only when the loss target is reached: MSE < 0.003 for network regression, or 100% accuracy together with cross-entropy < 0.08 for classification. For the two trainable network lessons, these base thresholds are multiplied by `sqrt(10 / P)`, where `P` is the total number of weights and biases. The three-neuron reference network has 10 parameters; the default nine-neuron traffic network has 28. Increasing depth or width strictly lowers the target. Classification still also requires 100% accuracy. All four trainable lessons are calibrated to take roughly 10 seconds with their initial parameters. There is no timer-based stopping rule: changing the architecture, parameters, or learning rate can extend training, and fitting takes priority over duration.

- **Reset:** Stop training and restore the current lesson's initial architecture, parameters, activation mode, learning rate, and selected sample. Reset also clears training history while retaining language and sidebar preferences.
- **Local preferences:** Language and sidebar state are saved locally when browser storage is available. Training data stays in the browser.

The visual design uses a warm white background, ink blue weights, and dark red biases and loss. Network connections use solid lines for positive weights and dashed lines for negative weights.

## Model details

All datasets are generated deterministically for teaching; they are not real survey results. Regression uses mean squared error on scaled values, while classification uses binary cross-entropy.

Hidden layers use ReLU. Regression output layers are linear, except for the activation lesson's switchable ReLU output. Classification uses a sigmoid output. Training computes full-batch analytical gradients and uses backtracking to reduce the step size when needed to avoid increasing loss. The interface reports a reduced learning rate when one is used. ReLU uses a zero subgradient at its kink.

## Validation

With Node.js installed, run:

```sh
npm test
```

The fifteen model tests cover analytical gradients against finite differences, ReLU behavior and its zero subgradient, convergence for linear regression and café traffic, classification accuracy, and the single-neuron activation comparison. The activation test checks exact fitting with ReLU, the remaining error without it, gradients in both modes, and training convergence. Additional tests check the MSE surface and its derivatives, architecture-dependent targets, three distinct traffic peaks, stable binary cross-entropy for extreme logits, and loss reduction from the Sigmoid/cross-entropy gradient step.

## Files

- `index.html`: Page structure.
- `style.css`: Responsive layout and visual styles.
- `app.js`: Lessons, bilingual copy, charts, controls, and navigation.
- `model.js`: Datasets, forward passes, losses, gradients, and training.
- `model.mjs`: ES module adapter for the shared model.
- `advanced-model.js` / `advanced-model.mjs`: Illustrative multidimensional predictions and conditional next-token distributions.
- `advanced-lessons.js`: Higher-dimensional input and autoregressive decoding interfaces.
- `model.test.js`: Model tests using Node's built-in test runner.
