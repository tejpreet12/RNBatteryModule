import React, { useEffect } from 'react';
import { Text, View, ActivityIndicator, Pressable } from 'react-native';
import { useBatteryStore } from './batteryStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const BatteryCard = React.memo(function BatteryCard({
  level,
  charging,
  source,
}: {
  level: number;
  charging: boolean;
  source: string;
}) {
  return (
    <View style={{ padding: 16, borderRadius: 16, backgroundColor: '#111827' }}>
      <Text style={{ color: 'white', fontSize: 32, fontWeight: '700' }}>
        {level}%
      </Text>
      <Text style={{ color: 'white', marginTop: 8 }}>
        {charging ? 'Charging' : 'Not charging'} · {source}
      </Text>
    </View>
  );
});

export function BatteryScreen() {
  const { status, snapshot, error, init } = useBatteryStore();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    init().then(fn => {
      cleanup = fn;
    });

    return () => cleanup?.();
  }, []);

  if (status === 'loading') {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, marginBottom: 12 }}>
          Something went wrong
        </Text>
        <Text>{error}</Text>
        <Pressable onPress={() => init()} style={{ marginTop: 16 }}>
          <Text>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      {snapshot ? (
        <BatteryCard
          level={snapshot.level}
          charging={snapshot.charging}
          source={snapshot.source}
        />
      ) : (
        <Text>No battery data yet</Text>
      )}
    </SafeAreaView>
  );
}
