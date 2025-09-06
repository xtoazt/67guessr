
# 67guessr

A minimal, monochrome geography guessing game inspired by GeoGuessr. Built with Next.js and focused on clean, distraction-free gameplay.

### Features
- **Minimal Design**: Clean, monochrome interface focused on gameplay
- **Username/Password Auth**: Simple authentication system
- **Random Street Views**: Explore the world through Google Street View
- **Multiplayer Mode**: Challenge friends in real-time
- **No Ads**: Ad-free experience

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Node.js, Express
- **Database**: MongoDB, Redis
- **Authentication**: JWT with bcrypt
- **Maps**: Google Street View Embed API
- **Deployment**: DigitalOcean App Platform + Vercel

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Local Development

1. Clone and install:
   ```bash
   git clone <your-repo-url>
   cd 67guessr
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

### Deploy to DigitalOcean + Vercel

1. **Fork this repository** to your GitHub account

2. **Deploy Backend to DigitalOcean**:
   - Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Create new App from GitHub
   - DigitalOcean will auto-detect the `.do/app.yaml` configuration
   - See `DIGITALOCEAN_DEPLOYMENT.md` for detailed instructions

3. **Deploy Frontend to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository

4. **Set Environment Variables** in Vercel:
   ```
   MONGODB=your_mongodb_connection_string
   REDIS_URI=your_redis_connection_string
   JWT_SECRET=your_secure_jwt_secret
   NEXT_PUBLIC_API_URL=your-api-server.ondigitalocean.app
   NEXT_PUBLIC_WS_HOST=your-websocket-server.ondigitalocean.app
   ```

5. **Deploy**: Both platforms will automatically build and deploy your app

### Environment Variables

Create a `.env.local` file with:

```bash
# Database
MONGODB=mongodb+srv://username:password@cluster.mongodb.net/67guessr
REDIS_URI=redis://your-redis-host:port

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# API URLs (for production)
NEXT_PUBLIC_API_URL=your-api-server.ondigitalocean.app
NEXT_PUBLIC_WS_HOST=your-websocket-server.ondigitalocean.app
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. You are free to use, modify, and distribute this project for personal or commercial use. See `LICENSE.md` for more information.

## Community

Join the Discord community [here](https://discord.gg/yenVspFmkB) to discuss new features, report bugs, talk to the developers and connect with other players.

You can email me privately at gautam@codergautam.dev
