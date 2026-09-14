# Models served to the browser

| File | What | Source | License |
| --- | --- | --- | --- |
| `u2netp.onnx` | U²-Net-p — the 4.6 MB "small" salient-object segmentation network (fixed 320×320 input) used by the Background Remover | Qin et al., *U²-Net: Going Deeper with Nested U-Structure for Salient Object Detection* (Pattern Recognition, 2020); ONNX export as published by the `rembg` project | Apache-2.0 |

The weights are fetched by the page on first use and cached by the browser;
they never run anywhere but on the visitor's machine.
