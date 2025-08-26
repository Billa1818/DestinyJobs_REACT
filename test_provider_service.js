// Test simple du service ProviderProfilService
// Ce fichier peut être exécuté dans la console du navigateur

console.log('🧪 Test du service ProviderProfilService...');

// Simuler des données de test
const testProfileData = {
  provider_type: 'INDIVIDUAL',
  specializations: 'Développement Web, Python, React',
  hourly_rate: '50.00',
  daily_rate: '400.00',
  availability: 'AVAILABLE',
  years_experience: '5',
  completed_projects: '25',
  country: { id: 1, name: 'Bénin' },
  region: { id: 2, name: 'Littoral' },
  // Ces champs ne doivent PAS être envoyés
  image: null,
  cv: null,
  portfolio: null,
  organization_logo: null
};

const testFiles = {};

console.log('📊 Données de test:', testProfileData);
console.log('📁 Fichiers de test:', testFiles);

// Test de validation
try {
  const validation = ProviderProfilService.validateProfileData(testProfileData);
  console.log('✅ Validation:', validation);
  
  if (validation.isValid) {
    // Test de préparation des données
    const formData = ProviderProfilService.prepareProfileData(testProfileData, testFiles);
    
    console.log('📤 FormData préparé:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value} (type: ${typeof value})`);
    }
    
    // Vérifier qu'aucun champ de fichier vide n'est présent
    const fileFields = ['image', 'cv', 'portfolio', 'organization_logo'];
    let hasEmptyFileFields = false;
    
    for (let [key, value] of formData.entries()) {
      if (fileFields.includes(key) && (value === '' || value === 'null' || value === null)) {
        hasEmptyFileFields = true;
        console.warn(`⚠️  ATTENTION: Champ fichier vide détecté: ${key} = ${value}`);
      }
    }
    
    if (!hasEmptyFileFields) {
      console.log('✅ Aucun champ de fichier vide détecté - Le service fonctionne correctement!');
    } else {
      console.error('❌ PROBLÈME: Des champs de fichiers vides sont présents!');
    }
  } else {
    console.error('❌ Validation échouée:', validation.errors);
  }
} catch (error) {
  console.error('💥 Erreur lors du test:', error);
}

console.log('�� Test terminé.'); 