---
title: "Realistic Face Aging with ComfyUI and Local AI"
date: "2025-03-29T19:35:00"
slug: "face-aging-with-comfyui-local"
---

### Realistic Face Aging with ComfyUI and Local AI

My daughter wanted to see what she might look like as an adult — but instead of uploading her face to some app that harvests data and sends it to who-knows-where, I decided to build a 100% local AI workflow.

Using [ComfyUI](https://github.com/comfyanonymous/ComfyUI) running on my Windows PC with GPU acceleration, I created a full image-to-image aging pipeline. It’s fast, private, and doesn't leave my machine.

---

#### 🧰 Tools Used
- **ComfyUI (Windows, GPU build)**
- `dreamshaper_8.safetensors` (base Stable Diffusion model)
- `faceaging_lora.safetensors` (downloaded from CivitAI)
- Optional: **Impact Pack** for image resizing (`Image Scale` node)

---

#### 🔧 Workflow Summary
1. **Load Image** – Import the original photo
2. **Resize Image (optional)** – Downscale to ~768x1024 for performance
3. **VAE Encode** – Convert the image to latent space
4. **Load LoRA** – Apply the face aging model at ~0.75 strength
5. **Positive Prompt**:
   ```
   photo of the same person aged 40 years, realistic aging, wrinkles around eyes and mouth, mature facial features, same pose, same clothes, same expression, ultra-realistic, photographic style, consistent lighting, natural skin texture
   ```
6. **Negative Prompt**:
   ```
   (worst quality, low quality:1.4), (bad anatomy), text, error, blurry, deformed face, cartoon, painting, drawing, unrealistic
   ```
7. **KSampler** – With denoise set to `0.5`
8. **VAE Decode** – Convert latent output back into a real image
9. **Save Image** – Store the result locally

---

#### ✅ Result
The output looks like a realistically aged version of her — same expression, same pose, aged 40 years. Best of all, her image never left my machine. No cloud processing. No creepy terms of service.

This is exactly why local AI matters — especially when kids are involved.

---

*Posted using my private GitHub-powered markdown blog workflow.*
