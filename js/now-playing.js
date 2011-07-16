NowPlaying = function(api, user) {
    this.api = api;
    this.user = user;
    
    /* Used for autoUpdate */
    this.interval = 5;
};
NowPlaying.prototype = {
    
    display: function(track)
    {        
        $('#artist').text(track.artist);
        $('#track').text(track.name);
    },
    
    update: function()
    {
        this.api.getNowPlayingTrack(this.user, jQuery.proxy(this.handleResponse, this));
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