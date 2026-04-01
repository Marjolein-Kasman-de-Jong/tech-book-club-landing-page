/*
 * Automatically splits a title into two visually balanced lines by inserting a <br> tag
 * at the most even word boundary based on character count, while preserving inline HTML
 * such as <strong>, <em>, <span>, etc.
 *
 * Usage:
 * - Add an element with the selector (class="balanced-title") to your HTML.
 * - Set the minimum viewport width (in pixels) required to apply the balancing in line 18 (0 = apply always).
 *
 * Example:
 * <h1 class="balanced-title">This is a <strong>great</strong> title</h1>
 *
 * Note:
 * - Best used when loaded at the end of the <body>.
 */

const minWidth = 768; // minimum viewport width (in pixels) required to apply the balancing (0 = apply always)

function getTextNodes(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        if (
          node.parentElement &&
          ["SCRIPT", "STYLE"].includes(node.parentElement.tagName)
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let currentNode;

  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  return textNodes;
}

function getWordPartsFromTextNodes(textNodes) {
  const wordParts = [];

  textNodes.forEach((node) => {
    const pieces = node.textContent.split(/(\s+)/);

    pieces.forEach((piece) => {
      if (piece.trim() !== "") {
        wordParts.push({
          node,
          text: piece
        });
      }
    });
  });

  return wordParts;
}

function insertBreakAtWordBoundary(element, splitIndex) {
  const textNodes = getTextNodes(element);
  const wordParts = getWordPartsFromTextNodes(textNodes);

  if (splitIndex <= 0 || splitIndex >= wordParts.length) {
    return;
  }

  const splitPart = wordParts[splitIndex];
  const targetNode = splitPart.node;
  const targetText = targetNode.textContent;

  let currentWordIndex = 0;
  let splitOffset = -1;

  const matches = [...targetText.matchAll(/\S+/g)];

  for (const match of matches) {
    if (currentWordIndex === 0) {
      // we count globally below
    }
  }

  let globalWordIndex = 0;

  for (const node of textNodes) {
    const nodeText = node.textContent;
    const nodeMatches = [...nodeText.matchAll(/\S+/g)];

    for (const match of nodeMatches) {
      if (globalWordIndex === splitIndex) {
        splitOffset = match.index;
        break;
      }
      globalWordIndex++;
    }

    if (node === targetNode && splitOffset !== -1) {
      break;
    }
  }

  if (splitOffset === -1) {
    return;
  }

  const beforeText = targetText.slice(0, splitOffset).replace(/\s+$/, "");
  const afterText = targetText.slice(splitOffset).replace(/^\s+/, "");

  const beforeNode = document.createTextNode(beforeText);
  const br = document.createElement("br");
  const afterNode = document.createTextNode(afterText);

  targetNode.parentNode.insertBefore(beforeNode, targetNode);
  targetNode.parentNode.insertBefore(br, targetNode);
  targetNode.parentNode.insertBefore(afterNode, targetNode);
  targetNode.remove();
}

function balanceTitle(selector, minWidth = 0) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const originalHtml = el.dataset.originalHtml || el.innerHTML.trim();
    el.dataset.originalHtml = originalHtml;

    if (window.innerWidth < minWidth) {
      el.innerHTML = originalHtml;
      return;
    }

    el.innerHTML = originalHtml;

    const fullText = el.textContent.trim().replace(/\s+/g, " ");
    const words = fullText.split(" ");

    if (words.length < 2) {
      return;
    }

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

    insertBreakAtWordBoundary(el, bestSplit);
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