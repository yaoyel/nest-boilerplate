import { Component } from '@nestjs/common';
import { createNamespace, getNamespace } from 'cls-hooked';
import * as yenv from 'yenv';

import { Env } from '../env/env.component';

export enum ContextTypes {
  ROOT = 'context',
  REQUEST = 'request',
  RESPONSE = 'response',
}

@Component()
export class Context {
  constructor(private env: Env) {}

  public create(cb) {
    const session = createNamespace(ContextTypes.ROOT);

    session.run(() => {
      cb(session);
    });
  }

  public get requestId() {
    return this.getRequest().id;
  }

  private getContext() {
    return getNamespace(ContextTypes.ROOT);
  }

  private getRequest() {
    return this.getContext().get(ContextTypes.REQUEST);
  }

  private getResponse() {
    return this.getContext().get(ContextTypes.RESPONSE);
  }
}