function Timer(seconds) {
  this.seconds = seconds;
  this.currentSeconds = null;
  this.tickId = null;
}

Timer.prototype.start = function() {
  console.log('start timer');
  this.currentSeconds = this.seconds;
  this.tickId = setInterval(this.tick.bind(this), 1000);
};

Timer.prototype.tick = function() {
  if (this.currentSeconds === 0) clearInterval(this.tickId);
  console.log(this.toString());
  this.currentSeconds--;
};

Timer.prototype.toString = function() {
  var minutes = this.currentSeconds / 60;
  var exactMinutes = Math.floor(minutes);
  var exactMinutesStr = exactMinutes.toString();
  if (exactMinutesStr.length < 2) { exactMinutesStr = '0' + exactMinutesStr; }

  var remainingSecs = Math.round((minutes - exactMinutes) * 60);
  var remainingSecsStr = remainingSecs.toString();

  if (remainingSecsStr.length < 2) { remainingSecsStr = '0' + remainingSecsStr; }

  var time = exactMinutesStr + ':' + remainingSecsStr;
  return time;
}
