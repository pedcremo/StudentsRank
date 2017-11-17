// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('TEST 2nd DAW', function() {
    var audioOriginal, audioMock;
    var context;

    // inject the HTML fixture for the tests
  beforeEach(function() {
    var fixture = '<div id ="fixture"><img id="profileImg"  src="images/squareWhite.png" /> '+
    '<img id="bola" style="position:absolute" src="images/squareWhite.png" />'+
    '<img id="stickLeft" style="position:absolute" src="images/stickWhite.png" />'+
    '<h2 id="playerLeft"></h2>'+
    '<p id="scorePlayerLeft">0</p>'+
    '<img id="stickRight" style="position:absolute" src="images/stickWhite.png" />'+
    '<h2 id="playerRight">v</h2>'+
    '<p id="scorePlayerRight">0</p>'+
    '<div id="vertical"></div></div>';

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);

    audioOriginal = window.Audio;
    audioMock = {play:function(){},pause:function(){}};
    window.Audio = function() { return audioMock; };

    //context = require('../src/client/context');
    //this.context_ = context;

    jasmine.clock().install();
  });
  // remove the html fixture from the DOM
  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
    window.Audio = audioOriginal;
    jasmine.clock().uninstall();
  });

  it('1. Test (3 points)', function() {
    expect(this.context_.clear).toBeDefined();
    });
});