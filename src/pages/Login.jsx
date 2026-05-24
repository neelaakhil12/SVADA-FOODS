import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';

export default function Login() {
  const { isLoggedIn, currentUser, setIsLoggedIn, setCurrentUser, setCurrentPage } = useContext(ShopContext);
  
  const [activeMode, setActiveMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', phone: '', agree: false });
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset states when swapping panels
  useEffect(() => {
    setSuccessMsg('');
  }, [activeMode]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      // Simulate login
      const mockName = loginForm.email.split('@')[0].toUpperCase();
      setIsLoggedIn(true);
      setCurrentUser({
        name: mockName,
        email: loginForm.email
      });
      setSuccessMsg(`Welcome back, ${mockName}! Logging you in securely...`);
      
      setTimeout(() => {
        setSuccessMsg('');
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2500);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupForm.name && signupForm.email && signupForm.password && signupForm.agree) {
      // Simulate registration
      setIsLoggedIn(true);
      setCurrentUser({
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone
      });
      setSuccessMsg(`Congratulations, ${signupForm.name}! Account registered successfully.`);
      
      setTimeout(() => {
        setSuccessMsg('');
        setCurrentPage('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2500);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      setSuccessMsg(`A secure password reset link has been dispatched to ${forgotEmail}.`);
      setForgotEmail('');
      setTimeout(() => {
        setSuccessMsg('');
        setActiveMode('login');
      }, 4000);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSuccessMsg('Logged out successfully from your SVADA account.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // If already logged in, show user details
  if (isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 font-poppins min-h-[60vh] flex flex-col justify-center">
        <div className="bg-white border border-orange-100 p-8 rounded-3xl text-left space-y-6 shadow-md relative">
          <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center border border-orange-100 mx-auto">
            <CheckCircle className="h-8 w-8 text-primary animate-pulse" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="font-outfit font-black text-svada-dark text-xl">Account Profile Desk</h3>
            <p className="text-xs text-svada-light">You are currently logged in securely to your SVADA profile.</p>
          </div>

          <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 space-y-2 text-sm text-svada-dark font-medium">
            <p className="flex justify-between">
              <span className="text-xs text-svada-light">Profile Name:</span>
              <span>{currentUser?.name}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-xs text-svada-light">Email Address:</span>
              <span className="font-mono">{currentUser?.email}</span>
            </p>
            {currentUser?.phone && (
              <p className="flex justify-between">
                <span className="text-xs text-svada-light">Phone Link:</span>
                <span>{currentUser?.phone}</span>
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                setCurrentPage('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-2"
            >
              <span>Explore Traditional Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-orange-50 text-primary border border-orange-100 hover:bg-orange-100 py-3 rounded-xl font-bold text-xs transition"
            >
              Log Out of Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      <div className="bg-white border border-orange-100 rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        
        {/* LEFT COLUMN - SAFFRON DECORATIVE SPLIT */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white p-8 sm:p-12 flex flex-col justify-between text-left relative overflow-hidden">
          {/* Animated decorative sparks */}
          <div className="absolute inset-0 opacity-10 pointer-events-none text-4xl">
            <span className="absolute top-[10%] left-[20%] animate-pulse">🌶️</span>
            <span className="absolute top-[70%] left-[10%] animate-bounce">🥭</span>
            <span className="absolute top-[40%] right-[20%] animate-pulse">🍯</span>
            <span className="absolute bottom-[10%] right-[15%] rotate-12">🌾</span>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="h-3 w-3 text-secondary animate-pulse" />
              <span>Village Traditional Portal</span>
            </div>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl leading-tight">
              Eat Healthy. Choose Traditional.
            </h2>
            <p className="text-xs sm:text-sm text-orange-50/80 font-light leading-relaxed">
              Log in to save your preferred traditional pickle weights, track your shipping parcel status, manage orders, and unlock special festival discounts.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/20 mt-8 relative z-10 text-xs text-orange-100 font-light">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0" />
              <span>100% Hygienic Food Processing Facility</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0" />
              <span>Direct farmers procurement support</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - LOGICAL FORMS */}
        <div className="p-6 sm:p-10 flex flex-col justify-center text-left relative">
          
          {/* Success Banner */}
          {successMsg && (
            <div className="absolute top-4 left-6 right-6 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold leading-relaxed flex items-start space-x-2 z-20 animate-fade-down shadow-md">
              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN VIEW */}
          {activeMode === 'login' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-outfit font-black text-svada-dark text-xl sm:text-2xl">Access Account</h3>
                <p className="text-xs text-svada-light font-light">Please input your registered email address and password.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Email *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                      placeholder="name@email.com"
                    />
                    <Mail className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-svada-light font-bold uppercase block">Password *</label>
                    <button 
                      type="button" 
                      onClick={() => setActiveMode('forgot')}
                      className="text-[10px] text-primary font-bold hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-10 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                      placeholder="••••••••"
                    />
                    <Lock className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-svada-light/60 hover:text-svada-dark"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Authenticate profile</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Social Logins */}
              <div className="space-y-4 pt-4 border-t border-orange-50">
                <span className="text-[9px] text-svada-light font-bold uppercase tracking-wider block text-center">
                  Or sign in with
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['Google', 'Facebook', 'Apple'].map((soc) => (
                    <button
                      key={soc}
                      onClick={() => {
                        setIsLoggedIn(true);
                        setCurrentUser({ name: 'SOCIAL GUEST', email: 'guest@social.com' });
                        setSuccessMsg(`Signed in with ${soc}! Loading...`);
                        setTimeout(() => {
                          setSuccessMsg('');
                          setCurrentPage('home');
                        }, 2000);
                      }}
                      className="bg-orange-50/50 hover:bg-orange-100 border border-orange-100/50 rounded-xl py-2 text-[10px] font-bold text-svada-dark transition text-center"
                    >
                      {soc}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-svada-light text-center">
                  New to SVADA?{' '}
                  <button 
                    onClick={() => setActiveMode('signup')}
                    className="text-primary font-bold hover:underline"
                  >
                    Register Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* SIGNUP VIEW */}
          {activeMode === 'signup' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-outfit font-black text-svada-dark text-xl sm:text-2xl">Create Account</h3>
                <p className="text-xs text-svada-light font-light">Register to start collecting traditional reward points.</p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-1.5 text-xs font-semibold text-svada-dark focus:outline-hidden"
                      placeholder="First and last name"
                    />
                    <User className="h-3.5 w-3.5 text-svada-light/60 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Email *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-1.5 text-xs font-semibold text-svada-dark focus:outline-hidden"
                      placeholder="name@email.com"
                    />
                    <Mail className="h-3.5 w-3.5 text-svada-light/60 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Phone Link</label>
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-svada-dark focus:outline-hidden"
                      placeholder="10 digits"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-svada-dark focus:outline-hidden"
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-1.5">
                  <input
                    type="checkbox"
                    required
                    id="agree"
                    checked={signupForm.agree}
                    onChange={(e) => setSignupForm({ ...signupForm, agree: e.target.checked })}
                    className="mt-0.5 h-3.5 w-3.5 text-primary border-orange-100 rounded-md focus:ring-primary focus:ring-0"
                  />
                  <label htmlFor="agree" className="text-[10px] text-svada-light leading-normal select-none cursor-pointer">
                    I agree to SVADA's terms, clean cooking standards, and prepaid ordering & shipping policies.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  Create Account
                </button>
              </form>

              <p className="text-xs text-svada-light text-center border-t border-orange-50 pt-3">
                Already registered?{' '}
                <button 
                  onClick={() => setActiveMode('login')}
                  className="text-primary font-bold hover:underline"
                >
                  Access Profile
                </button>
              </p>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {activeMode === 'forgot' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-outfit font-black text-svada-dark text-xl">Recover Password</h3>
                <p className="text-xs text-svada-light font-light">Input your registered email. We will issue a secure reset link.</p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Registered Email *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden"
                      placeholder="name@email.com"
                    />
                    <Mail className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveMode('login')}
                    className="flex-1 bg-orange-50 text-svada-dark border border-orange-100 rounded-xl py-2.5 text-xs font-bold hover:bg-orange-100 transition"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="flex-2 bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Dispatched Reset Link
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
