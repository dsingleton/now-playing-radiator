NowPlaying = function(api, user) {
    this.api = api;
    this.user = user;
    
    /* Used for autoUpdate */
    this.interval = 5;
    
    this.onChangeEvents = [];
};
NowPlaying.prototype = {
    
    display: function(track)
    {        
        $('#artist').text(track.artist);
        $('#track').text(track.name);
    },
    
    update: function()
    {
        this.api.getNowPlayingTrack(
            this.user,
            jQuery.proxy((function(track) {
                this.onChangeEvents.forEach(function(func) {
                    func(track);
                });
            }), this),
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
    
    bindOnChange: function(func) {
        this.onChangeEvents.push(func);
    }
};