import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Disable in production
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      cache: 'bounded',
      context: ({ req }) => ({ req }),
      plugins: [
        // Habilita Apollo Sandbox
        require('@apollo/server/plugin/landingPage/default').ApolloServerPluginLandingPageLocalDefault(),
      ],
    }),

    AuthModule,
    UserModule,
    ExpenseModule,
    IncomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
