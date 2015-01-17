/**
 * @fileOverview A representation of a single to-do item
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(function(require)
{
    'use strict';

    /**
     * Create new to-do item
     *
     * @constructor
     * @class TodoItem
     * @param {String}  [description] - To-do item textual content
     * @param {Boolean} [isCompleted] - Indication whether to-do item is completed or not
     */
    function TodoItem(description, isCompleted)
    {
        this._id = TodoItem.INVALID_ID;
        this._description = description || '';
        this._isCompleted = isCompleted || false;
    }

    /**
     * Get to-do item id
     *
     * @memberOf TodoItem
     * @returns {Number} To-do item identifier
     */
    TodoItem.prototype.getId = function ()
    {
        return this._id;
    };

    /**
     * Set to-do item id
     *
     * @memberOf TodoItem
     * @param {Number} id - To-do item identifier
     */
    TodoItem.prototype.setId = function (id)
    {
        this._id = id;
    };

    /**
     * Get to-do item description
     *
     * @memberOf TodoItem
     * @returns {String} To-do item textual content (description)
     */
    TodoItem.prototype.getDescription = function ()
    {
        return this._description;
    };

    /**
     * Set to-do item description
     *
     * @memberOf TodoItem
     * @param {String} description - To-do item textual content (description)
     */
    TodoItem.prototype.setDescription = function (description)
    {
        this._description = description;
    };

    /**
     * Check whether to-do item is completed
     *
     * @memberOf TodoItem
     * @returns {Boolean} True if to-do item is completed, false otherwise
     */
    TodoItem.prototype.isCompleted = function ()
    {
        return this._isCompleted;
    };

    /**
     * Set to-do item completion
     *
     * @memberOf TodoItem
     * @param {Boolean} isCompleted - Indication whether to-do item completed or not
     */
    TodoItem.prototype.setCompleted = function (isCompleted)
    {
        this._isCompleted = !!isCompleted;
    };

    /**
     * Special value reserved as invalid to-do item identifier value
     *
     * @name TodoItem#INVALID_ID
     * @type Number
     * @constant
     */
    TodoItem.INVALID_ID = 0;

    return TodoItem;
});
