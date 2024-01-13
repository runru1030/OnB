import { ImageAnnotatorClient } from "@google-cloud/vision";

export default new ImageAnnotatorClient({
  credentials: {
    type: "service_account",
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    token_url: process.env.GOOGLE_TOKEN_URL,
    universe_domain: "googleapis.com",
  },
});
