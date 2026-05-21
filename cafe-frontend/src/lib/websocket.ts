import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {jwtDecode} from "jwt-decode";

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws-cafe';

export const KITCHEN_TOPIC = '/topic/kitchen';
export const BAR_TOPIC = '/topic/bar';

const isTokenValid = (token: string | null) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        return !(decoded.exp && decoded.exp * 1000 < Date.now());
    } catch {
        return false;
    }
};

export const createStompClient = (onMessage: (topic: string, message: unknown) => void) => {
    const client = new Client({
        webSocketFactory: () => {
            const currentToken = localStorage.getItem('token');
            if (!isTokenValid(currentToken)) {
                console.warn("Token is expired or missing. WebSocket connection will likely fail.");
            }

            const socketUrl = `${WS_URL}?token=${currentToken}`;
            return new SockJS(socketUrl);
        },

        beforeConnect: () => {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                client.connectHeaders = {
                    Authorization: `Bearer ${currentToken}`,
                };
            }
        },
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