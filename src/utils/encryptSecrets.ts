import EthCrypto from 'eth-crypto';

export const encryptWithPublicKey = async (publicKey: string, message: string): Promise<string> => {

  const encrypted = await EthCrypto.encryptWithPublicKey(publicKey, message);

  return EthCrypto.cipher.stringify(encrypted);
};