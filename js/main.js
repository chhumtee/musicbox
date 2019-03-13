var nextVid = 'Atp-j69X96Q';
var apiKey = 'AIzaSyDaRIMgnLUalRn_XfmCChkq3CbX_WgPqSw';


// Submit button
$('#search-term').submit(function (event) {
    event.preventDefault();
    var searchTerm = $('#tb-query').val();

    // Search for query
    getRequest(searchTerm);
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
        $(this).parent().parent().remove();


        if($('.list-queue .list').children('li').length == 0) {
            $('.queue-empty').show();
            $('.list-queue .list').hide();
        }

    }
    else if(resultType == 'remove btn-result') {
        $(this).parent().parent().remove();

        
        if($('.list-queue .list').children('li').length == 0) {
            $('.queue-empty').show();
            $('.list-queue .list').hide();
        }
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
        key: apiKey,
        type: 'video',
        q: searchTerm + " song"
    };

    /*
    $.getJSON(url, params, function (searchTerm) {
        showResults(searchTerm);
    }); */

    $.ajax({
        type: 'get',
        dataType: "json",
        url: url,
        data: params,
        success: function(searchTerm){
            showResults(searchTerm);
        },
        error: function(xhr, status, error) {
            console.log(JSON.stringify(xhr));
        }
    });

}

// Display the results
function showResults(results) {

    var html = "";
    var entries = results.items;

    $.each(entries, function (index, value) {
        var title = value.snippet.title;
        var thumbnail = value.snippet.thumbnails.high.url;
        var vidId = value.id.videoId;

        html += '<li class="result flex-content">';

        html += '<img src="' + thumbnail + '" class="list-img">';
        html += '<div class="list-info flex-content"><p>' + title + '</p>';
        html += '<a href="" class="add-queue btn-result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '"><i class="fas fa-plus"></i></a>';
        html += '<a href="" class="play-now btn-result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '"><i class="fas fa-play"></i></a></div>';

        html += '</li>';

    });

    $('.list-search .list').html(html);
}

// Add to queue
function addToQueue(title, thumbnail, vidId){

    let html = '';

    html += '<li class="result flex-content">';

    html += '<div class="list-info flex-content"><p>' + title + '</p>';
    html += '<a href="" class="remove btn-result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '"><i class="fas fa-times"></i></a>';
    html += '<a href="" class="play-now btn-result" data-id="' + vidId + '" data-title="' + title +'" data-thumb="' + thumbnail + '"><i class="fas fa-play"></i></a></div>';

    html += '</li>';

    $('.queue-empty').hide();
    $('.list-queue .list').append(html).show();

}

function displayNext(title, thumbnail, vidId) {

    let html = '';
    let imgSrc = "https://img.youtube.com/vi/" + vidId + "/maxresdefault.jpg";

    $('.player-img').attr('src', imgSrc);
    $('.song-name').html(title);

}

// Search and return the list of query
function getRandomVideo(videoId) {
    url = 'https://www.googleapis.com/youtube/v3/search';
    var params = {
        maxResults: 21,
        part: 'snippet',
        key: apiKey,
        type: 'video',
        relatedToVideoId: videoId,
    };

    $.getJSON(url, params, function (videoId) {
        autoplayRelatedVideo(videoId);
    });
}

function autoplayRelatedVideo(results) {

    var randomNumber = Math.floor(Math.random() * (15 - 0));
    var entries = results.items[randomNumber];

    var title = entries.snippet.title;
    var thumbnail = entries.snippet.thumbnails.high.url;
    var vidId = entries.id.videoId;

    playNow(title, thumbnail, vidId);

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
        height: '40',
        width: '100%',
        videoId: 'GjQEWj-gL-E',
        events: {
        'onStateChange': onPlayerStateChange
        }
    });
}

function playNow(title, thumbnail, vidId) {

    let html = '';
    let imgSrc = "https://img.youtube.com/vi/" + vidId + "/maxresdefault.jpg";

    nextVid = vidId;

    $('.player-img').attr('src', imgSrc);
    $('.song-name').html(title);

    player.loadVideoById({videoId: vidId});

}

function onPlayerStateChange(event) {
    var tmp = $('.list-queue .list').children('li').first();

    // console.log(event.data);

    if (event.data == 0) {

        if($('.list-queue .list').children('li').length == 0) {

            getRandomVideo(nextVid);

            $('.queue-empty').show();
            $('.list-queue .list').hide();
        }
        else {
            let title = tmp.find('.btn-result').attr('data-title');
            let thumbnail = tmp.find('btn-result').attr('data-thumb');
            nextVid = tmp.find('.btn-result').attr('data-id');

            player.loadVideoById({videoId: nextVid});
            displayNext(title, thumbnail, nextVid);

            tmp.remove();

            if($('.list-queue .list').children('li').length == 0) {
                $('.queue-empty').show();
                $('.list-queue .list').hide();
            }

            playNow(title, thumbnail, nextVid);
        }

        console.log(nextVid);
    }
}


