import { BaseLogger } from './base_logger';

export class NoopLogger extends BaseLogger {
  protected log(): void {
    // NOOP
  }
}
