import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { split, ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { config } from './config';

const { dev: { SERVER_HTTP_END_POINT, SERVER_WEB_SOCKET_END_POINT } } = config;
// Create an http link:
const httpLink = new HttpLink({
    uri: SERVER_HTTP_END_POINT
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: SERVER_WEB_SOCKET_END_POINT,
    options: {
        reconnect: true
    }
});

const terminationLink = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const link = ApolloLink.from([terminationLink]);

export default new ApolloClient({ link, cache: new InMemoryCache() });