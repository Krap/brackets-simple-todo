/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(
{
    //
    'EXTENSION_NAME':                   'Simple To-Do',

    // General
    'DONE':                             'Fatto',
    'RESET':                            'Reset',
    'CANCEL':                           'Cancella',
    'DELETE':                           'Cancella',

    'PANEL_TOOLTIP_ADD_TODO':           'Aggiungi nuova attività da fare',
    'PANEL_TOOLTIP_ADD_CATEGORY':       'Aggiungi nuova categoria',
    'PANEL_TOOLTIP_ADD_TO_CAT_TODO':    'Aggiungi nuove attività da fare in questa categoria',
    'PANEL_TOOLTIP_HIDE_CAT':           'Nascondi/Mostra categorie',
    'PANEL_TOOLTIP_RELOAD_TODO':        'Ricarica attività da fare',
    'PANEL_TOOLTIP_TOGGLE_COMPLETED':   'Mostra/Nascondi completato elementi attività',
    'PANEL_TOOLTIP_SETTINGS':           'Impostazioni',

    'EDIT_TOOLTIP_ACCEPT':              'Accetta cambiamenti',
    'EDIT_TOOLTIP_DECLINE':             'Rifiuta cambiamenti',
    'EDIT_TOOLTIP_DELETE':              'Cancella',

    // Dialogs
    'DIALOG_TITLE_ADD_TODO_FAILED':     'Impossibile aggiungere attività',
    'DIALOG_MESSAGE_DESCR_EMPTY':       'La descrizione delle attività é vuota.',

    'DIALOG_TITLE_EDIT_TODO_FAILED':    'Fallita la modifica delle attività',
    'DIALOG_TITLE_DELETE_TODO_FAILED':  'Fallita la cancellazione delle attività',
    'DIALOG_TITLE_LIST_TODO_FAILED':    'Fallita la lettura della lista delle attività',
    'DIALOG_TITLE_DEL_COMPLETED_FAILED':'Fallita la cancellazione completa di tutte le attività',
    'DIALOG_TITLE_DELETE_CAT_FAILED':   'Fallita la cancellazione della categoria',

    'DIALOG_TITLE_ADD_CAT_FAILED':      'Fallita l\'aggiunta della categoria',

    'DIALOG_TITLE_EDIT_CAT_FAILED':     'Fallita la modifica della categoria',
    'DIALOG_MESSAGE_CAT_NAME_EMPTY':    'Un nome della categoria è vuoto',

    'DIALOG_TITLE_CONFIRM_CAT_DELETE':  'Conferma cancellazione categoria',
    'DIALOG_MESSAGE_CONFIRM_CAT_DELETE':'Elimina categoria \'{0}\' e tutte le attività da fare?',

    'DIALOG_TITLE_SETTINGS':            'Impostazioni Simple To-Do',
    'SETTINGS_TAB_GENERAL':             'Generale',
    'SETTINGS_GENERAL':                 'Impostazioni generali',
    'SETTINGS_TODO_STORAGE':            'Memorizza attività da fare',
    'SETTINGS_DELETE_COMPLETED':        'Elimina attività completate',
    'SETTINGS_DELETE_COMPLETED_WARN':   'Attenzione: tutte le attività completate verranno eliminate',
    'SETTINGS_CONFIRM_DELETE_COMPLETED':'Attenzione: tutte le attività completate verranno eliminate in modo permanente. Premi \"Fatto\" per confermare.',

    'SETTINGS_PROVIDER':                'Memorizza',
    'SETTINGS_FILE_PROVIDER_NAME':      'File di testo',
    'FILE_PROVIDER_FILE_NAME':          'Nome file To-Do',
    'FILE_PROVIDER_CATEGORY_PREFIX':    'Prefisso categoria',
    'FILE_PROVIDER_COMPLETED_PREFIX':   'Completa attività prefissate',
    'FILE_PROVIDER_INCOMPLETE_PREFIX':  'Incompleta attività prefissate',
    'FILE_PROVIDER_ERR_READ_FAILED':    'Fallita la lettura del file delle attività da fare',
    'FILE_PROVIDER_ERR_WRITE_FAILED':   'Fallita la scrittura del file delle attività da fare',
    'FILE_PROVIDER_ERR_CAT_NOT_FOUND':  'Fallita la ricerca della categoria con id: ',
    'FILE_PROVIDER_ERR_TODO_NOT_FOUND': 'Fallita la ricerca delle attività da fare con id: ',
    'FILE_PROVIDER_ERR_FILENAME_EMPTY': 'Il file delle attività da fare un deve essere vuoto',
    'FILE_PROVIDER_ERR_CAT_MARKER_EMPTY': 'Contrassegno di categoria non deve essere vuoto',
    'FILE_PROVIDER_ERR_MARKER_EMPTY':   'Prefisso di completamento non deve essere vuoto',
    'FILE_PROVIDER_ERR_MARKERS_SAME':   'Completamento e di categoria prefissi devono essere univoci. Un prefisso non può iniziare con un\'altro (es. "abc" e "abcd")',

    //
    'PLACEHOLDER_TODO_ITEM':            'Attività da fare',
    'PLACEHOLDER_CATEGORY':             'Nome categoria'
});
