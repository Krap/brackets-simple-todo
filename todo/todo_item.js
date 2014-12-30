/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(function(require)
{
    'use strict';

    function TodoItem(id, description, isCompleted)
    {
        this._id = id || TodoItem.INVALID_ID;
        this._description = description || '';
        this._isCompleted = isCompleted || false;
    }

    TodoItem.prototype.getId = function ()
    {
        return this._id;
    };

    TodoItem.prototype.setId = function (id)
    {
        this._id = id;
    };

    TodoItem.prototype.getDescription = function ()
    {
        return this._description;
    };

    TodoItem.prototype.setDescription = function (description)
    {
        this._description = description;
    };

    TodoItem.prototype.isCompleted = function ()
    {
        return this._isCompleted;
    };

    TodoItem.prototype.setCompleted = function (isCompleted)
    {
        this._isCompleted = isCompleted;
    };

    TodoItem.prototype.edit = function (other)
    {
        if (other.getDescription() && other.getDescription() !== this.getDescription())
        {
            this.setDescription(other.getDescription());
        }

        if (other.isCompleted() !== null && other.isCompleted() !== this.isCompleted())
        {
            this.setCompleted(other.isCompleted());
        }
    };
        
    TodoItem.INVALID_ID = 0;

    return TodoItem;
});
