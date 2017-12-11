
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
}

export default Settings;
