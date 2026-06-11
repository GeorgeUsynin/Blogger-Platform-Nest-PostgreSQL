export type DeviceState = {
  deviceId: string;
  userId: number;
  clientIp: string;
  deviceName: string;
  issuedAt: Date;
  expiresIn: Date;
};

export type CreateDeviceInput = DeviceState;

export type UpdateSessionInput = {
  issuedAt: Date;
  expiresIn: Date;
};

export type ReconstructDeviceInput = DeviceState;
