
$(document).ready(function () {
  $('.userContent').toArray().forEach(function(ugc){
    ugc = $(ugc);

    var phrase = NLP.getKeywords(ugc.text());
    if (typeof phrase !== 'undefined' && phrase.length > 0) {
      var parent = ugc.parents('.userContentWrapper');

      // Verify this isn't a "sponsored" item
      var likePageBtn = parent.find('.PageLikeButton');
      if (likePageBtn.length === 0) {
        loadVideos(phrase, parent);
      }
    }
  });
});

function loadVideos(phrase, parent) {
  $.get("http://api.5min.com/search/" + phrase + "./videos.json?sid=577").done(function(response){
    var videos = response.items;
    var videosAdded = 0;
    var video = videos[0];

    var $video = $('<div style="background-color: #EDEFF4;margin-top: 10px;padding: 10px;margin-left: 60px;margin-right: 18px;">'+
        '<span style="font-size: 14px; font-weight: bold;">Related Video From AOL</span><br/><br/>' +
        video.title + '<br/><br/>' +
        //'<a style="margin-top: 10px" target="_blank" href="' + video.player.url + '"><img height="212px" width="398px" src="' + video.image + '"></img></a>' +
        '<video style="margin-top: 10px" id="'+ video.id +'" class="aol-video-base aol-video-cat-'+ video.channel.toLowerCase +'" controls preload="auto" width="390px" height="212px" poster="'+video.image+'" data-setup=""> <source src="' + video.videoUrl + '" type="video/mp4"> </video>' +
      '</div>');

    $(parent).append($video);

  });
}

var NLP = (function(){
  var prepositions = [
    'aboard',
    'about',
    'above',
    'across',
    'after',
    'against',
    'along',
    'amid',
    'among',
    'around',
    'as',
    'at',
    'before',
    'behind',
    'below',
    'beneath',
    'beside',
    'besides',
    'between',
    'beyond',
    'by',
    'concerning',
    'considering',
    'despite',
    'down',
    'during',
    'except',
    'excepting',
    'excluding',
    'following',
    'for',
    'from',
    'in',
    'inside',
    'into',
    'like',
    'minus',
    'near',
    'of',
    'off',
    'on',
    'onto',
    'opposite',
    'outside',
    'over',
    'past',
    'per',
    'plus',
    'regarding',
    'round',
    'save',
    'since',
    'than',
    'through',
    'to',
    'toward',
    'towards',
    'under',
    'underneath',
    'unlike',
    'until',
    'up',
    'upon',
    'versus',
    'via',
    'with',
    'within',
    'without'
  ];

  var articles = [
    'the',
    'a',
    'an',
    'one',
    'some',
    'few'
  ];

  var singularWord = function(word) {
    if (word.lastIndexOf('es') == word.length - 2) {
      return word.substr(0, word.length - 2);
    } else if (word.lastIndexOf('s') == word.length - 1) {
      return word.substr(0, word.length - 1);
    } else {
      return word;
    }
  };

  var isCapitalized = function(word) {
    var firstLetter = word.substr(0, 1);
    if (firstLetter.toUpperCase() == firstLetter) {
      return true;
    }
  };

  var isPreposition = function(word) {
    return prepositions.indexOf(word) > -1;
  };

  var isArticle = function(word) {
    return articles.indexOf(word) > -1;
  };

  var isNumber = function(word) {
    return word.match(/\d/);
  }

  var isInterestingWord = function(word) {
    return !isPreposition(word) &&
           !isArticle(word) &&
           !isNumber(word) &&
           ( 
             isCapitalized(word) ||
             singularWord(word).length > 4
           )
  };

  var interestingBitsOfPhrase = function(str){
    return str
      .split(" ")
      .reduce(function(acc, word){
        if (isInterestingWord(word)) { acc.push(word); }
        return acc;
      }, [])
      .join(" ");
  };

  var getBestPhraseAcc = function(phrases) {
    if (typeof phrases == 'undefined') { return; }
    if (phrases.length == 0) { return ; }

    var first = phrases[0];
    if (first.length < 10) {
      return getBestPhraseAcc(phrases.slice(1));
    } else {
      return first;
    }
  };

  return {
    getBestPhrase: function(str) {
      var phrases = str
        .split(/[:;,!\?\.]/)
        .map(function(phrase) {
          return interestingBitsOfPhrase(phrase);
        });
      return getBestPhraseAcc(phrases);
    },

    getKeywords: function(str) {
      var blob = str.replace(/-/g, ' ').replace(/[…\.,-\/#!$%\^&\*;:{}=\-_`~()\d]/g, '');
      return blob.split(/\s/).reduce(function(acc, word){
        var l = word.length;
        if (
            (isCapitalized(word) && l > 2) ||
            (l > 8 && word.indexOf('http') !== 0)
          ) { acc.push(word); }
        return acc;
      }, []).join(" ");
    }
  };

}());