
import {TurboModuleRegistry} from 'react-native';
import type {TurboModule, CodegenTypes} from 'react-native';

export type BatterySnapshot = {
  level: number;      // 0 - 100
  charging: boolean;
  source: string;     // "ac" | "usb" | "wireless" | "unknown"
};

export interface Spec extends TurboModule {
  getBatteryState(): Promise<BatterySnapshot>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
  readonly onBatteryChanged: CodegenTypes.EventEmitter<BatterySnapshot>;

}

export default TurboModuleRegistry.getEnforcing<Spec>('BatteryModule');