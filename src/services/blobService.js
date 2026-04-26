import { blobServiceClient } from "../config/azure.js";

const containerName = "simplireadblobcontainer-1";

export async function uploadToBlob(filePath, fileName) {
  const containerClient =
    blobServiceClient.getContainerClient(containerName);

  const blobName = fileName;

  const blockBlobClient =
    containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadFile(filePath);

  return blockBlobClient.url;
}