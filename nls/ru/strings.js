/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(
{
    // General
    'DONE':                             'Готово',
    'RESET':                            'Сбросить',
    'CANCEL':                           'Отмена',
    'DELETE':                           'Удалить',

    'PANEL_TOGGLE':                     'Показать Simple To-Do',
    'PANEL_TOOLTIP_ADD_TODO':           'Добавить новый элемент',
    'PANEL_TOOLTIP_ADD_CATEGORY':       'Добавить новую категорию',
    'PANEL_TOOLTIP_ADD_TO_CAT_TODO':    'Добавить новый элемент в эту категорию',
    'PANEL_TOOLTIP_HIDE_CAT':           'Скрыть/Показать категорию',
    'PANEL_TOOLTIP_RELOAD_TODO':        'Обновить список',
    'PANEL_TOOLTIP_TOGGLE_COMPLETED':   'Скрыть/Показать завершенные задачи',
    'PANEL_TOOLTIP_SETTINGS':           'Настройки',
    'PANEL_COMPLETED':                  'завершено',

    'EDIT_TOOLTIP_ACCEPT':              'Принять изменения',
    'EDIT_TOOLTIP_DECLINE':             'Отменить изменения',
    'EDIT_TOOLTIP_DELETE':              'Удалить',

    // Dialogs
    'DIALOG_TITLE_ADD_TODO_FAILED':     'Не удалось удалить задачу',
    'DIALOG_MESSAGE_DESCR_EMPTY':       'Описание задачи не может быть пустым',

    'DIALOG_TITLE_EDIT_TODO_FAILED':    'Не удалось отредактировать задачу',
    'DIALOG_TITLE_DELETE_TODO_FAILED':  'Не удалось удалить задачу',
    'DIALOG_TITLE_LIST_TODO_FAILED':    'Не удалось прочитать список задач',
    'DIALOG_TITLE_DEL_COMPLETED_FAILED':'Не удалось удалить все завершенные задачи',
    'DIALOG_TITLE_DELETE_CAT_FAILED':   'Не удалось удалить категорию',

    'DIALOG_TITLE_ADD_CAT_FAILED':      'Не удалось добавить категорию',

    'DIALOG_TITLE_EDIT_CAT_FAILED':     'Не удалось отредактировать категорию',
    'DIALOG_MESSAGE_CAT_NAME_EMPTY':    'Имя категории не может быть пустым',

    'DIALOG_TITLE_CONFIRM_CAT_DELETE':  'Подтвердите удаление категории',
    'DIALOG_MESSAGE_CONFIRM_CAT_DELETE':'Удалить категорию \'{0}\' и все её задачи?',

    'DIALOG_TITLE_SETTINGS':            'Настройки Simple To-Do',
    'SETTINGS_TAB_GENERAL':             'Общие',
    'SETTINGS_GENERAL':                 'Общие Настройки',
    'SETTINGS_TODO_STORAGE':            'Хранилище',
    'SETTINGS_DELETE_COMPLETED':        'Удалять завершенные',
    'SETTINGS_DELETE_COMPLETED_WARN':   'Внимание: все завершенные задачи будут удалены',
    'SETTINGS_CONFIRM_DELETE_COMPLETED':'Внимание: все завершенные задачи будут удалены. Нажмите \"Готово\" еще раз для подтверждения.',

    'SETTINGS_PROVIDER':                'Хранилище',
    'SETTINGS_FILE_PROVIDER_NAME':      'Текстовый Файл',
    'FILE_PROVIDER_FILE_NAME':          'Имя файла',
    'FILE_PROVIDER_CATEGORY_PREFIX':    'Префикс категории',
    'FILE_PROVIDER_COMPLETED_PREFIX':   'Префикс завершенных задач',
    'FILE_PROVIDER_INCOMPLETE_PREFIX':  'Префикс незавершенных задач',
    'FILE_PROVIDER_ERR_READ_FAILED':    'Не удалось прочитать файл',
    'FILE_PROVIDER_ERR_WRITE_FAILED':   'Не удалось записать файл',
    'FILE_PROVIDER_ERR_CAT_NOT_FOUND':  'Не удалось найти категорию с id: ',
    'FILE_PROVIDER_ERR_TODO_NOT_FOUND': 'Не удалось найти задачу с id: ',
    'FILE_PROVIDER_ERR_FILENAME_EMPTY': 'Имя файла не может быть пустым',
    'FILE_PROVIDER_ERR_CAT_MARKER_EMPTY': 'Маркер категории не может быть пустым',
    'FILE_PROVIDER_ERR_MARKER_EMPTY':   'Префикс задач не может быть пустым',
    'FILE_PROVIDER_ERR_MARKERS_SAME':   'Префиксы категорий и завершенных задач должны быть уникальны. Один префикс не может начинаться с другого (например, "abc" и "abcd")',

    //
    'PLACEHOLDER_TODO_ITEM':            'Описание задачи',
    'PLACEHOLDER_CATEGORY':             'Имя категории'
});
