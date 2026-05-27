export class UserContextDto {
  userId: number;
}

export class UserContextWithDeviceIdDto extends UserContextDto {
  deviceId: string;
}
