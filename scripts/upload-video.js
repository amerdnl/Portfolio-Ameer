#!/usr/bin/env node

/**
 * Upload a video to Vercel Blob.
 *
 * Usage:
 *   VERCEL_BLOB_READ_WRITE_TOKEN=your_token node scripts/upload-video.js
 *
 * The token can be created at:
 *   https://vercel.com/account/storage/blob/tokens
 *
 * Set it as an env var or in .env.local
 */

import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const token = process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error('❌ VERCEL_BLOB_READ_WRITE_TOKEN not set.');
  console.error('');
  console.error('Create a token at: https://vercel.com/account/storage/blob/tokens');
  console.error('Then run: VERCEL_BLOB_READ_WRITE_TOKEN=your_token node scripts/upload-video.js');
  process.exit(1);
}

const videoPath = path.join(projectRoot, 'public', 'afiq-steve.mp4');
if (!fs.existsSync(videoPath)) {
  console.error(`❌ Video not found: ${videoPath}`);
  process.exit(1);
}

const fileStream = fs.createReadStream(videoPath);
const fileSize = fs.statSync(videoPath).size;

console.log(`📹 Uploading afiq-steve.mp4 (${(fileSize / 1024 / 1024).toFixed(1)} MB)…`);

try {
  const blob = await put('afiq-steve.mp4', fileStream, {
    access: 'public',
    token,
  });

  console.log('✅ Upload complete!');
  console.log('');
  console.log('Copy this URL into Hero.jsx <source src="…">');
  console.log(blob.url);
  console.log('');
  console.log('Example:');
  console.log(`  <source src="${blob.url}" type="video/mp4" />`);
} catch (err) {
  console.error('❌ Upload failed:', err.message);
  if (err.message.includes('401') || err.message.includes('Unauthorized')) {
    console.error('');
    console.error('Your token may be invalid or expired.');
    console.error('Create a new one at: https://vercel.com/account/storage/blob/tokens');
  }
  process.exit(1);
}
