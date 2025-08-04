const API_URL = 'http://localhost:3003';

// Service d'authentification
export const authService = {
  // Connexion
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/users?email=${email}`);
      const users = await response.json();
      
      if (users.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const user = users[0];
      if (user.password !== password) {
        throw new Error('Mot de passe incorrect');
      }
      
      if (!user.isActive) {
        throw new Error('Compte désactivé');
      }
      
      // Stocker les informations utilisateur dans localStorage
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        profile: user.profile
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', `token_${user.id}_${Date.now()}`);
      
      return userData;
    } catch (error) {
      throw error;
    }
  },

  // Inscription
  async register(userData) {
    try {
      // Vérifier si l'email existe déjà
      const emailCheck = await fetch(`${API_URL}/users?email=${userData.email}`);
      const existingUsers = await emailCheck.json();
      
      if (existingUsers.length > 0) {
        throw new Error('Cet email est déjà utilisé');
      }
      
      // Créer le nouvel utilisateur
      const newUser = {
        ...userData,
        id: Date.now(), // ID temporaire
        createdAt: new Date().toISOString(),
        isActive: true,
        profile: {
          bio: '',
          experience: '',
          education: '',
          skills: [],
          location: '',
          salary: ''
        }
      };
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }
      
      const createdUser = await response.json();
      
      // Connecter automatiquement l'utilisateur
      const userDataToStore = {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        avatar: createdUser.avatar,
        profile: createdUser.profile
      };
      
      localStorage.setItem('user', JSON.stringify(userDataToStore));
      localStorage.setItem('token', `token_${createdUser.id}_${Date.now()}`);
      
      return userDataToStore;
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return user && token;
  },

  // Obtenir les informations de l'utilisateur connecté
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Mettre à jour le profil utilisateur
  async updateProfile(userId, profileData) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile: profileData }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
      
      const updatedUser = await response.json();
      
      // Mettre à jour les données en localStorage
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedUserData = {
          ...currentUser,
          profile: updatedUser.profile
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      }
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  // Changer le mot de passe
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      const user = await response.json();
      
      if (user.password !== currentPassword) {
        throw new Error('Mot de passe actuel incorrect');
      }
      
      const updateResponse = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      
      if (!updateResponse.ok) {
        throw new Error('Erreur lors du changement de mot de passe');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Réinitialiser le mot de passe
  async resetPassword(email) {
    try {
      const response = await fetch(`${API_URL}/users?email=${email}`);
      const users = await response.json();
      
      if (users.length === 0) {
        throw new Error('Email non trouvé');
      }
      
      // Simuler l'envoi d'un email de réinitialisation
      console.log(`Email de réinitialisation envoyé à ${email}`);
      
      return true;
    } catch (error) {
      throw error;
    }
  }
}; 