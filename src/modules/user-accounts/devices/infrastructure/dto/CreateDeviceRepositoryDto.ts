export class CreateDeviceRepositoryDto {
  deviceId: string;
  userId: number;
  issuedAt: Date;
  deviceName: string;
  clientIp: string;
  expiresIn: Date;
}
