# custom-gpt-api-oauth

## Description 
a starting point for enhancing Custom GPTs with user authentication and the ability to read and write to a database.  

As an example this project will use use Prisma with Neon Serverless Postgres.  For authentication: Clerk oAuth 2 server.  It will also automatically generate open API specs using swagger.  

## Prisma
`npx prisma generate` - this will generate the Prisma client
`npx prisma db push` - this effectively runs migrations on the Neon serverless postgres database
`npx prisma format` - this will help define foreign keys and enforce best practices