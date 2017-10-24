'use strict';

import {context} from './context.js';

/** Once the page is loaded we get a context app object an generate students rank view. */
window.onload = function() {
  context.initMenu();
  context.getTemplateRanking();
};
