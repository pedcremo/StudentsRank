//import {context} from '../context.js'; //Singleton
//import {saveSettings} from '../dataservice.js';
import {loadTemplate} from '../lib/utils.js';
import {template} from '../lib/templator.js';
import {events} from '../lib/eventsPubSubs.js';

let settings = {};

events.subscribe('dataservice/getSettings',(obj) => {
  let settings_ = JSON.parse(obj);
  settings = new Settings(settings_.weightXP,settings_.weightGP,settings_.defaultTerm,settings_.terms);
  events.publish('settings/change',settings);
});

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
      }catch (err) {
        out = '1st Term';
      }
      this.defaultTerm = out;
      return out;
    }
  }

  static getSettings() {
    let scope = {};
    let output = '';
    scope.TPL_TERMS = settings.terms;

    for (let i = 0;i < settings.terms.length;i++) {
      if (settings.terms[i].name === settings.defaultTerm) { 
        output += '<option selected value="' + settings.terms[i].name + '">' + settings.terms[i].name + '</option>';
      }else {
        output += '<option value="' + settings.terms[i].name + '">' + settings.terms[i].name + '</option>';
      }
    }
    if ('ALL' === settings.defaultTerm) {
      output += '<option selected value="ALL">ALL</option>';
    }else {
      output += '<option value="ALL">ALL</option>';
    }
    scope.TPL_DEFAULT_TERM = output;

    let callback = function(responseText) {
      let out = template(responseText,scope);
      $('#content').html(eval('`' + out + '`'));
      let itemWeightChanger = $('#weightChanger');
      itemWeightChanger.val(settings.weightXP);
      let labelXPWeight = $('#idXPweight');
      labelXPWeight.text(settings.weightXP + '% XP weight');
      let labelGPWeight = $('#idGPweight');
      labelGPWeight.text(settings.weightGP + '% GP weight');
      $('#termsItems').change(function() {
        let optionTerm = $(this).children(':selected').val();
        settings.defaultTerm = optionTerm;
        events.publish('dataservice/saveSettings',settings);
        //saveSettings(settings);
        events.publish('settings/change',settings);
      });

      itemWeightChanger.change(function() {
          $('#idXPweight').text(itemWeightChanger.val() + '% XP weight');
          settings.weightXP = itemWeightChanger.val();
          $('#idGPweight').text((100 - itemWeightChanger.val()) + '% GP weight');
          settings.weightGP = (100 - itemWeightChanger.val());
          //saveSettings(settings);
          events.publish('dataservice/saveSettings',settings);
          events.publish('settings/change',settings);
        });
      console.log('Settings: To implement');
    };
    loadTemplate('templates/settings.html',callback);
  }
}

export default Settings;
