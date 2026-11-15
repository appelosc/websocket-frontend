# Clipboard Sync App – Web client

React and TypeScript web client for the Clipboard Sync App. After logging in, the user gets a "pastebin" page: whatever is typed in the text field is sent live over WebSocket to the same user's other connected screens.

Built with React, TypeScript, Vite and socket.io-client.

This is one part of the Clipboard Sync App:

- [authn-authz](https://github.com/appelosc/authn-authz) (`project2` branch): authentication API that issues access and refresh tokens
- [websocket](https://github.com/appelosc/websocket): WebSocket server
- **websocket-frontend** (this repo): web client
- [electron-websocket](https://github.com/appelosc/electron-websocket): this client ported to an Electron desktop app

## Features

- Login against a separate authentication API with an access token and a refresh token
- Automatic login on page load if a refresh token is stored
- Live text sharing over Socket.IO
- Connection status light (green = connected, yellow = connecting, red = not connected) and a "Reconnect" button
- Automatic renewal of the access token when it has expired. Concurrent renewals share one request
- Automatic logout if the token is invalid or cannot be renewed

## How the connection works

1. The socket sends the access token in the Socket.IO handshake.
2. If the server answers `TokenExpiredError`, the client requests a new access token from `/auth/refresh` with the refresh token and connects again.
3. If the server answers `No token provided` or `Invalid token`, or the refresh fails, the client logs out: it disconnects the socket, calls `/auth/logout`, clears the stored tokens and returns to the login page.
4. If the server closes the connection, which it does when a token expires, the client reconnects.

## Project structure

```
src/
├── App.tsx              # Routing (HashRouter): /login and /pastebin
├── api/
│   ├── client.ts        # fetch wrapper with the base path to the authentication API
│   ├── login.ts         # Login
│   ├── logout.ts        # Logout against the server
│   ├── refresh.ts       # Access token renewal
│   ├── session.ts       # Clears the stored tokens
│   └── connection.ts    # Socket.IO connection, token refresh and logout
├── pages/
│   ├── Login.tsx
│   └── PasteBin.tsx
├── styling/
└── types/
```

## Getting started

Create a `.env` file in the project root:

| Variable                 | Description                           |
| ------------------------ | ------------------------------------- |
| `VITE_AUTH_API_URL`      | Base URL of the authentication API    |
| `VITE_WEBSOCKET_API_URL` | URL of the WebSocket server           |

Then install and run:

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build     # type check and production build
npm run lint      # ESLint
npm run preview   # preview the production build
```
