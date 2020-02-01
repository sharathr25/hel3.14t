export const config = {
    dev : {
        SERVER_HTTP_END_POINT : 'http://192.168.0.106:4000/graphql',
        SERVER_WEB_SOCKET_END_POINT : 'ws://192.168.0.106:4000/graphql'
    },
    prod : {
        SERVER_HTTP_END_POINT : 'https://help-app-v1.herokuapp.com/graphql',
        SERVER_WEB_SOCKET_END_POINT : 'wss://help-app-v1.herokuapp.com/graphql'
    }
}