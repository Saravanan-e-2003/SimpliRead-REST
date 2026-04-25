import "./env.js";
import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;


export const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);