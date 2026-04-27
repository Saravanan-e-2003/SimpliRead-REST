import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} from "@azure/storage-blob";

import fs from "fs";

// use connection string directly
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;

// client
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);


// upload + SAS
export async function uploadToBlob(filePath, fileName, bookId) {
  const blobName = `${bookId}.pdf`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // upload
  await blockBlobClient.uploadFile(filePath);

  //  SAS generation (this still needs credential internally)
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    blobServiceClient.credential // works with connection string
  ).toString();

  const sasUrl = `${blockBlobClient.url}?${sasToken}`;

  return {
    url: sasUrl,
    blobName,
  };
}