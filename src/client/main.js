'use strict';

import {context} from './context.js'; //Singleton
import {initRouter} from './router.js';

/** Once the page is loaded we get a context app object an generate students rank view if we are logged otherwise show login template. */
window.onload = function() {
  context.isLogged();
  initRouter();
};
