export interface CameraParam {
  id: string;
  title: string; // 标题（20字以内）
  description: string; // 图片内容解说（300字以内）
  images: string[]; // 9张图片URL
  thumbnail: string; // 缩略图（第一张图片）
  cameraSettings: {
    iso: string; // ISO（感光度）
    shutterSpeed: string; // 快门速度
    aperture: string; // 光圈
    whiteBalance: string; // 白平衡
    focus: string; // 对焦
    exposure: string; // 曝光补偿
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
