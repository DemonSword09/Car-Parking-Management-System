import { Migration } from '@mikro-orm/migrations';

export class Migration20211026125239 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "slot" ("id" serial primary key, "cost" int4 not null, "updated_at" timestamptz(0) not null, "bookedby" varchar(255) not null, "booked" bool not null);');

    this.addSql('create table "user" ("_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" text not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
