// Service Worker — 俄罗斯方块离线支持 (网络优先策略)
const CACHE = 'tetris-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      // 网络请求成功 → 更新缓存，返回最新内容
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => {
      // 离线 → 返回缓存
      return caches.match(e.request);
    })
  );
});
