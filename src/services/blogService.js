import api from './api';

// Service pour la gestion des articles de blog
const blogService = {
  // Récupérer tous les articles publics
  getPublicPosts: async (params = {}) => {
    try {
      const response = await api.get('/api/blog/posts/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un article public par slug
  getPublicPost: async (slug) => {
    try {
      const response = await api.get(`/api/blog/public/posts/${slug}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les articles de l'utilisateur connecté
  getMyPosts: async (params = {}) => {
    try {
      const response = await api.get('/api/blog/posts/my-posts/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un article spécifique de l'utilisateur connecté
  getMyPost: async (slug) => {
    try {
      // D'abord essayer de récupérer via l'endpoint public
      try {
        const response = await api.get(`/api/blog/public/posts/${slug}/`);
        return response.data;
      } catch (publicError) {
        // Si l'article n'est pas public, essayer de le récupérer depuis la liste des articles de l'utilisateur
        const myPostsResponse = await api.get('/api/blog/posts/my-posts/');
        const myPosts = myPostsResponse.data.results || myPostsResponse.data;
        
        // Chercher l'article par slug
        const article = myPosts.find(post => post.slug === slug);
        
        if (article) {
          return article;
        } else {
          throw new Error('Article non trouvé');
        }
      }
    } catch (error) {
      throw error;
    }
  },

  // Créer un nouvel article (sans image)
  createPost: async (postData) => {
    try {
      const response = await api.post('/api/blog/posts/create/', postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer un article avec image
  createPostWithImage: async (postData, imageFile) => {
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs de l'article
      Object.keys(postData).forEach(key => {
        if (postData[key] !== null && postData[key] !== undefined) {
          formData.append(key, postData[key]);
        }
      });
      
      // Ajouter l'image si elle existe
      if (imageFile) {
        formData.append('featured_image', imageFile);
      }

      const response = await api.post('/api/blog/posts/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un article
  updatePost: async (slug, postData, imageFile = null) => {
    try {
      let data;
      let headers = {};

      if (imageFile) {
        // Mise à jour avec image
        const formData = new FormData();
        Object.keys(postData).forEach(key => {
          if (postData[key] !== null && postData[key] !== undefined) {
            formData.append(key, postData[key]);
          }
        });
        formData.append('featured_image', imageFile);
        data = formData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // Mise à jour sans image
        data = postData;
        headers['Content-Type'] = 'application/json';
      }

      const response = await api.put(`/api/blog/posts/${slug}/update/`, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un article
  deletePost: async (slug) => {
    try {
      const response = await api.delete(`/api/blog/posts/${slug}/delete/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Publier un article (changer le statut)
  publishPost: async (slug) => {
    try {
      const response = await api.put(`/api/blog/posts/${slug}/update/`, {
        status: 'PENDING'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les catégories
  getCategories: async () => {
    try {
      const response = await api.get('/api/blog/categories/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les tags
  getTags: async () => {
    try {
      const response = await api.get('/api/blog/tags/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechercher des articles
  searchPosts: async (query, params = {}) => {
    try {
      const searchParams = { ...params, query };
      const response = await api.get('/api/blog/posts/search/', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== NOUVELLES MÉTHODES API PUBLIQUE =====
  
  // Récupérer tous les articles publics avec filtres et pagination
  getPublicBlogPosts: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });

      const response = await api.get(`/api/blog/public/posts/?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechercher des articles publics
  searchPublicPosts: async (query, page = 1) => {
    return blogService.getPublicBlogPosts({ search: query }, page);
  },

  // Filtrer par catégorie
  filterByCategory: async (categoryId, page = 1) => {
    return blogService.getPublicBlogPosts({ category: categoryId }, page);
  },

  // Filtrer par articles en vedette
  filterByFeatured: async (isFeatured = true, page = 1) => {
    return blogService.getPublicBlogPosts({ is_featured: isFeatured }, page);
  },

  // Filtrer par auteur
  filterByAuthor: async (authorId, page = 1) => {
    return blogService.getPublicBlogPosts({ author: authorId }, page);
  },

  // Trier les articles
  sortPosts: async (sortField, page = 1) => {
    return blogService.getPublicBlogPosts({ ordering: sortField }, page);
  },

  // Récupérer les articles en vedette
  getFeaturedPosts: async (page = 1) => {
    return blogService.getPublicBlogPosts({ is_featured: true }, page);
  },

  // Récupérer les articles récents
  getRecentPosts: async (page = 1) => {
    return blogService.getPublicBlogPosts({ ordering: '-publish_date' }, page);
  },

  // Récupérer les articles les plus vus
  getMostViewedPosts: async (page = 1) => {
    return blogService.getPublicBlogPosts({ ordering: '-views_count' }, page);
  },

  // Récupérer les articles les plus aimés
  getMostLikedPosts: async (page = 1) => {
    return blogService.getPublicBlogPosts({ ordering: '-likes_count' }, page);
  },

  // Récupérer les catégories publiques
  getPublicCategories: async () => {
    try {
      const response = await api.get('/api/blog/public/categories/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les articles en vedette (endpoint dédié)
  getPublicFeaturedPosts: async () => {
    try {
      const response = await api.get('/api/blog/public/featured/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les articles récents (endpoint dédié)
  getPublicRecentPosts: async () => {
    try {
      const response = await api.get('/api/blog/public/recent/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les articles par catégorie (endpoint dédié)
  getPublicPostsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/api/blog/public/categories/${categoryId}/posts/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les statistiques du blog
  getPublicBlogStats: async () => {
    try {
      const response = await api.get('/api/blog/public/stats/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default blogService; 