import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { appConfiguration, loggerConfiguration } from './config';
import { globalErrorHandlerMiddleware } from './middlewares';
import routes from './routes';
import { swaggerSpecs } from './docs/swagger';
import fs from 'fs';
import path from 'path';

const { appVersion, port, mongoDB } = appConfiguration;

const initializeServer = async (): Promise<void> => {
  try {
    // Create the Express application
    const app: Application = express();

    // Middleware for parsing JSON request body
    app.use(express.json());

    const directories = ['/uploads'];

    for (const directory of directories) {
      const dir = path.join(`${__dirname}${directory}`);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Middleware for parsing urlencoded request body
    app.use(express.urlencoded({ extended: true }));

    // Middleware to enable CORS
    app.use(cors());

    // Enable CORS preflight for all routes
    app.options('*', cors());

    const uploadsPath = path.join(__dirname, 'uploads');

    // Serve static files from the 'uploads' directory
    app.use(`/${appVersion}/uploads`, express.static(uploadsPath));

    // API routes
    app.use(`/${appVersion}`, routes);

    app.use(`/${appVersion}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

    // 404 handler for unknown API requests
    app.use((req: Request, res: Response, next: NextFunction) => {
      next({ statusCode: NOT_FOUND, message: 'Not found' });
    });

    // Global error handler
    app.use(globalErrorHandlerMiddleware);

    // Connect to MongoDB
    await mongoose.connect(mongoDB.url, mongoDB.options);

    loggerConfiguration.info('Connected to MongoDB');

    // Start the server
    const server = app.listen(port, () => {
      loggerConfiguration.info(`Listening on port ${port}...`);
    });

    // Graceful server shutdown
    const exitHandler = (): void => {
      server.close(() => {
        loggerConfiguration.info('Server closed');

        process.exit(0);
      });
    };

    // Handle uncaught exceptions and unhandled rejections
    const unexpectedErrorHandler = (error: Error): void => {
      loggerConfiguration.error('error', error);

      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);

    process.on('unhandledRejection', unexpectedErrorHandler);
  } catch (error) {
    loggerConfiguration.error('Failed to start server:', error);

    process.exit(1);
  }
};

// Start the server
void initializeServer();
