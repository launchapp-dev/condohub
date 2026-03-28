export default {
  "meta": {
    "title": "CondoHub",
    "description": "Plateforme moderne de gestion de condominiums"
  },
  "nav": {
    "dashboard": "Tableau de bord",
    "visitors": "Visiteurs",
    "announcements": "Annonces",
    "maintenance": "Entretien",
    "amenities": "Commodités",
    "finances": "Finances",
    "documents": "Documents",
    "community": "Communauté",
    "settings": "Paramètres",
    "login": "Se connecter",
    "logout": "Se déconnecter",
    "signup": "S'inscrire"
  },
  "auth": {
    "email": "E-mail",
    "password": "Mot de passe",
    "confirmPassword": "Confirmer le mot de passe",
    "name": "Nom complet",
    "loginTitle": "Bon retour",
    "loginSubtitle": "Connectez-vous à votre compte CondoHub",
    "signupTitle": "Créer un compte",
    "signupSubtitle": "Rejoignez la communauté de votre condominium",
    "forgotPassword": "Mot de passe oublié ?",
    "noAccount": "Vous n'avez pas de compte ?",
    "hasAccount": "Vous avez déjà un compte ?",
    "loginButton": "Se connecter",
    "signupButton": "S'inscrire",
    "loginWithGoogle": "Continuer avec Google",
    "loginWithGitHub": "Continuer avec GitHub",
    "errors": {
      "invalidCredentials": "E-mail ou mot de passe invalide",
      "accountExists": "Un compte avec cet e-mail existe déjà",
      "weakPassword": "Le mot de passe est trop faible",
      "passwordsMismatch": "Les mots de passe ne correspondent pas",
      "generic": "Une erreur s'est produite. Veuillez réessayer."
    }
  },
  "dashboard": {
    "title": "Tableau de bord",
    "welcome": "Bienvenue, {name}",
    "recentVisitors": "Visiteurs récents",
    "recentAnnouncements": "Annonces récentes",
    "pendingMaintenance": "Entretien en attente",
    "upcomingBookings": "Réservations à venir"
  },
  "visitors": {
    "title": "Visiteurs",
    "register": "Enregistrer un visiteur",
    "registerTitle": "Enregistrer un visiteur",
    "name": "Nom du visiteur",
    "phone": "Téléphone",
    "purpose": "Motif de la visite",
    "expectedAt": "Arrivée prévue",
    "unit": "Unité",
    "status": "Statut",
    "qrPass": "Pass QR",
    "securityView": "Contrôle d'accès",
    "checkIn": "Entrée",
    "checkOut": "Sortie",
    "noVisitors": "Aucun visiteur trouvé"
  },
  "announcements": {
    "title": "Annonces",
    "new": "Nouvelle annonce",
    "newTitle": "Créer une annonce",
    "subject": "Sujet",
    "body": "Message",
    "priority": "Priorité",
    "publish": "Publier",
    "comments": "Commentaires",
    "noAnnouncements": "Aucune annonce pour l'instant"
  },
  "maintenance": {
    "title": "Entretien",
    "newRequest": "Nouvelle demande",
    "newTitle": "Soumettre une demande d'entretien",
    "category": "Catégorie",
    "description": "Description",
    "urgency": "Urgence",
    "submit": "Soumettre la demande",
    "statusPending": "En attente",
    "statusInProgress": "En cours",
    "statusCompleted": "Terminé",
    "noRequests": "Aucune demande d'entretien"
  },
  "amenities": {
    "title": "Commodités",
    "book": "Réserver une commodité",
    "bookingTitle": "Réserver {name}",
    "date": "Date",
    "time": "Heure",
    "duration": "Durée",
    "confirmBooking": "Confirmer la réservation",
    "noAmenities": "Aucune commodité disponible"
  },
  "finances": {
    "title": "Finances",
    "balance": "Solde",
    "dues": "Cotisations mensuelles",
    "payments": "Paiements",
    "budgets": "Budgets",
    "payNow": "Payer maintenant"
  },
  "documents": {
    "title": "Documents",
    "upload": "Téléverser un document",
    "noDocuments": "Aucun document disponible"
  },
  "community": {
    "title": "Communauté",
    "info": "Infos communauté",
    "units": "Unités",
    "members": "Membres",
    "contact": "Contact"
  },
  "settings": {
    "title": "Paramètres",
    "profile": "Profil",
    "language": "Langue",
    "notifications": "Notifications",
    "communitySettings": "Paramètres communauté",
    "roles": "Gestion des rôles",
    "save": "Enregistrer les modifications"
  },
  "roles": {
    "resident": "Résident",
    "board_member": "Membre du conseil",
    "admin": "Administrateur",
    "security": "Sécurité",
    "maintenance": "Entretien"
  },
  "common": {
    "loading": "Chargement...",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "create": "Créer",
    "search": "Rechercher",
    "filter": "Filtrer",
    "back": "Retour",
    "next": "Suivant",
    "previous": "Précédent",
    "submit": "Soumettre",
    "close": "Fermer",
    "open": "Ouvrir",
    "view": "Voir",
    "download": "Télécharger",
    "share": "Partager",
    "copy": "Copier",
    "success": "Succès",
    "error": "Erreur",
    "warning": "Avertissement",
    "info": "Info",
    "confirm": "Confirmer",
    "yes": "Oui",
    "no": "Non",
    "optional": "Facultatif",
    "required": "Obligatoire"
  }
} as const;
