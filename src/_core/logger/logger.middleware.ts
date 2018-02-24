import { ExpressMiddleware, Middleware, NestMiddleware } from '@nestjs/common';
import * as fs from 'fs';
import * as morgan from 'morgan';
import * as path from 'path';
import * as uuid from 'uuid';

import { Context } from '../context/context.component';
import { Env } from '../env/env.component';
import { Logger } from '../logger/logger.component';

@Middleware()
export class LoggerMiddleware implements NestMiddleware {
  private format: string;

  constructor(private env: Env, ctx: Context) {
    this.format =
      '[RQID=:request-id] [PID=:process-id] [:date[clf]] :method :url :status :response-time ms';

    morgan.token('request-id', () => ctx.requestId);
    morgan.token('process-id', () => process.pid);
  }

  public resolve(...args: any[]): ExpressMiddleware {
    if (this.env.isProduction()) {
      return morgan(this.format, {
        stream: fs.createWriteStream(
          path.join(process.cwd(), this.env.LOG_FILE),
          {
            flags: 'a',
          },
        ),
      });
    } else {
      return morgan(this.format);
    }
  }
}