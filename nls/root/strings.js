/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(
{
    'COMMAND_TOGGLE':                   'ovk.todo.panel.togle',
    'COMMAND_ADD_TODO':                 'ovk.todo.addTodo',

    'ATTR_ASSOCIATED_FILE':             '_file',

    //
    'EXTENSION_NAME':                   'Simple To-Do',

    // General
    'DONE':                             'Done',
    'RESET':                            'Reset',
    'CANCEL':                           'Cancel',
    'DELETE':                           'Delete',

    'PANEL_TOGGLE':                     'Show Simple To-Do',
    'PANEL_TOOLTIP_ADD_TODO':           'Add new to-do item',
    'PANEL_TOOLTIP_ADD_CATEGORY':       'Add new category',
    'PANEL_TOOLTIP_ADD_TO_CAT_TODO':    'Add to-do item to this category',
    'PANEL_TOOLTIP_HIDE_CAT':           'Hide/Show category',
    'PANEL_TOOLTIP_RELOAD_TODO':        'Reload to-do items',
    'PANEL_TOOLTIP_TOGGLE_COMPLETED':   'Show/Hide completed to-do items',
    'PANEL_TOOLTIP_SETTINGS':           'Settings',
    'PANEL_COMPLETED':                  'completed',

    'EDIT_TOOLTIP_ACCEPT':              'Accept changes',
    'EDIT_TOOLTIP_DECLINE':             'Decline changes',
    'EDIT_TOOLTIP_LINK':                'Link/Unlink to opened file',
    'EDIT_TOOLTIP_DELETE':              'Delete',

    'TODO_TOOLTIP_OPEN_ASSOC':          'Open the associated file in the editor. File: ',

    // Dialogs
    'DIALOG_TITLE_ADD_TODO_FAILED':     'Failed to add to-do item',
    'DIALOG_MESSAGE_DESCR_EMPTY':       'A to-do item description is empty.',

    'DIALOG_TITLE_EDIT_TODO_FAILED':    'Failed to edit to-do item',
    'DIALOG_TITLE_DELETE_TODO_FAILED':  'Failed to delete to-do item',
    'DIALOG_TITLE_LIST_TODO_FAILED':    'Failed to read list of to-do items',
    'DIALOG_TITLE_DEL_COMPLETED_FAILED':'Failed to delete all completed to-do items',
    'DIALOG_TITLE_DELETE_CAT_FAILED':   'Failed to delete category',

    'DIALOG_TITLE_ADD_CAT_FAILED':      'Failed to add category',

    'DIALOG_TITLE_EDIT_CAT_FAILED':     'Failed to edit category',
    'DIALOG_MESSAGE_CAT_NAME_EMPTY':    'A category name is empty',

    'DIALOG_TITLE_OPEN_ASSOC_FAILED':   'Failed to open associated file',

    'DIALOG_TITLE_CONFIRM_CAT_DELETE':  'Confirm category delete',
    'DIALOG_MESSAGE_CONFIRM_CAT_DELETE':'Delete category \'{0}\' and all its to-do items?',

    'DIALOG_TITLE_SETTINGS':            'Simple To-Do Settings',
    'SETTINGS_TAB_GENERAL':             'General',
    'SETTINGS_GENERAL':                 'General Settings',
    'SETTINGS_TOGGLE_PANEL_HOTKEY':     'Show/Hide Panel Hotkey',
    'SETTINGS_ADD_TODO_HOTKEY':         'Add Task Hotkey',
    'SETTINGS_TODO_STORAGE':            'To-Do Items Storage',
    'SETTINGS_DELETE_COMPLETED':        'Delete Completed',
    'SETTINGS_DELETE_COMPLETED_WARN':   'Warning: all completed to-do items will be deleted',
    'SETTINGS_CONFIRM_DELETE_COMPLETED':'Warning: all your completed to-do items will be permanently deleted. Press \"Done\" again to confirm.',

    'SETTINGS_PROVIDER':                'Storage',

    'SETTINGS_FILE_PROVIDER_NAME':      'Text File',
    'FILE_PROVIDER_FILE_NAME':          'To-Do File Name',
    'FILE_PROVIDER_CATEGORY_PREFIX':    'Category Prefix',
    'FILE_PROVIDER_COMPLETED_PREFIX':   'Completed Item Prefix',
    'FILE_PROVIDER_INCOMPLETE_PREFIX':  'Incomplete Item Prefix',
    'FILE_PROVIDER_ERR_READ_FAILED':    'Failed to read to-do file',
    'FILE_PROVIDER_ERR_WRITE_FAILED':   'Failed to write to-do file',
    'FILE_PROVIDER_ERR_CAT_NOT_FOUND':  'Failed to find category with id: ',
    'FILE_PROVIDER_ERR_TODO_NOT_FOUND': 'Failed to find to-do with id: ',
    'FILE_PROVIDER_ERR_FILENAME_EMPTY': 'To-Do file name must not be empty',
    'FILE_PROVIDER_ERR_CAT_MARKER_EMPTY': 'Category marker must not be empty',
    'FILE_PROVIDER_ERR_MARKER_EMPTY':   'Completion prefix must not be empty',
    'FILE_PROVIDER_ERR_MARKERS_SAME':   'Completion and category prefixes must be unique. One prefix cannot start with another (e.g. "abc" and "abcd")',

    'TRELLO_PROVIDER_KEY_PLACEHOLDER':      'Paste Your Trello API Key Here',
    'TRELLO_PROVIDER_TOKEN_PLACEHOLDER':    'Paste Your Trello Token Here',
    'TRELLO_PROVIDER_USER_PLACEHOLDER':     'Trello User Id',
    'TRELLO_PROVIDER_SETTINGS_AUTH_LEGEND': 'Trello Authentication',
    'TRELLO_PROVIDER_SETTINGS_GET_KEY':     'Click Here To Get Trello API Key',
    'TRELLO_PROVIDER_SETTINGS_KEY_LABEL':   'API Key',
    'TRELLO_PROVIDER_SETTINGS_GET_TOKEN':   'Click Here To Get Trello Token',
    'TRELLO_PROVIDER_SETTINGS_TOKEN_LABEL': 'Token',
    'TRELLO_PROVIDER_SETTINGS_LIST_LEGEND': 'Select Trello List',
    'TRELLO_PROVIDER_SETTINGS_REFRESH':     'Refresh',
    'TRELLO_PROVIDER_SETTINGS_BOARD_LABEL': 'Board',
    'TRELLO_PROVIDER_SETTINGS_LIST_LABEL':  'List',
    'TRELLO_PROVIDER_SETTINGS_GET_LIST_ERR':'Failed to enumerate lists. Response: ',
    'TRELLO_PROVIDER_SETTINGS_GET_BOARD_ERR':'Failed to enumerate lists. Response: ',
    'TRELLO_PROVIDER_API_RESPONSE_ERR':     'Response: ',
    'TRELLO_PROVIDER_GET_CHECKITEMS_ERR':   'Failed to get checklist items',
    'TRELLO_PROVIDER_GET_CARDS_ERR':        'Failed to get cards',
    'TRELLO_PROVIDER_NO_UNCAT_ERR':         'Uncategorized to-do items are not supported by Trello. Please create a new category and add to-do items to it.',
    'TRELLO_PROVIDER_ERR_CAT_NOT_FOUND':    'Failed to find category with id: ',
    'TRELLO_PROVIDER_NEW_CHECKLIST_ERR':    'Failed to create new checklist',
    'TRELLO_PROVIDER_ADD_TO_CL_ERR':        'Failed to add item to checklist with id: ',
    'TRELLO_PROVIDER_ERR_TODO_NOT_FOUND':   'Failed to find to-do with id: ',
    'TRELLO_PROVIDER_EDIT_CHECKITEM_ERR':   'Failed to edit checkitem with id: ',
    'TRELLO_PROVIDER_DEL_CHECKITEM_ERR':    'Failed to delete checkitem with id: ',
    'TRELLO_PROVIDER_NEW_CARD_ERR':         'Failed to create new card',
    'TRELLO_PROVIDER_EDIT_CARD_ERR':        'Failed to edit card with id: ',
    'TRELLO_PROVIDER_DEL_CARD_ERR':         'Failed to delete card with id: ',
    'TRELLO_PROVIDER_ATTRS_NOT_SUPP':       'To-do item attributes are not supported in Trello storage',

    //
    'PLACEHOLDER_TODO_ITEM':            'To-Do Item',
    'PLACEHOLDER_CATEGORY':             'Category Name'
});
