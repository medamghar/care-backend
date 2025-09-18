import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { OrdersModule } from './orders/orders.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PubserviceService } from './pubservice/pubservice.service';
import { PubSub } from 'graphql-subscriptions';
import { ImagesModule } from './images/images.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Static file serving for uploads
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // GraphQL with subscription support
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      resolvers: {
      },
      playground: false,
      introspection: true,
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],

      subscriptions: {
        'graphql-ws': {
          onConnect: (connectionParams: Record<string, any>) => {
            console.log('🔌 WebSocket connection established');
            console.log('Raw connection params:', JSON.stringify(connectionParams, null, 2));
            console.log('Connection params type:', typeof connectionParams);

            // The actual connection parameters are nested inside connectionParams.connectionParams
            const actualParams = connectionParams?.connectionParams;

            if (actualParams) {
              console.log('Actual connection params keys:', Object.keys(actualParams));
              console.log('Authorization tokens available:', {
                'authorization': actualParams['authorization'] ? 'Present' : 'Missing',
                'Authorization': actualParams['Authorization'] ? 'Present' : 'Missing',
                'authToken': actualParams['authToken'] ? 'Present' : 'Missing',
                'token': actualParams['token'] ? 'Present' : 'Missing',
              });

              // Log token previews for debugging (first 20 characters)
              if (actualParams['authorization']) {
                console.log('authorization preview:', actualParams['authorization'].substring(0, 20) + '...');
              }
              if (actualParams['Authorization']) {
                console.log('Authorization preview:', actualParams['Authorization'].substring(0, 20) + '...');
              }
            }

            // Return the connection parameters directly - this is what gets passed to context
            return actualParams || {};
          },
          onDisconnect: () => {
            console.log('🔌 WebSocket connection closed');
          },
        },
      },
      context: async ({ req, extra, connectionParams }: any) => {
        // Handle WebSocket subscriptions (graphql-ws)
        if (extra) {
          console.log('🔌 WebSocket subscription context (graphql-ws)');
          console.log('Full extra object keys:', Object.keys(extra));
          console.log('connectionParams from Apollo:', connectionParams);

          // The connectionParams should now be available directly from Apollo
          let resolvedParams = connectionParams || {};

          console.log('Connection params type:', typeof resolvedParams);
          console.log('Connection params value:', resolvedParams);

          // If connectionParams is still not available, try to extract from extra.request headers
          if (!resolvedParams || Object.keys(resolvedParams).length === 0) {
            console.log('No connectionParams found, checking request headers...');
            const request = extra.request;
            if (request && request.headers) {
              console.log('Request headers available:', Object.keys(request.headers));
              // Try to extract auth from request headers as fallback
              const authFromHeaders = request.headers.authorization || request.headers.Authorization || '';
              if (authFromHeaders) {
                resolvedParams = { authorization: authFromHeaders };
                console.log('Extracted auth from request headers');
              }
            }
          }

          console.log('Final resolved params:', JSON.stringify(resolvedParams, null, 2));

          // Try multiple possible locations for the auth token
          const authToken = resolvedParams?.authorization ||
            resolvedParams?.Authorization ||
            resolvedParams?.token ||
            resolvedParams?.authToken ||
            extra.headers?.authorization ||
            extra.headers?.Authorization ||
            '';

          console.log('Found auth token:', authToken ? 'Present' : 'Missing');
          if (authToken) {
            console.log('Auth token preview:', `${authToken.substring(0, 20)}...`);
            console.log('Auth token type:', typeof authToken);
            console.log('Starts with Bearer:', authToken.startsWith('Bearer '));
          }

          // Create a request-like object from WebSocket connection context
          // Ensure the authorization header includes 'Bearer ' prefix if not present
          let formattedAuthToken = '';
          if (authToken) {
            formattedAuthToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
          }

          const wsReq = {
            headers: {
              authorization: formattedAuthToken,
            },
            user: resolvedParams?.user || null,
          };

          console.log('Final wsReq auth header:', wsReq.headers.authorization ? 'Present' : 'Missing');

          return {
            req: wsReq,
            connectionParams: resolvedParams,
            extra,
          };
        }

        // Handle HTTP requests
        if (req) {
          const authHeader = req?.headers?.authorization || '';
          console.log('🔍 GraphQL HTTP Context - Auth header:', authHeader ? 'Present' : 'Missing');
          return { req };
        }

        console.log('⚠️ No context available - neither req nor extra');
        return {};
      },

      formatError: (error) => {
        console.error('GraphQL Error:', {
          message: error.message,
          code: error.extensions?.code,
          path: error.path,
          locations: error.locations,
        });

        return {
          message: error.message,
          code: error.extensions?.code,
          path: error.path,
        };
      },
      // Add more detailed logging in development
      ...(process.env.NODE_ENV === 'development' && {
        debug: true,
      }),
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ShopsModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    OrdersModule,
    PromotionsModule,
    ImagesModule,
    NotificationModule,

  ],
  providers: [PubserviceService, PubSub],

})
export class AppModule { }