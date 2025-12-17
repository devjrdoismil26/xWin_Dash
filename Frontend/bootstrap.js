import Echo from "laravel-echo";
import axios from "axios";
import io from "socket.io-client";

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

window.io = io;

window.Echo = new Echo({
  broadcaster: "socket.io",
  host: import.meta.env.VITE_WEBSOCKET_URL, // Usando variável de ambiente
  client: io, // Adicionando o cliente Socket.io
  auth: {
    headers: {
      Authorization: `Bearer localStorage.getItem("token")`,
    },
  },
});
