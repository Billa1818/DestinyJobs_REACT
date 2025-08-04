import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [likedArticles, setLikedArticles] = useState(new Set([3])); // Article 3 est déjà liké
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simuler l'état de connexion

  // Données des articles
  const articles = [
    {
      id: 1,
      title: "Comment attirer les meilleurs talents dans votre entreprise",
      category: "recrutement",
      categoryLabel: "Recrutement",
      categoryColor: "bg-blue-100 text-blue-800",
      date: "15 Jan 2024",
      author: "TechCorp Solutions",
      authorImage: "https://via.placeholder.com/24x24",
      image: "https://via.placeholder.com/300x200",
      excerpt: "Dans un marché du travail de plus en plus compétitif, attirer et retenir les meilleurs talents est devenu un défi majeur pour les entreprises. Découvrez nos stratégies éprouvées...",
      likes: 87,
      isLiked: false
    },
    {
      id: 2,
      title: "Créer une culture d'entreprise positive et inclusive",
      category: "entreprise",
      categoryLabel: "Entreprise",
      categoryColor: "bg-purple-100 text-purple-800",
      date: "12 Jan 2024",
      author: "InnovateHub",
      authorImage: "https://via.placeholder.com/24x24",
      image: "https://via.placeholder.com/300x200",
      excerpt: "Une culture d'entreprise forte est l'un des facteurs les plus importants pour attirer et retenir les talents. Voici comment développer un environnement de travail épanouissant...",
      likes: 142,
      isLiked: false
    },
    {
      id: 3,
      title: "L'importance de la formation continue en entreprise",
      category: "formation",
      categoryLabel: "Formation",
      categoryColor: "bg-green-100 text-green-800",
      date: "10 Jan 2024",
      author: "SkillBoost Academy",
      authorImage: "https://via.placeholder.com/24x24",
      image: "https://via.placeholder.com/300x200",
      excerpt: "Investir dans la formation de vos équipes n'est plus une option mais une nécessité. Découvrez pourquoi et comment mettre en place un programme de formation efficace...",
      likes: 98,
      isLiked: true
    },
    {
      id: 4,
      title: "Tendances du marché de l'emploi en Afrique de l'Ouest",
      category: "actualite",
      categoryLabel: "Actualités",
      categoryColor: "bg-orange-100 text-orange-800",
      date: "8 Jan 2024",
      author: "Destiny Jobs",
      authorImage: "https://via.placeholder.com/24x24",
      image: "https://via.placeholder.com/300x200",
      excerpt: "Le marché de l'emploi en Afrique de l'Ouest connaît des transformations importantes. Analysons les secteurs en croissance et les opportunités émergentes...",
      likes: 203,
      isLiked: false
    }
  ];

  const popularArticles = [
    {
      id: 5,
      title: "Guide complet pour réussir son entretien d'embauche",
      image: "https://via.placeholder.com/60x60",
      likes: 156
    },
    {
      id: 6,
      title: "Les compétences les plus demandées en 2024",
      image: "https://via.placeholder.com/60x60",
      likes: 134
    },
    {
      id: 7,
      title: "Comment négocier son salaire efficacement",
      image: "https://via.placeholder.com/60x60",
      likes: 98
    }
  ];

  const categories = [
    { name: "Recrutement", count: 24 },
    { name: "Vie d'entreprise", count: 18 },
    { name: "Formation", count: 15 },
    { name: "Actualités", count: 12 }
  ];

  const handleLike = (articleId) => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour liker un article. Veuillez vous connecter.');
      return;
    }

    setLikedArticles(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(articleId)) {
        newLiked.delete(articleId);
      } else {
        newLiked.add(articleId);
      }
      return newLiked;
    });
  };

  const handleShare = (articleId) => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour partager un article. Veuillez vous connecter.');
      return;
    }
    
    // Simuler le partage
    alert('Article partagé avec succès !');
  };

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      alert(`Merci ! Vous êtes maintenant abonné à notre newsletter avec l'email : ${email}`);
      e.target.email.value = '';
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Blog Destiny Jobs</h1>
          <p className="text-gray-600 text-lg">Découvrez les dernières actualités et conseils carrière</p>
        </div>
    </div>

      {/* Featured Article */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="relative">
          <img src="https://via.placeholder.com/800x400" alt="Article vedette" className="w-full h-64 lg:h-80 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <span className="bg-fuchsia-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">À la Une</span>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">Les meilleures pratiques de recrutement en 2024</h2>
              <p className="text-gray-200 mb-4">Découvrez comment optimiser votre processus de recrutement et attirer les meilleurs talents dans un marché compétitif...</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <i className="fas fa-calendar mr-1"></i>
                            15 Janvier 2024
                        </span>
                <span className="flex items-center">
                  <i className="fas fa-user mr-1"></i>
                            TechCorp Solutions
                        </span>
                <span className="flex items-center">
                  <i className="fas fa-heart mr-1"></i>
                            124 likes
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Rechercher des articles..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
                    </div>
                </div>
                
            {/* Category Filter */}
            <div className="lg:w-48">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                        <option value="">Toutes catégories</option>
                        <option value="recrutement">Recrutement</option>
                        <option value="entreprise">Vie d'entreprise</option>
                        <option value="formation">Formation</option>
                        <option value="actualite">Actualités</option>
                    </select>
                </div>
                
            {/* Sort */}
            <div className="lg:w-48">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                        <option value="recent">Plus récents</option>
                        <option value="popular">Plus populaires</option>
                        <option value="trending">Tendances</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

      {/* Blog Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Articles Column */}
        <div className="lg:col-span-2 space-y-6">
          {filteredArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3">
                  <img src={article.image} alt="Article" className="w-full h-48 sm:h-full object-cover" />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center mb-3">
                    <span className={`${article.categoryColor} px-2 py-1 rounded-full text-xs font-medium`}>
                      {article.categoryLabel}
                    </span>
                    <span className="text-gray-500 text-sm ml-3">
                      <i className="fas fa-calendar mr-1"></i>
                      {article.date}
                            </span>
                        </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-fuchsia-600 cursor-pointer">
                    {article.title}
                        </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <img src={article.authorImage} alt="Entreprise" className="w-6 h-6 rounded-full" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLike(article.id)} 
                        className={`flex items-center space-x-1 transition-colors duration-200 ${
                          likedArticles.has(article.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <i className={likedArticles.has(article.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                        <span className="like-count">{article.likes}</span>
                                </button>
                      <button 
                        onClick={() => handleShare(article.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                      >
                        <i className="fas fa-share"></i>
                                    <span>Partager</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Articles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-fire text-orange-500 mr-2"></i>
                    Articles populaires
                </h3>
            <div className="space-y-4">
              {popularArticles.map((article) => (
                <div key={article.id} className="flex items-start space-x-3">
                  <img src={article.image} alt="Article" className="w-15 h-15 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 hover:text-fuchsia-600 cursor-pointer">
                      {article.title}
                            </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <i className="fas fa-heart text-red-400 mr-1"></i>
                      <span>{article.likes} likes</span>
                        </div>
                    </div>
                </div>
              ))}
                </div>
            </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Catégories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <a 
                  key={category.name}
                  href="#" 
                  className="flex items-center justify-between text-gray-700 hover:text-fuchsia-600 transition-colors duration-200"
                >
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </a>
              ))}
            </div>
            </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Newsletter</h3>
            <p className="text-sm mb-4 text-fuchsia-100">Recevez les derniers articles directement dans votre boîte mail</p>
            <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
              <input 
                type="email" 
                name="email"
                placeholder="Votre email" 
                className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500"
                required
              />
              <button 
                type="submit"
                className="w-full bg-white text-fuchsia-600 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                        S'abonner
                    </button>
            </form>
            </div>
        </div>
    </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
          <i className="fas fa-chevron-left mr-1"></i>
            Précédent
        </button>
        <button className="px-3 py-1 bg-fuchsia-600 text-white rounded-md text-sm">1</button>
        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">2</button>
        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">3</button>
        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
            Suivant
          <i className="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  );
};

export default Blog;