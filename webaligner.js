var webAligner = (function()
{
  var exports = {};

  function descend(array, startPos)
  {
    var pos = startPos;
    var min = array[pos];
    while (true) {
      var bottom = true;
      var newPos = pos;
      if (pos>0) {
        if (array[pos-1] < min) {
          min=array[pos-1];
          newPos--;
          bottom = false;
        }
      }
      if (pos<array.length-1) {
        if (array[pos+1] < min) {
          min = array[pos+1];
          newPos++;
          bottom = false;
        }
      }
      pos = newPos;
      if (bottom) break;
    }
    return pos;
  }

  exports.align = function(audioCtx, audioData, startTs, endTs, words, weight, cb)
  {
    var blockLen = 0.025; // 100ms block size
    var stepLen = 0.01; // 20ms step size
    var duration = endTs-startTs;
    var startStep = Math.floor((startTs-(blockLen/2))/stepLen);
    var endStep = Math.floor((endTs-(blockLen/2))/stepLen);
    var steps = endStep-startStep;
    var blockSize = Math.floor(blockLen*audioCtx.sampleRate);
    var stepSize = Math.floor(stepLen*audioCtx.sampleRate);

    wordArray = words.split(" ");
    var characters = words.length-wordArray.length+1;
    if (wordArray.length<2) return console.log("Need at least two words!");
    wordStepPos = [];
    if (weight) {
      var position = 0;
      for (i=0; i<wordArray.length-1; i++) {
        position += wordArray[i].length;
        wordStepPos.push(Math.floor(position/characters*steps));
      }
    } else {
      for (i=1; i<wordArray.length; i++) {
        wordStepPos.push(Math.floor(i/wordArray.length*steps));
      }
    }

    // draw energy
    audioCtx.decodeAudioData(audioData, function(decodedData)
    {
      var audio = decodedData.getChannelData(0);
      var totalDuration = decodedData.duration;
      if (endTs>totalDuration) return console.log('End time after end of file');
      var rms = [];

      for (stepNum = startStep; stepNum < endStep; stepNum++) {
        var blockTotal = 0.0;
        for (i=0; i<blockSize; i++) {
          var sample = audio[(stepSize*stepNum)+i];
          blockTotal += sample*sample;
        }
        rms.push(Math.sqrt(blockTotal/blockSize));
      }

      var times = [];
      times.push(startTs);
      for (i=0; i<wordStepPos.length; i++) {
        wordStepPos[i] = descend(rms, wordStepPos[i]);
        times.push(startTs + (wordStepPos[i]/steps*duration));
      }
      times.push(endTs);
      cb(times);
    });
  }
  return exports;
}());
