var current_url = null;

var CONFIG = {
    'api_root': 'http://ws.audioscrobbler.com/2.0/',
    'api_key': 'b25b959554ed76058ac220b7b2e0a026',
    'refresh': 10,
};

function get_username()
{
    // format: #!/user/username 
    return document.location.hash.split('/')[2];
}

function generate_api_url(method, params)
{
    var params = jQuery.extend({
        'api_key': CONFIG.api_key,
        'format': 'json',
        'method': method
    }, params);
    
    // Append &callback=? for magic jquery conversion, or it gets encoded
    return CONFIG.api_root + '?' + jQuery.param(params) + '&callback=?';
}

function update()
{
    var url = generate_api_url('user.recenttracks', {'user': get_username()});

    jQuery.getJSON(url, function(data) {

        var track = data.recenttracks.track[0];
        
        var isNowPlaying = track['@attr'] && track['@attr'].nowplaying;
        if (!isNowPlaying) {
            clear();
            return;
        }
        
        var isChanged = current_url != track.url;

        console.log('Checking for update');

        if (isNowPlaying && isChanged) {
            
            console.log('Updating');

            current_url = track.url

            var trackName = track.name;
            var artistName = track.artist['#text'];
            var imageURL = track.image[3]['#text'];
            
            $('#artist').text(artistName);
            $('#track').text(trackName);        
            $('#album_cover').attr('src', imageURL);
            
            var url2 = generate_api_url('artist.getInfo', {'artist': artistName, 'username': get_username()});
            jQuery.getJSON(url2, function(data) {
                $('#bio').html(data.artist.bio.summary);
            }); 
            
            
        }
    });
}

$(document).ready(function() {
    init();
});

function init()
{
    update();
    setInterval(update, 1000 * CONFIG.refresh);

    window.addEventListener("hashchange", update, false);
}

function clear() {
    $('#artist').text('');
    $('#track').text('');        
    $('#album_cover').attr('src', 'x');
    $('#bio').html('');
}