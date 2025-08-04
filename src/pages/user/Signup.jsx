import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const { type } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: type || 'candidat',
    agreeTerms: false,
    newsletter: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, user, isAuthenticated } = useAuth();
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
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.userType,
        phone: '',
        avatar: 'https://via.placeholder.com/150'
      };

      const user = await register(userData);
      
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

  const togglePassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const userTypes = [
    {
      id: 'candidat',
      name: 'Candidat',
      icon: 'fas fa-user',
      description: 'Je cherche un emploi ou des opportunités',
      color: 'fuchsia'
    },
    {
      id: 'recruteur',
      name: 'Recruteur',
      icon: 'fas fa-building',
      description: 'Je recrute des talents pour mon entreprise',
      color: 'green'
    },
    {
      id: 'prestataire',
      name: 'Prestataire',
      icon: 'fas fa-handshake',
      description: 'J\'offre des services et formations',
      color: 'purple'
    }
  ];

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Content - Signup Page */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 rounded-t-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="text-center text-white">
                <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-user-plus text-2xl"></i>
                    </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Créer votre compte</h1>
                <p className="text-fuchsia-100 text-sm sm:text-base">Rejoignez Destiny Jobs et transformez votre carrière</p>
                </div>
            </div>

            {/* Signup Form */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="max-w-2xl mx-auto">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <i className="fas fa-users mr-2 text-fuchsia-600"></i>
                      Type de compte
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {userTypes.map((userType) => (
                        <div
                          key={userType.id}
                          className={`border-2 rounded-lg p-4 text-center cursor-pointer transition duration-200 ${
                            formData.userType === userType.id
                              ? `border-${userType.color}-500 bg-${userType.color}-50`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, userType: userType.id }))}
                        >
                          <div className={`w-12 h-12 bg-${userType.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <i className={`${userType.icon} text-${userType.color}-600 text-xl`}></i>
                        </div>
                          <h3 className="font-medium text-gray-900 mb-2">{userType.name}</h3>
                          <p className="text-sm text-gray-600">{userType.description}</p>
                        </div>
                      ))}
                    </div>
                </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-user mr-2 text-fuchsia-600"></i>
                        Prénom
                                    </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                        placeholder="Votre prénom"
                      />
                                </div>
                                <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-user mr-2 text-fuchsia-600"></i>
                        Nom
                                    </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                        placeholder="Votre nom"
                      />
                            </div>
                        </div>

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

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          onClick={() => togglePassword('password')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-lock mr-2 text-fuchsia-600"></i>
                        Confirmer le mot de passe
                                    </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200 pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('confirmPassword')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                </div>
                            </div>
                        </div>

                  {/* Terms and Newsletter */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        required
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                        J'accepte les{' '}
                        <a href="#" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
                          conditions d'utilisation
                        </a>{' '}
                        et la{' '}
                        <a href="#" className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
                          politique de confidentialité
                        </a>
                      </label>
                                </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                        Je souhaite recevoir la newsletter avec les dernières offres d'emploi et actualités
                                    </label>
                                </div>
                            </div>

                  {/* Signup Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    {loading ? 'Création du compte...' : 'Créer mon compte'}
                        </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                            </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Ou s'inscrire avec</span>
                            </div>
                        </div>

                  {/* Social Signup Buttons */}
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

                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                            Vous avez déjà un compte ?
                    <Link to="/login" className="font-medium text-fuchsia-600 hover:text-fuchsia-800 ml-1">
                                Se connecter
                    </Link>
                        </p>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Signup;