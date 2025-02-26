import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { RequestService } from '../setup/request';
import { ExpressRequest } from '/common/types';
import { Observable } from 'rxjs';
import { Env } from '../env';
import chalk from 'chalk';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    if (!RequestService.hasRequestId(request)) {
      RequestService.injectRequestId(request);
    }

    const response = context.switchToHttp().getResponse();
    const requestService = new RequestService(request);
    const logger = new Logger(requestService.getRequestId());
    const started = Date.now();

    // Inject logger into request
    request.logger = logger;

    const whiteListedPaths = ['health', 'docs', 'swagger-ui'];
    const isWhiteListed = whiteListedPaths.some((path) => request.url.includes(path));

    const text = {
      started: 'Started',
      completed: 'Completed',
      payload: 'Payload',
    };
    if (!Env.isProd) {
      const randomColors = [
        chalk.underline,
        chalk.green.underline,
        chalk.yellow.underline,
        chalk.blue.underline,
        chalk.magenta.underline,
        chalk.cyan.underline,
        chalk.white.underline,
        chalk.gray.underline,
      ];

      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      text.started = randomColor(text.started);
      text.completed = randomColor(text.completed);
      text.payload = randomColor(text.payload);
    }

    const { ip, method, originalUrl } = request;
    const userAgent = (Env.isProd && request.get('user-agent')) || '';

    response.on('finish', () => {
      const ended = Date.now();
      const delta = ended - started;
      const { statusCode: code } = response;
      const logText = `${text.completed} ${method} ${code} in ${delta}ms ${originalUrl} - ${userAgent} ${ip}`;
      isWhiteListed || logger.log(logText);
    });

    isWhiteListed || logger.log(`${text.started} ${method} ${originalUrl} - ${userAgent} ${ip}`);
    isWhiteListed || logger.log(`${text.payload} ${JSON.stringify(request.body)}`);

    return next.handle();
  }
}
