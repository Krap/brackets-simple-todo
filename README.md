# Brackets Simple To-Do
An Adobe Brackets extension to create and manage simple to-do list.

Features:

- Flat and categorized to-do list support
- To-do list can be stored in human-readable text file with configurable format
- Alternatively, to-do list can be stored in [Trello](trello.com)

Extension demo:

![todo](https://cloud.githubusercontent.com/assets/693072/5894885/70a4e63c-a4dd-11e4-8357-37e614304860.gif)

Flat to-do list (without categories):

![todo](https://cloud.githubusercontent.com/assets/693072/5894887/70ab3f8c-a4dd-11e4-97d3-4544baefd2ca.png)

Mixed to-do list (two uncategorized tasks, and two collapsed categories):

![todo](https://cloud.githubusercontent.com/assets/693072/5894886/70a715e2-a4dd-11e4-9a64-0a23e0345347.png)

# Installation
The easiest way to install the extension is using Brackets Extension Manager:

1. Select **File > Extension Manager...** or click **Extension Manager** icon (![extmgr](https://cloud.githubusercontent.com/assets/693072/6320515/e696c488-baad-11e4-84e6-0febe8e6926b.png)) in the toolbar
2. Search for 'Simple To-Do'
3. Click the **Install** button

# Usage
Click the Simple To-Do icon (![todoicon](https://cloud.githubusercontent.com/assets/693072/6320564/26b94dc8-baaf-11e4-90a5-a3033f5634be.png)) to show/hide to-do panel.

Simple To-Do Panel:

![panel](https://cloud.githubusercontent.com/assets/693072/6320577/e8056bc4-baaf-11e4-8358-9147127900d9.png)

There are six icons in the panel header (left-to-right):

1. Refresh to-do list
2. Add new uncategorized task
3. Add new category
4. Toggle completed tasks visibility
5. Open Simple To-Do settings dialog
6. Close simple to-do panel

To edit any task or category simply click on its name. While task/category in edit mode, there are three buttons on the right side:

![editmode](https://cloud.githubusercontent.com/assets/693072/6320640/2b16dabe-bab1-11e4-9ce4-76dc1a4112e1.png)

These buttons are (left-to-right):

1. Accept changes and save task/category.
2. Decline changes. If task/category is being added this button means 'do not add'.
3. Delete task/category. This button is only available when editing existing task/category.

## General Settings
![gensettings](https://cloud.githubusercontent.com/assets/693072/6320664/0ae292a0-bab2-11e4-99d8-40abd7cc28d4.png)

### Show/Hide Panel Hotkey
You can select a key combination to show/hide Simple To-Do panel. The default value is <kbd>Ctrl</kbd>-<kbd>Shift</kbd>-<kbd>T</kbd>.

### To-Do Items Storage
Here you can select where to store your to-do list. Two options are available in the current release - Text File (default) and Trello. Only one storage can be selected, but you can switch between them any time.

### Delete Completed
On checking this option all of your existing completed tasks will be permanently deleted. While this option is checked, each task will be deleted as soon as it is marked as completed.

## Text File Storage
This is the default storage for your tasks. When it is selected, to-do list will be stored in text file inside the root folder of the active Brackets project. Simple To-Do will automatically switch to different file when active Brackets project is changed (i.e. to-do list files are 'per-project'). The default file name is `todo.txt` and the default file format looks like this:

```
- Some task
- Another task
+ This task is completed

# Some Category
- Task in 'Some Category'
```

### Settings
![textfilesettings](https://cloud.githubusercontent.com/assets/693072/6320777/2846c200-bab5-11e4-9a5d-c7ec20770290.png)

#### To-Do File Name
Name of the file where to-do list will be stored. Name is relative to active project root folder. Default name is `todo.txt`.

#### Category Prefix
String prefix which will be used to mark category name. Default value is `# `.

#### Completed Item Prefix
String prefix which will be used to mark completed tasks. Default value is `+ `.

#### Incomplete Item Prefix
String prefix which will be used to mark incomplete tasks. Default value is `- `.

_**Important:** backup your to-do file before changing any prefixes. Simple To-Do won't understand file with old prefixes and therefore will erase it._

## Trello Storage
You can connect Simple To-Do to your [Trello](trello.com) account and store your to-do list as a Trello list. Thus, you can access it from different computers or via Trello website.

_Note: Trello storage doesn't support uncategorized tasks, i.e. each task should be within some category. _

To use Trello storage you should provide your Trello API Key and Token (so Simple To-Do can authenticate to Trello) and select board and list where to store your to-do list.

### Settings
![trellosettings](https://cloud.githubusercontent.com/assets/693072/6321015/c33a0ba8-babc-11e4-9eb7-33215fd74e04.png)

#### Trello Authentication
To get your Trello API Key click on the link **Click Here To Get Trello API Key**. A web page should appear with your key:

![apikey](https://cloud.githubusercontent.com/assets/693072/6321040/acc47b64-babd-11e4-9cc3-d0103534cb66.png)

Copy your API Key to settings dialog and then click on the link **Click Here To Get Trello Token**. A web page should appear asking whether you allow Simple To-Do to use your account, and after clicking on **Allow** you should see your token. Please copy your token to settings dialog.

_Note: you can revoke permissions granted to Simple To-Do in your Trello account settngs, under the **Applications** section_

_**Important:** Your Trello API Key and Token are stored in Brackets settings as plain text, so anyone with access to your computer could see and use them._

#### Select Trello List
When both Trello API Key and Token are filled, you can click on **Refresh** link to load your Trello boards and lists.

![trelloboards](https://cloud.githubusercontent.com/assets/693072/6321097/b1a5886a-babf-11e4-8459-c0f442da97ae.png)

Here you can select existing Trello board and list, where you to-do items will be stored.

_Note: inside Trello list, each card represents a category, and checklist inside this card used to store to-do items. However, if any of your cards already have more than one checklist - Simple To-Do may not work correctly (only one checklist per card is supported)._


