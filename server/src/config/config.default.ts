import { EggAppConfig, EggAppInfo, PowerPartial, Context } from 'midway';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // elk log，404
  config.middleware = [ 'elkLogger', 'notFound' ];

  const bizConfig = {
    sourceUrl: '',
    elkLogger: {
      // request url match
      match(ctx: Context) {
        const reg = /.*/;
        return reg.test(ctx.url);
      },
      // 是否启用
      enable: true,
    },
  };
  // security
  config.security = {
    csrf: {
      enable: false,
    },
    methodnoallow: {
      enable: false,
    },
  };
  // CORS
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    origin(ctx: Context) {
      const origin: string = ctx.get('origin');
      // console.log(origin, 'orgin');
      // 允许*域名访问
      if (origin.indexOf('') > -1) {
        // console.log('come in');
        return origin;
      } else {
        return '*';
      }
    },
  };

  // logger
  config.logger = {
    outputJSON: false,
    appLogName: 'app.log',
    coreLogName: 'core.log',
    agentLogName: 'agent.log',
    errorLogName: 'error.log',
  };

  // business domain
  config.apiDomain = {};

  // jsonwebtoken
  config.jwt = {
    secret: '123456',
    enable: true,
    match(ctx: Context) {
      const reg = /login|register/;
      return !reg.test(ctx.originalUrl);
    },
  };

  // socket io setting
  config.io = {
    namespace: {
      '/socket': {
        connectionMiddleware: [ 'auth', 'join', 'leave' ],
        packetMiddleware: [],
      },
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0,
    },
  };
  config.mysql = {
    client: {
      // host
      host: '47.104.172.100',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'MygameTest',
      // 数据库名
      database: 'poker',
    },
    app: true,
    agent: false,
  };

  return {
    ...bizConfig,
    ...config,
  };
};
