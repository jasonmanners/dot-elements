var start = document.getElementById('start');
start.onclick = function() {
  var elements = new $.Game();
  elements.start();
  document.getElementById('pause-pane').style.display = 'none';
}
