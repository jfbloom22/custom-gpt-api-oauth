# custom-gpt-api-oauth

## Description 
Example OpenAI Custom GPT with empowered with user authentication and ability to read and write to a database.  

Database: Prisma with Neon Serverless Postgres
Authentication: Clerk oAuth 2 server.

Additional features: automatically generate open API specs using swagger.  

## Prisma
`npx prisma generate` - this will generate the Prisma client
`npx prisma db push` - this effectively runs migrations on the Neon serverless postgres database
`npx prisma format` - this will help define foreign keys and enforce best practices
`prisma migrate dev --name {name}` - this will create a migration file in the migrations folder.  You can use this to create a migration file.  The name is the name of the migration file.  The name should be in snake-case.
`prisma migrate deploy` - this will run the migrations


What I am loving about Prisma is being able to generate the Types, restart my Typescript server, and boom, I have the types for free.  I can also use Prisma Studio to visually see the database schema and relationships.  It's a great tool for development.

### How to use Prisma Studio
`npx prisma studio` - this will open the Prisma Studio in your browser.  You can use this to visually see the database schema and relationships.


## Getting Started

`pnpm install`

## Generate Open API Specs

Use the ActionsGPT created by OpenAI to create the Open API spec.
https://chatgpt.com/g/g-TYEliDU6A-actionsgpt

Here is the prompt:

Create an Open API spec based on the code snippet below.  OAuth2 is used for authentication.  The scopes are “profile”, "email".  The spec should be in YAML format.

```typescript
{YOUR CODE HERE}
```

After it generates the spec, update the server URL, authorizationUrl, and tokenURL.
