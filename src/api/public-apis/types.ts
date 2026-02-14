export interface CameraParam {
  id: string;
  title: string; // 标题（20字以内）
  description: string; // 图片内容解说（300字以内）
  images: string[]; // 9张图片URL
  thumbnail: string; // 缩略图（第一张图片）
  cameraSettings: {
    // 基础参数
    shootMode: 'AUTO' | 'PRO'; // 拍摄模式
    filter: string; // 滤镜风格
    softLight: 'none' | 'soft' | 'dreamy' | 'hazy'; // 柔光效果
    // 调色参数 (0-100)
    tone: number; // 影调
    saturation: number; // 饱和度
    temperature: number; // 冷暖
    tint: number; // 青品
    sharpness: number; // 锐度
    // 其他
    vignette: 'on' | 'off'; // 暗角
  };
  author: {
    phone: string; // 提交者手机号
    nickname?: string; // 昵称（可选）
  };
  createdAt: string; // 创建时间（ISO格式）
}

export interface User {
  phone: string;
  nickname?: string;
  avatar?: string;
  token: string;
}

export interface LoginRequest {
  phone: string;
  verifyCode: string;
}

export interface SubmitRequest {
  title: string;
  description: string;
  images: string[];
  cameraSettings: CameraParam['cameraSettings'];
}
