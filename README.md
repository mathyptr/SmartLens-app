# ReInHerit SmartLens app

This application is part of the **ReInHerit Toolkit**.

![ReInHerit SmartLens logo](images/info/SmartLens-logo.jpg "ReInHerit SmartLens logo")

## Recognize details in artworks
This app allows the recognition of artworks and their details in images captured by the webcam of a smartphone in real time, showing the user the multimedia information related to them.
Details recognition is implemented using computer vision, applying three different Object Detection using the SSD/MobileNetV2 network on which fine tuning has been performed for the recognition of the "objects" (details) of the artworks of the dataset.

## Installation
The application is implemented using HTML, CSS and JavaScript. It is necessary to have a web server to run it.
Artworks and details info is stored in a MySQL database.
Update the `./server/config.php` file to connect to the database. 

## Application 
The application was created using PHP, HTML, Javascript and CSS style sheets and when it is started a carousel is shown and allows to view some example of artworks recognizable from the network. 

By scrolling with the mouse over these, it is suggested to try the interactive guide and this is possible by clicking on one of the artworks. By carrying out this operation, the webcam of the user's device will be opened.

After having recognized the detail, it will be possible to consult all the information relating to the artwork to which it belongs and to the detected detail.


### Reserved Area 
In the home page of the app there is an icon in the top right that allows access to the reserved area for which user authentication is required. There is a login that requires the appropriate insertion of username and password.

Once the authentication phase has been completed, the employee has access to the reserved area where he can do all CRUD operations.
Then, by clicking on the desired artwork, it is possible to view and modify all its information.

In order to make all the information available in other languages, the application was internationalized. 

By clicking on the figure of the artworks it is possible to access to the section relating to its the details, where they can be modified.

The employee can also train the network, but he must select first the details of interest. Then he can confirm and start the training.