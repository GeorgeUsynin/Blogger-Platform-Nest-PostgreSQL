import {
  TerminateAllDevicesExceptCurrentUseCase,
  TerminateDeviceByDeviceIdUseCase,
} from './application';
import {
  DeviceEntity,
  DevicesQueryRepository,
  DevicesRepository,
} from './infrastructure';

export { DevicesController } from './api';

export const devicesProviders = [DevicesRepository, DevicesQueryRepository];

export const devicesUseCases = [
  TerminateAllDevicesExceptCurrentUseCase,
  TerminateDeviceByDeviceIdUseCase,
];

export const entities = [DeviceEntity];
