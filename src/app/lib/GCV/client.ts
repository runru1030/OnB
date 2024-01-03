import { ImageAnnotatorClient } from "@google-cloud/vision";

export default new ImageAnnotatorClient({
  keyFilename: "./src/app/lib/GCV/service-account-key.json",
});
