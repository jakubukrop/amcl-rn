# amcl-rn

This is an example of using [Apache Milagro Crypto Library](https://github.com/apache/incubator-milagro-crypto-c) (AMCL) in a React Native app.

Currently works only for Android.

The current showcase uses the following AMCL functions:

    BLS_BLS381_KEY_PAIR_GENERATE
    BLS_BLS381_SIGN
    BLS_BLS381_VERIFY

## Compliling Milagro

Compiled AMCL libraries are already part of this repo (`/android/app/src/main/jniLibs`).

To compile AMCL for Android yourselves, go to a cloned `incubator-milagro-crypto-c/build` and use

    cmake \
      -D CMAKE_BUILD_TYPE=Release \
      -D BUILD_SHARED_LIBS=ON \
      -D AMCL_CHUNK=64 \
      -D AMCL_CURVE="BLS381" \
      -D AMCL_RSA="" \
      -D BUILD_PYTHON=OFF \
      -D BUILD_BLS=ON \
      -D BUILD_WCC=OFF \
      -D BUILD_MPIN=ON \
      -D BUILD_X509=OFF \
      -D CMAKE_INSTALL_PREFIX=/usr/local \
      -D CMAKE_TOOLCHAIN_FILE=$NDK_HOME/build/cmake/android.toolchain.cmake \
      -D ANDROID_ABI=arm64-v8a \
      -D ANDROID_PLATFORM=28 \
      ..
    make

- Make sure `$NDK_HOME` points to you NDK instalation folder.
- Use `ANDROID_ABI` to specify desired architecture. Standard architectures are: `armeabi-v7a`, `x86`, `arm64-v8a`, `x86_64`.
- Use `ANDROID_PLATFORM` to specify minimal supported SDK version.
- Note that the `cmake` example above build only the BLS and MPIN modules.
