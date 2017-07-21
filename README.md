# WebAligner

A client-side forced aligner for speech that attempts to find word boundaries. Works by plotting the RMS energy of the speech, then using gradient descent to find the local minimum for word boundaries.

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
