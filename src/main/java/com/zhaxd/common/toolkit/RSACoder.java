package com.zhaxd.common.toolkit;

import java.io.*;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import java.util.HashMap;
import java.util.Map;

import javax.crypto.*;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
import sun.security.rsa.RSAPrivateCrtKeyImpl;
import sun.security.rsa.RSAPublicKeyImpl;

/**
 * RSA安全编码组件
 * @author ch
 * 2013-11-8 下午02:43:27
 */
public abstract class RSACoder  {
    public static final String RSA = "RSA";
    public static final String SIGNATURE_ALGORITHM = "MD5withRSA";
    private static final String RSANOPADDING = "RSA/ECB/NoPadding";
    public static final String PUBLIC_KEY = "RSAPublicKey";
    public static final String PRIVATE_KEY = "RSAPrivateKey";

    public static byte[] decryptBASE64(String key) throws IOException{
        return (new BASE64Decoder()).decodeBuffer(key);
    }
    public static String encryptBASE64(byte[] data){
        return (new BASE64Encoder()).encodeBuffer(data);
    }
    /**
     * 用私钥对信息生成数字签名
     * @param data  加密数据
     * @param privateKey 私钥
     * @return
     * @throws Exception
     */
    public static String sign(byte[] data, String privateKey) throws Exception {
        // 解密由base64编码的私钥
        byte[] keyBytes = decryptBASE64(privateKey);
        // 构造PKCS8EncodedKeySpec对象
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        // RSA 指定的加密算法
        KeyFactory keyFactory = KeyFactory.getInstance(RSA);
        // 取私钥匙对象
        PrivateKey priKey = keyFactory.generatePrivate(pkcs8KeySpec);
        // 用私钥对信息生成数字签名
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initSign(priKey);
        signature.update(data);

        return encryptBASE64(signature.sign());
    }

    /**
     * 校验数字签名
     * @param data 加密数据
     * @param publicKey 公钥
     * @param sign 数字签名
     * @return 校验成功返回true 失败返回false
     * @throws Exception
     *
     */
    public static boolean verify(byte[] data, String publicKey, String sign)
            throws Exception {
        // 解密由base64编码的公钥
        byte[] keyBytes = decryptBASE64(publicKey);
        // 构造X509EncodedKeySpec对象
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        // RSA 指定的加密算法
        KeyFactory keyFactory = KeyFactory.getInstance(RSA);
        // 取公钥匙对象
        PublicKey pubKey = keyFactory.generatePublic(keySpec);
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initVerify(pubKey);
        signature.update(data);
        // 验证签名是否正常
        return signature.verify(decryptBASE64(sign));
    }


    public static  byte[] decrypt(byte[] data, Key key,String Algorithm,int bitLength) throws NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, IllegalBlockSizeException, InvalidKeyException, IOException, ShortBufferException {
        // 对数据解密
        Cipher cipher = Cipher.getInstance(Algorithm);
        cipher.init(Cipher.DECRYPT_MODE, key);
        return process(cipher, data, bitLength/8);
    }

    public static  byte[] encrypt(byte[] data, Key key,String Algorithm,int bitLength) throws NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, IllegalBlockSizeException, InvalidKeyException, IOException, ShortBufferException {
        // 对数据解密
        Cipher cipher = Cipher.getInstance(Algorithm);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return process(cipher, data, bitLength/8-11);
    }

    public static byte[] process( Cipher cipher,byte[] data,int byteSize) throws IOException, BadPaddingException, IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException, ShortBufferException {
        ByteArrayInputStream is=new ByteArrayInputStream(data);
        ByteArrayOutputStream os=new ByteArrayOutputStream(byteSize);
        ByteArrayOutputStream result=new ByteArrayOutputStream();
        int n = 0;
        byte [] buffer = new byte[byteSize];
        while((n = is.read(buffer))>0){
            os.write(buffer,0,n);
            byte[] temp=cipher.doFinal(buffer,0,n);
            result.write(temp);
        }
        return  result.toByteArray();
    }

    /**
     * 解密<br>
     * 用私钥解密
     * @param data
     * @param key
     * @return
     * @throws Exception
     */
    public static byte[] decryptByPrivateKey(byte[] data, String key)
            throws Exception {
        // 对密钥解密
        byte[] keyBytes = decryptBASE64(key);
        // 取得私钥
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA);
        Key privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
        // 对数据解密
        return decrypt(data,privateKey,keyFactory.getAlgorithm(),((RSAPrivateCrtKeyImpl)privateKey).getModulus().bitLength());
    }

    /**
     * 解密<br>
     * 用公钥解密
     * @param data
     * @param key
     * @return
     * @throws Exception
     */
    public static byte[] decryptByPublicKey(byte[] data, String key)
            throws Exception {
        // 对密钥解密
        byte[] keyBytes = decryptBASE64(key);
        // 取得公钥
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA);
        Key publicKey = keyFactory.generatePublic(x509KeySpec);
        // 对数据解密
        return decrypt(data,publicKey,keyFactory.getAlgorithm(),((RSAPublicKeyImpl)publicKey).getModulus().bitLength());
    }

    /**
     * 加密<br>
     * 用公钥加密
     *
     * @param data
     * @param key
     * @return
     * @throws Exception
     */
    public static byte[] encryptByPublicKey(byte[] data, String key)
            throws Exception {
        // 对公钥解密
        byte[] keyBytes = decryptBASE64(key);
        // 取得公钥
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA);
        PublicKey publicKey = keyFactory.generatePublic(x509KeySpec);
        // 对数据加密
        return encrypt(data,publicKey,keyFactory.getAlgorithm(),((RSAPublicKeyImpl)publicKey).getModulus().bitLength());
    }

    /**
     * 加密<br>
     * 用私钥加密
     * @param data
     * @param key
     * @return
     * @throws Exception
     */
    public static byte[] encryptByPrivateKey(byte[] data, String key)
            throws Exception {
        // 对密钥解密
        byte[] keyBytes = decryptBASE64(key);
        // 取得私钥
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA);
        Key privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
        // 对数据加密
        return encrypt(data,privateKey,keyFactory.getAlgorithm(),((RSAPrivateCrtKeyImpl)privateKey).getModulus().bitLength());
    }

    /**
     * 取得私钥
     * @return
     * @throws Exception
     */
    public static String getPrivateKey()
            throws Exception {
        return keyMap.get(PRIVATE_KEY);
    }

    /**
     * 取得公钥
     * @return
     * @throws Exception
     */
    public static String getPublicKey()
            throws Exception {
        return  keyMap.get(PUBLIC_KEY);
    }
    public static Map<String, String> keyMap;
    /**
     * 初始化密钥
     *
     * @return
     * @throws Exception
     */
    public static Map<String, String> initKey() throws Exception {
        if(keyMap==null){
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(RSA);
            keyPairGen.initialize(512);
            KeyPair keyPair = keyPairGen.generateKeyPair();
            // 公钥
            RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
            // 私钥
            RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
            keyMap = new HashMap<String, String>(2);
            keyMap.put(PUBLIC_KEY,encryptBASE64(publicKey.getEncoded()));
            keyMap.put(PRIVATE_KEY, encryptBASE64(privateKey.getEncoded()));
        }
        return keyMap;
    }

    public static String readFileContent(String fileName) {
        File file = new File(fileName);
        BufferedReader reader = null;
        StringBuffer sbf = new StringBuffer();
        try {
            reader = new BufferedReader(new FileReader(file));
            String tempStr;
            while ((tempStr = reader.readLine()) != null) {
                sbf.append(tempStr);
            }
            reader.close();
            return sbf.toString();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        }
        return sbf.toString();
    }
}
