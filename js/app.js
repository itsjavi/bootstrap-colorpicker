/**
 * 
 * index.html scripts
 * 
 */
!function($) {
    /**
     * Fetch latest commits from Github API and cache them
     * @link https://gist.github.com/4520294
     * 
     */
    var $commits = {
        "repo_name": "xaguilars/bootstrap-colorpicker",
        "cache_enabled": true, //cache api responses?
        "cache_ttl": (60 * 60), // in seconds
        "data": {},
        "load": function(count, callback) {
            count = count || 10;
            callback = callback || function() {
            };

            var $self = this;
            if ($self.cache_enabled && window["localStorage"]) {
                var cache_key = "repo_commits";
                var expiration = localStorage.getItem(cache_key + "_expiration");
                if (expiration && (expiration < +new Date())) {
                    localStorage.removeItem(cache_key);
                    localStorage.removeItem(cache_key + "_expiration");
                    expiration = false;
                }
                var commits = localStorage.getItem(cache_key);
                if (commits) {
                    if (window["console"])
                        console.info("Commit data feched from localStorage");
                    $self.store(JSON.parse(commits), false);
                    callback($self.data);
                    return;
                }
            }
            $self.query(count, callback);
        },
        "query": function(count, callback) {
            var $self = this;
            var query_url = 'https://api.github.com/repos/' + $self.repo_name + '/commits?per_page=' + count;
            console.info("Fetching commit data from " + query_url);
            $.getJSON(query_url, function(data, textStatus, jqXHR) {
                $self.store(data, $self.cache_enabled);
                callback($self.data);
            }, 'json');
        },
        "store": function(commitsJson, cache) {
            var $self = this;
            $self.data = commitsJson;
            if (cache && window["localStorage"]) {
                localStorage.setItem("repo_commits", JSON.stringify(commitsJson));
                localStorage.setItem("repo_commits_expiration", +new Date() + 1000 * $self.cache_ttl);
            }
            $(window).trigger("commits_loaded", [commitsJson]);
        }
    }

    // App
    $(function() {
        window.prettyPrint && prettyPrint()
        $('#cp1').colorpicker({
            format: 'hex'
        });
        $('#cp2').colorpicker();
        $('#cp3').colorpicker();
        var bodyStyle = $('body')[0].style;
        $('#cp4').colorpicker().on('changeColor', function(ev) {
            bodyStyle.backgroundColor = ev.color.toHex();
        });

        try {
            // load latest commits under a try to not paralize the app
            $commits.load(10, function(data) {
                if (data && (data.length > 0)) {
                    $(data).each(function(i, item) {
                        $("#changelog ul").append($('<li>').html("<b>" + item.commit.author
                                .date.replace("T", " ").replace("Z", "") +
                                ":</b> " + item.commit.message));
                    });
                }

            });
        } catch (err) {}
    });
}(window.jQuery);