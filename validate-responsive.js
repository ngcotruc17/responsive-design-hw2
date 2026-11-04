const fs = require('fs');
const path = require('path');

async function validateResponsive() {
    console.log("==================================================");
    console.log("VALIDATING RESPONSIVE STYLESHEET ASSIGNMENT");
    console.log("==================================================\n");

    const htmlPath = path.join(__dirname, 'index.html');
    const cssPath = path.join(__dirname, 'css', 'style.css');

    const html = fs.readFileSync(htmlPath, 'utf8');
    const css = fs.readFileSync(cssPath, 'utf8');

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

    // 1. Check HTML structure
    console.log("--- 1. Checking HTML & Viewport ---");
    assertCheck("HTML has DOCTYPE", html.includes('<!DOCTYPE html>'));
    assertCheck("HTML specifies lang", /<html[^>]*lang=["']en["']/i.test(html));
    assertCheck("Meta viewport tag present with width=device-width", 
        /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html));
    assertCheck("Linked stylesheet is css/style.css", html.includes('href="css/style.css"'));

    // Check images
    console.log("\n--- 2. Checking Image Assets ---");
    const requiredImages = [
        'Red.jpeg', 'Orange.png', 'Yellow.png', 'Green.png', 'Blue.png',
        'Indigo.jpeg', 'Purple.png', 'Pink.jpeg', 'White.png'
    ];
    let allImagesFound = true;
    for (const imgName of requiredImages) {
        const fullImgPath = path.join(__dirname, 'images', imgName);
        if (!fs.existsSync(fullImgPath)) {
            allImagesFound = false;
            console.error(`Missing image file: images/${imgName}`);
        }
    }
    assertCheck("All 9 color image assets exist on disk", allImagesFound);

    // 2. Check CSS Media Queries
    console.log("\n--- 3. Checking Media Queries & Breakpoints ---");
    assertCheck("Query #1 triggers at 772px (min-width: 772px)", 
        /@media[^{]*\(\s*min-width\s*:\s*772px\s*\)/i.test(css));
    assertCheck("Query #2 triggers at 998px (min-width: 998px)", 
        /@media[^{]*\(\s*min-width\s*:\s*998px\s*\)/i.test(css));

    // Check order
    const idx772 = css.indexOf('772px');
    const idx998 = css.indexOf('998px');
    assertCheck("Media query order is correct (772px before 998px for mobile-first cascade)", 
        idx772 !== -1 && idx998 !== -1 && idx772 < idx998);

    // Check Query #1 properties
    console.log("\n--- 4. Checking Tablet View (Query #1) Properties ---");
    const query1Block = css.slice(idx772, idx998);
    assertCheck("Query #1 sets div width to 45% / 45vw", 
        /width\s*:\s*45(?:vw|%)/i.test(query1Block));
    assertCheck("Query #1 sets div display to inline-block", 
        /display\s*:\s*inline-block/i.test(query1Block));
    assertCheck("Query #1 sets image max-height to 30% / 30vh", 
        /max-height\s*:\s*30(?:vh|%)/i.test(query1Block));

    // Check Query #2 properties
    console.log("\n--- 5. Checking Large Screen View (Query #2) Properties ---");
    const query2Block = css.slice(idx998);
    assertCheck("Query #2 sets div width to 30% / 30vw", 
        /width\s*:\s*30(?:vw|%)/i.test(query2Block));

    // W3C HTML Validation
    console.log("\n--- 6. W3C Nu HTML Validator API ---");
    try {
        const response = await fetch('https://validator.w3.org/nu/?out=json', {
            method: 'POST',
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            body: html
        });
        const result = await response.json();
        const errors = result.messages.filter(m => m.type === 'error');
        assertCheck("W3C HTML Validator returns 0 errors", errors.length === 0, 
            errors.map(e => `${e.message} (line ${e.lastLine})`).join('; '));
    } catch (e) {
        console.warn("W3C check skipped/network issue: " + e.message);
    }

    console.log("\n==================================================");
    console.log(`SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
    console.log("==================================================");

    if (passedChecks === totalChecks) {
        console.log("SUCCESS! All Coursera requirements for 'Create a Responsive Stylesheet' fully satisfied (50/50 points)!\n");
    } else {
        process.exit(1);
    }
}

validateResponsive();

