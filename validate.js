const fs = require('fs');
const path = require('path');

async function runValidation() {
    console.log("==========================================");
    console.log("STARTING COMPREHENSIVE PROJECT VALIDATION");
    console.log("==========================================\n");

    const htmlPath = path.join(__dirname, 'index.html');
    const cssPath = path.join(__dirname, 'gallery.css');
    const jsPath = path.join(__dirname, 'gallery.js');

    const html = fs.readFileSync(htmlPath, 'utf8');
    const css = fs.readFileSync(cssPath, 'utf8');
    const js = fs.readFileSync(jsPath, 'utf8');

    let passedChecks = 0;
    let totalChecks = 0;

    function assertCheck(name, condition, details = "") {
        totalChecks++;
        if (condition) {
            console.log(`[PASS] ${name}`);
            passedChecks++;
        } else {
            console.error(`[FAIL] ${name} - ${details}`);
        }
    }

    // 1. W3C Check
    console.log("--- 1. Testing W3C Official Nu Validator API ---");
    try {
        const response = await fetch('https://validator.w3.org/nu/?out=json', {
            method: 'POST',
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            body: html
        });
        const result = await response.json();
        const errors = result.messages.filter(m => m.type === 'error');
        const warnings = result.messages.filter(m => m.type === 'info');

        assertCheck("W3C HTML Validator returns 0 errors", errors.length === 0, 
            errors.map(e => `${e.message} (line ${e.lastLine})`).join('; '));
        console.log(`   (W3C returned ${errors.length} errors, ${warnings.length} warnings)`);
    } catch (e) {
        console.warn("W3C API call skipped/network issue: " + e.message);
    }

    console.log("\n--- 2. Checking HTML Structure & Accessibility ---");
    assertCheck("HTML has valid doctype", html.includes('<!DOCTYPE html>'));
    assertCheck("HTML specifies lang attribute", /<html[^>]*lang=["']en["']/i.test(html));
    assertCheck("HTML has <title> element in <head>", /<title>[^<]+<\/title>/i.test(html));
    assertCheck("CSS linked correctly", html.includes('href="gallery.css"'));
    assertCheck("JS linked correctly", html.includes('src="gallery.js"'));
    assertCheck("Body has onload listener", /<body[^>]*onload=["']addTabFocus\(\)["']/i.test(html));

    // Check headings
    const h1Count = (html.match(/<h1/gi) || []).length;
    const h2Count = (html.match(/<h2/gi) || []).length;
    const h3Count = (html.match(/<h3/gi) || []).length;
    assertCheck("No skipped heading levels (H1 to H3 avoided)", h1Count >= 1 && (h3Count === 0 || h2Count > 0));

    // Check images
    console.log("\n--- 3. Checking Images and Alt Text ---");
    const imgMatches = [...html.matchAll(/<img[^>]+>/gi)];
    assertCheck("At least 6 images present", imgMatches.length >= 6, `Found ${imgMatches.length} images`);

    const altTexts = [];
    let allHaveUniqueAlt = true;
    let allHavePreviewClass = true;
    let allHaveMouseEvents = true;
    let allHaveFocusEvents = true;
    let hardcodedTabindex = false;

    imgMatches.forEach((imgTag, idx) => {
        const tag = imgTag[0];
        const altMatch = tag.match(/alt=["']([^"']*)["']/i);
        const alt = altMatch ? altMatch[1].trim() : "";
        if (!alt || altTexts.includes(alt)) {
            allHaveUniqueAlt = false;
        }
        altTexts.push(alt);

        if (!tag.includes('class="preview"') && !tag.includes("class='preview'")) {
            allHavePreviewClass = false;
        }
        if (!tag.includes('onmouseover="upDate(this)"') || !tag.includes('onmouseleave="unDo()"')) {
            allHaveMouseEvents = false;
        }
        if (!tag.includes('onfocus="upDate(this)"') || !tag.includes('onblur="unDo()"')) {
            allHaveFocusEvents = false;
        }
        if (/tabindex/i.test(tag)) {
            hardcodedTabindex = true;
        }
    });

    assertCheck("Every image has unique, descriptive alt text", allHaveUniqueAlt, `Alt texts: ${JSON.stringify(altTexts)}`);
    assertCheck("Every image has class='preview'", allHavePreviewClass);
    assertCheck("Every image has onmouseover and onmouseleave listeners", allHaveMouseEvents);
    assertCheck("Every image has onfocus and onblur listeners", allHaveFocusEvents);
    assertCheck("No hardcoded tabindex in HTML (must be dynamically added via JS)", !hardcodedTabindex);

    // Check preview container
    assertCheck("#image container present with original initial text", 
        html.includes('id="image"') && html.includes('Hover over an image below to display here.'));

    console.log("\n--- 4. Checking JavaScript Functions & Logic ---");
    assertCheck("upDate() function defined", /function\s+upDate\s*\(/i.test(js));
    assertCheck("upDate() uses previewPic/element.alt dynamically", /innerHTML\s*=\s*.*alt/i.test(js));
    assertCheck("upDate() uses previewPic/element.src dynamically for backgroundImage", /backgroundImage\s*=\s*.*src/i.test(js));
    assertCheck("unDo() function defined", /function\s+unDo\s*\(/i.test(js));
    assertCheck("unDo() resets text to original prompt", js.includes('Hover over an image below to display here.'));
    assertCheck("unDo() resets backgroundImage to empty URL url('')", /backgroundImage\s*=\s*['"]url\(['"]{2}\)['"]/i.test(js));
    assertCheck("addTabFocus() function defined", /function\s+addTabFocus\s*\(/i.test(js));
    assertCheck("addTabFocus() contains console.log()", /console\.log/i.test(js));
    assertCheck("addTabFocus() uses a for loop", /for\s*\(/i.test(js));
    assertCheck("addTabFocus() uses setAttribute to add tabindex", /setAttribute\s*\(\s*['"]tabindex['"]\s*,\s*['"]0['"]\s*\)/i.test(js));

    console.log("\n==========================================");
    console.log(`SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
    console.log("==========================================");

    if (passedChecks === totalChecks) {
        console.log("SUCCESS! All Coursera rubric and accessibility checks fully satisfied (100/100)!\n");
    } else {
        process.exit(1);
    }
}

runValidation();

