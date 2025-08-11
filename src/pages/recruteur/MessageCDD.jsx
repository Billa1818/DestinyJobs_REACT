import React, { useState, useRef } from 'react';

const MessageCDD = () => {
  const [charCount, setCharCount] = useState(0);
  const [isScheduled, setIsScheduled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [recipientFilters, setRecipientFilters] = useState({
    all: true,
    recent: false,
    premium: false
  });
  const [candidateCount, setCandidateCount] = useState(247);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const messageRef = useRef(null);
  const attachmentInputRef = useRef(null);

  // Character counter
  const handleMessageChange = (e) => {
    const count = e.target.value.length;
    setCharCount(count);
  };

  // Schedule message toggle
  const handleScheduleToggle = (e) => {
    setIsScheduled(e.target.checked);
  };

  // File upload handling
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const removeFile = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    
    // Update the file input
    const dt = new DataTransfer();
    newAttachments.forEach(file => dt.items.add(file));
    if (attachmentInputRef.current) {
      attachmentInputRef.current.files = dt.files;
    }
  };

  // Preview functionality
  const handlePreview = () => {
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  // Template loading
  const loadTemplate = (templateName) => {
    console.log('Loading template:', templateName);
    // Here you would load the template content
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      
      setTimeout(() => {
        setIsSent(false);
        // Reset form
        e.target.reset();
        setAttachments([]);
        setCharCount(0);
        setRecipientFilters({ all: true, recent: false, premium: false });
        setCandidateCount(247);
      }, 2000);
    }, 2000);
  };

  // Save draft functionality
  const handleSaveDraft = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  // Recipient filter updates
  const handleRecipientFilterChange = (filter) => {
    const newFilters = { ...recipientFilters };
    newFilters[filter] = !newFilters[filter];
    setRecipientFilters(newFilters);
    
    // Update candidate count
    let count = 0;
    if (newFilters.all) count += 247;
    if (newFilters.recent) count += 45;
    if (newFilters.premium) count += 89;
    
    setCandidateCount(Math.min(count, 247));
  };

  return (
    <main className="flex-1 bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                <i className="fas fa-paper-plane text-fuchsia-600 mr-3"></i>
                Messagerie Candidats
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Envoyez des messages ciblés à vos candidats acceptés</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i className="fas fa-users mr-1"></i>
                <span>{candidateCount}</span> candidats actifs
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Message Composer */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    <i className="fas fa-edit text-fuchsia-600 mr-2"></i>
                    Composer un message
                  </h2>
                  <button 
                    onClick={handlePreview}
                    className="text-fuchsia-600 hover:text-fuchsia-800 text-sm font-medium flex items-center"
                  >
                    <i className="fas fa-eye mr-1"></i>
                    Aperçu
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Recipients Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <i className="fas fa-filter mr-1"></i>
                      Destinataires
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={recipientFilters.all}
                          onChange={() => handleRecipientFilterChange('all')}
                          className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                        />
                        <span className="ml-2 text-sm">Tous les candidats</span>
                        <span className="ml-auto text-xs text-gray-500">(247)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={recipientFilters.recent}
                          onChange={() => handleRecipientFilterChange('recent')}
                          className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                        />
                        <span className="ml-2 text-sm">Candidats récents</span>
                        <span className="ml-auto text-xs text-gray-500">(45)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={recipientFilters.premium}
                          onChange={() => handleRecipientFilterChange('premium')}
                          className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                        />
                        <span className="ml-2 text-sm">Profils premium</span>
                        <span className="ml-auto text-xs text-gray-500">(89)</span>
                      </label>
                    </div>
                  </div>

                  {/* Sector Filter */}
                  <div>
                    <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-industry mr-1"></i>
                      Secteur d'activité (optionnel)
                    </label>
                    <select id="sector" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
                      <option value="">Tous les secteurs</option>
                      <option value="it">Informatique & Tech</option>
                      <option value="finance">Finance & Banque</option>
                      <option value="marketing">Marketing & Communication</option>
                      <option value="health">Santé & Médical</option>
                      <option value="education">Éducation & Formation</option>
                      <option value="commerce">Commerce & Vente</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-tag mr-1"></i>
                      Objet du message *
                    </label>
                    <input 
                      type="text" 
                      id="subject" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="Ex: Nouvelle opportunité d'emploi chez..."
                    />
                  </div>

                  {/* Message Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <i className="fas fa-envelope mr-1"></i>
                      Type de message
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center">
                        <input type="radio" name="message-type" value="job-offer" defaultChecked className="text-fuchsia-600 focus:ring-fuchsia-500" />
                        <span className="ml-2 text-sm">Offre d'emploi</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="message-type" value="event" className="text-fuchsia-600 focus:ring-fuchsia-500" />
                        <span className="ml-2 text-sm">Événement</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="message-type" value="info" className="text-fuchsia-600 focus:ring-fuchsia-500" />
                        <span className="ml-2 text-sm">Information générale</span>
                      </label>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-align-left mr-1"></i>
                      Message *
                    </label>
                    <div className="border border-gray-300 rounded-md">
                      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
                        <button type="button" className="format-btn p-1 rounded hover:bg-gray-100" data-format="bold">
                          <i className="fas fa-bold text-sm"></i>
                        </button>
                        <button type="button" className="format-btn p-1 rounded hover:bg-gray-100" data-format="italic">
                          <i className="fas fa-italic text-sm"></i>
                        </button>
                        <button type="button" className="format-btn p-1 rounded hover:bg-gray-100" data-format="underline">
                          <i className="fas fa-underline text-sm"></i>
                        </button>
                        <div className="w-px bg-gray-300 mx-1"></div>
                        <button type="button" className="format-btn p-1 rounded hover:bg-gray-100" data-format="list">
                          <i className="fas fa-list text-sm"></i>
                        </button>
                        <button type="button" className="format-btn p-1 rounded hover:bg-gray-100" data-format="link">
                          <i className="fas fa-link text-sm"></i>
                        </button>
                      </div>
                      <textarea 
                        ref={messageRef}
                        id="message" 
                        required 
                        rows="8" 
                        onChange={handleMessageChange}
                        className="w-full px-3 py-3 border-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none"
                        placeholder="Rédigez votre message ici...&#10;&#10;Conseil : Personnalisez votre message en utilisant des variables comme {nom_candidat}, {secteur}, etc."
                      ></textarea>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>Variables disponibles: {nom_candidat}, {secteur}, {experience}</span>
                      <span className={charCount > 2000 ? 'text-red-500' : ''}>
                        {charCount}/2000 caractères
                      </span>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-paperclip mr-1"></i>
                      Pièces jointes (optionnel)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-fuchsia-400 transition-colors">
                      <input 
                        ref={attachmentInputRef}
                        type="file" 
                        id="attachments" 
                        multiple 
                        accept=".pdf,.doc,.docx,.jpg,.png" 
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="attachments" className="cursor-pointer">
                        <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-600">Cliquez pour ajouter des fichiers</p>
                        <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG (max 5MB chacun)</p>
                      </label>
                    </div>
                    <div className="mt-2 space-y-1">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded text-sm">
                          <span className="flex items-center">
                            <i className="fas fa-file mr-2 text-gray-500"></i>
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                          <button 
                            type="button" 
                            onClick={() => removeFile(index)} 
                            className="text-red-500 hover:text-red-700"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Options */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="flex items-center mb-3">
                      <input 
                        type="checkbox" 
                        id="schedule-message" 
                        checked={isScheduled}
                        onChange={handleScheduleToggle}
                        className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        <i className="fas fa-clock mr-1"></i>
                        Programmer l'envoi
                      </span>
                    </label>
                    {isScheduled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="schedule-date" className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                          <input type="date" id="schedule-date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
                        </div>
                        <div>
                          <label htmlFor="schedule-time" className="block text-xs font-medium text-gray-600 mb-1">Heure</label>
                          <input type="time" id="schedule-time" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button 
                      type="button" 
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
                    >
                      {isSaving ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Sauvegarder brouillon
                        </>
                      )}
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || isSent}
                      className={`flex-1 px-6 py-2 rounded-md transition duration-200 font-medium ${
                        isSent 
                          ? 'bg-green-600 text-white' 
                          : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Envoi en cours...
                        </>
                      ) : isSent ? (
                        <>
                          <i className="fas fa-check mr-2"></i>
                          Message envoyé !
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          {isScheduled ? 'Programmer l\'envoi' : 'Envoyer maintenant'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Statistics Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-chart-bar text-fuchsia-600 mr-2"></i>
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Messages envoyés ce mois</span>
                  <span className="font-semibold text-fuchsia-600">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taux d'ouverture moyen</span>
                  <span className="font-semibold text-green-600">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Candidatures générées</span>
                  <span className="font-semibold text-blue-600">156</span>
                </div>
              </div>
            </div>

            {/* Recent Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-file-alt text-fuchsia-600 mr-2"></i>
                Modèles récents
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => loadTemplate('Offre IT Senior')}
                  className="template-btn w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors"
                >
                  <div className="font-medium">Offre IT Senior</div>
                  <div className="text-xs text-gray-500">Utilisé le 15 juin</div>
                </button>
                <button 
                  onClick={() => loadTemplate('Événement recrutement')}
                  className="template-btn w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors"
                >
                  <div className="font-medium">Événement recrutement</div>
                  <div className="text-xs text-gray-500">Utilisé le 10 juin</div>
                </button>
                <button 
                  onClick={() => loadTemplate('Newsletter mensuelle')}
                  className="template-btn w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors"
                >
                  <div className="font-medium">Newsletter mensuelle</div>
                  <div className="text-xs text-gray-500">Utilisé le 1er juin</div>
                </button>
              </div>
              <button className="w-full mt-3 text-sm text-fuchsia-600 hover:text-fuchsia-800 font-medium">
                <i className="fas fa-plus mr-1"></i>
                Créer un nouveau modèle
              </button>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-lg border border-fuchsia-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                Conseils
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                  Personnalisez vos messages avec les variables
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                  Testez vos emails avant l'envoi massif
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                  Programmez vos messages aux heures optimales
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Aperçu du message</h3>
              <button onClick={closePreview} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="bg-white rounded border p-4">
                  <div className="border-b pb-3 mb-3">
                    <h4 className="font-semibold text-lg">Objet du message</h4>
                    <p className="text-sm text-gray-600">De: Votre Entreprise • À: Candidats sélectionnés</p>
                  </div>
                  <div className="whitespace-pre-wrap">Contenu du message...</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={closePreview} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Fermer
              </button>
              <button className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700">
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MessageCDD;