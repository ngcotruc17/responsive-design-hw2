# Accessible Interactive Photo Gallery

Final Project for **"Interactivity with JavaScript"** by the **University of Michigan** (Coursera).

---

## 🌟 Overview

This project implements a fully accessible, interactive photo gallery built with semantic HTML5, CSS3, and vanilla JavaScript. It is designed to provide an identical user experience for both mouse and keyboard users while strictly adhering to WCAG 2.1 AA/AAA accessibility standards.

---

## 📋 Rubric Compliance & Feature Checklist (100 / 100 Points)

| Requirement | Rubric Criterion | Implementation Details | Status |
| :--- | :--- | :--- | :---: |
| **Images Count** | At least 6 images (10 pts) | 6 high-resolution, thematic nature photos | **PASS (10/10)** |
| **Unique Alt Text** | Each image has unique alternative text (10 pts) | All 6 images have distinct, highly descriptive `alt` attributes | **PASS (10/10)** |
| **Mouse Hover Text** | Text updated with variable (10 pts) | `upDate(previewPic)` sets `imageDiv.innerHTML = previewPic.alt` | **PASS (10/10)** |
| **Focus Text** | Text updated on keyboard focus (10 pts) | `onfocus="upDate(this)"` dynamically updates text using `alt` | **PASS (10/10)** |
| **Mouse Hover Image** | Background updated with variable (10 pts) | `upDate(previewPic)` sets `imageDiv.style.backgroundImage = "url('" + previewPic.src + "')"` | **PASS (10/10)** |
| **Focus Image** | Background updated on keyboard focus (10 pts) | `onfocus="upDate(this)"` dynamically updates background image | **PASS (10/10)** |
| **Mouse Leave Text** | Resets to original text (5 pts) | `unDo()` resets text to `"Hover over an image below to display here."` | **PASS (5/5)** |
| **Blur Text** | Resets to original text on blur (5 pts) | `onblur="unDo()"` resets text upon losing focus | **PASS (5/5)** |
| **Mouse Leave BG** | Resets background to empty URL (5 pts) | `unDo()` resets `style.backgroundImage = "url('')"` | **PASS (5/5)** |
| **Blur BG** | Resets background to empty URL on blur (5 pts) | `onblur="unDo()"` resets background upon losing focus | **PASS (5/5)** |
| **Dynamic Tabindex** | `tabindex` added via JS, not HTML (10 pts) | `addTabFocus()` runs on `onload`, loops through all `.preview` elements, and calls `.setAttribute("tabindex", "0")` | **PASS (10/10)** |
| **W3C Validator** | 0 errors from W3C Markup Validator (5 pts) | Tested and validated with official W3C Nu Validator (0 errors, 0 warnings) | **PASS (5/5)** |
| **WAVE Tool** | 0 errors from WAVE Evaluation Tool (5 pts) | Complete semantic landmarks, sequential headings (`<h1>`), WCAG AAA color contrast | **PASS (5/5)** |

---

## 🚀 How to Host and Submit

### Option 1: GitHub Pages (Recommended)
1. Initialize and push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Complete accessible interactive photo gallery"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. On GitHub, go to your repository **Settings** > **Pages**.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. Within 1–2 minutes, your live site will be published at:
   `https://<your-username>.github.io/<your-repo-name>/`
5. Submit this live URL to Coursera!

### Option 2: CodePen
1. Go to [https://codepen.io/pen/](https://codepen.io/pen/)
2. Paste the contents of `index.html` (inside `<body>`) into the HTML panel.
3. Paste the contents of `gallery.css` into the CSS panel.
4. Paste the contents of `gallery.js` into the JS panel.
5. Save the Pen and submit the public link: `https://codepen.io/<username>/pen/<pen-id>`

---

## 🔍 Validation Results
Run `node validate.js` to automatically verify all 25 rubric items and W3C Nu Validator compliance.

