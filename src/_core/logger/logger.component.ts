import { Component } from '@nestjs/common';
import * as clfDate from 'clf-date';
import { Logger as WinstonLogger, transports } from 'winston';

import { Context } from '../context/context.component';
import { Env } from '../env/env.component';

@Component()
export class Logger extends WinstonLogger {
  constructor(env: Env, ctx: Context) {
    const formatter = ({ message }) => {
      const rId = ctx.requestId;

      return `[RQID=${rId}] [PID=${process.pid}] [${clfDate()}] ${message}`;
    };

    super({
      transports: [
        env.isProduction()
          ? new transports.File({
              filename: env.LOG_FILE,
              formatter,
              json: false,
              level: env.LOG_LEVEL,
              maxFiles: 5,
              maxsize: 5242880,
            })
          : new transports.Console({
              colorize: true,
              formatter,
              json: false,
              level: env.LOG_LEVEL,
            }),
      ],
    });
  }
}