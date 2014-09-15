var start = document.getElementById('start-btn');
start.onclick = function() {
  var elements = new $.Game();
  window.game = elements;
  elements.start();
};


var respawn = document.getElementById('respawn-btn');
respawn.onclick = function() {
  window.game = null;
  var elements = new $.Game();
  window.game = elements;
  elements.start();
};

var respawn = document.getElementById('restart-btn');
respawn.onclick = function() {
  window.game = null;
  var elements = new $.Game();
  window.game = elements;
  elements.start();
};