"use strict";

let origHtml = null;
const bounceUpClass = 'bounce-up';

// Go through a sentence, wrap its characters with spans
function bounceUp_prepareText(selector2animate) {
  var $sentences = $(selector2animate);
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
function bounceUp(selector2animate, doRestoreHtml = true) {
  let sentenceCounter = 0;
  const sentenceDelay = 600;
  const spanDelay = 75;

  $(selector2animate).addClass(bounceUpClass);

  bounceUp_prepareText(selector2animate);

  $(selector2animate).each(function() {
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

  // Calc the anim time
  var animTime = 0;
  $(selector2animate).each(function() {
    var $sentence = $(this);
    var $spans = $sentence.find('span');
    var spanNum = $spans.length;
    animTime += spanNum * spanDelay + sentenceDelay;
  });

  if (doRestoreHtml) {
    bounceUp_restoreHtml(selector2animate, animTime, origHtml);
  }

  setTimeout(function() {
    $(selector2animate).removeClass(bounceUpClass);
  }, animTime);

}

function bounceUp_restoreHtml(selector2animate, restoreAfter, origHtml) {
  setTimeout(function () {
    let $sentences = $(selector2animate);
    $sentences.html(origHtml);
  }, restoreAfter);
}
