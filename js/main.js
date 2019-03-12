var nextVid = 'Atp-j69X96Q';

$(document).ready(function () {

	// Submit button
	$('#search-term').submit(function (event) {
		event.preventDefault();
		var searchTerm = $('#tb-query').val();

		// Search for query
		getRequest(searchTerm);
	});

});

// Determine function to call on click of a result
$(document).on('click', '.btn-result', function(e){
	e.preventDefault();

	let title = $(this).attr('data-title');
	let thumbnail = $(this).attr('data-thumb');
	let vidId = $(this).attr('data-id');
	let resultType = $(this).attr('class');

	if(resultType == 'add-queue btn-result') {
		addToQueue(title, thumbnail, vidId);
	}
	else if(resultType == 'play-now btn-result') {
		playNow(title, thumbnail, vidId);
		if($(this).parent().parent().parent().attr('id') == 'isQueued') {
			$(this).parent().parent().remove();
		}
	}
	else if(resultType == 'remove btn-result') {
		$(this).parent().parent().remove();
	}

});

/* ==========================================================================
   CUSTOM YOUTUBE FUNCTIONS
   ========================================================================== */


// Search and return the list of query
function getRequest(searchTerm) {
    url = 'https://www.googleapis.com/youtube/v3/search';
    var params = {
		maxResults: 20,
        part: 'snippet',
        key: 'AIzaSyDdtK4ebp4xCl_41vfPlFwutqAumqUo-uA',
		type: 'video',
        q: searchTerm
    };

    $.getJSON(url, params, function (searchTerm) {
        showResults(searchTerm);
    });
}

// Search and return the list of query
function getRandomVideo(videoId) {
    url = 'https://www.googleapis.com/youtube/v3/search';
    var params = {
		maxResults: 25,
        part: 'snippet',
        key: 'AIzaSyDdtK4ebp4xCl_41vfPlFwutqAumqUo-uA',
		type: 'video',
		relatedToVideoId: videoId,
    };

    $.getJSON(url, params, function (videoId) {
        autoplayRelatedVideo(videoId);
    });
}

function autoplayRelatedVideo(results) {

	var randomNumber = Math.floor(Math.random() * (25 - 0));
	var entries = results.items[randomNumber];

	var title = entries.snippet.title;
	var thumbnail = entries.snippet.thumbnails.high.url;
	var vidId = entries.id.videoId;

	playNow(title, thumbnail, vidId);

}

// Display the results
function showResults(results) {
    var html = "";
    var entries = results.items;

    $.each(entries, function (index, value) {
        var title = value.snippet.title;
        var thumbnail = value.snippet.thumbnails.high.url;
		var vidId = value.id.videoId;

		html += '<li class="result">';

		html += '<div class="img-bg"><img src="' + thumbnail + '"></div>';
		html += '<div class="vid-info"><p>' + title + '</p>';
		html += '<a href="" class="add-queue btn-result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '"><i class="ion-plus"></i></a>';
		html += '<a href="" class="play-now btn-result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '"><i class="ion-play"></i></a></div>';

		html += '</li>';

    });

    $('#search-results').html(html);
}

function addToQueue(title, thumbnail, vidId){

	let html = '';

	html += '<li class="result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '">';

	html += '<div class="img-bg"><img src="' + thumbnail + '"></div>';
	html += '<div class="vid-info"><p>' + title + '</p>';
	html += '<a href="" class="remove btn-result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '"><i class="ion-close"></i></a>';
	html += '<a href="" class="play-now btn-result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '"><i class="ion-play"></i></a></div>';

	html += '</li>';

	$('#noQueue').hide();
	$('#isQueued').append(html).show();

}

function displayNext(title, thumbnail, vidId) {

	let html = '';
	let imgSrc = "https://img.youtube.com/vi/" + vidId + "/maxresdefault.jpg";

	$('#img-bg').attr('src', imgSrc);
	$('#playing-title').html(title);

}

/* ==========================================================================
   YOUTUBE IFRAME API FUNCTIONS
   ========================================================================== */

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
	 height: '315',
	 width: '100%',
	 videoId: 'Atp-j69X96Q',
	 events: {
	   'onStateChange': onPlayerStateChange
	 }
	});
}

function playNow(title, thumbnail, vidId) {

	let html = '';
	let imgSrc = "https://img.youtube.com/vi/" + vidId + "/maxresdefault.jpg";

	nextVid = vidId;

	// $('iframe').attr('src', iframeSrc);
	$('#img-bg').attr('src', imgSrc);
	$('#playing-title').html(title);

	player.loadVideoById({videoId: vidId});

}

function onPlayerStateChange(event) {
	var tmp = $('#isQueued').children('li').first();

	console.log(event.data);

	if (event.data == 0) {

		if($('#isQueued').children('li').length == 0) {

			getRandomVideo(nextVid);

			$('#noQueue').show();
			$('#isQueued').hide();
		}
		else {
			let title = tmp.find('.btn-result').attr('data-title');
			let thumbnail = tmp.find('btn-result').attr('data-thumb');
			nextVid = tmp.find('.btn-result').attr('data-id');

			player.loadVideoById({videoId: nextVid});
			displayNext(title, thumbnail, nextVid);

			tmp.remove();

			if($('#isQueued').children('li').length == 0) {
				$('#noQueue').show();
				$('#isQueued').hide();
			}

			playNow(title, thumbnail, nextVid);
		}

		console.log(nextVid);
	}
}
