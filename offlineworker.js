var CACHE_NAME = 'app-offline-cache-v1';

var resourcesToCache = [
    './',
    './site.css',
    './assets/columbus-ohio.JPG',
    './assets/nevergonnaletyoudown.gif',
    './site.js',
    './index.htm',
    './offlineworker.js',
    './queueworker.js',
    './worker.js',
    'https://fonts.googleapis.com/css?family=Roboto',
    'https://code.jquery.com/jquery-2.2.4.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        // open the app browser cache
        caches.open(CACHE_NAME)
            .then(function (cache) {
                // add all app assets to the cache
                return cache.addAll(resourcesToCache);
            })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        // try to find corresponding response in the cache
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    // cache hit: return cached result
                    return response;
                }

                // not found: fetch resource from the server
                return fetch(event.request);
            })
    );
});