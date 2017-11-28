'use strict';

import {context} from './context.js'; //Singleton mantains coordinated all classes involved in the app
import {initRouter} from './router.js'; //Knows what to do for every single URL 

/** Once the page is loaded we get a context app object an generate students rank view if we are logged otherwise show login template. */
$(document).ready(function(){
  context.isLogged();
  initRouter();
  
});
