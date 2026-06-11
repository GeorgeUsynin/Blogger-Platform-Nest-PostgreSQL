import { DB_TABLE_NAMES } from '../../../../constants';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../users/infrastructure/entities';
import { CreateDeviceDomainDto, UpdateDeviceDomainDto } from './dto';
import { NotAnOwnerOfThisDevice } from '../../../../core/exceptions';

@Entity({ name: DB_TABLE_NAMES.DEVICES })
export class Device {
  @PrimaryColumn({ type: 'uuid' })
  deviceId: string;

  @Column({ name: 'userId', type: 'integer' })
  userId: number;

  @Column({ type: 'timestamp with time zone' })
  issuedAt: Date;

  @Column({ type: 'varchar' })
  deviceName: string;

  @Column({ type: 'varchar' })
  clientIp: string;

  @Column({ type: 'timestamp with time zone' })
  expiresIn: Date;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  static create(dto: CreateDeviceDomainDto): Device {
    const device = new Device();

    device.deviceId = dto.deviceId;
    device.userId = dto.userId;
    device.clientIp = dto.clientIp;
    device.deviceName = dto.deviceName;
    device.issuedAt = dto.issuedAt;
    device.expiresIn = dto.expiresIn;

    return device;
  }

  public updateAttributes(dto: UpdateDeviceDomainDto): void {
    this.issuedAt = dto.issuedAt;
    this.expiresIn = dto.expiresIn;
  }

  public isDeviceOwner(userId: number): boolean {
    return this.userId === userId;
  }

  public isDeviceIssuedAtMatch(issuedAt: Date): boolean {
    return this.issuedAt.toISOString() === issuedAt.toISOString();
  }

  public ensureDeviceOwner(userId: number) {
    if (this.userId !== userId) {
      throw new NotAnOwnerOfThisDevice();
    }

    return true;
  }
}
