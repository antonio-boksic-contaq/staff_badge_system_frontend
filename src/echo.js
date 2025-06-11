import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'qptvbfa1pbawx5ue1cmr', // preso dal env del backend
    wsHost: process.env.NODE_ENV === "production" ? "192.168.10.230" : "127.0.0.1",
    cluster: 'mt1', // in realtà non serve ma senza valore va in errore... credo che possiamo mettere qualsiasi valore
    wsPort: 8082,
    wssPort: 8082,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});
