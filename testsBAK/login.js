describe('Login app', () => {
    var username,password,loginbutton;
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.get('/');
        username = element(by.name('username'));
        password = element(by.name('password'));
        loginbutton = element(by.buttonText('Login'));
    });
    it ('Entrem amb admin admin',function() {
        username.sendKeys('admin');
        password.sendKeys('admin');
        loginbutton.click().then(function() {
                browser.sleep(2000);
                var tableRanking = element(by.id('idTableRankingBody'));
                expect(tableRanking.isDisplayed()).toBeTruthy();
                let profileImages = element(by.className('profile')); //Image profiles TEST
              });
      });
  });