#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <jni.h>
#include <syslog.h>

#include "amcl.h"
#include "config_curve_BLS381.h"

#if CURVE_SECURITY_BLS381 == 128
#include "bls_BLS381.h"
#elif CURVE_SECURITY_BLS381 == 192
#include "bls192_BLS381.h"
#elif CURVE_SECURITY_BLS381 == 256
#include "bls256_BLS381.h"
#endif

// Support multiple security levels
#if CURVE_SECURITY_BLS381 == 128
#define G2LEN 4 * BFS_BLS381
#elif CURVE_SECURITY_BLS381 == 192
#define G2LEN 8 * BFS_BLS381
#elif CURVE_SECURITY_BLS381 == 256
#define G2LEN 16 * BFS_BLS381
#endif

int maxLen64(int len)
{
  return ((len / 3) + 2) * 4 + 1;
}

jobjectArray Java_com_amclrn_crypto_BlsModule_keyPairGenerateJNI(JNIEnv *env, jobject thiz, jstring seed)
{
  char sk[BGS_BLS381];
  octet SK = {0, sizeof(sk), sk};
  char skStr[maxLen64(BGS_BLS381)];

  char pk[G2LEN];
  octet PK = {0, sizeof(pk), pk};
  char pkStr[maxLen64(G2LEN)];

  // TODO: Use secure random generator insterad of NULL, use seed too
  BLS_BLS381_KEY_PAIR_GENERATE(NULL, &SK, &PK);

  // convert SK and PK to base64 strings
  OCT_tobase64(skStr, &SK);
  OCT_tobase64(pkStr, &PK);

  jclass strArrClass = (*env)->FindClass(env, "java/lang/String");
  jobjectArray keyStrings = (*env)->NewObjectArray(env, 2, strArrClass, NULL);
  (*env)->SetObjectArrayElement(env, keyStrings, 0, (*env)->NewStringUTF(env, skStr));
  (*env)->SetObjectArrayElement(env, keyStrings, 1, (*env)->NewStringUTF(env, pkStr));

  return keyStrings;
}

jstring Java_com_amclrn_crypto_BlsModule_signJNI(JNIEnv *env, jobject thiz, jstring msgString, jstring skString)
{
  jboolean isCopy = JNI_FALSE;

  // convert message string to octet
  const char *msgStr = (*env)->GetStringUTFChars(env, msgString, &isCopy);
  char m[sizeof(msgStr)];
  octet M = {0, sizeof(m), m};
  OCT_jstring(&M, (char *)msgStr);

  // convert SK base64 string to octet
  char sk[BGS_BLS381];
  octet SK = {0, sizeof(sk), sk};
  const char *skStr = (*env)->GetStringUTFChars(env, skString, &isCopy);
  OCT_frombase64(&SK, (char *)skStr);

  char sig[BFS_BLS381 + 1];
  octet SIG = {0, sizeof(sig), sig};
  char sigStr[maxLen64(BFS_BLS381 + 1)];

  BLS_BLS381_SIGN(&SIG, &M, &SK);

  // convert SIG to base64 string
  OCT_tobase64(sigStr, &SIG);
  jstring sigString = (*env)->NewStringUTF(env, sigStr);

  // free memory
  (*env)->ReleaseStringUTFChars(env, msgString, msgStr);
  (*env)->ReleaseStringUTFChars(env, skString, skStr);

  return sigString;
}

jint Java_com_amclrn_crypto_BlsModule_verifyJNI(JNIEnv *env, jobject thiz,
                                                jstring sigString, jstring msgString, jstring pkString)
{
  jboolean isCopy = JNI_FALSE;

  // convert message string to octet
  const char *msgStr = (*env)->GetStringUTFChars(env, msgString, &isCopy);
  char m[sizeof(msgStr)];
  octet M = {0, sizeof(m), m};
  OCT_jstring(&M, (char *)msgStr);

  // convert PK base64 string to octet
  char pk[G2LEN];
  octet PK = {0, sizeof(pk), pk};
  const char *pkStr = (*env)->GetStringUTFChars(env, pkString, &isCopy);
  OCT_frombase64(&PK, (char *)pkStr);

  // convert SIG base64 string to octet
  char sig[BFS_BLS381 + 1];
  octet SIG = {0, sizeof(sig), sig};
  const char *sigStr = (*env)->GetStringUTFChars(env, sigString, &isCopy);
  OCT_frombase64(&SIG, (char *)sigStr);

  int result = BLS_BLS381_VERIFY(&SIG, &M, &PK);

  // free memory
  (*env)->ReleaseStringUTFChars(env, msgString, msgStr);
  (*env)->ReleaseStringUTFChars(env, pkString, pkStr);
  (*env)->ReleaseStringUTFChars(env, sigString, sigStr);

  return result;
}