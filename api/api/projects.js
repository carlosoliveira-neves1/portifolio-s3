// api/projects.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:          process.env.AWS_REGION,
});

const BUCKET = process.env.AWS_S3_BUCKET;
const KEY    = 'projects.json';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      try {
        const obj = await s3.getObject({ Bucket: BUCKET, Key }).promise();
        const projects = JSON.parse(obj.Body.toString());
        return res.status(200).json(projects);
      } catch (err) {
        // Se não existe o arquivo, retorna lista vazia
        if (err.code === 'NoSuchKey' || err.code === 'NoSuchBucket') {
          return res.status(200).json([]);
        }
        throw err;
      }
    }

    if (req.method === 'POST') {
      const projects = req.body;
      await s3
        .putObject({
          Bucket:      BUCKET,
          Key,
          Body:        JSON.stringify(projects, null, 2),
          ContentType: 'application/json',
          ACL:         'public-read',
        })
        .promise();
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET','POST']);
    return res.status(405).json({ error: 'MethodNotAllowed' });
  } catch (err) {
    console.error('ERROR /api/projects', err);
    // Sempre JSON de erro
    return res.status(500).json({
      error:   err.code || 'InternalError',
      message: err.message
    });
  }
}
