import { ImageAnnotatorClient } from "@google-cloud/vision";
import path from "path";

export default new ImageAnnotatorClient({
  keyFilename: path.resolve("public/service-account-key.json"),
});
