"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const shops_module_1 = require("./shops/shops.module");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const brands_module_1 = require("./brands/brands.module");
const orders_module_1 = require("./orders/orders.module");
const promotions_module_1 = require("./promotions/promotions.module");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const pubservice_service_1 = require("./pubservice/pubservice.service");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const images_module_1 = require("./images/images.module");
const notification_module_1 = require("./notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
                resolvers: {},
                playground: false,
                introspection: true,
                csrfPrevention: false,
                plugins: [(0, default_1.ApolloServerPluginLandingPageLocalDefault)()],
                subscriptions: {
                    'graphql-ws': {
                        onConnect: (connectionParams) => {
                            console.log('🔌 WebSocket connection established');
                            console.log('Raw connection params:', JSON.stringify(connectionParams, null, 2));
                            console.log('Connection params type:', typeof connectionParams);
                            const actualParams = connectionParams?.connectionParams;
                            if (actualParams) {
                                console.log('Actual connection params keys:', Object.keys(actualParams));
                                console.log('Authorization tokens available:', {
                                    'authorization': actualParams['authorization'] ? 'Present' : 'Missing',
                                    'Authorization': actualParams['Authorization'] ? 'Present' : 'Missing',
                                    'authToken': actualParams['authToken'] ? 'Present' : 'Missing',
                                    'token': actualParams['token'] ? 'Present' : 'Missing',
                                });
                                if (actualParams['authorization']) {
                                    console.log('authorization preview:', actualParams['authorization'].substring(0, 20) + '...');
                                }
                                if (actualParams['Authorization']) {
                                    console.log('Authorization preview:', actualParams['Authorization'].substring(0, 20) + '...');
                                }
                            }
                            return actualParams || {};
                        },
                        onDisconnect: () => {
                            console.log('🔌 WebSocket connection closed');
                        },
                    },
                },
                context: async ({ req, extra, connectionParams }) => {
                    if (extra) {
                        console.log('🔌 WebSocket subscription context (graphql-ws)');
                        console.log('Full extra object keys:', Object.keys(extra));
                        console.log('connectionParams from Apollo:', connectionParams);
                        let resolvedParams = connectionParams || {};
                        console.log('Connection params type:', typeof resolvedParams);
                        console.log('Connection params value:', resolvedParams);
                        if (!resolvedParams || Object.keys(resolvedParams).length === 0) {
                            console.log('No connectionParams found, checking request headers...');
                            const request = extra.request;
                            if (request && request.headers) {
                                console.log('Request headers available:', Object.keys(request.headers));
                                const authFromHeaders = request.headers.authorization || request.headers.Authorization || '';
                                if (authFromHeaders) {
                                    resolvedParams = { authorization: authFromHeaders };
                                    console.log('Extracted auth from request headers');
                                }
                            }
                        }
                        console.log('Final resolved params:', JSON.stringify(resolvedParams, null, 2));
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
                ...(process.env.NODE_ENV === 'development' && {
                    debug: true,
                }),
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            shops_module_1.ShopsModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            brands_module_1.BrandsModule,
            orders_module_1.OrdersModule,
            promotions_module_1.PromotionsModule,
            images_module_1.ImagesModule,
            notification_module_1.NotificationModule,
        ],
        providers: [pubservice_service_1.PubserviceService, graphql_subscriptions_1.PubSub],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map