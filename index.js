const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');
const fs = require('fs');

async function main() {
  const privateEndpointIP = '10.0.0.5';
  const accountName = 'your-storage-account-name';
  const containerName = 'your-container-name';
  const blobName = 'dummy.txt';
  const filePath = './dummy.txt';

  // Create a dummy text file
  fs.writeFileSync(filePath, 'This is a dummy text file.');

  // Use DefaultAzureCredential to authenticate
  const credential = new DefaultAzureCredential();
  const blobServiceClient = new BlobServiceClient(
    `https://${privateEndpointIP}/${accountName}`,
    credential
  );

  // Get a container client
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload the file
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
}

main().catch((err) => {
  console.error('Error running sample:', err.message);
});
