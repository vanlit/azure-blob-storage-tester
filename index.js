const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');
const fs = require('fs');
require('dotenv').config();

async function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function uploadFile(blobServiceClient, containerName, blobName, filePath) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadFile(filePath);
  console.log(`Uploaded block blob ${blobName} successfully`);
}

async function downloadFile(blobServiceClient, containerName, blobName, downloadFilePath) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.downloadToFile(downloadFilePath);
  console.log(`Downloaded block blob ${blobName} successfully`);
}

async function main() {
  const privateEndpointIP = process.env.PRIVATE_ENDPOINT_IP;
  const accountName = process.env.STORAGE_ACCOUNT_NAME;
  const containerName = process.env.CONTAINER_NAME;
  const blobName = process.env.BLOB_NAME || 'dummy.txt';
  const filePath = process.env.FILE_PATH || './dummy.txt';
  const downloadFilePath = process.env.DOWNLOAD_FILE_PATH || './downloaded_dummy.txt';

  // Create a dummy text file
  await writeFile(filePath, 'This is a dummy text file.');

  // Use DefaultAzureCredential to authenticate
  const credential = new DefaultAzureCredential();
  const blobServiceClient = new BlobServiceClient(
    `https://${privateEndpointIP}/${accountName}`,
    credential
  );

  // Upload the file
  await uploadFile(blobServiceClient, containerName, blobName, filePath);

  // Download the file
  await downloadFile(blobServiceClient, containerName, blobName, downloadFilePath);

  // Verify the contents
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const downloadedContent = fs.readFileSync(downloadFilePath, 'utf8');

  if (originalContent === downloadedContent) {
    console.log('The contents are intact.');
  } else {
    console.log('The contents are not intact.');
  }
}

main().catch((err) => {
  console.error('Error running sample:', err.message);
});
