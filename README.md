# spider_task_3
The task is to create a social website for Anju's girlfriend through which she can post her articles and share it with her friends.
## Getting Started
1. Download or clone this repo to your local system
2. Install nodejs from Nodejs official website
3. Open the terminal in the folder where you have cloned the project.
4. Now run the following commands
```
   npm cache clean
   npm install
```
5. Now, you should be able to see the node modules folder with all dependencies installed.
6. Install the mongodb community edition from here [Mongodb official documentation](https://docs.mongodb.com/manual/administration/install-community/)
7. Ensure that mongo service has started and is listening on port 27017
8. Now , run the following command back in the terminal at the project folder node app.js
9. Navigate to http://localhost:8000/login and you should be able to view the login page
## Sub Tasks
All the ticked features are added.
- [x] **Basic Task:**
    - [x] Anju’s girlfriend wants her account to be secure so add an account sign-up
    and Login page to make her stay secure.
    - [x] Anju’s girlfriend wants to add content so he decides to add a create an article
    page for creating articles
        - [x] Heading
        - [x] Bold, italic wherever necessary
        - [x] External links wherever necessary
    ( Anju thinks he could format the text as HTML and store it in the database )
    - [x] Anju’s girlfriend wants to look at all the articles so he decides to have a feed
    page for all the articles to appear.
    - [x] A profile page for the users displaying the details of the user along with the
    number of articles he has posted so far and also details such as the number
    of followers and following.
    - [x] Search option to search any username and view their articles on that page
    And follow them.

- [x] **Hacker mode**
    - [x] In the profile page, have settings for changing username and password
    - [x] Add additional features to the editor which can provide users to add images,
    different font styles and size to the text, multi-colour text and centralizing the
    specific content in the article.
    - [x] A dashboard page for viewing all the articles the person has created with an
    edit and delete option
    - [x] Create a dashboard page containing
        - [x] notification bar ( to indicate Anju’s new followers with seen and not
    seen )
        - [x] To traverse between pages
    - [x] Sometimes Anju’s girlfriend forget her friend’s name so help her to identify or
    complete her friend’s name by having a synchronous search in the search
    option for usernames (Anju thinks of loading the result in a list below the
    search box)