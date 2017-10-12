'use strict';

import Context from './context.js';

/** Once the page is loaded we get a context app object an generate students rank view. */
window.onload = function() {
  let context = new Context();
  context.getRanking();
}