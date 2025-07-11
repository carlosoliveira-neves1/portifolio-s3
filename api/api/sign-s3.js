// api/sign-s3.js
import AWS from 'aws-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { filename, filetype } = req.body;

  // Configura o cliente S3 usando as variáveis de ambiente
  const s3 = new AWS.S3({
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region:          process.env.AWS_REGION
  });

  const Key = `projects/${Date.now()}_${filename}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key,
    Expires: 60,
    ContentType: filetype,
    ACL: 'public-read'
  };

  try {
    // Gera URL pré-assinada para upload
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    // URL pública acessível após upload
    const publicURL = `https://${params.Bucket}.s3.amazonaws.com/${Key}`;

    return res.status(200).json({ uploadURL, publicURL });
  } catch (err) {
    console.error('Error in sign-s3:', err);
    return res.status(500).json({ error: err.message });
  }
}
