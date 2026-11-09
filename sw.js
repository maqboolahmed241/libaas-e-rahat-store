const STORE_URL = "https://maqboolahmed241.github.io/libaas-e-rahat-store/";
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  const title = data.title || "لباسِ راحت";
  const options = {
    body: data.body || "آپ کے اسٹور میں نئی اطلاع موصول ہوئی",
    tag: "libaas-store-" + (data.event_type || "update"),
    renotify: true,
    data: { url: data.url || STORE_URL }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url || STORE_URL;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if ("focus" in client) {
        await client.focus();
        if ("navigate" in client) await client.navigate(target);
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
