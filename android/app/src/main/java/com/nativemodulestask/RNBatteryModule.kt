package com.nativemodulestask

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap

class RNBatteryModule(private val reactContext: ReactApplicationContext)
  : NativeBatteryModuleSpec(reactContext) {

  companion object {
    const val NAME = "BatteryModule"
  }

  private var receiver: BroadcastReceiver? = null

  override fun getName() = NAME

  override fun getBatteryState(promise: Promise) {
    try {
      promise.resolve(readBatteryMap())
    } catch (e: Exception) {
      promise.reject("BATTERY_READ_ERROR", e.message, e)
    }
  }

  private fun readBatteryMap(): WritableMap {
    val intent = reactContext.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))

    val levelRaw = intent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
    val scale = intent?.getIntExtra(BatteryManager.EXTRA_SCALE, 100) ?: 100
    val status = intent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
    val plugged = intent?.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1) ?: -1

    val level = if (levelRaw >= 0 && scale > 0) (levelRaw * 100.0 / scale).toInt() else -1
    val charging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
      status == BatteryManager.BATTERY_STATUS_FULL

    val source = when (plugged) {
      BatteryManager.BATTERY_PLUGGED_AC -> "ac"
      BatteryManager.BATTERY_PLUGGED_USB -> "usb"
      BatteryManager.BATTERY_PLUGGED_WIRELESS -> "wireless"
      else -> "unknown"
    }

    return Arguments.createMap().apply {
      putInt("level", level)
      putBoolean("charging", charging)
      putString("source", source)
    }
  }

  private fun startBatteryUpdates() {
    if (receiver != null) return

    receiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context?, intent: Intent?) {
        android.util.Log.d("BatteryModule", "Battery update received")
        emitOnBatteryChanged(readBatteryMap())
      }
    }

    reactContext.registerReceiver(receiver, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
  }

  override fun addListener(eventName: String?) {
    if (eventName == "onBatteryChanged") {
      startBatteryUpdates()
    }
    emitOnBatteryChanged(readBatteryMap())
  }

  override fun removeListeners(count: Double) {
    if (count == 0.0) {
      receiver?.let { reactContext.unregisterReceiver(it) }
      receiver = null
    }
  }
}