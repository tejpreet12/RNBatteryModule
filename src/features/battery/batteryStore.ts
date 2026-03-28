import { create } from 'zustand';
import NativeBatteryModule, {
  type BatterySnapshot,
} from '../../native/battery/NativeBatteryModule';

type Status = 'idle' | 'loading' | 'success' | 'error';

type BatteryState = {
  status: Status;
  snapshot: BatterySnapshot | null;
  error: string | null;
  init: () => Promise<() => void>;
};

export const useBatteryStore = create<BatteryState>((set, get) => ({
  status: 'idle',
  snapshot: null,
  error: null,

  init: async () => {
    set({ status: 'loading', error: null });

    try {
      const snapshot = await NativeBatteryModule.getBatteryState();

      set({ status: 'success', snapshot });

      // 🔥 ADD THIS (missing piece)
      NativeBatteryModule.addListener('onBatteryChanged');

  const subscription = NativeBatteryModule.onBatteryChanged(next => {
    console.log('EVENT RECEIVED:', next);

    set({
      snapshot: next,
      status: 'success',
    });
  });

      return () => {
        subscription.remove();

        NativeBatteryModule.removeListeners(1);
      };
    } catch (e) {
      set({
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to read battery state',
      });

      return () => {};
    }
  },
}));
