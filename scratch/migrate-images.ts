import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const prisma = new PrismaClient();
const BUCKET_NAME = 'images';
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

async function migrateImages() {
  console.log('Starting image migration to Supabase...');

  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log('No public/uploads directory found. Nothing to migrate.');
    return;
  }

  const files = fs.readdirSync(UPLOADS_DIR);
  console.log(`Found ${files.length} files in local uploads directory.`);

  for (const file of files) {
    const filePath = path.join(UPLOADS_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(file).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    console.log(`Uploading ${file} to Supabase bucket '${BUCKET_NAME}'...`);
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(file, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`Failed to upload ${file}:`, error.message);
      continue;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(file);
      
    const publicUrl = publicUrlData.publicUrl;
    console.log(`Success! Public URL: ${publicUrl}`);

    // Update database records
    // In our schema, images might be stored in the Image table or other fields
    // Based on typical Prisma schema, let's update the Image table url
    try {
      const result = await prisma.image.updateMany({
        where: {
          url: `/uploads/${file}`
        },
        data: {
          url: publicUrl
        }
      });
      if (result.count > 0) {
         console.log(`Updated ${result.count} records in the Image table for ${file}.`);
      }

      // Check if there are other models that store url (like Room.featuredImage)
      // Since it's dynamic, we might need to handle specific tables if they store direct URLs
      // Usually, images are just in the Image table.
    } catch (dbErr) {
      console.error(`Error updating DB for ${file}:`, dbErr);
    }
  }

  console.log('Image migration complete!');
}

migrateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
