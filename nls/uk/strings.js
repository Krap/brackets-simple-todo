/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(
{

    // General
    'DONE':                             'Так',
    'RESET':                            'Скинути',
    'CANCEL':                           'Скасувати',
    'DELETE':                           'Видалити',

    'PANEL_TOGGLE':                     'Показати Simple To-Do',
    'PANEL_TOOLTIP_ADD_TODO':           'Додати новий елемент до списку',
    'PANEL_TOOLTIP_ADD_CATEGORY':       'Додати нову категорію',
    'PANEL_TOOLTIP_ADD_TO_CAT_TODO':    'Додати елемент до цієї категорії',
    'PANEL_TOOLTIP_HIDE_CAT':           'Сховати/Показати категорію',
    'PANEL_TOOLTIP_RELOAD_TODO':        'Обновити список',
    'PANEL_TOOLTIP_TOGGLE_COMPLETED':   'Сховати/Показати виконані завдання',
    'PANEL_TOOLTIP_SETTINGS':           'Налаштування',
    'PANEL_COMPLETED':                  'виконані',

    'EDIT_TOOLTIP_ACCEPT':              'Прийняти зміни',
    'EDIT_TOOLTIP_DECLINE':             'Відхилити зміни',
    'EDIT_TOOLTIP_DELETE':              'Видалити',

    // Dialogs
    'DIALOG_TITLE_ADD_TODO_FAILED':     'Не вдалося додати елемент до списку',
    'DIALOG_MESSAGE_DESCR_EMPTY':       'Відсутній опис елементу',

    'DIALOG_TITLE_EDIT_TODO_FAILED':    'Не вдалося змінити елемент',
    'DIALOG_TITLE_DELETE_TODO_FAILED':  'Не вдалося видалити елемент',
    'DIALOG_TITLE_LIST_TODO_FAILED':    'Не вдалося прочитати список',
    'DIALOG_TITLE_DEL_COMPLETED_FAILED':'Не вдалося видалити усі виконані завдання',
    'DIALOG_TITLE_DELETE_CAT_FAILED':   'Не вдалося видалити категорію',

    'DIALOG_TITLE_ADD_CAT_FAILED':      'Не вдалося додати категорію',

    'DIALOG_TITLE_EDIT_CAT_FAILED':     'Не вдалося змінити категорію',
    'DIALOG_MESSAGE_CAT_NAME_EMPTY':    'Ім\'я категорії порожне',

    'DIALOG_TITLE_CONFIRM_CAT_DELETE':  'Підтвердіть видалення категорії',
    'DIALOG_MESSAGE_CONFIRM_CAT_DELETE':'Видалити категорію \'{0}\' та усі її елементи?',

    'DIALOG_TITLE_SETTINGS':            'Налаштування Simple To-Do',
    'SETTINGS_TAB_GENERAL':             'Загальні',
    'SETTINGS_GENERAL':                 'Загальні Налаштування',
    'SETTINGS_TODO_STORAGE':            'Зберігати елементи у',
    'SETTINGS_DELETE_COMPLETED':        'Видаляти виконані',
    'SETTINGS_DELETE_COMPLETED_WARN':   'Попередження: усі виконані завдання будуть видалені',
    'SETTINGS_CONFIRM_DELETE_COMPLETED':'Попередження: усі виконані завдання будуть видалені назавжди. Натисніть \"Так\" знову для підтвердження',

    'SETTINGS_PROVIDER':                'Зберігання',
    'SETTINGS_FILE_PROVIDER_NAME':      'Текстовий файл',
    'FILE_PROVIDER_FILE_NAME':          'Ім\'я файлу',
    'FILE_PROVIDER_CATEGORY_PREFIX':    'Префікс категорії',
    'FILE_PROVIDER_COMPLETED_PREFIX':   'Префікс виконаних завдань',
    'FILE_PROVIDER_INCOMPLETE_PREFIX':  'Префікс невиконаних завдань',
    'FILE_PROVIDER_ERR_READ_FAILED':    'Не вдалося прочитати файл',
    'FILE_PROVIDER_ERR_WRITE_FAILED':   'Не вдалося записати файл',
    'FILE_PROVIDER_ERR_CAT_NOT_FOUND':  'Не вдалося знайти категорію з ідентифікатором: ',
    'FILE_PROVIDER_ERR_TODO_NOT_FOUND': 'Не вдалося знайти елемент з ідентифікатором: ',
    'FILE_PROVIDER_ERR_FILENAME_EMPTY': 'Ім\'я файлу не може бути порожнім',
    'FILE_PROVIDER_ERR_CAT_MARKER_EMPTY':'Маркер категорії не може бути порожнім',
    'FILE_PROVIDER_ERR_MARKER_EMPTY':   'Префікс виконаних завдань не може бути порожнім',
    'FILE_PROVIDER_ERR_MARKERS_SAME':   'Префікси завершення та категорій повинні бути унікальними. Один префікс не може починатися з іншого (наприклад, "ABC" і "ABCD")',

    //
    'PLACEHOLDER_TODO_ITEM':            'Завдання',
    'PLACEHOLDER_CATEGORY':             'Ім\'я категорії'
});
