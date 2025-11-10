// Este es el código de tu "intermediario" (backend)

export default async function handler(req, res) {
  // --- Configuración Segura ---
  // Debes guardar esto como "Variables de Entorno" en Vercel o Netlify
  // NUNCA las escribas directamente aquí.
  const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
  const USER_LOGIN = "tuusuario"; // <-- CAMBIA ESTO
  // ------------------------------

  try {
    // Paso 1: Obtener un Token de Acceso de Twitch
    const tokenResponse = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
      {
        method: "POST",
      }
    );
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Paso 2: Consultar la API de Streams con el token
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

    // Paso 3: Responder a tu página web
    if (streamData.data && streamData.data.length > 0) {
      // ¡Está en vivo!
      res.status(200).json({
        live: true,
        title: streamData.data[0].title,
        game: streamData.data[0].game_name,
        viewers: streamData.data[0].viewer_count,
      });
    } else {
      // No está en vivo
      res.status(200).json({
        live: false,
      });
    }
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ live: false, error: error.message });
  }
}