// Цей додатковий код використовується для реєстрації сервісного працівника.
// register() не викликається за замовчуванням.

// Це дозволяє програмі завантажуватися швидше під час наступних відвідувань у виробництві та дає
// це офлайн-можливості. Однак це також означає, що розробники (і користувачі)
// буде бачити лише розгорнуті оновлення під час наступних відвідувань сторінки, зрештою
// існуючі вкладки, відкриті на сторінці, були закриті, оскільки раніше кешувалися
// ресурси оновлюються у фоновому режимі.



const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // Конструктор URL доступний у всіх браузерах, які підтримують ПЗ.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Наш сервіс-воркер не працюватиме, якщо PUBLIC_URL має інше походження
      // від того, на чому обслуговується наша сторінка. Це може статися, якщо CDN звик
      // обслуговувати активи; див. https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Це працює на локальному хості. Давайте перевіримо, чи існує ще сервісний працівник чи ні.
        checkValidServiceWorker(swUrl, config);

        
        // Додати додаткове журналювання до localhost, вказуючи розробникам на
        // service worker/документація PWA.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://bit.ly/CRA-PWA'
          );
        });
      } else {
        // Не є локальним хостом. Просто зареєструйте сервісного працівника
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {

              // На цьому етапі оновлений попередньо кешований вміст отримано,  
              // але попередній сервіс-воркер все одно обслуговуватиме старшого
              // вміст, доки всі вкладки клієнта не будуть закриті.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
              );


              // Виконати зворотний виклик
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // На даний момент все було попередньо кешовано.  
              // Це ідеальний час для відображення a
              // "Вміст кешується для використання в автономному режимі." повідомлення.
              console.log('Content is cached for offline use.');

              
              // Виконати зворотний виклик
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
