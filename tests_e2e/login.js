describe('Login app', () => {
    var username,password,loginbutton;
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.get('/');
        browser.sleep(2000);
        username = element(by.name('username'));
        password = element(by.name('password'));
        loginbutton = element(by.buttonText('Login'));
    });
    it ('Entrem amb admin admin',function() {
        username.sendKeys('admin');
        password.sendKeys('admin');
        loginbutton.click().then(function() {
                browser.sleep(2000);
                var addStudentLink = $('[href*="#addStudent"]');
                //var tableRanking = element(by.id('idTableRankingBody'));
                expect(addStudentLink.isDisplayed()).toBeTruthy();
                //let profileImages = element(by.className('profile')); //Image profiles TEST
                addStudentLink.click();
                browser.sleep(2000);
                username = element(by.name('firstname'));
                var surname = element(by.name('surnames'));
                username.sendKeys('Paco');
                surname.sendKeys('El Maco');
                var savebutton = element(by.buttonText('Save'));
                savebutton.click();
                browser.sleep(4000);
                var deleteStudentLink = $('[href*="##deleteStudent/-1935365642"]');
                deleteStudentLink.click();
                browser.sleep(2000);
              });
      });
  });