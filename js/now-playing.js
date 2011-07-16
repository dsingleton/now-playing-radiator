NowPlaying = function(api, user) {
    this.api = api;
    this.user = user;
    
    /* Used for autoUpdate */
    this.interval = 5;
};
NowPlaying.prototype = {
    
    display: function(track)
    {
        this.track = track;
        
        $('#artist').text(track.artist);
        $('#track').text(track.name);
    },
    
    update: function()
    {
        this.api.getNowPlayingTrack(
            this.user,
            jQuery.proxy(this.handleResponse, this), 
            function(error) { console && console.log(error); }
        );
    },
    
    autoUpdate: function()
    {
        // Do an immediate update, don't wait an interval period
        this.update();
        
        // Try and avoid repainting the screen when the track hasn't changed
        setInterval(jQuery.proxy(this.update, this), this.interval * 1000);
    },
    
    handleResponse: function(response)
    {
        if (response) {
            this.display({
                artist: response.artist['#text'],
                name: response.name
            });
        }
        else {
            this.display({artist: ' ', name: ''});
        }
    }
};

$(document).ready(function() {
    
    // format: #!/user/username
    var username = document.location.hash.split('/')[2];
    var api = new LastfmAPI('b25b959554ed76058ac220b7b2e0a026');
    
    np = new NowPlaying(api, username);
    np.autoUpdate();
});