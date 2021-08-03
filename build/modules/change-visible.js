/**
 * change the visibility of an element with the specified id
 * @param {string} id target element id
 * @param {boolean} state `true` for `block` and `false` for `none`
 * @returns {void}
 */
function change(id) {
  var el = document.getElementById(id)
  el.style.display = (el.style.display !== "block") ? "block" : "none"
}