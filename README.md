<h1 align="center" id="title">Echo - Social Media Application</h1>

<p align="center"><img src="https://socialify.git.ci/sarveshpop/echo/image?font=Inter&amp;language=1&amp;name=1&amp;owner=1&amp;pattern=Solid&amp;stargazers=1&amp;theme=Dark" alt="project-image"></p>

<p id="description">A social media application built using React and NextJS.</p>

<h2>🚀 Demo</h2>

[https://echo.sarvesh.online/](https://echo.sarvesh.online/)

  
  
<h2>🫡 Implemented Features</h2>

Here're some of the features implemented so far:

*   User Auth via multiple providers
*   Secure password hashing
*   Create Posts
*   Like Share and Comment on Posts
*   Follow users
*   Tag users in posts
*   Search for posts

<h2>⏳ Planned Features</h2>

What you can expect to see soon:

*   Auth0 integrationn 
*   Echo(repost) tweets
*   CDN integration
*   User search
*   Recent Search history
*   Better UX
*   More Speed! 🚀

<h2>🚧 Note</h2>

Following limitations have been applied on the hosted webiste to avoid spam:

*   Image upload restricted to 1MB
*   Unverified Email auth commented out
*   Video upload restricted

<h2>👨‍🚀 Getting Started</h2>

<p>1. Install dependencies</p>

```bash
npm install
# or
pnpm install
# or
yarn install
```

<p>2. Create a .env file with the following variables</p>

```bash
# DB URL:
DATABASE_URL:

# NextAuth config:
NEXTAUTH_SECRET:
NEXTAUTH_URL:

# OAuth ids and secrets:
PROVIDER_ID:
PROVIDER_SECRET:
```

<p>3. Push the prisma schema to your database</p>

```
npx prisma db push
```

<p>4. run the project</p>

```
npm run dev
```

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   TypeScript
*   NextJS
*   React
*   tRPC
*   NextAuth
*   Prisma
*   Supabase
*   TailwindCSS
