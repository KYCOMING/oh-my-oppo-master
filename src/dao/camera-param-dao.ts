import { getDatabase } from './database';
import { CameraParam } from '@/api/public-apis/types';

interface CameraParamRow {
  id: string;
  title: string;
  description: string | null;
  images: string;
  thumbnail: string | null;
  camera_settings: string;
  author_phone: string | null;
  author_nickname: string | null;
  created_at: string;
}

function rowToCameraParam(row: CameraParamRow): CameraParam {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    images: JSON.parse(row.images),
    thumbnail: row.thumbnail || '',
    cameraSettings: JSON.parse(row.camera_settings),
    author: {
      phone: row.author_phone || '',
      nickname: row.author_nickname || undefined,
    },
    createdAt: row.created_at,
  };
}

function cameraParamToRow(param: CameraParam): Omit<CameraParamRow, 'id'> {
  return {
    title: param.title,
    description: param.description,
    images: JSON.stringify(param.images),
    thumbnail: param.thumbnail,
    camera_settings: JSON.stringify(param.cameraSettings),
    author_phone: param.author.phone,
    author_nickname: param.author.nickname || null,
    created_at: param.createdAt,
  };
}

export const cameraParamDAO = {
  async getAll(): Promise<CameraParam[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<CameraParamRow>(
      'SELECT * FROM camera_params ORDER BY created_at DESC'
    );
    return result.map(rowToCameraParam);
  },

  async getById(id: string): Promise<CameraParam | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<CameraParamRow>(
      'SELECT * FROM camera_params WHERE id = ?',
      [id]
    );
    return result ? rowToCameraParam(result) : null;
  },

  async insert(param: CameraParam): Promise<void> {
    const db = await getDatabase();
    const row = cameraParamToRow(param);
    await db.runAsync(
      `INSERT INTO camera_params (id, title, description, images, thumbnail, camera_settings, author_phone, author_nickname, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        param.id,
        row.title,
        row.description,
        row.images,
        row.thumbnail,
        row.camera_settings,
        row.author_phone,
        row.author_nickname,
        row.created_at,
      ]
    );
  },

  async update(id: string, updates: Partial<CameraParam>): Promise<boolean> {
    const db = await getDatabase();
    const existing = await this.getById(id);
    if (!existing) {
      return false;
    }

    const updated = { ...existing, ...updates };
    const row = cameraParamToRow(updated);

    await db.runAsync(
      `UPDATE camera_params SET title = ?, description = ?, images = ?, thumbnail = ?, camera_settings = ?, author_phone = ?, author_nickname = ? WHERE id = ?`,
      [
        row.title,
        row.description,
        row.images,
        row.thumbnail,
        row.camera_settings,
        row.author_phone,
        row.author_nickname,
        id,
      ]
    );
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM camera_params WHERE id = ?', [id]);
    return result.changes > 0;
  },
};
