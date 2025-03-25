import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token);
        req['user'] = decoded;
        req['authentificated'] = true;
      } catch (error) {
        req['authentificated'] = false;
      }
    }
    next();
  }
}
