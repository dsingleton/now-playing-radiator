/* 
 * A simple wraper to basic Last.fm API functionality
 *
 * Only supports GET and unauthenticated methods, which is 90% of what you 
 * need usually, reliant on jquery.
 *
 * @todo add a error callback, catch and handle lfm errors
 *
 */
LastfmAPI = function(api_key) {
    this.api_key = api_key;
};
LastfmAPI.prototype = {
    root: 'http://ws.audioscrobbler.com/2.0/',
    
    get: function (method, params, success, error)
    {
        jQuery.ajax({
            url: this.root,
            dataType: "jsonp",
            data: jQuery.extend({
                'api_key': this.api_key,
                'format': 'json',
                'method': method
            }, params),
            // Forces JSONP errors to fire, needs re-evaluation if long polling is used
            timeout: 2000
        })
        .success(function(response) { 
            (response.error ? error : success)(response);
        })
        .error(function() {
            // JSONP limitations mean we'll only get timeout errors
            console.log({error: 0, message: 'HTTP Error'});
        });
    },
    
    getNowPlayingTrack: function(user, success, error)
    {
        this.get('user.recenttracks', {user: user}, function(response) {
            var track = response.recenttracks.track[0];
            
            if (track && track['@attr'] && track['@attr'].nowplaying) {
                success(track);
            }
            else {
                success(false);
            }
        }, error);
    }
};