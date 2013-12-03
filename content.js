// Run our video injection at an interval.
injectAOLVideos();
setInterval(injectAOLVideos, 1000);

// The setup method that will inject the photos.
function injectAOLVideos() {
	console.log("injecting");
  $('.userContentWrapper:not(.aol-modified)').each(function (idx) {
    var wrapper = $(this);
    var ugc = wrapper.find(".userContent").text().trim();
    var phrase = (ugc && NLP.getKeywords(ugc));
    var likePageBtn = wrapper.find('.PageLikeButton');

  	console.log(idx, " : ", ugc, " : ", phrase);
    // If we found keywords for a phrase, populate some thumbnails.
    if (likePageBtn.length === 0 && phrase) {
      loadThumbnails(phrase, wrapper);
    }

    // Flag the wrapper so we don't deal with it again.
    wrapper.addClass("aol-modified");
  });
}

// Loads thumbnails with the appropriate videos.
function loadThumbnails(phrase, wrapper) {
  $.get("http://api.5min.com/search/" + phrase + "./videos.json?sid=577").done(function(response){
    var videos = response.items;
    var video = videos[0];
    var $video = $('<div style="background-color: #EDEFF4;margin-top: 10px;padding: 10px;margin-left: 60px;margin-right: 18px;">'+
        '<span style="font-size: 14px; font-weight: bold;">Related Video From AOL</span><br/><br/>' +
        video.title + '<br/><br/>' +
        //'<a style="margin-top: 10px" target="_blank" href="' + video.player.url + '"><img height="212px" width="398px" src="' + video.image + '"></img></a>' +
        '<video style="margin-top: 10px" id="'+ video.id +'" class="aol-video-base aol-video-cat-'+ video.channel.toLowerCase +'" controls preload="auto" width="390px" height="212px" poster="'+video.image+'" data-setup=""> <source src="' + video.videoUrl + '" type="video/mp4"> </video>' +
      '</div>');

    $video.on('click', function(event) {
      //do nothing yet
    });

    wrapper.append($video);
  }); 
}
