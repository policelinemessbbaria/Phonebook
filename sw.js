const CACHE_NAME = 'digital-phonebook-v3'; // কোড চেঞ্জ করলে এই নামের শেষের সংখ্যা পরিবর্তন করুন (যেমন: v3, v4)

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // আপনার অন্য কোনো ফাইল থাকলে এখানে লিখুন
];

// ইন্সটল এবং ক্যাশিং
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  // নতুন সার্ভিস ওয়ার্কার পেলে সাথে সাথে অ্যাক্টিভেট হবে (Waiting থাকবে না)
  self.skipWaiting();
});

// অ্যাক্টিভেট এবং পুরনো ক্যাশ ক্লিয়ার
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // পুরনো ক্যাশ ডিলিট করছে
          }
        })
      );
    })
  );
  // সব ক্লায়েন্ট বা ট্যাবকে নিয়ন্ত্রণ করবে
  return self.clients.claim();
});

// ফেচ রিকোয়েস্ট হ্যান্ডলিং
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ক্যাশে থাকলে সেটা দেখাবে (স্পিড বাড়বে)
        if (response) {
          return response;
        }
        // না থাকলে নেটওয়ার্ক থেকে আনবে
        return fetch(event.request);
      })
  );
});
