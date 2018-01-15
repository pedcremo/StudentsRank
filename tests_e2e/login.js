describe('Login app', () => {
    var username,password,loginbutton;
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        browser.get('/');
        browser.sleep(4000);
        username = element(by.name('username'));
        password = element(by.name('password'));
        loginbutton = element(by.buttonText('Login'));
    });
    it ('Entrem amb admin admin',function() {
        username.sendKeys('admin');
        password.sendKeys('admin');
        loginbutton.click().then(function() {
                browser.sleep(2000);
                
                element(by.id('newSubject')).isPresent().then(function(result) {
                    if ( result ) {
                        //Whatever if it is true (displayed)
                        console.log('JJJJJJJJJJ');
                        var subjectname = element(by.id('subjectName'));
                        subjectname.sendKeys('prova');
                        var newSubject = element(by.id('newSubjectInput'));
                        
                        newSubject.click().then(function(){
                            browser.sleep(2000);
                            console.log('PLICK CLICK CLICK');
                            addStudent('Paco','ElMaco');
                            addStudent('Juanito','Reina');
                            deleteStudent('480131812');
                        });
                    }else{
                        addStudent('Paco','ElMaco');
                        addStudent('Juanito','Reina');
                        deleteStudent('480131812');
                    }
                });              
                
              });
      });
  });

  function addStudent(name_,surname_) {
    var addStudentLink = $('[href*="#addStudent"]');
    //var tableRanking = element(by.id('idTableRankingBody'));
    expect(addStudentLink.isDisplayed()).toBeTruthy();
    //let profileImages = element(by.className('profile')); //Image profiles TEST
    addStudentLink.click();
    browser.sleep(2000);
    username = element(by.name('firstname'));
    var surname = element(by.name('surnames'));
    username.sendKeys(name_);
    surname.sendKeys(surname_);
    var savebutton = element(by.buttonText('Save'));
    savebutton.click();
    browser.sleep(4000);    
  }

  function deleteStudent(id) {
    var deleteStudentLink = $('[href*="#deleteStudent/'+ id +'"]');
    deleteStudentLink.click();
    browser.sleep(2000);
    browser.switchTo().alert().then(function (alert) {
        
                alert.accept();
                return browser.get('/');
        
    });
    browser.sleep(2000);
  }