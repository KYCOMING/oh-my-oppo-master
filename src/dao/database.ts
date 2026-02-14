import * as SQLite from 'expo-sqlite';
import { CameraParam } from '@/api/public-apis/types';

const DATABASE_NAME = 'camera_params.db';

let db: SQLite.SQLiteDatabase | null = null;

const initialData: CameraParam[] = [
  {
    id: 'cam1',
    title: '夜景模式随手拍',
    description: '在低光环境下拍摄的夜景样张，强调城市灯光与轮廓。',
    images: [
      'https://picsum.photos/seed/ny1/800/600',
      'https://picsum.photos/seed/ny2/800/600',
      'https://picsum.photos/seed/ny3/800/600',
      'https://picsum.photos/seed/ny4/800/600',
      'https://picsum.photos/seed/ny5/800/600',
      'https://picsum.photos/seed/ny6/800/600',
      'https://picsum.photos/seed/ny7/800/600',
      'https://picsum.photos/seed/ny8/800/600',
      'https://picsum.photos/seed/ny9/800/600',
    ],
    thumbnail: 'https://picsum.photos/seed/ny1/400/300',
    cameraSettings: {
      shootMode: 'PRO',
      filter: 'standard',
      softLight: 'none',
      tone: 50,
      saturation: 50,
      temperature: 50,
      tint: 50,
      sharpness: 50,
      vignette: 'off',
    },
    author: {
      phone: '13800000001',
      nickname: '小明',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cam2',
    title: '人像虚化效果',
    description: '前景清晰、背景虚化，突出演示主体。',
    images: [
      'https://picsum.photos/seed/portrait1/800/600',
      'https://picsum.photos/seed/portrait2/800/600',
      'https://picsum.photos/seed/portrait3/800/600',
      'https://picsum.photos/seed/portrait4/800/600',
      'https://picsum.photos/seed/portrait5/800/600',
      'https://picsum.photos/seed/portrait6/800/600',
      'https://picsum.photos/seed/portrait7/800/600',
      'https://picsum.photos/seed/portrait8/800/600',
      'https://picsum.photos/seed/portrait9/800/600',
    ],
    thumbnail: 'https://picsum.photos/seed/portrait1/400/300',
    cameraSettings: {
      shootMode: 'PRO',
      filter: 'vivid',
      softLight: 'soft',
      tone: 60,
      saturation: 70,
      temperature: 40,
      tint: 50,
      sharpness: 65,
      vignette: 'on',
    },
    author: {
      phone: '13800000002',
      nickname: '阿强',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cam3',
    title: '运动场景抓拍',
    description: '高速运动的瞬间定格，画面干净锐利。',
    images: [
      'https://picsum.photos/seed/sport1/800/600',
      'https://picsum.photos/seed/sport2/800/600',
      'https://picsum.photos/seed/sport3/800/600',
      'https://picsum.photos/seed/sport4/800/600',
      'https://picsum.photos/seed/sport5/800/600',
      'https://picsum.photos/seed/sport6/800/600',
      'https://picsum.photos/seed/sport7/800/600',
      'https://picsum.photos/seed/sport8/800/600',
      'https://picsum.photos/seed/sport9/800/600',
    ],
    thumbnail: 'https://picsum.photos/seed/sport1/400/300',
    cameraSettings: {
      shootMode: 'PRO',
      filter: 'clear',
      softLight: 'dreamy',
      tone: 45,
      saturation: 55,
      temperature: 30,
      tint: 60,
      sharpness: 80,
      vignette: 'off',
    },
    author: {
      phone: '13800000003',
      nickname: '阿勋',
    },
    createdAt: new Date().toISOString(),
  },
];

async function seedInitialData(database: SQLite.SQLiteDatabase): Promise<void> {
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM camera_params'
  );
  
  if (result && result.count === 0) {
    for (const param of initialData) {
      await database.runAsync(
        `INSERT INTO camera_params (id, title, description, images, thumbnail, camera_settings, author_phone, author_nickname, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          param.id,
          param.title,
          param.description,
          JSON.stringify(param.images),
          param.thumbnail,
          JSON.stringify(param.cameraSettings),
          param.author.phone,
          param.author.nickname || null,
          param.createdAt,
        ]
      );
    }
  }
}

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS camera_params (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        images TEXT NOT NULL,
        thumbnail TEXT,
        camera_settings TEXT NOT NULL,
        author_phone TEXT,
        author_nickname TEXT,
        created_at TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_created_at ON camera_params(created_at);
    `);

    await seedInitialData(db);

    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    return initDatabase();
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
