cmake_minimum_required(VERSION 3.1 FATAL_ERROR)

# link 3rd-party directories
link_directories(src/main/jniLibs/${ANDROID_ABI})

# add jni library
add_library(amcl_bls_jni SHARED src/main/cpp/amcl_bls_jni.c)

# include headers
target_include_directories(amcl_bls_jni PUBLIC src/main/jniLibs/include)

# link 3rd-party libs
target_link_libraries(amcl_bls_jni PUBLIC amcl_bls_BLS381 amcl_core)
