import { ImageAnnotatorClient } from "@google-cloud/vision";
import path from "path";

export default new ImageAnnotatorClient({
  keyFilename: path.resolve("./src/app/lib/GCV/service-account-key.json"),
});
