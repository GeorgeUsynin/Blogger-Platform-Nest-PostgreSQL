export class CreateDeviceDomainDto {
  userId: number;
  deviceId: string;
  deviceName: string;
  clientIp: string;
  issuedAt: Date;
  expiresIn: Date;
}
