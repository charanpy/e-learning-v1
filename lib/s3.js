const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const util = require('util');

const unlinkFile = util.promisify(fs.unlink);
const readdir = util.promisify(fs.readdir);

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_BUCKET_REGION;

const s3 = new S3({
  region,
});

const uploadFile = async (file, fileName) => {
  const fileStream = fs.createReadStream(file.path);
  console.log(file);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileName,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
};

const deleteFile = async (key) => {
  if (!key) {
    return;
  }
  return s3
    .deleteObjects({
      Bucket: bucketName,
      Delete: { Objects: [{ Key: key }] },
    })
    .promise();
};

const deleteFiles = async () => {
  try {
    const files = await readdir('uploads');
    const unlinkPromises = files?.map((filename) =>
      unlinkFile(`uploads/${filename}`)
    );
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
};

const getFileExtension = (file) => file?.originalname?.split('.')?.pop();

const uploadFileHelper = async (file, folder) => {
  console.log(file?.filename + Date.now());
  if (file?.originalname) {
    const imageResponse = await uploadFile(
      file,
      `${folder}/${file?.filename || '' + Date.now()}.${
        getFileExtension(file) || 'png'
      }`
    );

    return {
      key: imageResponse.Key,
      url: imageResponse.Location,
    };
  }
};

const getS3Params = (fileName, contentType) => ({
  Bucket: bucketName,
  Key: fileName,
  Expires: 600 * 60,
  ContentType: contentType || 'image/*',
  ACL: 'public-read',
});

const getSignedUrl = async (fileName, contentType) => {
  return s3.getSignedUrl('putObject', getS3Params(fileName, contentType));
};

const updateFileHelper = async (file, key, folder) => {
  if (file?.originalname) {
    await deleteFile(key);
    const imageResponse = await uploadFile(
      file,
      `${folder}/${file?.filename}.${getFileExtension(file) || 'png'}`
    );

    return {
      key: imageResponse.Key,
      url: imageResponse.Location,
    };
  }
};

module.exports = {
  uploadFile,
  unlinkFile,
  deleteFile,
  deleteFiles,
  updateFileHelper,
  uploadFileHelper,
  getSignedUrl,
};
