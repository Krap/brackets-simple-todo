/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define({
  'COMMAND_TOGGLE': 'ovk.todo.panel.togle',
  'COMMAND_ADD_TODO': 'ovk.todo.addTodo',

  'ATTR_ASSOCIATED_FILE': '_file',

  //
  'EXTENSION_NAME': 'Simple To-Do',

  // General
  'DONE': 'Fait',
  'RESET': 'Réinitialiser',
  'CANCEL': 'Annuler',
  'DELETE': 'Supprimer',

  'PANEL_TOGGLE': 'Afficher Simple To-Do',
  'PANEL_TOOLTIP_ADD_TODO': 'Ajouter une tâche',
  'PANEL_TOOLTIP_ADD_CATEGORY': 'Ajouter une catégorie',
  'PANEL_TOOLTIP_ADD_TO_CAT_TODO': 'Ajouter tâche à cette catégorie',
  'PANEL_TOOLTIP_HIDE_CAT': 'Cacher/Voir catégorie',
  'PANEL_TOOLTIP_RELOAD_TODO': 'Recharger les tâches',
  'PANEL_TOOLTIP_TOGGLE_COMPLETED': 'Masquer/Afficher les tâches terminées',
  'PANEL_TOOLTIP_SETTINGS': 'Paramètres',
  'PANEL_COMPLETED': 'completed',

  'EDIT_TOOLTIP_ACCEPT': 'Accepter les modifications',
  'EDIT_TOOLTIP_DECLINE': 'Refuser les modifications',
  'EDIT_TOOLTIP_LINK': 'Lier/Délier au fichier ouvert',
  'EDIT_TOOLTIP_DELETE': 'Supprimer',

  'TODO_TOOLTIP_OPEN_ASSOC': 'Ouvrir le fichier associé dans l\'éditeur. Fichier: ',

  // Dialogs
  'DIALOG_TITLE_ADD_TODO_FAILED': 'Impossible d\'ajouter la tâche',
  'DIALOG_MESSAGE_DESCR_EMPTY': 'La description de la tâche est vide.',

  'DIALOG_TITLE_EDIT_TODO_FAILED': 'Impossible de modifier la tâche',
  'DIALOG_TITLE_DELETE_TODO_FAILED': 'Impossible de supprimer la tâche',
  'DIALOG_TITLE_LIST_TODO_FAILED': 'Impossible de lire la liste de tâches',
  'DIALOG_TITLE_DEL_COMPLETED_FAILED': 'Impossible de supprimer toutes les tâches terminées',
  'DIALOG_TITLE_DELETE_CAT_FAILED': 'Impossible de supprimer la catégorie',

  'DIALOG_TITLE_ADD_CAT_FAILED': 'Impossible d\'ajouter une catégorie',

  'DIALOG_TITLE_EDIT_CAT_FAILED': 'Impossible de modifier une catégorie',
  'DIALOG_MESSAGE_CAT_NAME_EMPTY': 'Le nom de catégorie est vide',

  'DIALOG_TITLE_OPEN_ASSOC_FAILED': 'Impossible d\'ouvrir le fichier associé',

  'DIALOG_TITLE_CONFIRM_CAT_DELETE': 'Confirmation de suppression de catégorie',
  'DIALOG_MESSAGE_CONFIRM_CAT_DELETE': 'Supprimer la catégorie \'{0}\' et toutes set tâches ?',

  'DIALOG_TITLE_SETTINGS': 'Paramètres de Simple To-Do',
  'SETTINGS_TAB_GENERAL': 'Général',
  'SETTINGS_GENERAL': 'Paramètres généraux',
  'SETTINGS_TOGGLE_PANEL_HOTKEY': 'Raccourci pour afficher/masquer le panneau',
  'SETTINGS_ADD_TODO_HOTKEY': 'Raccourci pour ajouter une tâche',
  'SETTINGS_TODO_STORAGE': 'Stockage des tâches To-Do',
  'SETTINGS_DELETE_COMPLETED': 'Supprimer les tâches terminées',
  'SETTINGS_DELETE_COMPLETED_WARN': 'Attention: toutes les tâches terminées vont être supprimées',
  'SETTINGS_CONFIRM_DELETE_COMPLETED': 'Attention: toutes vos tâches terminées vont être supprimées définitivement. Appuyez à nouveau sur \"Terminé\" pour confirmer.',

  'SETTINGS_PROVIDER': 'Stockage',

  'SETTINGS_FILE_PROVIDER_NAME': 'Fichier texte',
  'FILE_PROVIDER_FILE_NAME': 'Nom du fichier de tâches',
  'FILE_PROVIDER_CATEGORY_PREFIX': 'Préfixe de catégorie',
  'FILE_PROVIDER_COMPLETED_PREFIX': 'Préfixe de tâche terminée',
  'FILE_PROVIDER_INCOMPLETE_PREFIX': 'Préfixe de tâche en cours',
  'FILE_PROVIDER_ERR_READ_FAILED': 'Impossible de lire le fichier de tâches',
  'FILE_PROVIDER_ERR_WRITE_FAILED': 'Impossible d\'écrire le fichier de tâches',
  'FILE_PROVIDER_ERR_CAT_NOT_FOUND': 'Impossible de trouver la catégorie avec l\'identifiant: ',
  'FILE_PROVIDER_ERR_TODO_NOT_FOUND': 'Impossible de trouver la tâche avec l\'identifiant: ',
  'FILE_PROVIDER_ERR_FILENAME_EMPTY': 'Nom du fichier de tâches obligatoire',
  'FILE_PROVIDER_ERR_CAT_MARKER_EMPTY': 'Préfixe de catégorie obligatoire',
  'FILE_PROVIDER_ERR_MARKER_EMPTY': 'Préfixe de tâche terminée obligatoire',
  'FILE_PROVIDER_ERR_MARKERS_SAME': 'Les préfixes de catégorie et de tâches terminées doivent être différents. Un préfixe ne peut pas commencer par un autre (ex. "abc" et "abcd")',

  'TRELLO_PROVIDER_KEY_PLACEHOLDER': 'Collez votre clé d\'API Trello ici',
  'TRELLO_PROVIDER_TOKEN_PLACEHOLDER': 'Collez votre jeton Troll ici',
  'TRELLO_PROVIDER_USER_PLACEHOLDER': 'Nom d\'utilisateur Trello',
  'TRELLO_PROVIDER_SETTINGS_AUTH_LEGEND': 'Authentification Trello',
  'TRELLO_PROVIDER_SETTINGS_GET_KEY': 'Cliquez ici pour obtenir la clé d\'API Trello',
  'TRELLO_PROVIDER_SETTINGS_KEY_LABEL': 'Clé d\'API',
  'TRELLO_PROVIDER_SETTINGS_GET_TOKEN': 'Cliquez ici pour obtenir le jeton Trello',
  'TRELLO_PROVIDER_SETTINGS_TOKEN_LABEL': 'Jeton',
  'TRELLO_PROVIDER_SETTINGS_LIST_LEGEND': 'Sélectionnez la liste Trello',
  'TRELLO_PROVIDER_SETTINGS_REFRESH': 'Rafraîchir',
  'TRELLO_PROVIDER_SETTINGS_BOARD_LABEL': 'Tableau',
  'TRELLO_PROVIDER_SETTINGS_LIST_LABEL': 'Liste',
  'TRELLO_PROVIDER_SETTINGS_GET_LIST_ERR': 'Impossible d\'énumérer les listes. Réponse: ',
  'TRELLO_PROVIDER_SETTINGS_GET_BOARD_ERR': 'Impossible d\'énumérer les listes. Réponse: ',
  'TRELLO_PROVIDER_API_RESPONSE_ERR': 'Réponse: ',
  'TRELLO_PROVIDER_GET_CHECKITEMS_ERR': 'Impossible d\'obtenir les entrées de liste',
  'TRELLO_PROVIDER_GET_CARDS_ERR': 'Impossible d\'obtenir les cartes',
  'TRELLO_PROVIDER_NO_UNCAT_ERR': 'Les tâches sans catégorie ne sont pas supportées par Trello. Merci de créer une catégorie et d\'y ajouter les nouvelles tâches.',
  'TRELLO_PROVIDER_ERR_CAT_NOT_FOUND': 'Impossible de trouver la catégorie avec l\'identifiant: ',
  'TRELLO_PROVIDER_NEW_CHECKLIST_ERR': 'Impossible de créer une nouvelle liste',
  'TRELLO_PROVIDER_ADD_TO_CL_ERR': 'Impossible d\'ajouter une tâche à la liste avec l\'identifiant: ',
  'TRELLO_PROVIDER_ERR_TODO_NOT_FOUND': 'Impossible de trouver la tâche avec l\'identifiant: ',
  'TRELLO_PROVIDER_EDIT_CHECKITEM_ERR': 'Impossible de modifier l\'entrée avec l\'identifiant: ',
  'TRELLO_PROVIDER_DEL_CHECKITEM_ERR': 'Impossible de supprimer l\'entrée avec l\'identifiant: ',
  'TRELLO_PROVIDER_NEW_CARD_ERR': 'Impossible de créer une nouvelle carte',
  'TRELLO_PROVIDER_EDIT_CARD_ERR': 'Impossible de modifier la carte avec l\'identifiant: ',
  'TRELLO_PROVIDER_DEL_CARD_ERR': 'Impossible de supprimer la carte avec l\'identifiant: ',
  'TRELLO_PROVIDER_ATTRS_NOT_SUPP': 'Les attributs de tâches ne sont pas supportés avec le stockage Trello',

  //
  'PLACEHOLDER_TODO_ITEM': 'Tâche',
  'PLACEHOLDER_CATEGORY': 'Catégorie'
});
