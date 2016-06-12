"use strict";

let origHtml = null;

// Go through a sentence, wrap its characters with spans
function bounceUp_prepareText() {
  var $sentences = $('.bounce-up');
  origHtml = $sentences.html();

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
// doRestoreHtml - you may have noticed some shift after the restore. So, you can omit it.
function bounceUp(doRestoreHtml = true) {
  let sentenceCounter = 0;
  const sentenceDelay = 600;
  const spanDelay = 75;

  bounceUp_prepareText();

  $('.bounce-up').each(function() {
    var $sentence = $(this);

    // Trigger for each sentence
    setTimeout(function() {
      var $spans = $sentence.find('span');
      var spanCounter = 0;

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

  if (doRestoreHtml) {
    // Calc delay to restore html
    var restoreAfter = 0;
    $('.bounce-up').each(function() {
      var $sentence = $(this);
      var $spans = $sentence.find('span');
      var spanNum = $spans.length;
      restoreAfter += spanNum * spanDelay + sentenceDelay;
    });
    bounceUp_restoreHtml(restoreAfter, origHtml);
  }
}

function bounceUp_restoreHtml(restoreAfter, origHtml) {
  setTimeout(function () {
    let $sentences = $('.bounce-up');
    $sentences.html(origHtml);
  }, restoreAfter);
}
