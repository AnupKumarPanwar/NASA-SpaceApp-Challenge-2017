app.controller('CloudsContentCtrl', function($scope, $stateParams, $rootScope, DataService, IonicUtilService, DB, RequestService, $state, $ionicScrollDelegate) {
    var currentID = parseInt($stateParams.id);
    $scope.setCollapsed = function(item) {
        if (!item.collapsed) {
            item["collapsed"] = true;
        } else {
            item.collapsed = !item.collapsed;
        }
        $ionicScrollDelegate.resize();
        return item.collapsed;
    };
    $scope.getCollapsed = function(item) {
        return item.collapsed;
    };
    $scope.getCurrentTitle = function() {
        switch (currentID) {
            case 1:
                return "";
                break;
            case 2:
                return "";
                break;
            case 3:
                return "";
                break;
        }
    };
    $scope.getCurrentContent = function() {
        var array = [];
        for (var i = 0; i < content.length; i++) {
            var item = content[i];
            if (currentID === item.id) {
                array.push(item);
            }
        }
        return array;
    };
    var formatContentArray = function(array) {
        for (var i = 0; i < array.length; i++) {
            var imageRows = [];
            for (var j = 0; j < array[i].imgs.length; j++) {
                var rowIndex = Math.floor(j / 2);
                if (!imageRows[rowIndex]) {
                    imageRows[rowIndex] = [];
                }
                imageRows[rowIndex].push({
                    img: array[i].imgs[j],
                    caption: array[i].caption[j],
                    credit: array[i].imgsCredit[j]
                });
            }
            array[i]["imageRows"] = imageRows;
        }
    };
    $scope.hasLink = function(link) {
        if (link) return true;
        else return false;
    };
    $scope.getImageClass = function(row) {
        if (row.length >= 2) return "col-50";
        else return "col";
    };
    $scope.toUrl = function(title) {
        if (!title) {
            return;
        } else {
            DataService.reset('article.wikiarticle');
            IonicUtilService.spinner.start();
            DB.load.prewikiarticle(title).then(function(content) {
                if (!content) {
                    RequestService.wikiarticle(title).then(function(retobj) {
                        if (retobj.success) {
                            DataService.set('article.wikiarticle', retobj.value);
                        } else {
                            DataService.set('article.wikiarticle', undefined);
                        }
                        IonicUtilService.spinner.stop();
                        $state.go("app.wiki");
                    });
                } else {
                    IonicUtilService.spinner.stop();
                    DataService.set('article.wikiarticle', content);
                    $state.go("app.wiki");
                }
            });
        }
    };
    var _init = function() {
        formatContentArray(content);
    }
    var content = [{
        "id": 1,
        "title": "Welcome to the sky!",
        "primaryText": "This app is primarily about things on or in the ground, but what if you’re flying and it’s cloudy? What if you’re on a roadtrip but are 87 miles from ANYTHING WORTH SEEING?",
        "secondaryText": "You might be resenting those fluffy little jerks out your window for coming between you and your geoscientific appetite, or loathing them for being the only thing between you and the endless horizon you have convinced yourself you are enjoying, or, you may be marveling at them for perfectly tracing the exquisite interactions between moisture and lift.\nWhatever your attitude toward them, every cloud has a story for you. And chances are, you are either bored enough or curious enough right now that hearing those stories may be worth your time. So stick around here and learn about clouds, at least until the urge to read Sky Shopper becomes too great, or until you feel like you can go back to hearing your car-mates banter without wanting to eat your own hands.\n\nIn any case, welcome to the sometimes-cloudy sky!",
        "caption": ["Patchwork stratocumulus clouds, from above"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/wtts1.jpg"],
        "imgsCredit": ["Shane Loeffler"]
    }, {
        "id": 1,
        "title": "How much do you like clouds?",
        "primaryText": "This cloud-centric diversion is intended to be a very basic and hopefully practical introduction to the art and science of cloud interpretation. It is nowhere near exhaustive, and in truth, really only scratches the surface of cloud exploration--which should be enough for most users.",
        "secondaryText": "If you are enthusiastic and want to get really good at clouds, you need plenty of practice looking at them. Turn your observations into questions and hypotheses, and then then seek additional information.\n\nReally enthusiastic users who become obsessed, fortunately,  will be able to indulge themselves with the World Meteorological Organization’s handy little, 367-page, two-volume, International Cloud Atlas, the first volume of which contains over 30,000 words, a comprehensive guide to cloud symbology, intricate hand-drawings, and exactly zero photographs. (The second volume is the photographic follow-up, but requires familiarity with the descriptions and symbols in the first volume for full comprehension!)",
        "caption": ["ice wisps fall out from parent cloud fragments"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Cirrus.jpg"],
        "imgsCredit": ["John Hain"]
    }, {
        "id": 1,
        "title": "Now, about those cloud stories",
        "primaryText": "Sure, every cloud has a story, but some stories are more interesting than others.",
        "secondaryText": "And which part of that story are you seeing? Is the cloud growing? Shrinking? Holding steady? Does it appear to be changing forms?\n\nIf you are new to cloud-gazing, these questions may seem impossible to answer. And in a way, they are, because of course,every cloud dies, only to have its water recycled through the earth-ocean-atmosphere system, eventually resulting in another cloud, at another place and another time. So in that way, the story never ends. But let’s not get too existential here with these clouds and their stories. The ones that we are seeing right now have plenty to tell us about what is happening right where they are, right at this time.",
        "caption": ["Cumulus cloud variety pack, Andrew Lake, MN"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Signalclouds.jpg"],
        "imgsCredit": ["Kenny Blumenfeld"]
    }, {
        "id": 1,
        "title": "What is a cloud?",
        "primaryText": "If you like it straight and kind of boring, then a cloud is a visible mass of water droplets and/or ice crystals, suspended in the air.",
        "secondaryText": "In more convoluted terms, a cloud is the result of a process involving water vapor (the gas form of water) and air motions of some sort. The amount of water vapor and quality of those motions determine the type, size, and life-trajectory of every cloud you see.\n\nWater vapor is always present, but is most abundant over and near large bodies of water (especially oceans), or where winds drive air inland from those moisture sources with little interruption. Not surprisingly, areas far away or cut off from major water bodies tend to be very dry and are often cloudless.\n\nMotions in the atmosphere result from the uneven heating of the earth by the sun, the differences in heat storage capacity between land and water, seasonal and daily cycles of sunlight, pressure differences resulting from these heat imbalances, changes in the effect of gravity on air at different heights above the ground, the rotation of the earth, air passing over varied topography, and plenty of other equally-exciting processes.\n\nBut virtually every cloud you see is there because air motions have acted upon some quantity of water vapor.",
        "caption": ["Extreme cold, moisture, and motions combined to make this delicate creature"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/wiac1.jpg"],
        "imgsCredit": ["Kenny Blumenfeld"]
    }, {
        "id": 1,
        "title": "What every cloud tells you",
        "primaryText": "Every cloud tells you there was too much water vapor, given the temperature (and pressure) of the air that the cloud now occupies.",
        "secondaryText": "For the cloud to form, the relative humidity had to increase to (or even slightly exceed) 100%, and condensation had to begin.\n\nFor a given mass of air, relative humidity increases if a) the amount of water vapor increases, b) the temperature decreases, or c) those two things happen simultaneously. It turns out, though, that cooling a mass of air is far more effective than pumping it full of water vapor, so many clouds form simply because the air cools enough to begin the process of condensation.",
        "caption": ["Even this small cloud resulted from an excess of water vapor, given the temperature"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/airplane_cloud.jpg"],
        "imgsCredit": ["Nickbar"]
    }, {
        "id": 1,
        "title": "Cooling the air to make clouds",
        "primaryText": "The air cools in to the point of condensation by radiation, advection, and through lifting or rising motions.",
        "secondaryText": "\"Radiational cooling,\" is the cooling that occurs on most nights as the heat built up during the day leaves the earth. The layer of air closest to the ground cools the fastest, sometimes reaching condensation and resulting in fog--which is a kind of cloud.\n\nNext we have \"advection,\" which is fancy-talk for \"the wind bringing in a different air mass.\" When the air blows from colder regions, colder air moves in. Large banks of clouds and even precipitation often form behind winter weather systems, as the cold air arrives faster than the moisture departs. Advection is not, however, a sure-fire process for cloud-building, because cold winds are also often dry winds, so cool advection is often associated with dry advection.\n\nLastly, we have lifting or rising motions. When air rises, the pressure on it decreases, so it expands and cools automatically (whereas sinking automatically compresses air and heats it). Whether a pocket of air near the ground gets hot and begins rising, or the wind blows it up a mountainside, cooling of it results every time. Although condensation from all three cooling processes can produce clouds, the vast majority of the world’s precipitation results from lifting processes, meaning that lift is a hidden driver of life on our planet.",
        "caption": ["Fog covers the Slovenian valleys, where overnight radiational cooling led to condensation", "These clouds formed behind a cold front, in a still-moist environment", "Clouds like these are produced by rising air that cools and condenses; you actually see it happening if you watch closely"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/ctatmc1.jpg", "img/Cloud/thumbnail/ctatmc2.jpg", "img/Cloud/thumbnail/ctatmc3.jpg"],
        "imgsCredit": ["Helena", "B. Rockwell", "Kenny Blumenfeld"]
    }, {
        "id": 1,
        "title": "How to see clouds",
        "primaryText": "So it turns out the animal shapes we were told to identify in the sky don’t really tell us all that much about the weather. Luckily, a less imaginative kind of cloud-shape identification can tell us an awful lot!",
        "secondaryText": "Clouds tend to assume one of three common forms: wispy, sheet-like, or heaped, although there are some combinations too. These basic forms tell us how the clouds were built and what that means about current and even future weather.\n\nOf course, it’s not proper to go around talking about heapy and wispy clouds, because eventually, you will just say \"great big heapy cloud,\" which means that \"sheep-looking cloud\" isn’t far behind, and then we’re back where we started.\n\nInstead, we have a formalized system for identifying and describing clouds thanks to Luke Howard, who was one of those early 19th century natural-science wonderers. His cloud-naming scheme mimics the way we describe living things, and has survived with just a few modifications and embellishments since its conception.",
        "caption": ["Sheet-like clouds with little heaps and wispy clouds all in one view!"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/htsc1.jpg"],
        "imgsCredit": ["Shane Loeffler"]
    }, {
        "id": 1,
        "title": "How to talk about clouds",
        "primaryText": "Clouds are categorized into a \"Linnaean,\" genus-species system (after Carl Linnaeus, himself an 18th century natural-science wonderer), using Latin, which always sounds more intelligent than, for example, \"heapy.\"",
        "secondaryText": "Like other classification systems, this one is universally accepted, and also somewhat arbitrary. Clouds are categorized according to shape and form, into ten basic genera or groups (\"genera,\" you may recall, is plural for \"genus\").\n\nEach genus tells us something about the cloud’s shape, and its name always includes a derivative of at least one of the following major cloud types: Cirrus, which is the wispy cloud; Stratus, which is the sheet-like or layered cloud; or Cumulus, which is the heaped or puffy cloud. Each of those basic types is also its own genus, accounting for three of the ten.\n\nThe three major cloud types are generally assumed to occupy certain parts of the sky:\nCirrus are high clouds, found at altitudes of at least 3 mi (~5 km), and often 2-3 times that height\nStratus are low clouds, usually forming between the ground and 1.2 mi (~ 2km)\nCumulus clouds are also low and form in the upper half or so of the layer common to stratus clouds\n\nHowever, some cumulus and stratus clouds can form higher up, between 1.2 and 3 mi (~2-5 km). Thus, two cloud genera are named for these \"middle\" clouds with the appropriate Latin suffix: Altostratus and Altocumulus.\n\n(If you were wondering, cirrus clouds have been banned for life from the middle altitudes, and hence, there will never be Altocirrus.)\n\nThree additional cloud genera combine two of the basic forms, giving us Cirrocumulus (wispy and heapy), Cirrostratus (wispy but sheet-like), and Stratocumulus (sheet-like and heapy).\n\nThe final two genera are for clouds that produce precipitation, which means we get to introduce the funny-sounding root, \"nimbus.\" We apply it once again to stratus and cumulus, giving us Nimbostratus and Cumulonimbus, respectively.\n\n(Even though precipitation can fall from cirrus clouds, sanctions against them continue, so no Nimbocirrus or Cirronimbus cloud exists.)",
        "caption": [null],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Cloudtypes.png"],
        "imgsCredit": ["Valentin de Bruyn, used under Creative Commons 3.0, retrieved from https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Cloud_types_en.svg/2000px-Cloud_types_en.svg.png"]
    }, {
        "id": 1,
        "title": "How to talk about clouds even more",
        "primaryText": "A given cloud genus may have several \"species,\" which in this case means \"varieties,\" rather than \"a common group of living organisms,\" as we might assume. We often think of species as living things of some sort, but as the root of \"specific,\" the term really just refers to a common manifestation or instance of a given genus, in this case a cloud.",
        "secondaryText": "As an example, cumulus clouds can be small, medium or large, and so each of those sizes is its own species (humilis, mediocris, and congestus)--each a specific instance of the genus Cumulus.\n\nSo, there may be just 10 basic cloud types, but there are 26 different species. With the exception of altostratus and nimbostratus, every cloud type has at least two distinct species.\n\nWhen we add in the fourteen defined \"varieties\" of clouds, many of which can be applied to multiple cloud species, then consider the occasional \"supplementary features and accessory clouds,\" and lastly, the all-important \"mother-cloud\" classification (which tells us that the cloud we are seeing descended or mutated from a different cloud type, yielding simple terms like Stratocumulus cumulogenitus), we end up with limitless options for describing clouds.\n\nFortunately, all that a scientifically-curious person who is not going to become a meteorologist or a professional cloud-type explainer needs to know, initially at least, are the ten basic genera. The two exceptions are for cumulus and altocumulus clouds, both of which have species that can be used to diagnose and forecast very different conditions.",
        "caption": ["Altocumulus lenticularis, a hypnotic species common to mountainous areas and otherwise not covered in the app"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Lenticular_hawaii.gif"],
        "imgsCredit": ["Public domain"]
    }, {
        "id": 2,
        "title": "Cirrus",
        "primaryText": "Cirrus clouds are made entirely of ice crystals, can be found high in the sky, and appear wispy, thin, and translucent--or some combination thereof. They may look like feathers or \"swooshes,\" because the tiny ice crystals that make them up get blasted into fast-looking shapes by very strong high-altitude winds.",
        "secondaryText": "We find cirrus at altitudes above 3 miles (5 km), and especially above 5 miles (8 km), where the air is sufficiently cold that any condensation will immediately form ice crystals (this is actually not condensation but \"deposition,\" which is when a gas becomes a solid without having been in the liquid phase first). In such cold conditions, it doesn't take much water vapor bring a volume air to the point of condensation (again, deposition), so the overall amount of water in cirrus clouds is quite low. As a result, they do not precipitate, although technically, the \"anvil\" portion of a cumulonimbus (thunderstorm cloud) is a mass of cirriform clouds that can \"rain out\" ice crystals as the parent cloud dissipates.\n\nYou generally see cirrus in fair weather, under otherwise clear skies. Their association with strong winds aloft may signal that the jet stream is nearly overhead, which could mean a turn toward inclement weather in 1-3 days. Cirrus are often so high, that even when you are flying, you have to look up to see them!",
        "caption": ["Cirrus formations over Bavaria", "Cirrus clouds above flight level"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Cirrus_Bavaria.jpg", "img/Cloud/thumbnail/c2.jpg"],
        "imgsCredit": ["Stefan Schweihofer", "Shane Loeffler"]
    }, {
        "id": 2,
        "title": "Stratus",
        "primaryText": "Appearing as continuous sheets of monochromatic gray, Stratus clouds assure us that we should go back to bed.",
        "secondaryText": "Stratus clouds usually cover most or all of the sky, and tell us to expect more of the same until an air mass with lower relative humidity arrives. They form when an entire layer of air cools to the point of condensation, and almost always in the absence of instability. Condensation without instability limits upward motions and ensures that little more than a bank of mist will result. Indeed, stratus clouds are just sheets of water droplets. They are low clouds, and can even hug the ground as fog.\n\nSome stratus clouds form as air is blown upslope and cools; others may form as cold air spreads in behind a retreating weather system, exploiting the leftover moisture; yet others form as cold air settles into low-lying areas. The mechanisms are nearly endless, and as a result, stratus clouds can be found in a wide variety of situations: over land, over the oceans and large lakes, in valleys, near the peaks of mountains, ahead of thermal boundaries, behind thermal boundaries--wherever air cools towards its dew point.\n\nLook for low, continuous sheets, sometimes with rows of lower and darker clouds among them. A large deck may have embedded areas of nimbostratus (precipitating stratus) clouds. Stratus clouds tend to thicken as weather systems approach and thin out as they retreat. In conditions leading to stratus fog, daytime sunlight may begin to reach the earth, warming it, and causing the relative humidity to fall. As this happens, condensed water begins to evaporate and the fog will dissipate from the bottom up, giving the impression that it has \"burned up\" or \"lifted.\"\n\nAs you fly above them, stratus clouds look remarkably continuous and blanket-like. Even though you will almost certainly see bumps scattered across the blanket, they whole mass of clouds should appear somewhat smooth-toped. Better-formed heaps or cauliflower shapes imply the cloud sheet has cumulus elements and is likely stratocumulus, rather than just stratus.",
        "caption": ["A seemingly endless blanket of stratus", "A perfect sheet of stratus, showing no texture or definition", "Fog north of Hanmer Springs, New Zealand (beneath an altostratus deck)"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/stratus1.jpg", "img/Cloud/thumbnail/stratus2.jpg", "img/Cloud/thumbnail/stratus3.jpg"],
        "imgsCredit": ["Shane Loeffler", "Kenny Blumenfeld", "Unknown public domain"]
    }, {
        "id": 2,
        "title": "Cumulus clouds: telling you whatever you want to hear",
        "primaryText": "\"Cumuliform\" clouds (those dominated by the heapy attributes of Cumulus) can mean many different things for the current and developing weather conditions. On one hand, they can foretell perfectly benign weather, and on the other they can warn of violent thunderstorms. It’s easy to find them, but it’s a bit more difficult to understand what they are telling you (versus what you want them to be telling you).",
        "secondaryText": "All cumulus-based clouds provide us with the blueprints to their own development. Those heaps and puffs we see are produced by upwards air currents that cool the air to the point of condensation. In that way, each cumulus cloud traces out the upward air currents and processes that produced it.\n\nThe size of a cumulus cloud is determined by the intensity and velocity of its upwards motions, which are determined by the instability of the air, which itself is determined by the vertical profile of the atmosphere's temperature and humidity at that location and time. Cumulus clouds in highly unstable conditions have vigorous upward motions and become powerful thunderstorms, whereas those with far less instability have less total lift and become harmless little puffs.\n\nThe secret to the \"success\" of a cumulus cloud lies in its ability to ignite a convective chain reaction by releasing heat through condensation. When a pocket of air rises, it cools. If it rises and cools enough, it will reach condensation, which releases stored heat and makes it more likely the rising air will remain warmer than the air around it and will continue rising, cooling, and condensing.\n\nThe likelihood and intensity of the air’s ability to rise, cool and condense is governed by the amount of moisture in the pocket of air, and how quickly the air around it cools with height. A deeply moist air mass that cools rapidly with height will encourage explosive upward motions, resulting in heavy cumulus or even cumulonimbus development, because the rising air easily remains warmer than the air around it, especially after heat is released during condensation. A comparatively dry air mass that cools slowly with height will lead to weaker upward motions, if any at all.\n\nThe cumulus clouds we see merely diagnose the health of the convective processes (the upwards air motions that transfer heat vertically). The slight puffs that dot the skies on pleasant days tell us the convection is weak and shallow. The towering, cauliflower-textured clouds we see during late afternoon on muggy days tell us the convection is strong and deep.\n\nCumuliform clouds are common, because ultimately, convection is common too.\n\nPlease see Humilis, Mediocris, and Congestus for even more information on how to master all that is Cumulus.",
        "caption": ["Cumuliform clouds over eastern Colorado"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/cctywywth1.jpg"],
        "imgsCredit": ["Shane Loeffler"]
    }, {
        "id": 2,
        "title": "Cumulus humilis",
        "primaryText": "\"Humilis.\" That's the root of \"humiliate,\" which is fitting, because these diminutive puffballs live in a constant state of embarrassment. They are small, they are benign, and the vast majority of the time, they will be gone by evening. You can’t imagine that any cloud droplet would want that for itself.",
        "secondaryText": "These are the typical \"fair-weather\" clouds. You will usually find them during daylight hours, most commonly during the warm season, when there is enough heat from the lower atmosphere to lift and cool a pocket of rising air to the point of condensation, creating a little clump that traces out the process. But that’s about all you’re going to see most of the time; there isn’t enough instability for deeper convection.\n\nLook for small, sometimes \"shredded\" puffs that are wider than they are tall (which isn’t saying much). They often lack definition and have fuzzy edges, though you may see hints of the bubbly, cauliflower-like appearance common to other cumulus species. Even if they seem to dominate the afternoon sky, most of the time they will fade with evening, when the heat from below that fuels them disappears.\n\nOne caution: even massive, intense thunderstorms begin as humilis look-alikes. So keep an eye on them for 5-10 minutes to make sure they aren't actually in the early stages of becoming congestus or cumulonimbus clouds. Most of the time they are not, and if that’s the case, carry on.",
        "caption": ["Cumulus humilis over a Minnesota lake on a fine day", "Small cumulus (humilis) dot the West Virginia sky"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/ch1.jpg", "img/Cloud/thumbnail/ch2.jpg"],
        "imgsCredit": ["B. Rockwell", "Shane Loeffler"]
    }, {
        "id": 2,
        "title": "Cumulus mediocris",
        "primaryText": "Some cloud droplets are destined for mediocrity, which is a slight upgrade from humiliating oneself constantly (see Cumulus humilis).",
        "secondaryText": "Cumulus mediocris clouds are larger and better-formed than humilis clouds, meaning they have more available moisture, more lift, or both. Thus, they have easier-to-spot updrafts.\n\nLook for heapy clouds that are roughly as tall as they are wide. The convection that generates them is usually robust enough that you can actually see it traced out by the bubbly, cauliflower texture.  \n\nEven though they too are of the \"fair-weather\" type, and even though they rarely produce precipitation themselves, their heft implies they have some good things going for them, and may be on their way to becoming a congestus or cumulonimbus. If you see these clouds growing taller and maintaining definition, keep an eye on them; they may be bucking for a promotion!",
        "caption": ["Cumulus mediocris over the St. Croix River, MN/WI"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/congestus_north.jpg"],
        "imgsCredit": ["Kenny Blumenfeld"]
    }, {
        "id": 2,
        "title": "Cumulus congestus",
        "primaryText": "Also known as \"towering cumulus,\" this convective cloud means business.",
        "secondaryText": "Cumulus congestus is a \"dazzle your friends cloud,\" because most people see a tall whitish thing, but you see a convective chain reaction that may or may not be propelling itself towards thunderstormhood--the greatest achievement of any cloud.\n\nCumulus congestus clouds provide an immediate diagnosis of potentially stormy conditions. Any cumulonimbus cloud must first pass through the congestus phase, and the amount of time between the two phases can be trivial. In explosively unstable conditions, some congestus towers can be massive in their own right, and are an early-warning sign that a dangerous thunderstorm is about to form.\n\nIf you see a crisp, well-defined congestus tower, you are seeing one that is healthy and growing. The cauliflower or boiling look means that the updraft is still is still expanding the cloud upwards and outwards. If you want to win the Nerd Olympics, pull out a pair of binoculars and watch the cloud expand live, before your eyes. You may also see signs of a smooth, pileus or \"cap cloud\" forming, which is another sign that a congestus cloud is ready to graduate to cumulonimbus.\n\nIf you no longer see any expanding or rising motions, the updraft (the rising air) is weakening or dying, and that particular cloud will soon take on a fuzzy, ill-defined look. The lack of definition is a clear sign that the tower is losing its punch. Of course, another tower may form in its place and make a run for it. So if you see a congestus, you’ve been put on notice that thunderstorms may form shortly.",
        "caption": ["Massive congestus near St. Paul, MN", "Cumulus congestus on a summer afternoon in central MN"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Towering.jpg", "img/Cloud/thumbnail/Sibley_towering.jpg"],
        "imgsCredit": ["Kenny Blumenfeld", "Kenny Blumenfeld"]
    }, {
        "id": 2,
        "title": "Cumulonimbus",
        "primaryText": "Life-enabler. Jaw-dropper. Thug of the sky. Cumulonimbus has many street names, because it plays many different roles, almost all having to do with making it rain, hard.",
        "secondaryText": "If you learn only one cloud, learn cumulonimbus. They represent the elegant and life-serving engine of deep moist convection--the same engine that produces the vast majority of the world’s precipitation.\n\nMonsoon rains, tropical cyclones, daily sea breeze thunderstorms, and tropical  rainforest precipitation all come to us courtesy of cumulonimbus clouds. Same with severe convective weather hazards like tornadoes, straight-line winds, hail, and flash-floods. Even the infamous desert \"haboob\" (dust storm) results from cold cumulonimbus downdrafts that crash into the ground and fan out.\n\nEvery year cumulonimbus clouds cost the world billions upon billions of dollars, while supplying us with water and breathing life into our delicate and interconnected ecosystems. They are, without a doubt, the most important clouds on our planet.\n\nCumulonimbus clouds are also, as luck would have it, extremely easy to spot, especially from a distance. They are the largest of the cumuliform clouds, and they represent the final step in cumulus development--a step that is often not achieved.\n\nFrom a distance, a cumulonimbus looks like a mass of  overgrown cumulus clouds, but with a flattened top that results from the convective updraft reaching the tropopause--a layer at the top of the troposphere where temperature no longer decreases with height. Here, rising air will eventually cool to the temperature of the air around it, meaning it can rise no further, and so the top of the cloud will begin to flatten out.\n\nAssuming the convective processes at lower altitudes are still strong, the updraft(s) will continue to produce cumuliform clouds that grow right up to the tropopause, where they too will eventually flatten out. The whole process leads to an an outward-expanding, nearly circular lid that often covers much more horizontal distance than the parent cloud itself. This is what leads to the classic \"anvil\" shape of many cumulonimbus clouds. That anvil, for what it’s worth, is frequently cirriform--made up primarily of ice crystals because of the extremely cold environment into which the anvil expands.\n\nAs with cumulus mediocris and especially congestus, the health of a cumulonimbus cloud can be determined through visual clues. A \"sharp-edged\" or crisp-looking cumulonimbus is at that moment strengthening or maintaining its strength, whereas a mushy-looking or fuzzy one is most certainly in decline.\n\nBy definition, cumulonimbus clouds produce precipitation, which can make identifying them more difficult at close range. Near or beneath a cumulonimbus, a combination of falling precipitation, the cloud base itself, and lower \"accessory clouds,\" can completely obstruct the view of the updrafts. At this range, observers are close enough to the storm to be at serious lightning risk and should get inside immediately.   \n\nAlthough they are often referred to as \"thunderstorm clouds\" or \"thunderheads,\" cumulonimbus clouds do not always produce lightning and thunder. This is especially true in tropical areas, where the air is often too warm to support ice formation, which is essential for the electrification of storm clouds. Even though tropical cyclones contain some of the most powerful cumulonimbus clouds in the world, lightning is rarely observed with them because of the lack of ice in the clouds.\n\nDo not let geography fool you though. Any cumulonimbus cloud should be assumed to be dangerous. Please beware of lightning. If you hear thunder, the storm is electrified, dangerous, and you are at risk.\n\nA cumulonimbus is a common yet breathtaking sight, and cloud-adorers will stop to pay homage every chance they get.",
        "caption": ["Classic cumulonimbus near Callodi, Italy", "Cumulonimbus twins over Ho Chi Minh City", "Large thunderstorm 100 miles to east top-lit by setting sun", "Even a small cumulonimbus up-close looks nothing like it does at a distance"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/cumulonimbus1.jpg", "img/Cloud/thumbnail/Air_cumulonimbus.jpg", "img/Cloud/thumbnail/Stpaul3.jpg", "img/Cloud/thumbnail/Approaching.jpg"],
        "imgsCredit": ["C. Langer", "Kien Do", "Kenny Blumenfeld", "Kenny Blumenfeld"]
    }, {
        "id": 2,
        "title": "Cirrostratus",
        "primaryText": "A combination of cirrus and stratus, but looking like neither, Cirrostratus clouds are nearly continuous sheets of ice crystals high in the sky.",
        "secondaryText": "With little or no blue sky to provide contrast, cirrostratus clouds can be very difficult to spot, and often just look milky or pasty, creating a halo around the sun or the moon. They generally form when the upper levels of the atmosphere are moistening, which happens in advance of low-pressure systems. Thus, these can be precipitation precursors. So next time you see them, grab a friend, look up in the sky, and say, \"Yup, Cirrostratus. Rain [or snow] by this time tomorrow.\" Then walk away. You will become a legend.",
        "caption": ["Veil of cirrostratus tops other clouds"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Cirrostratus.jpg"],
        "imgsCredit": ["Unknown public domain"]
    }, {
        "id": 2,
        "title": "Cirrocumulus",
        "primaryText": "Take the icy form of cirrus, and the heapy look of cumulus, and poof: you have one of the least consequential clouds out there!",
        "secondaryText": "Cirrocumulus clouds give the high sky a textured appearance, often like \"ragged buttons,\" ripples, or like thin swatches of lambswool or cotton. The \"lift\" that normally produces cumuliform clouds is not really at play in this case. Instead, it’s really the high-speed \"waves\" that provide the extremely shallow lift. It may be better to think of these as cirrus clouds on a bumpy, high-speed motorboat ride. If you are flying at cruising altitude and can see multiple cloud layers, cirrocumulus, along with cirrus, will be  will at the top--possibly even higher than the plane!\n\nLike cirrus clouds, cirrocumulus clouds often replace clear skies and may be replaced themselves by cirrostratus and eventually thicker and lower clouds.",
        "caption": ["Cirrocumulus darkened by the coming night", "Cirrocumulus field with hints of cirrostratus transformation"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Cirrocumulus1.jpg", "img/Cloud/thumbnail/cirrocumulus2.jpg"],
        "imgsCredit": ["Shane Loeffler", "J.Rotrekl"]
    }, {
        "id": 2,
        "title": "Stratocumulus",
        "primaryText": "Another generally inconsequential cloud type, stratocumulus have more breaks and a little more pop than than a straight-up stratus formation.",
        "secondaryText": "Stratoculumus clouds come in many different arrangements, best described as low, typically-broken sheets of oblong puffs. From below, they tend to have the same patchwork-lambswool look common to cirrocumulus and some altocumulus, but because they are the lowest of the three types, they have larger-looking swatches.\n\nAs the name implies, stratocumulus do exhibit some vertical development, though it is often shallow, keeping the puffs and heaps comparable to those of cumulus humilis and cumulus mediocris at best. Moreover, stratoculumus clouds usually form in only very modest instability, so the cumuliform heaps tend not to be particularly well defined.\n\nFrom above, stratocumululs clouds appears as sheets or extensive \"fields\" of small cumulus clouds. Their heapy nature and the tendency for small breaks to form among them, differentiate stratocumulus from pure stratus clouds.\n\nStratocumulus form in many different situations, but are most frequently associated with benign or even improving conditions. You may see them in the morning following a stormy night, or as the pressure rises behind a retreating weather system. They rarely produce precipitation, and almost never foretell significantly inclement weather.",
        "caption": ["Stratocumulus field, at eye-level", "Rows of stratocumulus seen from northeast Minnesota's Sawtooth Mountains"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/s1.jpg", "img/Cloud/thumbnail/s2.jpg"],
        "imgsCredit": ["Shane Loeffler", "B.Rockwell"]
    }, {
        "id": 2,
        "title": "Nimbostratus",
        "primaryText": "If cumulonimbus is Miami and Manilla, then nimbostratus is Seattle and London. As a precipitating stratus cloud almost entirely devoid of convection, nimbostratus is associated with prolonged bouts of light and moderate precipitation.",
        "secondaryText": "Nimbostratus clouds are generated in extensive sheets, usually embedded within an even larger (mostly non-precipitating) stratus deck, and less frequently around (though not directly beneath) a cumulonimbus cloud. They are most common in the moist but non-convective air masses associated with mid-latitude low pressure systems.  These systems and their associated nimbostratus arrays may take anywhere from six hours to several days to pass through a region, producing seemingly-endless bouts of steady rain or snow. Although nimbostratus clouds can produce light, fleeting showers, they are usually marked by precipitation that begins and ends gradually, and persists for hours or days without sudden changes in intensity.\n\nTemperate, near-coastal areas that are not prone to convective updrafts tend to get the majority of their precipitation from nimbostratus clouds. This stratiform precipitation feeds the temperate rainforest that extends from coastal Oregon and Washington, along the Pacific coast into Alaska. The majority of winter precipitation in North America, Europe, Asian Russia, and North America, is driven by stratiform processes and delivered by nimbostratus clouds.\n\nNimbostratus clouds are difficult to see because the of the lack of contrast between the precipitation area and the cloud bases themselves. They can be difficult to spot at a distance because the gradual nature of the precipitation precludes clear visual definition.",
        "caption": ["The most one can hope to see of nimbostratus"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/nimbostratus1.jpg"],
        "imgsCredit": ["Henryk Niestrój"]
    }, {
        "id": 2,
        "title": "Altostratus",
        "primaryText": "\"The cloud of undefined malaise,\" also know as altostratus, is perhaps the most boring cloud in the world. At least with stratus clouds, you know it could rain. But the featureless altostratus clouds just hang there, casting a pall of bleakness over all that is otherwise decent.",
        "secondaryText": "Altostratus clouds, by definition, form in the mid-levels of the troposphere, and at those altitudes, there simply is not enough water to create exceptionally thick clouds. Altostratus, therefore, lack the vertical depth of lower stratus clouds. Their formation, however, is still governed by layer-wise cooling and condensation, resulting in thin, relatively high sheets of water-droplet clouds that can cover large areas. Subtle variations in the already-scanty atmospheric water content, and/or small-scale sinking motions, can create random breaks in an altostratus cloud mass.\n\nThe thinness of altostratus often allows the sun to shine through, but because there are few if any ice crystals present, we tend not to see a halo. Thus, the presence or lack of a halo can be used to distinguish cirrostratus (halo) from altostratus (no halo). Altostratus clouds are also thicker than cirrostratus, and often mask the sky completely.\n\nWhen you see altostratus clouds, you can expect the next several hours to remain dry, and in many cases, the weather will not change substantially for days. However, they can be a sign that the atmosphere is moistening in advance of a disturbance. In those cases, altostratus may thicken and lower to form stratus and nimbostratus within 24 hours.\n\nAltostratus clouds are at their best around sunrise/sunset, when the diffuse light occasionally catches their relatively high altitudes just so, leaving us with a brightly-colored reward for putting up with them all day.",
        "caption": ["A dreary autumn altostratus deck over the Superior National Forest"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Altostratus1.jpg"],
        "imgsCredit": ["B.Rockwell"]
    }, {
        "id": 2,
        "title": "Altocumulus",
        "primaryText": "The jury is still out on altocumulus clouds: are they really cumuliform clouds but with higher bases, or do they just happen to appear to be cumuliform? This question for the ages will be debated by the gatekeepers of cloud-identifying arcana for generations to come. Or not.",
        "secondaryText": "Altocumulus clouds certainly earn more of their \"cumulus\" than, say, cirrocumulus, but these are not simply cumulus clouds begun at a higher altitude. The most common type of altocumulus clouds look  larger and lower than cirrocumulus, or a smaller and higher than stratocumulus--appearing as rows, bumps, \"buttons,\" and \"streets,\" any of which can be formed by waves or ripples getting ahold of air near the point of condensation. They are usually composed of water droplets, but ice crystals can be found in some of the higher/colder varieties.\n\nThere is one species that is distinctly cumuliform, and that is Altocumulus castellanus--a mouthful named for its \"castle-like\" towers. These clouds are like lofted and skinny mediocris-congestus hybrids, whose updrafts inform us that the atmosphere is convectively unstable, and whose relatively high bases (between 1.2 and 3 mi., or ~2-5 km) inform us that the instability is in the middle-altitudes and is not yet deep. Yet.\n\nWe usually see these clouds between mid-morning and mid-afternoon, before the surface-based heating and instability has maximized. In that way, altocumulus catellanus clouds tell us to watch for deeper convection, and that trouble may lie ahead.",
        "caption": ["Harmless altocumulus over Sweden", "Altocumulus castellanus, with their skinny, turret-like updraft towers"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/Altocumulus1.jpg", "img/Cloud/thumbnail/Castellanus.jpg"],
        "imgsCredit": ["K. Valtonen", "S. Petty"]
    }, {
        "id": 3,
        "title": "Spotting precipitation like a pro",
        "primaryText": "All this cloud information may be blowing your minds, but when clouds are racing towards you, it might be good to know if you are about to get soaked. Here are some very basic tips for seeing precipitation, before it gets to you (in no particular order).",
        "secondaryText": "This may seem obvious, but you want to look at the area between the base of the cloud and the ground, because that’s where you will see precipitation.\n\nPrecipitation restricts visibility, it has to. So you can get a sense of the precipitation intensity (and/or duration) by observing the extent to which visibility is limited beneath the cloud base. Darkness in this area is also a good indicator of limited visibility and intensity, because a heavy or large precipitation area will prevent light from passing through, thereby appearing dark.\n\nUse landscape features, and whether they are or are not obscured, to help you gauge the distance of the precipitation from you.\n\nLow visibility also limits the \"texture\" of the background, so precipitation areas therefore appear smooth, especially compared to the clouds around them.   \n\nAlthough precipitation areas will look darker than clear air, they are almost always lighter in color, sometimes much lighter, than the clouds immediately around them. So sharp contrast can be an excellent precipitation indicator.\n\nHere’s a great field trick that will impress your companions: if dark clouds are approaching and it is going to rain, the rain (or at least the heaviest of it) will begin, as or just after the darkest clouds pass. You can often find a sharp line delineating the darker \"accessory clouds\" from the lighter, smooth-looking precipitation area advancing towards you, and that line also marks the beginning of (the heaviest) precipitation.\n\nIsolated precipitation areas or pockets of more intense precipitation will appear as \"shafts\" of columns, sometimes looking like they have been \"blasted\" down from the cloud base.\n\nDefinition is, as with cumuliform clouds, an intensity indicator. The more sharply or clearly defined the precipitation area (based on its smoothness, contrast, visibility restrictions etc), the heavier it will be and/or the longer it will last.\n\nShafts of white, sometimes within a larger and darker precipitation area, may indicate that hail, snow, or some other form of frozen precipitation is falling.\n\nOf course, please beware of lightning, which is a frequent threat associated with precipitating clouds, especially during the warm season in continental, mountainous, tropical and sub-tropical, and even some desert regions. If you hear thunder, the storm is electrified, dangerous, and you are at risk.",
        "caption": ["Cold showers over the Tetons, Wyoming", "A clean break in the rain, Red Wing, MN", "Rain with an approaching thunderstorm", "Raining, but not enough to obscure the setting sun!", "A hail streak within an intense afternoon thunderstorm along the St. Croix River"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/splap1.jpg", "img/Cloud/thumbnail/Rain1.jpg", "img/Cloud/thumbnail/splap2.jpg", "img/Cloud/thumbnail/splap3.jpg", "img/Cloud/thumbnail/Hailstreak.jpg"],
        "imgsCredit": ["Kenny Blumenfeld", "Kenny Blumenfeld", "Kenny Blumenfeld", "Kenny Blumenfeld", "Kenny Blumenfeld"]
    }, {
        "id": 3,
        "title": "The Myth of the Dark Cloud",
        "primaryText": "Point out a bright white congestus formation to someone and then exclaim, \"ooh, that cloud might become a thunderstorm,\" and you face a 70% chance of being dismissed out of hand, in deference to the pervasive wisdom that storms can only come from dark clouds.",
        "secondaryText": "Before you laugh out loud at that reasoning, try some compassion: people who already have the deficiency of not being interested in clouds are simply unable to understand them. Or maybe they are interested but haven’t yet learned much. Moreover, even with a cloud-interest deficiency, a person could still, under some circumstances, show decency and intelligence in other areas. So there is no reason to be rude.\n\nInstead, you might explain that of course the sky does darken as a storm approaches, but that is because the storm is putting an awful lot of water, and sometimes even ice, between you and the sun. Continue by saying that as the light enters the cloud, it gets absorbed and scattered (refracted) by the busy droplets and ice crystals, which not only exist, but also are moving frenetically. The bigger the storm, you tell them, the less originating light makes it to you, and the darker the clouds will appear.\n\nAnd then you turn the corner. From beneath or inside a thunderstorm, the sky looks exactly as your simple friend says. But from a distance, it has a completely different look.\n\nThis is your opportunity to enlighten and possibly bore them to tears about cumuliform clouds (especially congestus and cumulonimbus), which accompany almost all thunderstorms, but can scarcely be seen from below.\n\nGiven enough distance, we can see congestus and cumulonimbus clouds just fine, and with sunlight shining on them, they will appear white, because they reflect the majority of the sunlight back to us. At greater distances they will appear yellowish or even pink (in the evening especially), but will retain their billowy and heapy looks, irrespective of color.\n\nSo, you conclude, thunderstorms affecting us are indeed accompanied by darkening skies. But from a distance, those same clouds have a very different look (and you gesture to the cumulonimbus cloud that had been cumulus congestus when the whole debate began).\n\nAnd then you walk away, with just a hint of victorious swagger.",
        "caption": ["Sure, it probably is really dark underneath this thing; not from here though!"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/tmotdc1.jpg"],
        "imgsCredit": ["Sandid"]
    }, {
        "id": 3,
        "title": "Boundary Issues",
        "primaryText": "It’s as true with clouds as it is with everything else: boundaries are where things happen.",
        "secondaryText": "It’s not going to take very much cloud-gazing for you to notice clouds over here but not over there, or some sort of sharp demarcation between clouds and no clouds. Of course, observation is only the first part of inquiry, so naturally you may wonder, \"why?\"\n\nThe correct answer always will lie deep within meteorology and cloud microphysics, but for far less effort, money, and anguish, you can just blame it on \"boundaries.\"\n\nIndeed, boundaries--whether in the air or on the landscape-- can produce, maintain, organize, and destroy clouds.\n\nAs the air changes temperature or moisture content, it also changes its ability to produce and maintain clouds. Warm and moist air masses often produce numerous convective (cumuliform) clouds; cool and moist air masses lead to stratiform clouds; hot and dry air masses yield only isolated cumuliform clouds, if any at all; and cold and dry air masses produce sinking motions that erode clouds and clear the skies.\n\nWe are most familiar with air mass changes that take place at the surface of the earth, but changes in air mass quality occur throughout the troposphere. At any level, boundaries between different air masses are also boundaries between different cloud formation and destruction zones.\n\nSimilarly, landscape features act like boundaries too, though perhaps more subtly. The flow of air across varying topography can encourage or discourage cloud formation. For instance, as air is forced up a mountain, it must cool, which increases its relative humidity, and its ability to generate clouds. When it is forced down a hill, the opposite happens, leaving us with dry and less-cloudy skies on one side of the mountain versus wetter and cloudier conditions on the other.\n\nThe world presents us with countless other examples of air mass and topographic boundaries, but the same principles hold no matter what you observe. Wherever you see clouds, there must be sufficient condensation (or deposition) to support them, and the kinds of clouds present can be used to diagnose how and why the condensation (or deposition) occurred. (Please refer to everything else in this part of the app for further information.)\n\nIf you see no clouds, the moisture and/or the processes to support cloud formation must be lacking.\n\nAs air masses and landscape features change, so do the capacities for building certain types of clouds. The patterns we see reflected in the cloud cover merely point us to where the changes are most meaningful. It’s all about the boundaries, indeed.",
        "caption": ["A sharp stratus boundary over the Great Plains"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/bi1.jpg"],
        "imgsCredit": ["Shane Loeffler"]
    }, {
        "id": 3,
        "title": "Turbulence yes, danger no",
        "primaryText": "Some users of this app are in flight right now, which means that some number of them are losing their minds over ALL THAT TURBULENCE! If you are among them, this section is for you. Let’s start by loosening our grip on the armrest.",
        "secondaryText": "First, know that aircraft are designed to withstand far more turbulence than they ever experience, and far more than your flight is experiencing right now. Turbulence is exceptionally common, and is not an aircraft safety issue.\n\nOn the inside of the plane, where all the passengers are, moderate or severe turbulence can cause people to lose balance in the aisles or develop motion sickness. So it is definitely a flyer experience and flyer comfort issue, but NOT an aircraft safety one. Sure, you might use the sad paper bag in the seat-back in front of you, but the airplane is going to be fine.\n\nIt might help to think of turbulence as one side-effect of the miracle of flight. Airplanes exploit laws of physics to fly through the air, which you may recall is a fluid jam-packed with currents and waves. When your plane encounters the waves, you experience turbulence.\n\nIf we could drop some dye into the air, we would be able to see all of its infinite motions. Instead, however, we have to contend with its invisibility, which is probably the main reason turbulence freaks us out. If we could see the waves in front of and around the aircraft, we’d have a much more intuitive sense of how the whole thing works--it’s much more like a boat than most people would guess.\n\nTurbulence is caused by anything that forces the air to develop even slightly vertical motions. As air passes over mountains, it has to go up, and then down, so mountainous areas are great sources of turbulence. Hot, sunny days encourage pockets of intense heating near the ground, which usually leads to rising \"thermals\"--another source of turbulence. Cold fronts associated with low pressure systems plow into to the warmer air masses ahead of them, giving the warm air a free ride skyward. Any condition that favors the development of thunderstorms is inherently turbulent. In fact, conditions conducive to the development of cumuliform clouds must therefore have rising motions and turbulence too. Anything anything that makes the air go up and down a little, is a source of turbulence.\n\nTurbulence is an immensely normal result of having an atmosphere, and your airplane can handle it. Whether you can is another story, but at least you can relax knowing the airplane itself is going to be okay.",
        "caption": ["This won't happen, but even if it does, see how the plane is still level?"],
        "wiki": null,
        "imgs": ["img/Cloud/thumbnail/turbulent_flyer.jpg"],
        "imgsCredit": [null]
    }];
    _init();
});
