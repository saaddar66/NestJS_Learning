import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Where do we get the token from? (The "Authorization: Bearer ..." header)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2. Should we ignore expired tokens? No, reject them.
      ignoreExpiration: false,
      
      // 3. The secret key to verify the signature (MUST match what you use in AuthModule)
      secretOrKey: 'YOUR_SECRET_KEY', // In production, use process.env.JWT_SECRET
    });
  }

  // 4. This runs after the token is verified.
  // The return value here is injected into the Request object as `req.user`
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}