import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export const KITCHEN_TOPIC = '/topic/kitchen';
export const BAR_TOPIC = '/topic/bar';

export const createStompClient = (onMessage: (topic: string, message: any) => void) => {
    const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        debug: (str) => {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
        console.log('Connected to WebSocket');

        client.subscribe(KITCHEN_TOPIC, (message) => {
            onMessage(KITCHEN_TOPIC, JSON.parse(message.body));
        });

        client.subscribe(BAR_TOPIC, (message) => {
            onMessage(BAR_TOPIC, JSON.parse(message.body));
        });
    };

    client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    return client;
};
