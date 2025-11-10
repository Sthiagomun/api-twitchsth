export default async function handler(req, res) {
  // --- Configuración Segura ---
  const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
  const USER_LOGIN = "sthiagomun"; // <-- Tu usuario de Twitch
  // ------------------------------

  try {
    const tokenResponse = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
      { method: "POST" }
    );
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const streamResponse = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${USER_LOGIN}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );
    const streamData = await streamResponse.json();

    // ¡¡IMPORTANTE!! Esta línea permite que tu GitHub Pages use esta API
    res.setHeader('Access-Control-Allow-Origin', 'https://sthiagomun.github.io');

    if (streamData.data && streamData.data.length > 0) {
      // En vivo
      res.status(200).json({ live: true, title: streamData.data[0].title });
    } else {
      // Offline
      res.status(200).json({ live: false });
    }
  } catch (error) {
    // ¡¡IMPORTANTE!! También en caso de error
    res.setHeader('Access-Control-Allow-Origin', 'https://sthiagomun.github.io');
    res.status(500).json({ live: false, error: error.message });
  }
}