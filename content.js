// Run our video injection at an interval.
injectAOLVideos();
setInterval(injectAOLVideos, 1000);
var videoIds = new Array();

// The setup method that will inject the photos.
function injectAOLVideos() {
	console.log("injecting");
  $('.userContentWrapper:not(.aol-modified)').each(function (idx) {
    var wrapper = $(this);
    var ugcWrapper = wrapper.find(".userContent");
    wrapper.addClass("aol-modified"); //We already checked this, don't bother checking it again

    if (isSubContent(wrapper)) {
      return;
    }

    var text = '';
    
    var sharedLink = wrapper.find('.mvm a');
    if (sharedLink.length > 0) {
      text = sharedLink.text().toLowerCase().replace(/home|page|website|homepage/g, '');
    } 
    else {
      text = ugcWrapper.text().trim();
    }

    NLP2.getKeywords(text, function(phrase){
      if (!phrase) {
        phrase = NLP.getKeywords(text);
      }
      if (phrase) {
        var likePageBtn = wrapper.find('.PageLikeButton');

        console.log(idx, " : ", text, " : ", phrase);
        // If we found keywords for a phrase, populate some thumbnails.
        if (likePageBtn.length === 0 && phrase) {
          loadThumbnails(phrase, wrapper);
        }
      }

      console.log("text:" + text + " phrase:" + phrase);
    });
  });
}

function isSubContent($element) {
  if ($element.parents('.userContentWrapper').length) {
    return true;
  }
};

// Loads thumbnails with the appropriate videos.
function loadThumbnails(phrase, wrapper) {
  $.get("http://api.5min.com/search/" + phrase + "./videos.json?sid=577").done(function(response){
    var videos = response.items;
    var video = videos[0];
    var $video = 
      $('<div class="aol-video ' + video.channel.replace(/[^\w]+/g, '-').toLowerCase() + '">' +
        '<div class="aol-logo" title="Aol On ' + video.channel + '"></div>' +
        '<img class="aol-video-thumbnail" src="' + video.image + '" title="' + video.title + ' - Aol On ' + video.channel + '" />' +
        '<div class="aol-video-thumbnail-overlay"></div>' +
        '<a class="fwb aol-video-title">' + video.title + '</a>' +
        '<span class="aol-video-description">' + video.description + '</span>' + 
        // '<video id="'+ video.id +'" class="aol-video-base controls preload="auto" width="379px" height="212px" poster="'+video.image+'" data-setup=""> <source src="' + video.videoUrl + '" type="video/mp4"> </video>' +
      '</div>');

    $video.on('click', function(event) {
      //do nothing yet
    });

    if (videoIds.indexOf(video.id) ==  -1) {
      wrapper.parent().append($video);
      videoIds.push(video.id);
    };

  }); 
}
