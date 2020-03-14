import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { split, ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { config } from './config';
import AsyncStorage from '@react-native-community/async-storage';

const { dev, prod } = config;

// const httpEndPoint = process.env.NODE_ENV === "development" ? dev.SERVER_HTTP_END_POINT : prod.SERVER_HTTP_END_POINT;
// const wsEndPoint = process.env.NODE_ENV === "development" ? dev.SERVER_WEB_SOCKET_END_POINT : prod.SERVER_WEB_SOCKET_END_POINT;

// const httpEndPoint = prod.SERVER_HTTP_END_POINT;
// const wsEndPoint = prod.SERVER_WEB_SOCKET_END_POINT;

const httpEndPoint = dev.SERVER_HTTP_END_POINT;
const wsEndPoint = dev.SERVER_WEB_SOCKET_END_POINT;

const withAuthToken = (token = "") => {
  // Create an http link:
  const httpLink = new HttpLink({
    uri: httpEndPoint,
  });

  const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    return forward(operation);
  });

  const linkWithAuthHeaders = middlewareLink.concat(httpLink);

// Create a WebSocket link:
  const wsLink = new WebSocketLink({
      uri: wsEndPoint,
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
    linkWithAuthHeaders
  );

  const link = terminationLink;

  return new ApolloClient({ link  , cache: new InMemoryCache() });
}

export default withAuthToken;