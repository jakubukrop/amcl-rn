package com.amclrn.crypto;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.Base64;
import java.nio.charset.StandardCharsets;

public class BlsModule extends ReactContextBaseJavaModule {
  static {
    System.loadLibrary("amcl_bls_jni");
  }

  public native String[] keyPairGenerateJNI(String seed);

  public native String signJNI(String message, String sk);

  public native int verifyJNI(String sig, String message, String pk);

  public BlsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "Bls";
  }

  @ReactMethod
  public void keyPairGenerate(String seed, Promise promise) {
    String[] keyStrings = keyPairGenerateJNI(seed);

    WritableMap keys = new WritableNativeMap();
    keys.putString("sk", keyStrings[0]);
    keys.putString("pk", keyStrings[1]);

    promise.resolve(keys);
  }

  @ReactMethod
  public void sign(String message, String sk, Promise promise) {
    String signature = signJNI(message, sk);
    promise.resolve(signature);
  }

  @ReactMethod
  public void verify(String signature, String message, String pk, Promise promise) {
    int verified = verifyJNI(signature, message, pk);
    promise.resolve(verified == 0);
  }

}