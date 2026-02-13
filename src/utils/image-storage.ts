import { File, Directory, Paths } from 'expo-file-system';

const IMAGES_DIR_NAME = 'images';

async function ensureImageDirectory(): Promise<Directory> {
  const imagesDir = new Directory(Paths.document, IMAGES_DIR_NAME);
  if (!imagesDir.exists) {
    imagesDir.create();
  }
  return imagesDir;
}

export async function copyImageToDocuments(uri: string): Promise<string> {
  const imagesDir = await ensureImageDirectory();
  
  const extension = uri.split('.').pop() || 'jpg';
  const filename = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
  
  const sourceFile = new File(uri);
  const destFile = imagesDir.createFile(filename, `image/${extension === 'jpg' ? 'jpeg' : extension}`);
  
  const content = await sourceFile.arrayBuffer();
  const writable = destFile.writableStream();
  const writer = writable.getWriter();
  await writer.write(new Uint8Array(content));
  await writer.close();
  
  return destFile.uri;
}

export async function copyImagesToDocuments(uris: string[]): Promise<string[]> {
  const copied: string[] = [];
  for (const uri of uris) {
    const newUri = await copyImageToDocuments(uri);
    copied.push(newUri);
  }
  return copied;
}

export async function deleteImage(uri: string): Promise<void> {
  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
}
