# MangoShare

MangoShare is a peer-to-peer file sharing project built around a Next.js web app and a Socket.IO signaling server. One user creates a room, shares a code or QR link, and another user joins the same room to transfer files directly in the browser.

## Repository Layout

- [Web](Web) contains the Next.js frontend used to create rooms, join sessions, and exchange files.
- [MangoShare-Socket](MangoShare-Socket) contains the Socket.IO server that relays room, file, and transfer events.

## Features

- Room-based file sharing between two participants
- Sender and receiver flows in the browser
- QR code generation for easy sharing
- Chunked file transfer through Socket.IO
- Image preview and download support
- Dark and light theme support in the web app

## How It Works

1. The sender opens the web app and creates a room.
2. A 6-digit room code or receiver link is shared with the other user.
3. The receiver joins the same room through the web app.
4. Files are sent as chunks through the Socket.IO server.
5. The receiver reconstructs the file and downloads it in the browser.

## Getting Started

### Web App

See the detailed setup instructions in [Web/README.md](Web/README.md).

### Socket Server

The Socket.IO server lives in [MangoShare-Socket](MangoShare-Socket) and listens on port `4000` by default.

## Environment

The web app uses `NEXT_PUBLIC_SOCKET_URL` to point at the Socket.IO server. If it is not set, the frontend defaults to `http://localhost:4000`.

## Notes

- The project is designed for two users per room.
- Large files may take longer to transfer depending on browser and network conditions.
- If you deploy the web app and socket server separately, make sure the frontend points to the correct Socket.IO URL.
