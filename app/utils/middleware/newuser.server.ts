import jwt from "jsonwebtoken";
export function checkNewUser(jwtToken: string) {
    try {
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_TOKEN_SECRET_KEY!);
        return decodedToken;
      } catch (error) {
        throw (error);
      }
}