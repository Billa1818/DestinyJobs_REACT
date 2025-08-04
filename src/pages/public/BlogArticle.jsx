import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const BlogArticle = () => {
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(124);

  // Données simulées de l'article
  const article = {
    id: id || 1,
    title: "Les meilleures pratiques de recrutement en 2024",
    author: "Marie Dupont",
    authorImage: "https://via.placeholder.com/40x40",
    authorTitle: "Directrice RH chez TechCorp Solutions",
    category: "Recrutement",
    categoryColor: "bg-blue-100 text-blue-800",
    publishedDate: "15 Janvier 2024",
    readTime: "8 min de lecture",
    image: "https://via.placeholder.com/800x400",
    excerpt: "Découvrez comment optimiser votre processus de recrutement et attirer les meilleurs talents dans un marché compétitif...",
    content: `
      <p class="lead">Le marché du recrutement en 2024 connaît des transformations majeures. Les entreprises doivent s'adapter aux nouvelles attentes des candidats et aux évolutions technologiques pour attirer et retenir les meilleurs talents.</p>
      
      <h2>1. L'importance de l'expérience candidat</h2>
      <p>L'expérience candidat est devenue un facteur clé de différenciation. Les candidats d'aujourd'hui s'attendent à un processus de recrutement fluide, transparent et respectueux de leur temps.</p>
      
      <h3>Conseils pratiques :</h3>
      <ul>
        <li>Optimisez votre site carrière pour une navigation intuitive</li>
        <li>Réduisez le temps de réponse aux candidatures</li>
        <li>Proposez des entretiens vidéo pour plus de flexibilité</li>
        <li>Donnez un feedback constructif même aux candidats refusés</li>
      </ul>
      
      <h2>2. L'intelligence artificielle au service du recrutement</h2>
      <p>L'IA révolutionne le processus de recrutement en automatisant les tâches répétitives et en améliorant la qualité des recrutements.</p>
      
      <h3>Applications concrètes :</h3>
      <ul>
        <li>Sourcing automatisé de candidats</li>
        <li>Analyse de CV par IA</li>
        <li>Pré-sélection basée sur les compétences</li>
        <li>Chatbots pour répondre aux questions fréquentes</li>
      </ul>
      
      <h2>3. La diversité et l'inclusion</h2>
      <p>La diversité n'est plus une option mais une nécessité. Les entreprises qui valorisent la diversité et l'inclusion bénéficient d'une meilleure créativité et d'une plus grande innovation.</p>
      
      <h3>Stratégies pour favoriser la diversité :</h3>
      <ul>
        <li>Formuler des offres d'emploi inclusives</li>
        <li>Utiliser des panels de recrutement diversifiés</li>
        <li>Former les recruteurs aux biais inconscients</li>
        <li>Mesurer et suivre les indicateurs de diversité</li>
      </ul>
      
      <h2>4. Le recrutement à distance</h2>
      <p>La pandémie a accéléré l'adoption du recrutement à distance. Cette tendance devrait se poursuivre en 2024.</p>
      
      <h3>Bonnes pratiques :</h3>
      <ul>
        <li>Investir dans des outils de visioconférence de qualité</li>
        <li>Adapter les processus d'onboarding au télétravail</li>
        <li>Maintenir une culture d'entreprise à distance</li>
        <li>Évaluer les compétences numériques des candidats</li>
      </ul>
      
      <h2>5. L'importance du branding employeur</h2>
      <p>Un branding employeur fort permet d'attirer les meilleurs talents et de réduire les coûts de recrutement.</p>
      
      <h3>Éléments clés :</h3>
      <ul>
        <li>Raconter l'histoire de votre entreprise</li>
        <li>Mettre en avant vos valeurs et votre culture</li>
        <li>Partager le témoignage de vos employés</li>
        <li>Être présent sur les réseaux sociaux professionnels</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Le recrutement en 2024 nécessite une approche moderne, centrée sur l'expérience candidat et utilisant les technologies appropriées. Les entreprises qui s'adaptent à ces nouvelles réalités seront les plus performantes dans l'attraction et la rétention des talents.</p>
    `,
    tags: ["recrutement", "RH", "talent", "innovation", "diversité"],
    views: 2847,
    likes: 124,
    shares: 45,
    comments: 23
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour liker un article. Veuillez vous connecter.');
      return;
    }
    
    if (liked) {
      setLikes(prev => prev - 1);
      setLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setLiked(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour sauvegarder un article.');
      return;
    }
    alert('Article sauvegardé dans vos favoris !');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-fuchsia-600">
              <i className="fas fa-home mr-2"></i>
              Accueil
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <Link to="/blog" className="text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                Blog
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span className="text-sm font-medium text-gray-500">Article</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-64 lg:h-80 object-cover" />
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className={`${article.categoryColor} px-3 py-1 rounded-full text-sm font-medium`}>
              {article.category}
            </span>
            <span className="text-gray-500 text-sm ml-4">
              <i className="fas fa-calendar mr-1"></i>
              {article.publishedDate}
            </span>
            <span className="text-gray-500 text-sm ml-4">
              <i className="fas fa-clock mr-1"></i>
              {article.readTime}
            </span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{article.excerpt}</p>
          
          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            <img src={article.authorImage} alt={article.author} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 className="font-semibold text-gray-900">{article.author}</h3>
              <p className="text-sm text-gray-600">{article.authorTitle}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-200 ${
                  liked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className={`fas fa-heart ${liked ? 'text-red-600' : ''}`}></i>
                <span>{likes}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <i className="fas fa-share"></i>
                <span>Partager</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <i className="fas fa-bookmark"></i>
                <span>Sauvegarder</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <i className="fas fa-eye mr-1"></i>
                {article.views} vues
              </span>
              <span className="flex items-center">
                <i className="fas fa-comment mr-1"></i>
                {article.comments} commentaires
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-tags text-fuchsia-600 mr-2"></i>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-user text-fuchsia-600 mr-2"></i>
              À propos de l'auteur
            </h3>
            <div className="text-center">
              <img src={article.authorImage} alt={article.author} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">{article.author}</h4>
              <p className="text-sm text-gray-600 mb-4">{article.authorTitle}</p>
              <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm">
                Voir le profil
              </button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Newsletter</h3>
            <p className="text-sm mb-4 text-fuchsia-100">Recevez les derniers articles directement dans votre boîte mail</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <button className="w-full bg-white text-fuchsia-600 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <i className="fas fa-comments text-fuchsia-600 mr-2"></i>
          Commentaires ({article.comments})
        </h2>
        
        {!isLoggedIn ? (
          <div className="text-center py-8">
            <i className="fas fa-lock text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-500 mb-4">Connectez-vous pour laisser un commentaire</p>
            <Link 
              to="/login" 
              className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <img src="https://via.placeholder.com/40x40" alt="User" className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <textarea 
                  placeholder="Ajoutez votre commentaire..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none"
                  rows="3"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200">
                    Publier
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sample Comments */}
            <div className="space-y-4 mt-6">
              {[1, 2].map((comment) => (
                <div key={comment} className="flex space-x-4">
                  <img src="https://via.placeholder.com/40x40" alt="User" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900">Jean Dupont</span>
                      <span className="text-sm text-gray-500">Il y a 2 heures</span>
                    </div>
                    <p className="text-gray-700">Excellent article ! Ces conseils sont très pratiques pour améliorer notre processus de recrutement.</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <button className="text-gray-500 hover:text-fuchsia-600">Répondre</button>
                      <button className="text-gray-500 hover:text-red-600">
                        <i className="fas fa-heart mr-1"></i>
                        J'aime
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Articles */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <i className="fas fa-newspaper text-fuchsia-600 mr-2"></i>
          Articles similaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
              <img src="https://via.placeholder.com/300x200" alt="Article" className="w-full h-32 object-cover" />
              <div className="p-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Recrutement</span>
                <h3 className="font-semibold text-gray-900 mt-2 mb-2">Comment attirer les meilleurs talents</h3>
                <p className="text-sm text-gray-600 mb-2">Stratégies efficaces pour attirer les candidats de qualité...</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>15 Jan 2024</span>
                  <span>5 min de lecture</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogArticle; 