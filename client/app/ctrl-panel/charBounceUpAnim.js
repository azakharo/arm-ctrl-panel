"use strict";

// Go through a sentence, wrap its characters with spans
function bounceUp_prepareText() {
  var $sentences = $('.bounce-up');

  // Run for each sentence
  $sentences.each(function() {
    var $sentence = $(this);
    var newContent = '';

    // Go through all characters of the sentence
    for (let i = 0; i < $sentence.text().length; i++) {
      var substring = $sentence.text().substr(i, 1);

      // If we have a character, wrap it
      if (substring != " ") {
        newContent += '<span>' + substring + '</span>';
      } else {
        newContent += substring;
      }
    }

    // Replace content
    $sentence.html(newContent);
  });
}

// Go through a sentence and trigger activate state
function bounceUp_triggerAnimation() {
  var sentenceCounter = 0;
  var sentenceDelay = 600;

  $('.bounce-up').each(function() {
    var $sentence = $(this);

    // Trigger for each sentence
    setTimeout(function() {
      var $spans = $sentence.find('span');
      var spanCounter = 0;
      var spanDelay = 75;

      // Loop through all spans and activate
      $spans.each(function() {
        var $span = $(this);

        // Trigger a timeout so each span is offset
        setTimeout(function() {
          $span.toggleClass('active');
        }, (spanCounter * spanDelay));

        spanCounter++;
      });
    }, (sentenceCounter * sentenceDelay));

    sentenceCounter++;
  });
}
