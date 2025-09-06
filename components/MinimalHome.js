import { useState } from 'react';
import { useSession, signOut } from './auth/auth';
import LoginModal from './auth/LoginModal';

export default function MinimalHome() {
  const { data: session } = useSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container flex items-center justify-between">
          <h1 className="navbar__title">67guessr</h1>
          
          <div className="flex items-center gap-md">
            {session?.token?.secret ? (
              <div className="flex items-center gap-md">
                <span className="text-sm text-secondary">
                  Welcome, {session.token.username}
                </span>
                <button 
                  onClick={() => signOut()}
                  className="btn btn-ghost btn-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setLoginModalOpen(true)}
                className="btn btn-primary"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mt-xl">
        <div className="text-center mb-xl">
          <h1 className="text-4xl font-bold mb-md">
            Explore the World
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            A minimal geography guessing game. Drop into random street views around the world and guess your location.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {/* Single Player Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Single Player</h3>
            </div>
            <div className="card-body">
              <p className="mb-lg">
                Play solo and explore random locations around the world. 
                Perfect your geography skills at your own pace.
              </p>
              <button className="btn btn-primary w-full">
                Start Game
              </button>
            </div>
          </div>

          {/* Multiplayer Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Multiplayer</h3>
            </div>
            <div className="card-body">
              <p className="mb-lg">
                Challenge friends or random players in real-time. 
                See who can guess locations the fastest and most accurately.
              </p>
              {session?.token?.secret ? (
                <button className="btn btn-primary w-full">
                  Join Game
                </button>
              ) : (
                <button 
                  onClick={() => setLoginModalOpen(true)}
                  className="btn btn-secondary w-full"
                >
                  Sign In to Play
                </button>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Your Stats</h3>
            </div>
            <div className="card-body">
              {session?.token?.secret ? (
                <div className="space-y-md">
                  <div className="flex justify-between">
                    <span className="text-secondary">Games Played:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Best Score:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Average Distance:</span>
                    <span className="font-medium">-</span>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">
                  Sign in to track your progress and see your statistics.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-2xl">
          <h2 className="text-3xl font-bold text-center mb-xl">
            Why 67guessr?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-sm">Minimal Design</h3>
              <p className="text-secondary">
                Clean, distraction-free interface focused on the game experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-sm">Global Locations</h3>
              <p className="text-secondary">
                Explore street views from every corner of the world.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-sm">Fast & Simple</h3>
              <p className="text-secondary">
                Quick games with instant feedback and no unnecessary features.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onLogin={() => {
          setLoginModalOpen(false);
          // Session will be updated automatically
        }} 
      />
    </div>
  );
}
