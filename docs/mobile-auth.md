Mobile Authentication Parity (Android + Web)

Summary
- Frontend attaches `Authorization: Bearer <JWT>` only when the token is a valid JWT.
- Android builds use `REACT_APP_ANDROID_API_BASE` or fallback `http://10.0.2.2:8080` in the emulator.
- Backend CORS allows `capacitor://localhost` and `http://localhost`, including `Authorization` headers.

Environment setup
- Web: set `REACT_APP_API_BASE` to your backend (e.g., `http://localhost:8080`).
- Android emulator: set `REACT_APP_ANDROID_API_BASE` if backend is not `10.0.2.2:8080`.
- Physical Android device: set `REACT_APP_ANDROID_API_BASE` to LAN IP (e.g., `http://192.168.1.50:8080`). Ensure the device can reach the machine.

Behavior details
- API client detects Android environment and uses `REACT_APP_ANDROID_API_BASE` or `10.0.2.2` fallback.
- On 401 responses, the client clears local storage token and username to prevent stale sessions.
- Android network security config permits cleartext (HTTP) in development; use HTTPS in production.

Troubleshooting
- Confirm the backend returns a JWT on `POST /api/auth/login`.
- Check device connectivity: emulator uses `10.0.2.2`; devices require LAN IP.
- Verify CORS origins include `capacitor://localhost` and that `Authorization` is allowed.