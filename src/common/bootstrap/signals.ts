import { Logger } from '@nestjs/common';

export const subscribeNodeSignals = (logger: Logger) => {
  const signalsNames: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];

  signalsNames.forEach((signalName) =>
    process.on(signalName, (signal) => {
      logger.log(`Retrieved signal: ${signal}, application terminated`, 'Bootstrap');
      process.exit(0);
    }),
  );

  process.on('uncaughtException', (error: Error) => {
    logger.error({ error }, 'Bootstrap');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Promise Rejection, reason: ${reason}`, 'Bootstrap');
    promise.catch((error: Error) => {
      logger.error({ error });
      process.exit(1);
    });
  });
};
