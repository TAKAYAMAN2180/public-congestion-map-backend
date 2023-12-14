import {createHash} from 'crypto';

export default function checkVerification(areaNum: number, hashedStr: string) {
    let result = false;
    const rowStr = areaNum + process.env.VERIFICATION_SALT;
    const hashed = encryptSha256(rowStr);
    if (hashed === hashedStr) {
        result = true;
    }
    return result;
}

const encryptSha256 = (str: string) => {
    const hash = createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
}