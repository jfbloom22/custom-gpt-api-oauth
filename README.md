# Custom GPT Actions API with OAuth2 and Postgres

A guide and cloneable template for creating an OpenAI ChatGPT Custom GPT with user authentication and database access.

## Tech Stack
- **Database**: [Prisma](https://prisma.io) with [Neon](https://neon.tech) Serverless Postgres
- **Authentication**: [Clerk.com](https://clerk.com) OAuth 2.0
- **Hosting**: [Vercel](https://vercel.com)
- **Language**: TypeScript
- **Package Manager**: pnpm

## Prerequisites
- Node.js 18+
- pnpm
- A custom domain name (required for Clerk configuration)
- OpenAI API access
- Clerk account
- Neon database account
- Vercel account (optional, for deployment)

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your credentials
5. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Detailed Setup Guide

### 1. Create a Custom GPT
1. Visit the [OpenAI GPT Builder](https://help.openai.com/en/articles/8554397-creating-a-gpt)
2. Follow the setup wizard to create your GPT
3. Configure the Actions section with the OpenAPI specification

### 2. Configure Clerk Authentication

1. Create a new Clerk project
2. Set up a production instance with a custom domain
3. Create an OAuth2 Provider:
   ```bash
   curl -X POST https://api.clerk.com/v1/oauth_applications \
    -H "Authorization: Bearer <CLERK_SECRET_KEY>"  \
    -H "Content-Type: application/json" \
    -d '{
      "callback_url": "https://oauth-client.com/oauth2/callback",
      "name": "oauth_app_1",
      "scopes": "profile email"
    }'
   ```
4. Update the callback URL after receiving the OpenAPI schema:
   ```bash
   curl -X PATCH https://api.clerk.com/v1/oauth_applications/<oauth_application_id> \
    -H "Authorization: Bearer <CLERK_SECRET_KEY>"  \
    -H "Content-Type: application/json" \
    -d '{"callback_url":"https://oauth-client.com/oauth2/callback"}'
   ```
5. Verify the configuration:
   ```bash
   curl -X GET https://api.clerk.com/v1/oauth_applications \
    -H "Authorization: Bearer <CLERK_SECRET_KEY>"
   ```

### 3. Database Setup

1. Create a new Neon database
2. Update the `DATABASE_URL` in your `.env` file
3. Run database migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 4. Generate OpenAPI Specifications

Use the [ActionsGPT](https://chatgpt.com/g/g-TYEliDU6A-actionsgpt) to generate OpenAPI specs based on your Prisma schema and code.

### 5. Deployment

#### Option 1: Vercel (Recommended)
- The project is configured for Vercel deployment
- Use the [Vercel CLI](https://vercel.com/docs/deployments/overview#vercel-cli) for deployment
- All `/api` routes are automatically converted to serverless functions

#### Option 2: Conventional Node.js Server
1. Add build script to `package.json`:
   ```json
   {
     "scripts": {
       "build": "tsc"
     }
   }
   ```
2. Build the project:
   ```bash
   pnpm build
   ```
3. Use the `dist` folder as your server root

## Development

### Database Management
- Generate Prisma client: `npx prisma generate`
- Push schema changes: `npx prisma db push`
- Format schema: `npx prisma format`
- Create migration: `prisma migrate dev --name {name}`
- Deploy migrations: `prisma migrate deploy`
- Launch Prisma Studio: `npx prisma studio`

### Local Development
- Run development server: `pnpm dev`
- Note: `vercel dev` may have issues with `app.listen()` - use `pnpm dev` instead

## Production Considerations

Before deploying to production, consider implementing:
- Comprehensive test suite
- Robust error handling
- Additional API endpoints
- Improved API organization following best practices:
  ```
  src/
  ├── controllers/
  ├── routes/
  └── api/
  ```
- Automated OpenAPI spec generation
- Consider using [TSOA](https://tsoa-community.github.io/docs/getting-started.html)

## Privacy Policy

Before publishing your GPT, create a privacy policy. Use this template prompt:
```
Help me create a simple privacy policy to publish on my website for my custom GPT. 
My company name is [company name] and my website is [website url]. 
The company will collect email addresses, but it will never sell this information to third parties.
```

## Publishing Your GPT

1. Complete your Builder Profile
2. Verify your domain name
3. Submit for review

For more information, visit: [Building and Publishing a GPT](https://help.openai.com/en/articles/8798878-building-and-publishing-a-gpt)

## Troubleshooting

- **Vercel dev issues**: Use `pnpm dev` instead
- **Prisma type build errors on Vercel**: These are ignorable
- **Database connection issues**: Verify your `DATABASE_URL` in `.env`

## Contributing

Contributions are welcome! Please feel free to submit a PR or create an issue.

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.