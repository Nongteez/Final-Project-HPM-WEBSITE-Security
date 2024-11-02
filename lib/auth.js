import jwt from 'jsonwebtoken';

export function VerifyToken(token){
    try {
        if(token){
            const deCode = jwt.decode(token);
            if(deCode.exp < Date.now() / 1000) {
                return false
            }else{
                return deCode
            }
            
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}
