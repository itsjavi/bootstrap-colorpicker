/**
 * 
 * Script for loading and caching commit history
 * 
 */
!function(root, $) {
    /**
     * Fetch latest commits from Github API and cache them
     * @link https://gist.github.com/4520294
     * 
     */
    root["ghcommits"] = {
        "repo_name": "mjaalnir/bootstrap-colorpicker",
        "cache_enabled": true, //cache api responses?
        "cache_ttl": (2 * 60 * 60), // 2h (in seconds)
        "onload": {},
        "callback": function() {
        },
        "load": function(count, onload) {
            var $self = this;
            count = count || 10;
            $self.onload = onload || function() {
            };

            if ($self.cache_enabled && root["localStorage"]) {
                var cache_key = "repo_commits";
                var expiration = localStorage.getItem(cache_key + "_expiration");
                if (expiration && (expiration < +new Date())) {
                    localStorage.removeItem(cache_key);
                    localStorage.removeItem(cache_key + "_expiration");
                    expiration = false;
                }
                var commits = localStorage.getItem(cache_key);
                if (commits) {
                    if (root["console"])
                        console.info("Commit data feched from localStorage");
                    $self.store(JSON.parse(commits), false);
                    $self.onload($self.data);
                    return;
                }
            }
            $self.query(count);
        },
        "store": function(commitsJson, cache) {
            var $self = this;
            $self.data = commitsJson;
            if (cache && root["localStorage"]) {
                localStorage.setItem("repo_commits", JSON.stringify(commitsJson));
                localStorage.setItem("repo_commits_expiration", +new Date() + 1000 * $self.cache_ttl);
            }
        },
        "query": function(count) {
            var $self = this;
            var query_url = 'https://api.github.com/repos/' + $self.repo_name + '/commits?per_page=' + count;
            console.info("Fetching commit data from " + query_url);
            $.ajax({'dataType': "jsonp", 'url': query_url, 'jsonpCallback': 'ghcommits._jsonpcb'});
        },
        "_jsonpcb": function(jsonpresp) {
            ghcommits.store(jsonpresp.data, ghcommits.cache_enabled);
            ghcommits.onload(ghcommits.data);
        }
    }

    $(function() {
        try {
            // load latest commits under a try to not paralize the app
            ghcommits.load(10, function(data) {
                if (data && (data.length > 0)) {
                    $(data).each(function(i, item) {
                        $("#changelog ul").append($('<li>').html("<b>" + item.commit.author
                                .date.replace("T", " ").replace("Z", "") +
                                ":</b> " + item.commit.message));
                    });
                }

            });
        } catch (err) {
            // noop
        }
    });
}(window, window.jQuery);