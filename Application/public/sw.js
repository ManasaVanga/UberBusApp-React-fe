let cacheData="v1";

this.addEventListener("install",(event)=>{
  event.waitUntil(
    caches.open(cacheData).then((cache)=>{
      cache.addAll([
        '/favicon.ico',
        '/asset-manifest.json',
        '/manifest.json',
        '/static/js/main.chunk.js',
        '/static/js/0.chunk.js',
        '/static/js/1.chunk.js',
        '/static/js/bundle.js',
        '/static/media/hero_large-2.e51f8dc1.jpeg',
        '/static/media/sky.fa50a921.jpeg',
        '/static/media/login.06871eca.gif',
        '/index.html',
        '/signup',
        '/login',
        '/sw.js',
        '/'
      ])
    })
  )
})

this.addEventListener("fetch",(event)=>{
  event.respondWith(
    caches.match(event.request).then((resp)=>{
      if(resp)
      {
        return resp;
      }
    })
  )
})

console.warn("ws file is public folder")