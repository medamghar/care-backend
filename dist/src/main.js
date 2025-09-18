"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const graphql_upload_ts_1 = require("graphql-upload-ts");
const express = require("express");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, graphql_upload_ts_1.graphqlUploadExpress)({ maxFileSize: 10000000, maxFiles: 10 }));
    const uploadsPath = (0, path_1.join)(process.cwd(), 'uploads');
    app.use('/uploads', express.static(uploadsPath));
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Apollo-Require-Preflight',
            'X-Requested-With',
            'Accept',
            'Origin',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers',
        ],
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Backend server running on http://0.0.0.0:${port}`);
    console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
    console.log(`🌐 Network access: http://192.168.192.9:${port}/graphql`);
}
bootstrap();
//# sourceMappingURL=main.js.map