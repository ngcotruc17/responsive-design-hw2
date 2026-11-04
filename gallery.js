/* gallery.js - JavaScript functions for Accessible Interactive Photo Gallery */

/**
 * Called on mouseover and onfocus events.
 * Updates the large image container with the hovered or focused image's src and alt text.
 * @param {HTMLElement} previewPic - The thumbnail image element triggered.
 */
function upDate(previewPic) {
    // Determine the active element (supports direct element argument, this, or event object)
    var element = previewPic || this;
    if (element && element.target) {
        element = element.target;
    }

    console.log("upDate triggered for: " + element.alt + " (src: " + element.src + ")");

    var imageDiv = document.getElementById("image");
    // 1) Update the background image URL to the source of the preview image
    imageDiv.style.backgroundImage = "url('" + element.src + "')";
    // 2) Update the text of the div to the alt text of the preview image
    imageDiv.innerHTML = element.alt;
}

/**
 * Called on mouseleave and onblur events.
 * Resets the large image container back to its original state (empty URL and initial prompt text).
 */
function unDo() {
    console.log("unDo triggered - resetting display");

    var imageDiv = document.getElementById("image");
    // 1) Update the background image back to an empty URL
    imageDiv.style.backgroundImage = "url('')";
    // 2) Update the text of the div back to the original text
    imageDiv.innerHTML = "Hover over an image below to display here.";
}

/**
 * Called on window/body load.
 * Dynamically adds the tabindex attribute to all preview images using a for loop.
 * This ensures keyboard users can tab through the gallery without hardcoding tabindex into the HTML.
 */
function addTabFocus() {
    console.log("Page load event triggered: executing addTabFocus()");

    // Select all images with class 'preview'
    var images = document.querySelectorAll(".preview");

    // Loop through each image to dynamically assign tabindex="0"
    for (var i = 0; i < images.length; i++) {
        console.log("Adding tabindex='0' to image " + (i + 1) + ": " + images[i].alt);
        images[i].setAttribute("tabindex", "0");
    }
}

// Fallback: Also attach addTabFocus to window.onload to ensure it runs across all browsers
window.onload = addTabFocus;

