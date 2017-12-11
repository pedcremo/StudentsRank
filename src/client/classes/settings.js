import {context} from '../context.js'; //Singleton
import {saveSettings} from '../dataservice.js';
import {loadTemplate} from '../lib/utils.js';
import {template} from '../lib/templator.js';

class Settings {
  constructor(weightXP,weightGP,defaultTerm,terms) {
    this.weightXP = weightXP;
    this.weightGP = weightGP;
    this.terms = terms;
    this.defaultTerm = this.getDefaultTerm(defaultTerm);
  }
  getDefaultTerm(defaultTerm) {
    if (defaultTerm) {
      this.defaultTerm = defaultTerm;
      return this.defaultTerm;
    }else {
      let out = '';
      try {
        out = this.terms[0].name;
      }catch (err) {
        out = '1st Term';
      }
      this.terms.forEach(element => {
        let dateFrom = element.begin;
        let dateTo = element.end;
        let d1 = dateFrom.split('/');
        let d2 = dateTo.split('/');

        let from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);  // -1 because months are from 0 to 11
        let to   = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
        let currentDate = new Date();
        if (currentDate > from && currentDate < to) {
          out = element.name;
        }
      });
      this.defaultTerm = out;
      return out;
    }
  }

  static getSettings() {    
    let scope={};
    let output='';
    scope.TPL_TERMS = context.settings.terms;

    for (let i = 0;i < context.settings.terms.length;i++) {
      if (context.settings.terms[i].name === context.settings.defaultTerm) { 
        output += '<option selected value="' + context.settings.terms[i].name + '">' + context.settings.terms[i].name + '</option>';
      }else {
        output += '<option value="' + context.settings.terms[i].name + '">' + context.settings.terms[i].name + '</option>';
      }
    }
    if ('ALL' === context.settings.defaultTerm) {
      output += '<option selected value="ALL">ALL</option>';
    }else {
      output += '<option value="ALL">ALL</option>';
    }
    scope.TPL_DEFAULT_TERM = output;     

    let callback = function(responseText) {
      let out = template(responseText,scope);
      $('#content').html(eval('`' + out + '`'));      
      let itemWeightChanger = $('#weightChanger');
      itemWeightChanger.val(context.settings.weightXP);
      let labelXPWeight = $('#idXPweight');
      labelXPWeight.text(context.settings.weightXP + '% XP weight');
      let labelGPWeight = $('#idGPweight');
      labelGPWeight.text(context.settings.weightGP + '% GP weight');
      $('#termsItems').change(function() {
        let optionTerm = $(this).children(':selected').val();
        context.settings.defaultTerm = optionTerm;
        saveSettings(context.settings);  
      });

      itemWeightChanger.change(function() {
          $('#idXPweight').text(itemWeightChanger.val() + '% XP weight');
          context.settings.weightXP = itemWeightChanger.val();          
          $('#idGPweight').text((100 - itemWeightChanger.val()) + '% GP weight');
          context.settings.weightGP = (100 - itemWeightChanger.val());
          saveSettings(context.settings);          
        });
      console.log('Settings: To implement');
    };
    loadTemplate('templates/settings.html',callback);
  }
}

export default Settings;
