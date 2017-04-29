app.controller('FaqCtrl', ['$scope', function($scope) {
    $scope.getFAQs = function() {
        return faqs;
    };
    $scope.getAnswer = function(item) {
        return item.answer
    };
    $scope.getQuestion = function(item) {
        return item.question;
    };
    $scope.getCollapsed = function(item) {
        return item.collapsed;
    };
    $scope.setCollapsed = function(item) {
		if (!item.collapsed) {
            item["collapsed"] = true;
        } else {
            item.collapsed = !item.collapsed;
        }
        return item.collapsed;
    };
    var faqs = [{
        question: "How do I use Flyover Country™ (FC)?",
        answer: "First choose your trip type: air (plane) vs. ground (car/foot). Do this by opening the left side menu and selecting one of these options under Trip mode. (See “What’s the difference between plane and car/foot trip modes?” below for more information.) Return to the map. Draw a path by tapping on two or more points (start and end points, turns on your road, etc.) When you’ve selected your last point, tap “Load path” in the upper right. The app will download and display all of the information available within a buffer strip around your path. You can now explore the points of interest (POI) and bedrock map units by tapping on them.<br><br>Now save all this information for offline! Note that the button in the upper right now says “Save for offline.” Tap it and you’ll be prompted to make some selections about which POI categories and basemaps to save, and to name the path. Saving will take a few minutes, or longer for large paths. Your saved paths are available under Saved in the left side menu and you can choose to load or delete them."
    }, {
        question: "Does my phone’s GPS work in airplane mode? Is it legal?",
        answer: "Your phone is only receiving a GPS signal, not transmitting anything, and so it’s safe and legal. Enabling airplane mode does not turn off your GPS (unless you’re running iOS 8.2 or earlier). Some users with older phones have reported problems getting a GPS fix on their positions while flying; this may be due to the plane’s speed relative to the phone’s ability to update.  Newer phones have no such reported issues.<br><br>GPS works best from the window seat.  If you lose your GPS position fix, put your phone close to window for a few seconds and you should pick up enough satellites to reestablish it."
    }, {
        question: "Why is my position not showing up on screen?",
        answer: "Make sure that the GPS option in the side menu is toggled to the on position and that you have granted FC permission to use your location data (this is prompted when you first run the app but also located in your phone’s settings menu)."
    }, {
        question: "I’ve tried everything and still can’t get a GPS signal.",
        answer: "FC relies on the quality of the GPS receiver in your device. Some, especially older, devices may not have a sensitive enough GPS chip to get a consistent satellite signal while flying at high speeds while surrounded by metal high in the sky. However, most phones we’ve tested have successfully acquired a signal, so keep trying!"
    }, {
        question: "I keep getting errors while saving.",
        answer: "Try breaking your trip into several smaller legs and saving them individually."
    }, {
        question: "Can FC fix my position relative to the map?",
        answer: "Yes! Once FC has a lock on your position, location options will appear in the lower right of the map screen. Navigation mode (arrow symbol) centers your position and displays it as a blue arrowhead. The map will be oriented with your direction of travel in the up position (so that points of interest to your right in real life will be to the right of the symbol on your screen). In this mode you can zoom in and out but can’t move the map around. To exit navigation mode, click the arrowhead in the lower right again. Your position will turn back into a dot, up will be north again, and you’ll be able to move the map around."
    }, {
        question: "What’s the difference between plane and car/foot trip modes?",
        answer: "In the left side menu, you can choose between these options. There are two differences: the size of the buffer strip, and the level of detail of the bedrock geology map. In plane mode, the buffer strip is about 125 miles on either side of your path (from 30,000 feet in the air you can see about 200 miles to the horizon), and we use the Geological Map of North America (GMNA). In car/foot mode, the buffer strip is about 12 miles on either side of your path, and we use the higher-resolution Geologic Map of the United States (GMUS), which maps units in more detail and includes more text about each unit. We can’t use GMUS on plane paths because they would just be too big."
    }, {
        question: "Can I make a path with more than two points?",
        answer: "Yes! You can click as many points as you want before you hit “Load path.” Go ahead and follow roads, geologic contacts, state lines, and shorelines; draw your path in a circle or a heart shape and fill it in if you like. Also see the FAQ about the differences between plane vs. car/foot trip modes."
    }, {
        question: "Why is the map gray?",
        answer: "If you’re offline, make sure the basemap is set to one of the tile types that you have saved and that you are viewing an area within the saved path you have loaded. Try zooming in or out to trigger tile requests."
    }, {
        question: "Why is the base map fuzzy when I zoom in?",
        answer: "We only save basemap tiles down to a certain zoom level. Each time you zoom in to a finer level, the number of tiles for a particular path quadruples, so download sizes increase rapidly."
    }, {
        question: "Can I save my own points?",
        answer: "Yes! As of release 0.1.4. Hold down on the point you want to save, and a square bubble will pop up. Tap the bubble to add a name, notes, etc. The points will be saved on your device."
    }, {
        question: "Why don't I see anything when I open or return to the app?",
        answer: "You may be at a zoom level for which you don’t have map tiles saved or displayed, or you may be viewing an area off of the map strip you have saved. Zoom in or out, or move the map around."
    }, {
        question: "How do I change basemaps?",
        answer: "Simple, street, satellite, and terrain maps are available. To choose, click on the map symbol in the upper right of the map screen. You can choose to save multiple basemaps when you save a path."
    }, {
        question: "Can I view my speed and altitude?",
        answer: "Yes! Click on the speedometer symbol in a blue circle in the lower right of the map screen to toggle this information panel on and off."
    }, {
        question: "What about fails?",
        answer: "There are a number of reasons a service or save might fail. FC relies on many separate databases and systems to work properly, and sometimes these services are down or undergoing maintenance. Double check your connection to the internet while loading data to save offline, and if the problem persists, contact us and report the bug!"
    }, {
        question: "Does FC work outside North America?",
        answer: "Yes! FC works worldwide."
    }, {
        question: "Why \"Flyover Country™\"?",
        answer: "It’s a bit tongue-in-cheek. It describes one of the purposes of the app, of course, but “Flyover Country” is also a usually-derogatory term for the part of the United States between the coasts - the part that the chic people never see (or would want to see) closer than from the airplane seat. We’re from Minnesota, and we love it (and the rest of rich, beautiful, interesting midcontinent), and so we’re co-opting the term."
    }, {
        question: "Can I put my own data in it?",
        answer: "Yes, we host field trip guides and other georeferenced “custom content” whose authors agree to a Creative Commons Attribution 4.0 International license.  Please contact Amy or Shane (amyrbo@umn.edu, Loeff081@d.umn.edu) to set up an account.<br><br>	Where appropriate, though, we prefer that you do the following: (1) Datasets: The best approach is to submit them to the appropriate database so that FC can access them - and everyone else can too! We’re big believers in public databases, because databases and the people who run them are what makes FC possible. (2) Narratives or articles: If appropriate, we encourage you to add them to Wikipedia! As with public databases above, if you add them to Wikipedia, they will be curated, formatted in a standard way, and best of all, available to everyone. ",
    }, {
        question: "What about data besides geology?",
        answer: "The possibilities are endless – history tours, architectural tours, points of interest along historic highways – for actual or virtual field trips."
    }, {
        question: "I have an idea for an education/outreach project that uses Flyover Country™.",
        answer: "Great! Let’s talk! We have already worked with scientists to develop FC outreach modules for their scientific projects, and part of our mandate is to do more of it. You can easily plug into FC as part of the Broader Impacts activities for your NSF proposal. Email Amy at amyrbo@umn.edu to discuss your ideas at any stage of development."
    }, {
        question: "Who pays for FC?",
        answer: "The National Science Foundation (NSF) has awarded three grants (NSF numbers 1541800, 1550913, 1643277) to Amy Myrbo, Shane Loeffler, and Reed McEwan at the University of Minnesota, and colleagues at other institutions, to build the app for geoscience outreach, research, citizen science, and undergraduate education. Amy is supported by two additional NSF grants that fund her time to work on the app."
    }, {
        question: "Why did you choose these databases to display?",
        answer: "As is true in many situations, we chose things that are spiffy, are run by cool people we know, and that were ready to go without too much effort. The principal investigators of Neotoma, Paleobiology Database, and Macrostrat were all early supporters of the FC concept, have great web services, and they’re only a few hours away in Madison. FC is a product of LacCore, so including our database of sites was a no-brainer. And Wikipedia is just the best.<br><br>Our newest additions, field trip guides, come courtesy of the Geological Society of America, which has made a substantial amount of content freely available to FC and its user base."
    }, {
        question: "How do I report a bug?",
        answer: "We hate bugs, but we love bug reports. We’re a small team, so we can only test FC on a limited number of devices and in a small sampling of situations. If you find something isn’t working right or if you’ve thought of a way to make something better, please don’t hesitate to email Shane at Loeff081@d.umn.edu"
    }];
}]);