import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtilsService {
  constructor(private jwtService: JwtService) {}

  /**
   * Generates an access token with a 1-minute expiration.
   * @param payload - The payload to include in the token.
   * @returns The generated access token.
   */
  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '1m' });
  }

  /**
   * Generates a refresh token with a 7-day expiration.
   * @param payload - The payload to include in the token.
   * @returns The generated refresh token.
   */
  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  /**
   * Verifies a JWT token.
   * @param token - The token to verify.
   * @returns The decoded payload if valid.
   * @throws Error if the token is invalid.
   */
  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}