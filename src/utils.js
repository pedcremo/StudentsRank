function hashcode(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function getElementTd(text) {
	let tdEl = document.createElement("td");
    let t = document.createTextNode(text); // Create a text node
    //liEl.setAttribute("id",hashcode(this.surname + ", " + this.name)); 
    
    tdEl.appendChild(t);
    return tdEl;
}

export {hashcode,getElementTd};

