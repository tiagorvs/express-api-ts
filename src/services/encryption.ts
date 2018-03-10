import {Config} from '../config';
import * as crypto from 'crypto';
import {DebugConsole} from "../models";

export const EncryptionServices = {

    randomSecret(length: number): string {
        new DebugConsole('EncryptionServices/randomSecret');
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_*()[]æÂê®†Úºîœπ‡Ò∂ƒﬁÌÏÈ¬µ‹≈©◊ß~~…÷≠Ù@€ô—}øÇ¡«¶{‘“ë•@<>≤≥',
            secret = '';
        for (var i = 0; i < length; i++)
            secret += characters.charAt(Math.floor(Math.random() * characters.length));
        return secret;
    },

    hash(secret: string, iterations: number): string {
        new DebugConsole('EncryptionServices/hash');
        let hash = '';
        for (let i = 0; i < iterations; i++) {
            hash = crypto.createHmac('sha512', Config.encryption.hash)
                .update(secret)
                .digest(Config.encryption.binary);
        }
        return hash;
    },

    encrypt(content: string, password: string): string {
        new DebugConsole('EncryptionServices/encrypt');
        let cipher = crypto.createCipher(Config.encryption.algorithm, password),
            crypted = cipher.update(content, 'utf8', 'base64');
        crypted += cipher.final(Config.encryption.binary);
        return crypted;
    },

    decrypt: function (content: string, password: string) {
        new DebugConsole('EncryptionServices/decrypt');
        let decipher = crypto.createDecipher(Config.encryption.algorithm, password),
            dec = decipher.update(content, 'base64', 'utf8');
        dec += decipher.final(Config.encryption.binary);
        return dec;
    }

};