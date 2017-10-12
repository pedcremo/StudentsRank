/** Hash code funtion usefull for getting an unique id based on a large text */
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


/** Pass a text or an element ang get a td table element wrapping it. */ 
function getElementTd(text) {
  let tdEl = document.createElement("td");
  let t = text;
  if (typeof text === "string" || typeof text === "number"){ 
     t = document.createTextNode(text); // Create a text node
  }    
  tdEl.appendChild(t);
   return tdEl;
}

export {hashcode,getElementTd};

