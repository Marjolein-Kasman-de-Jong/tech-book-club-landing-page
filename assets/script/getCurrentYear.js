/*
 * Reusable helper for any project that needs the current year in the UI.
 * Add the class "current-year" to one or more HTML elements and load this script
 * after those elements exist in the DOM, for example before the closing </body> tag.
 * The script will automatically replace their text content with the user's current year.
 */
const currentYearElements = document.querySelectorAll(".current-year");
const currentYear = new Date().getFullYear();

currentYearElements.forEach((element) => {
  element.textContent = currentYear;
});
