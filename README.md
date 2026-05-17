# CSA_FinalProjectINST377
Final project CSA, Exercise app
# Gym Exercise Alternative Finder

## Decription
Gym Exercise Alternative finder is a website application that helps gym goers find exercises based on the muscle group they want to target. Users can select a muscle group from a dropdown menu and view exercises that target that muscle. The application displays the exercise name, category, equipment used, and a description of how to perform the exercise. 
Users are also able to save exercises to a favorites page using a supabase database. This makes it easy to keep track of useful exercises and return to them later. 
## Target Browsers
This website application is targted towards desktop browsers, mainly Chrome, Safari, Firedox, and Edge. 


# DEVELOPER MANUAL 
## Installation and running server
1. When installing this application for the first time, clone the repository and move into the open project folder: 

``` git clone <https://github.com/csolanoa/CSA_FinalProjectINST377.git>``` 
Install all depencies: 
```npm install ```
2. In Supabase, create a table named 'favorites', add these additonal collumns: 
exercise_id as integer
exercise_name as text
muscle_group as text
equipment as text
cateogry as text
image_url as text
3. Now run!
``` npm start``` 
You can open the application website at: http://localhost:3000

#TESTS
## No tests

## API's
### GET / 
Returns the home page
### GET/about
Returns the about page
### GET/ favorites page
Returns the favorites page
### GET/muscles
Gets the muscle group from the wger API. This is used to fill the muscle dropdown menu 
### GET /exercises
Gets exercise information from the wger API. This includes exercise names, descriptions, categories, equipment, and muscle groups.

### GET /favorites
Gets all saved favorite exercises from the Supabase favorites table.

### POST /favorite
Saves a selected exercise to the Supabase favorites table.
## Tests
No automated tests were written for this project.

## Known Bugs and Issues
Some exercise descriptions may contain extra HTML formatting because the descriptions come directly from the wger API. Some exercises may also have missing descriptions or missing equipment information. Duplicate favorites can also currently be saved. Originally, some of the exercises and matcing descriptions were in different languages besides english. This issue was mainly fixed however some descriptions still appear in another language. 

## Future Development
In the future, I would like to add a delete button for saved favorites, prevent duplicate favorites, add more filters for equipment and category.

## Deployment
This project is meant to be deployed using Vercel. The main server file is `index.js`, and the project uses `package.json` to install and run the required dependencies.