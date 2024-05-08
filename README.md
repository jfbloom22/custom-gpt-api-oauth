# custom-gpt-api-oauth

## Description 
a starting point for enhancing Custom GPTs with user authentication and the ability to read and write to a database.  

As an example this project will use use Prisma with Neon Serverless Postgres.  For authentication: Clerk oAuth 2 server.  It will also automatically generate open API specs using swagger.  

## Prisma
`npx prisma generate` - this will generate the Prisma client
`npx prisma db push` - this effectively runs migrations on the Neon serverless postgres database
`npx prisma format` - this will help define foreign keys and enforce best practices
`prisma migrate dev --name {name}` - this will create a migration file in the migrations folder.  You can use this to create a migration file.  The name is the name of the migration file.  The name should be in snake-case.
`prisma migrate deploy` - this will run the migrations


What I am loving about Prisma is being able to generate the Types, restart my Typescript server, and boom, I have the types for free.  I can also use Prisma Studio to visually see the database schema and relationships.  It's a great tool for development.

### How to use Prisma Studio
`npx prisma studio` - this will open the Prisma Studio in your browser.  You can use this to visually see the database schema and relationships.
