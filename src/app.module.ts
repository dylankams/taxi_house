import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'; // Importer PugAdapter
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DriversModule } from './drivers/drivers.module';
import { TaxisModule } from './taxis/taxis.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Driver } from './drivers/entities/driver.entity';
import { Taxi } from './taxis/entities/taxi.entity';
import { Breakdown } from './breakdowns/entities/breakdown.entity';
import { Problem } from './problems/entities/problem.entity';
import { BreakdownsModule } from './breakdowns/breakdowns.module';
import { ProblemsModule} from './problems/problems.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'taxiapp',
      entities: [User, Role, Driver, Taxi, Breakdown, Problem],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    DriversModule,
    TaxisModule,
    BreakdownsModule,
    ProblemsModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"Ne pas répondre" <no-reply@taxihouse.mobile>',
      },
      template: {
        dir: join(__dirname, '../src/templates'), // Répertoire où se trouvent les templates
        adapter: new PugAdapter(), // Utilisation de PugAdapter
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}