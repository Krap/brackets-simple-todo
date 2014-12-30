/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(
{
    //
    'EXTENSION_NAME':                   'Simple To-Do',

    // General
    'CANCEL':                           'Cancel',

    'YES_RELOAD':                       'Yes, reload',

    'PANEL_TOOLTIP_ADD_TODO':           'Add new to-do item',
    'PANEL_TOOLTIP_RELOAD_TODO':        'Reload to-do items',
    'PANEL_TOOLTIP_TOGGLE_COMPLETED':   'Show/Hide completed to-do items',
    'PANEL_TOOLTIP_SETTINGS':           'Settings',

    'EDIT_TOOLTIP_ACCEPT':              'Accept changes',
    'EDIT_TOOLTIP_DECLINE':             'Decline changes',
    'EDIT_TOOLTIP_DELETE':              'Delete to-do item',

    // Dialogs
    'DIALOG_TITLE_CONFIRM_RELOAD':      'Confirm reload',
    'DIALOG_MESSAGE_CONFIRM_RELOAD':    'Do you really want to reload? All changes to the edited to-do item will be lost.',

    'DIALOG_TITLE_ADD_TODO_FAILED':     'Failed to add to-do item',
    'DIALOG_MESSAGE_DESCR_EMPTY':       'A to-do item description is empty.',

    'DIALOG_TITLE_EDIT_TODO_FAILED':    'Failed to edit to-do item',
    'DIALOG_TITLE_DELETE_TODO_FAILED':  'Failed to delete to-do item',
    'DIALOG_TITLE_LIST_TODO_FAILED':    'Failed to read list of to-do items',

    'DIALOG_TITLE_SETTINGS':            'Simple To-Do Settings',
    'SETTINGS_TAB_GENERAL':             'General',
    'SETTINGS_GENERAL':                 'General Settings',
    'SETTINGS_TODO_STORAGE':            'To-Do Items Storage',
    'SETTINGS_DELETE_COMPLETED':        'Delete Completed',
    'SETTINGS_DELETE_COMPLETED_WARN':   'Warning: all completed to-do items will be deleted',

    'SETTINGS_PROVIDER':                'Storage',
    'SETTINGS_FILE_PROVIDER_NAME':      'Text File',
    'FILE_PROVIDER_FILE_NAME':          'To-Do File Name',
    'FILE_PROVIDER_COMPLETED_PREFIX':   'Completed Item Prefix',
    'FILE_PROVIDER_INCOMPLETE_PREFIX':  'Innomplete Item Prefix',
    'FILE_PROVIDER_ERR_FILENAME_EMPTY': 'To-Do file name must not be empty',
    'FILE_PROVIDER_ERR_MARKER_EMPTY':   'Completion prefix must not be empty',
    'FILE_PROVIDER_ERR_MARKERS_SAME':   'Completion prefixes must be unique. One prefix cannot start with another (e.g. "abc" and "abcd")',

    //
    'PLACEHOLDER_TODO_ITEM':            'To-Do Item'
});
