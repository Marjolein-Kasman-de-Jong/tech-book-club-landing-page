/*
 * Automatically splits a title into two visually balanced lines by inserting a <br> tag
 * at the most even word boundary based on character count.
 *
 * Usage:
 * - Add an element with the selector (class="balanced-title") to your HTML.
 * - Set the minimum viewport width (in pixels) required to apply the balancing in line 16 (0 = apply always).
 * 
 * Example:
 * <h1 class="balanced-title">This is a great title</h1>
 * 
 * Note:
 * - Best used when loaded at the end of the <body>.
*/

const minWidth = 768; // minimum viewport width (in pixels) required to apply the balancing (0 = apply always)

function balanceTitle(selector, minWidth = 0) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const originalText = el.dataset.originalText || el.textContent.trim();

    // Always store the original text so we can reset if needed
    el.dataset.originalText = originalText;

    if (window.innerWidth < minWidth) {
      // Reset to single-line version if below breakpoint
      el.textContent = originalText;
      return;
    }

    const words = originalText.split(" ");
    if (words.length < 2) return;

    let bestSplit = 1;
    let smallestDiff = Infinity;

    for (let i = 1; i < words.length; i++) {
      const firstPart = words.slice(0, i).join(" ");
      const secondPart = words.slice(i).join(" ");
      const diff = Math.abs(firstPart.length - secondPart.length);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        bestSplit = i;
      }
    }

    const firstText = document.createTextNode(words.slice(0, bestSplit).join(" "));
    const br = document.createElement("br");
    const secondText = document.createTextNode(words.slice(bestSplit).join(" "));

    el.replaceChildren(firstText, br, secondText);
  });
}

// Setup: run on load and on resize
function setupTitleBalancer(selector, minWidth = 0) {
  function apply() {
    balanceTitle(selector, minWidth);
  }

  window.addEventListener("resize", apply);
  document.addEventListener("DOMContentLoaded", apply);
}

setupTitleBalancer(".balanced-title", minWidth);