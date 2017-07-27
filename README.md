# WebAligner

A simple lightweight client-side forced aligner for speech.

## Algorithm

1. Estimate the word boundaries (optionally using the length of each word)
1. Calculate the RMS energy plot of the audio
1. For each estimated word boundary, use gradient descent to find the local minimum of the RMS energy plot

## Usage

An example interface can be found [here](https://github.com/chrisbaume/webaligner-example).

```
bower install webaligner
```

```javascript
<script src="bower_components/webaligner/webaligner.js"></script>
<script>
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioData = new ArrayBuffer(2000);
  var startTime = 2.3;
  var endTime = 5.6;
  var words = "the quick brown fox jumps over the lazy dog";
  var weightByWordLength = true;
  var useTimes = function(times) {
    // do something with the timestamps
  }
  webAligner.align(audioCtx, audioData, startTime, endTime,
                     words, weightByWordLength, useTimes);
</script>
```
