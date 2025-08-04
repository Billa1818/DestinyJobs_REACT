import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'candidat':
          navigate('/candidat');
          break;
        case 'prestataire':
          navigate('/prestataire');
          break;
        case 'recruteur':
          navigate('/recruteur');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Effacer l'erreur quand l'utilisateur tape
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      
      // Rediriger selon le rôle
      switch (user.role) {
        case 'candidat':
          navigate('/candidat');
          break;
        case 'prestataire':
          navigate('/prestataire');
          break;
        case 'recruteur':
          navigate('/recruteur');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Main Content - Login Page */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 rounded-t-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="text-center text-white">
                  <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-user text-2xl"></i>
                            </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Connexion à votre compte</h1>
                  <p className="text-fuchsia-100 text-sm sm:text-base">Accédez à votre espace personnel Destiny Jobs</p>
                        </div>
                    </div>

              {/* Login Form */}
              <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-md mx-auto">
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                                <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-envelope mr-2 text-fuchsia-600"></i>
                                        Adresse e-mail
                                    </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                        placeholder="votre@email.com"
                      />
                                </div>

                    {/* Password Field */}
                                <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-lock mr-2 text-fuchsia-600"></i>
                                        Mot de passe
                                    </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="password" 
                          name="password" 
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200 pr-12"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={togglePassword} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="remember" 
                          name="remember" 
                          checked={formData.remember}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                            Se souvenir de moi
                                        </label>
                                    </div>
                      <Link to="/reset-password" className="text-sm text-fuchsia-600 hover:text-fuchsia-800 font-medium">
                                        Mot de passe oublié ?
                      </Link>
                                </div>

                    {/* Login Button */}
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50"
                    >
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      {loading ? 'Connexion...' : 'Se connecter'}
                                </button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                                    </div>
                                </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                      >
                        <i className="fab fa-google mr-2 text-red-500"></i>
                                        Google
                                    </button>
                      <button 
                        type="button" 
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                      >
                        <i className="fab fa-linkedin mr-2 text-fuchsia-600"></i>
                                        LinkedIn
                                    </button>
                                </div>
                            </form>

                  {/* Sign Up Link */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                                    Vous n'avez pas encore de compte ?
                      <Link to="/signup" className="font-medium text-fuchsia-600 hover:text-fuchsia-800 ml-1">
                                        Créer un compte
                      </Link>
                                </p>
                            </div>

                  {/* Comptes de test */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Comptes de test :</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div><strong>Candidat:</strong> candidat@example.com / password123</div>
                      <div><strong>Prestataire:</strong> prestataire@example.com / password123</div>
                      <div><strong>Recruteur:</strong> recruteur@example.com / password123</div>
                    </div>
                  </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  );
};

export default Login;