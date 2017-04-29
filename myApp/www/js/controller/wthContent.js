app.controller('WthContentCtrl', function($scope, $stateParams, DataService, IonicUtilService, DB, RequestService, $state) {
    var currentID = $stateParams.id;
    $scope.getCurrentTitle = function() {
        switch (currentID) {
            case "river":
                return "River or stream";
                break;
            case "lake":
                return "Lake or coastline";
                break;
            case "mount":
                return "Mountain, hill or ridge";
                break;
            case "can":
                return "Valley or canyon";
                break;
            case "dune":
                return "Pattern of sand or debris";
                break;
            case "land":
                return "Whole landscape";
                break;
            case "human":
                return "Human-made landscape";
                break;
            case "crops":
                return "Crops";
                break;
            case "colors":
                return "Bizzare colors";
                break;
            case "other":
                return "Other";
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
    $scope.hasLink = function(link) {
        if (link) return true;
        else return false;
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
    var content = [
    {
        "id": "river",
        "title": "Single-channel river",
        "text": "Also known as a 'Sinuous' or 'Meandering' river, the Single Channel River is only one of many different types of rivers. A sinuous river bends and meanders but usually flows in just one channel.",
        "wiki": "Meander",
        "imgs": ["img/RFA/River/SingleChan/river_single_channel.jpg", "img/RFA/River/SingleChan/river_single_channel2.jpg", "img/RFA/River/SingleChan/river_single_channel3.jpg"]
    }, {
        "id": "river",
        "title": "Braided river",
        "text": "A braided river consists of many small channels that repeatedly split apart and join back together. Large braided rivers are rare in the U.S., restricted to places like Alaska, Montana, and to some extent the Great Plains. Examples below: The Platte River of Nebraska and the Bitterroot River of Montana.",
        "wiki": "Braided_river",
        "imgs": ["img/RFA/River/Braided/river_braided.jpg", "img/RFA/River/Braided/river_braided2.jpg", "img/RFA/River/Braided/river_braided3.jpg"]
    }, {
        "id": "river",
        "title": "Entrenched river",
        "text": "A river that is constrained by a canyon, usually formed as the land is tectonically uplifted, for example, in the case of the Colorado River in the Grand Canyon.",
        "wiki": "Entrenched_river",
        "imgs": ["img/RFA/River/Entrenched/entrenchedriver.jpg", "img/RFA/River/Entrenched/entrenchedriver2.jpg", "img/RFA/River/Entrenched/entrenchedriver3.jpg"]
    }, {
        "id": "river",
        "title": "Delta",
        "text": "Where the mouth of the river flows into an ocean.",
        "wiki": "River_delta",
        "imgs": ["img/RFA/River/Delta/delta.jpg", "img/RFA/River/Delta/delta2.jpg", "img/RFA/River/Delta/delta3.jpg"]
    }, {
        "id": "river",
        "title": "Confluence",
        "text": "The merging of two rivers.",
        "wiki": "Confluence",
        "imgs": ["img/RFA/River/Confluence/confluence_1.jpg", "img/RFA/River/Confluence/confluence2.jpg", "img/RFA/River/Confluence/confluence3.jpg"]
    }, {
        "id": "river",
        "title": "Meander",
        "text": "A bend in a river, created as the river erodes the outer banks and deposits sediment on the inner banks.",
        "wiki": "Meander",
        "imgs": ["img/RFA/River/Meander/meanders.jpg", "img/RFA/River/Meander/meanders2.jpg", "img/RFA/River/Meander/meanders3.jpg"]
    }, {
        "id": "river",
        "title": "Abandoned meander",
        "text": "A meander that has been cut off from the main flow of the river, similar to an oxbow.",
        "wiki": "Meander",
        "imgs": ["img/RFA/River/AbMeander/abandonedmeander.jpg", "img/RFA/River/AbMeander/abandonedmeander2.jpg", "img/RFA/River/AbMeander/abandonedmeander3.jpg"]
    }, {
        "id": "river",
        "title": "Oxbow",
        "text": "A U-shaped lake or dry lake, cut off from a meandering river.",
        "wiki": "Oxbow_lake",
        "imgs": ["img/RFA/River/Oxbow/oxbow_small.jpg", "img/RFA/River/Oxbow/oxbow1_small.jpg", "img/RFA/River/Oxbow/oxbow2_small.jpg"]
    }, {
        "id": "river",
        "title": "Scrollbars",
        "text": "Arcs of small ridges and valleys ('swales') that parallel a river. They're usually deposited as the river meanders across its floodplain.",
        "wiki": "Meander",
        "imgs": ["img/RFA/River/Scrollbar/ridgeandswale.jpg", "img/RFA/River/Scrollbar/ridgeandswale2.jpg", "img/RFA/River/Scrollbar/ridgeandswale3.jpg"]
    }, {
        "id": "river",
        "title": "Bayou",
        "text": "A marshy, water-logged area with extremely slow-moving water, typically found in the Gulf region of the U.S.",
        "wiki": "Bayou",
        "imgs": ["img/RFA/River/Bayou/bayou.jpg", "img/RFA/River/Bayou/bayou2.jpg", "img/RFA/River/Bayou/bayou3.jpg"]
    }, {
        "id": "river",
        "title": "Manmade levee",
        "text": "A wall or slope built next to a river to regulate water levels.",
        "wiki": "Levee",
        "imgs": ["img/RFA/River/Levee/levee.jpg", "img/RFA/River/Levee/levee2.jpg", "img/RFA/River/Levee/levee3.jpg"]
    }, {
        "id": "river",
        "title": "Flood plain",
        "text": "Flat land on either side of a river, often submerged during times when the river runs high and overflows its banks. In some places, floodplains are farmed.",
        "wiki": "Floodplain",
        "imgs": ["img/RFA/River/FloodPlain/floodplain.jpg", "img/RFA/River/FloodPlain/floodplain2.jpg", "img/RFA/River/FloodPlain/floodplain3.jpg"]
    }, {
        "id": "river",
        "title": "Point-bar and cutbank",
        "text": "Pointbars are piles of sand and sediment that accumulate on the sides of river meanders, where the water slows down as it rounds the curve. Cutbanks are the outer banks of meanders, where the water speeds up and erodes down the side.",
        "wiki": "Point_bar",
        "imgs": ["img/RFA/River/PointBar/pointbar.jpg", "img/RFA/River/PointBar/point_bar_2.jpg", "img/RFA/River/PointBar/pointbar3.jpg"]
    }, {
        "id": "river",
        "title": "Channel bar",
        "text": "A deposit of sediment in a channel. Similar to a point bar, but not restricted to the shoreline. Usually an indication that the river carries large amounts of sediment during flood times.",
        "wiki": "Shoal",
        "imgs": ["img/RFA/River/ChannelBar/channel_bar.jpg", "img/RFA/River/ChannelBar/channel_bar2.jpg", "img/RFA/River/ChannelBar/channel_bar3.jpg"]
    }, {
        "id": "river",
        "title": "Slot canyon",
        "text": "A deep, very narrow canyon, typically formed in limestone or sandstone and so frequently found in the Southwest.",
        "wiki": "Slot_canyon",
        "imgs": ["img/RFA/River/SlotCan/slotcanyon1.jpg", "img/RFA/River/SlotCan/slotcanyon2.jpg", "img/RFA/River/SlotCan/slotcanyon3.jpg"]
    }, {
        "id": "river",
        "title": "Anabranch",
        "text": "A part of a river that leaves the main channel, then rejoins it further downstream. They can be small, short branches, or long, significant branches that cover many miles.",
        "wiki": "Anabranch",
        "imgs": ["img/RFA/River/Anabranch/anabranch.jpg", "img/RFA/River/Anabranch/anabranch2.jpg", "img/RFA/River/Anabranch/anabranch3.jpg"]
    }, {
        "id": "river",
        "title": "Stream offset",
        "text": "Stream offsets occur when faults dramatically change the course of a stream or river. This is especially well illustrated along the San Andreas Fault in California.",
        "wiki": null,
        "imgs": ["img/RFA/River/StreamOff/streamoffset.jpg", "img/RFA/River/StreamOff/streamoffset2.jpg", "img/RFA/River/StreamOff/streamoffset3.jpg"]
    }, {
        "id": "river",
        "title": "River ice",
        "text": "Check out the difference between winter, spring, and summer over the Missouri River in Nebraska.",
        "wiki": null,
        "imgs": ["img/RFA/River/Ice/missouri_river_ice_breakup.jpg", "img/RFA/River/Ice/missouri_river_iced_over.jpg", "img/RFA/River/Ice/missouri_river_not_iced_over.jpg"]
    }, {
        "id": "river",
        "title": "Delta distributaries",
        "text": "Small streams that break off a main river at a delta and flow independently into the ocean, lake, or larger river that the river feeds into.",
        "wiki": "Distributary",
        "imgs": ["img/RFA/River/DeltaDis/delta_distributary_1.jpg", "img/RFA/River/DeltaDis/delta_distributary_2.jpg", "img/RFA/River/DeltaDis/delta_distributary_3.jpg"]
    }, {
        "id": "lake",
        "title": "Sinkhole",
        "text": "A lake made from the collapse of an underground cave. Most sinkholes don't hold water, but when they do, they're noticeable and cool.",
        "wiki": "Sinkhole",
        "imgs": ["img/RFA/Lake/Sink/sinkholes.jpg", "img/RFA/Lake/Sink/sinkholes2.jpg", "img/RFA/Lake/Sink/sinkholes3.jpg"]
    }, {
        "id": "lake",
        "title": "Kettle hole",
        "text": "A lake formed from a retreating glacier. These are typically found in the northern areas of the U.S.: Minnesota, Michigan, New York, Massachusetts, etc.",
        "wiki": "Kettle_landform",
        "imgs": ["img/RFA/Lake/Kettle/kettelholes.jpg", "img/RFA/Lake/Kettle/kettelholes2.jpg", "img/RFA/Lake/Kettle/kettelholes3.jpg"]
    }, {
        "id": "lake",
        "title": "Playa",
        "text": "An ephemeral lake bed, usually in a desert.",
        "wiki": "Dry_lake",
        "imgs": ["img/RFA/Lake/Playa/playa.jpg", "img/RFA/Lake/Playa/playa2.jpg", "img/RFA/Lake/Playa/playa3.jpg"]
    }, {
        "id": "lake",
        "title": "Crater lake",
        "text": "A lake in the caldera of a volcano. It's unusual to fly over these types of lakes, unless you're in the Cascade Range of the Pacific Northwest.",
        "wiki": "Crater_lake",
        "imgs": ["img/RFA/Lake/Crater/craterlake.jpg", "img/RFA/Lake/Crater/craterlake2.jpg", "img/RFA/Lake/Crater/craterlake3.jpg"]
    }, {
        "id": "lake",
        "title": "Barrier island",
        "text": "A long, thin island running parallel to a coastline. They form from a variety of mechanisms and can shield the mainland from waves and storms.",
        "wiki": "Barrier_island",
        "imgs": ["img/RFA/Lake/Barrier/barrierisland.jpg", "img/RFA/Lake/Barrier/barrierisland2.jpg", "img/RFA/Lake/Barrier/barrierisland3.jpg"]
    }, {
        "id": "lake",
        "title": "Baymouth bar",
        "text": "A long, thin bar of sand that completely cuts off a bay from the rest of the ocean.",
        "wiki": "Baymouth_bar",
        "imgs": ["img/RFA/Lake/Baymouth/baymouthbar.jpg", "img/RFA/Lake/Baymouth/baymouthbar2.jpg", "img/RFA/Lake/Baymouth/baymouthbar3.jpg"]
    }, {
        "id": "lake",
        "title": "Tombolo",
        "text": "A long, thin bar of sand that connects the main land to an island.",
        "wiki": "Tombolo",
        "imgs": ["img/RFA/Lake/Tombolo/tombolo.jpg", "img/RFA/Lake/Tombolo/tombolo2.jpg", "img/RFA/Lake/Tombolo/tombolo3.jpg"]
    }, {
        "id": "lake",
        "title": "Estuary",
        "text": "A transition zone between a river and an ocean, usually partially enclosed but open to the sea.",
        "wiki": "Estuary",
        "imgs": ["img/RFA/Lake/Estuary/estuary.jpg", "img/RFA/Lake/Estuary/estuary2.jpg", "img/RFA/Lake/Estuary/estuary3.jpg"]
    }, {
        "id": "lake",
        "title": "Salt lake/alkaline lake",
        "text": "A lake with a high concentration of salt. You can usually identify them by the rings of white salts along their edges.",
        "wiki": "Salt_lake",
        "imgs": ["img/RFA/Lake/Salt/sodalake.jpg", "img/RFA/Lake/Salt/sodalake2.jpg", "img/RFA/Lake/Salt/sodalake3.jpg"]
    }, {
        "id": "lake",
        "title": "Sea stack",
        "text": "A rock isolated by coastal erosion.",
        "wiki": "Sea_stack",
        "imgs": ["img/RFA/Lake/SeaStack/sea_stack.jpg", "img/RFA/Lake/SeaStack/seastack2.jpg", "img/RFA/Lake/SeaStack/seastack3.jpg"]
    }, {
        "id": "lake",
        "title": "Coastal dunes",
        "text": "Dunes form on beaches when waves bring more sand than they take away, winds blow sand inland, and vegetation or another obstacle blocks sand from blowing too far inland.",
        "wiki": "Dune",
        "imgs": ["img/RFA/Lake/Dunes/dunes_coastal.jpg", "img/RFA/Lake/Dunes/dunes_coastal2.jpg", "img/RFA/Lake/Dunes/dunes_coastal3.jpg"]
    }, {
        "id": "mount",
        "title": "Butte",
        "text": "A small, isolated, flat-topped hill, usually found in deserts.",
        "wiki": "Butte",
        "imgs": ["img/RFA/Mount/butte1.jpg", "img/RFA/Mount/butte2.jpg", "img/RFA/Mount/butte3.jpg"]
    }, {
        "id": "mount",
        "title": "Mesa",
        "text": "A flat-topped mountain with steep sides, usually larger than a butte, usually found in a desert.",
        "wiki": "Mesa",
        "imgs": ["img/RFA/Mount/mesa1.jpg", "img/RFA/Mount/mesa2.jpg", "img/RFA/Mount/mesa3.jpg"]
    }, {
        "id": "mount",
        "title": "Monadnock/inselberg",
        "text": "An isolated mountain that rises abruptly from otherwise level ground.",
        "wiki": "Inselberg",
        "imgs": ["img/RFA/Mount/monadnock_1.jpg", "img/RFA/Mount/monadnock_2.jpg", "img/RFA/Mount/monadnock_3.jpg"]
    }, {
        "id": "mount",
        "title": "Fold limb",
        "text": "Fold limbs can look like ridges: long, linear mountains with crests at the top. Ridges can be due to a variety of geologic landforms, but, in highly folded areas of the country - like the Appalachians - they are frequently fold limbs.",
        "wiki": "Fold_geology",
        "imgs": ["img/RFA/Mount/ridge.jpg", "img/RFA/Mount/fold_limb2.jpg", "img/RFA/Mount/fold_limb3.jpg"]
    }, {
        "id": "mount",
        "title": "Hogbacks",
        "text": "Steeply tilting rock layers which stick up out of the ground like spine vertebrae. Sometimes they can form triangle-shaped wedges that lay against the sides of mountains.",
        "wiki": "Hogback_geology",
        "imgs": ["img/RFA/Mount/hogback.jpg", "img/RFA/Mount/hogback2.jpg", "img/RFA/Mount/hogback3.jpg"]
    }, {
        "id": "mount",
        "title": "Thrust Sheets",
        "text": "Thrust sheets can also produce ridges. The ridges below are the edges of giant sheets of rock that were thrust up on top of other rocks during a mountain-building event. The thrust sheets tend to form several long, parallel ridges. Note: Not all thrust faults look like this! These are special cases.",
        "wiki": "Thrust_fault",
        "imgs": ["img/RFA/Mount/thrusts.jpg", "img/RFA/Mount/thrusts2.jpg", "img/RFA/Mount/thrusts3.jpg"]
    }, {
        "id": "mount",
        "title": "Syncline",
        "text": "Folded layers of rocks can make beautiful mountains. Syncline folds look like smiley-faces; anticlines look like frowney-faces. When viewed from above, synclines tend to have valleys in the middle; anticlines tend to be raised in the middle. Syncline mountains are common in the Appalachian Valley and Ridge Province.",
        "wiki": "Syncline",
        "imgs": ["img/RFA/Mount/syncline.jpg", "img/RFA/Mount/syncline2.jpg", "img/RFA/Mount/syncline3.jpg"]
    }, {
        "id": "mount",
        "title": "Anticline",
        "text": "Folded layers of rocks can make beautiful mountains. Syncline folds look like smiley-faces; anticlines look like frowney-faces. When viewed from above, synclines tend to have valleys in the middle; anticlines tend to be raised in the middle. Syncline mountains are common in the Appalachian Valley and Ridge Province.",
        "wiki": "Anticline",
        "imgs": ["img/RFA/Mount/anticline.jpg", "img/RFA/Mount/anticline2.jpg", "img/RFA/Mount/anticline3.jpg"]
    }, {
        "id": "mount",
        "title": "Cirque",
        "text": "A curved mountain face formed by glacial erosion. The cirque on the right is outlined in red to illustrate.",
        "wiki": "Cirque",
        "imgs": ["img/RFA/Mount/cirque.jpg", "img/RFA/Mount/cirque2.jpg", "img/RFA/Mount/cirque3.jpg"]
    }, {
        "id": "mount",
        "title": "Glacier",
        "text": "U.S. glaciers are usually only seen in Montana or Alaska. The ones shown below are Montana glaciers.",
        "wiki": "Glacier",
        "imgs": ["img/RFA/Mount/glacier.jpg", "img/RFA/Mount/glacier2.jpg", "img/RFA/Mount/glacier3.jpg"]
    }, {
        "id": "mount",
        "title": "Alluvial fan",
        "text": "Fan-shaped sediment deposit at the base of a mountain.",
        "wiki": "Alluvial_fan",
        "imgs": ["img/RFA/Mount/alluvialfans.jpg", "img/RFA/Mount/alluvialfans2.jpg", "img/RFA/Mount/alluvialfan3.jpg"]
    }, {
        "id": "mount",
        "title": "Drumlin",
        "text": "A long, narrow hill formed by a retreating glacier. Common in Minnesota, Wisconsin, Boston, etc. They are often distinctive, since they can occur as swarms of long, narrow hills, all pointing North (or North-ish). From above, these swarms can look like long striations on the landscape.",
        "wiki": "Drumlin",
        "imgs": ["img/RFA/Mount/drumlins.jpg", "img/RFA/Mount/drumlins2.jpg", "img/RFA/Mount/drumlins3.jpg"]
    }, {
        "id": "mount",
        "title": "Esker",
        "text": "A long, sinuous ridge of sand, presumably formed as sandy streams cutting down, through, or underneath glaciers. When the glacier retreats, the pile of stream sediment is left behind. You can spot them as long, sinuous ridges in the northern, formerly glaciated parts of the country.",
        "wiki": "Esker",
        "imgs": ["img/RFA/Mount/esker.jpg", "img/RFA/Mount/esker2.jpg", "img/RFA/Mount/esker3.jpg"]
    }, {
        "id": "mount",
        "title": "Moraine",
        "text": "A pile of glacial debris (sand, gravel, etc.) that is left behind as the glacier retreats. They tend to be long, sinuous mounds of sand.",
        "wiki": "Moraine",
        "imgs": ["img/RFA/Mount/moraine.jpg", "img/RFA/Mount/moraine2.jpg", "img/RFA/Mount/moraine3.jpg"]
    }, {
        "id": "mount",
        "title": "Cinder cone",
        "text": "A small, steep mountain of volcanic ash and cinder that accumulates around a small volcanic vent. They are common in the Southwest (especially Arizona) and in the Cascades. They're easily identified by their small, conical shape, and the large gaping hole on top. You can often see recent (solidified) lava flows pouring from their tops.",
        "wiki": "Cinder_cone",
        "imgs": ["img/RFA/Mount/cindercone.jpg", "img/RFA/Mount/cindercone2.jpg", "img/RFA/Mount/cindercone3.jpg"]
    }, {
        "id": "mount",
        "title": "Lava dome",
        "text": "A small, budging dome of slowly-oozing lava, usually found near active volcanic zones, like the Cascades. From above, they look like raised pimples on the landscape.",
        "wiki": "Lava_dome",
        "imgs": ["img/RFA/Mount/lavadomes.jpg", "img/RFA/Mount/lavadomes2.jpg", "img/RFA/Mount/lavadomes3.jpg"]
    }, {
        "id": "mount",
        "title": "Exposed dike",
        "text": "Dikes form when lava cuts up through overlying rock, usually on its way to the surface. As the overlying layers are eroded away, dikes can appear on the surface as long, resistant ridges, often a different color than the surrounding landscape.",
        "wiki": "Dike_geology",
        "imgs": ["img/RFA/Mount/dike.jpg", "img/RFA/Mount/dike2.jpg", "img/RFA/Mount/dike3.jpg"]
    }, {
        "id": "can",
        "title": "U-Shaped valleys",
        "text": "A wide valley with steep sides - a cross-section of the valley would look like a U. These valleys are carved by glaciers, and are usually only seen in the northern regions of the U.S.",
        "wiki": "U-shaped_valley",
        "imgs": ["img/RFA/Can/U-shaped-valley.jpg", "img/RFA/Can/U-shaped-valley2.jpg", "img/RFA/Can/U-shaped-valley3.jpg"]
    }, {
        "id": "can",
        "title": "V-Shaped valleys",
        "text": "V-shaped valleys typically form from rivers. Their sides are gentle slopes straight down to the river below, unlike U-shaped glacial valleys that have very steep sides and a rounded, flat bottom. V-shaped valleys are common in recently-uplifted, young terrain; for example: in the western states. Older, more well-developed terrain rarely have V-shaped valleys.",
        "wiki": "Valley",
        "imgs": ["img/RFA/Can/v-shaped-valley1.jpg", "img/RFA/Can/v-shaped-valley2.jpg", "img/RFA/Can/v-shaped-valley3.jpg"]
    }, {
        "id": "can",
        "title": "Joints in granite",
        "text": "Joints (fractures) in granite can often form steep-sided gashes that look (from above) like mini-canyons. Granite joints are easily identified, since they tend to be irregularly spaced and occur across bare rock faces. They are easily seen when flying over the Sierra Nevadas of California or Nevada.",
        "wiki": "Joint_geology",
        "imgs": ["img/RFA/Can/joints_granite.jpg", "img/RFA/Can/joints_granite2.jpg", "img/RFA/Can/joints_granite3.jpg"]
    }, {
        "id": "can",
        "title": "Water gaps",
        "text": "Water gaps are the small, narrow valleys by which a river cuts across a mountain range. They typically indicate that the river is older than the mountain; in other words: the river established its course before the region was uplifted.",
        "wiki": "Water_gap",
        "imgs": ["img/RFA/Can/watergap1.jpg", "img/RFA/Can/watergap2.jpg", "img/RFA/Can/watergap3.jpg"]
    }, {
        "id": "can",
        "title": "Fault-controlled valleys",
        "text": "Faults often produce straight, steep valleys. Faults grind rocks together, creating a plane of weakness, which is more easily eroded than surrounding rock. This plane is a good place for a valley to form. (Note: Not all faults look like valleys, though. In fact, most do not.",
        "wiki": null,
        "imgs": ["img/RFA/Can/valley_fault_controlled.jpg", "img/RFA/Can/fault-controlled_canyon2.jpg", "img/RFA/Can/fault-controlled_canyon4.jpg"]
    }, {
        "id": "can",
        "title": "Syncline",
        "text": "Folded layers of rocks can make beautiful mountains. Syncline folds look like smiley-faces; anticlines look like frowney-faces. When viewed from above, synclines tend to have valleys in the middle; anticlines tend to be raised in the middle. Syncline mountains are common in the Appalachian Valley and Ridge Province.",
        "wiki": "Syncline",
        "imgs": ["img/RFA/Mount/syncline.jpg", "img/RFA/Mount/syncline2.jpg", "img/RFA/Mount/syncline3.jpg"]
    }, {
        "id": "can",
        "title": "Entrenched river",
        "text": "A river that is constrained by a canyon, usually formed as the land is tectonically uplifted, for example, in the case of the Colorado River in the Grand Canyon.",
        "wiki": "Entrenched_river",
        "imgs": ["img/RFA/River/Entrenched/entrenchedriver.jpg", "img/RFA/River/Entrenched/entrenchedriver2.jpg", "img/RFA/River/Entrenched/entrenchedriver3.jpg"]
    }, {
        "id": "can",
        "title": "Slot canyon",
        "text": "A deep, very narrow canyon, typically formed in limestone or sandstone and so frequently found in the Southwest.",
        "wiki": "Slot_canyon",
        "imgs": ["img/RFA/River/SlotCan/slotcanyon1.jpg", "img/RFA/River/SlotCan/slotcanyon2.jpg", "img/RFA/River/SlotCan/slotcanyon3.jpg"]
    }, {
        "id": "dune",
        "title": "Coastal dunes",
        "text": "Dunes form on beaches when waves bring more sand than they take away, winds blow sand inland, and vegetation or another obstacle blocks sand from blowing too far inland.",
        "wiki": "Dune",
        "imgs": ["img/RFA/Lake/Dunes/dunes_coastal.jpg", "img/RFA/Lake/Dunes/dunes_coastal2.jpg", "img/RFA/Lake/Dunes/dunes_coastal3.jpg"]
    }, {
        "id": "dune",
        "title": "Crescentic dunes (aka Barchans)",
        "text": "Crescent-shaped sand dunes that form from wind that blows consistently from one direction. The 'wings' point in the direction the wind blows.",
        "wiki": "Dune",
        "imgs": ["img/RFA/Dunes/barchan.jpg", "img/RFA/Dunes/barchans2.jpg", "img/RFA/Dunes/barchans3.jpg"]
    }, {
        "id": "dune",
        "title": "Star dunes",
        "text": "Radially-symmetrical sand dunes with multiple 'arms'. They form in places where the wind can blow from multiple directions.",
        "wiki": "Dune",
        "imgs": ["img/RFA/Dunes/star_dunes.jpg", "img/RFA/Dunes/dunes_star.jpg", "img/RFA/Dunes/dunes_star2.jpg"]
    }, {
        "id": "dune",
        "title": "Parabolic dunes",
        "text": "U-shaped sand dunes, anchored by vegetation. The 'wings' point into the wind. (The opposite of barchan dunes).",
        "wiki": "Dune",
        "imgs": ["img/RFA/Dunes/parabolic_dunes.jpg", "img/RFA/Dunes/dunes_parabolic.jpg", "img/RFA/Dunes/parabolicdunes3.jpg"]
    }, {
        "id": "dune",
        "title": "Longitudinal dunes (aka Seif dunes)",
        "text": "Long sand hills that form parallel to wind direction. The opposite is a transverse dune, perpendicular to the wind direction.",
        "wiki": "Dune",
        "imgs": ["img/RFA/Dunes/linear_dunes.jpg", "img/RFA/Dunes/longitudinal_dunes_2.jpg", "img/RFA/Dunes/longitudinal_dunes_3.jpg"]
    }, {
        "id": "dune",
        "title": "Alluvial fan",
        "text": "Fan-shaped sediment deposit at the base of a mountain.",
        "wiki": "Alluvial_fan",
        "imgs": ["img/RFA/Mount/alluvialfans.jpg", "img/RFA/Mount/alluvialfans2.jpg", "img/RFA/Mount/alluvialfan3.jpg"]
    }, {
        "id": "dune",
        "title": "Erg",
        "text": "A sand sea. The only active ergs in the U.S. are the Yuma Desert of Arizona, the Algodones of southeast California, the Great Sand Dunes of Colorado, White Sands of New Mexico, and the Nebraska Sand Hills {read more}. Note: Ergs are huge, so instead of a nadir-facing view at 35,000 feet, this image of the Great Sand Dunes of Colorado is a south-facing perspective at 35,000 feet.",
        "wiki": "Dune",
        "img2": null,
        "img3": null,
        "imgs": ["img/RFA/Dunes/erg_perspective.jpg"]
    }, {
        "id": "land",
        "title": "Badlands",
        "text": "An arid environment with extreme erosion, unsuitable for grazing or farming.",
        "wiki": "Badlands",
        "imgs": ["img/RFA/Land/badlands.jpg", "img/RFA/Land/badlands2.jpg", "img/RFA/Land/badlands3.jpg"]
    }, {
        "id": "land",
        "title": "Dissected plateau",
        "text": "A landscape that has been severely eroded, producing sharp relief and topography. Some portions of the Appalachian Plateau are dissected.",
        "wiki": "Dissected_plateau",
        "img2": null,
        "img3": null,
        "imgs": ["img/RFA/Land/dissected plateau.jpg"]
    }, {
        "id": "human",
        "title": "Power lines",
        "text": "A long, straight swath cut across mountains and forests usually marks giant power lines and towers.",
        "wiki": "Electric_power_transmission",
        "imgs": ["img/RFA/Human/power_lines_through_a_forest.jpg", "img/RFA/Human/powerlines.jpg", "img/RFA/Human/powerlines2.jpg"]
    }, {
        "id": "human",
        "title": "Ski slopes",
        "text": "Long tree-less scars down a mountainside often mark ski slopes.",
        "wiki": null,
        "imgs": ["img/RFA/Human/ski_slopes.jpg", "img/RFA/Human/ski_slopes2.jpg", "img/RFA/Human/skislopes3.jpg"]
    }, {
        "id": "human",
        "title": "Oil fields",
        "text": "Large oil fields are easy to spot from a plane. They tend to have dense networks of dirt roads connecting small dirt patches, where the pumps are pumping.",
        "wiki": "Oil_field",
        "imgs": ["img/RFA/Human/oilfields.jpg", "img/RFA/Human/oilfields2.jpg", "img/RFA/Human/oilfields23.jpg"]
    }, {
        "id": "human",
        "title": "Tailing ponds",
        "text": "Large man-made ponds near mines. The miners pump contaminated water into the ponds, where contaminates can precipitate out. Mine operators usually construct the ponds as giant rectangles, frequently in rows. The ponds tend to be multi-colored, and are usually right next to what is obviously a mine.",
        "wiki": "Tailings",
        "imgs": ["img/RFA/Human/tailingsponds.jpg", "img/RFA/Human/tailingsponds2.jpg", "img/RFA/Human/tailingsponds3.jpg"]
    }, {
        "id": "human",
        "title": "Quarry",
        "text": "An open pit mine, usually for rock, gravel, or cement. Unlike mineral mines, quarries tend to be gray- or tan-colored. Bright reds, blues, greens, or variations in colors point to mineral deposits -- usually not to cement.",
        "wiki": "Quarry",
        "imgs": ["img/RFA/Human/quarry.jpg", "img/RFA/Human/quarry2.jpg", "img/RFA/Human/quarry4.jpg"]
    }, {
        "id": "human",
        "title": "Mountain-top removal mines",
        "text": "These are usually coal mines in the Appalachians. Just like the name says, to get at the coal, the mine operators remove the top of a mountain, following the coal seam. They're easy to spot from a plane flying over, say, West Virginia or Kentucky.",
        "wiki": "Mountaintop_removal_mining",
        "imgs": ["img/RFA/Human/mtr.jpg", "img/RFA/Human/mtr2.jpg", "img/RFA/Human/mtr3.jpg"]
    }, {
        "id": "human",
        "title": "Open pit mines - coal",
        "text": "Just as the name implies, an open pit mine is a large, open pit. Coal open pit mines often have an unsurprisingly coal-gray color. These are especially common in Wyoming.",
        "wiki": "Open-pit_mining",
        "imgs": ["img/RFA/Human/coal.jpg", "img/RFA/Human/coal2.jpg", "img/RFA/Human/coal3.jpg"]
    }, {
        "id": "human",
        "title": "Open pit mines - copper",
        "text": "Copper open pit mines often (though not always) are associated with beautiful colors. The major copper ores include chalcopyrite (golden), cuprite (red), malachite (bright green), and bornite (which can be red, copper-colored, blue, or green, and is iridescent), all of which are usually found with other brightly-colored copper minerals.",
        "wiki": "Open-pit_mining",
        "imgs": ["img/RFA/Human/copper.jpg", "img/RFA/Human/copper2.jpg", "img/RFA/Human/copper3.jpg"]
    }, {
        "id": "human",
        "title": "Open pit mines - iron",
        "text": "If the primary ore is an iron oxide, an open pit iron mine usually has a mixture of rust-red and dark gray. If the primary ore is an iron sulfide, the colors can be more vibrant and varied.",
        "wiki": "Open-pit_mining",
        "imgs": ["img/RFA/Human/iron.jpg", "img/RFA/Human/iron2.jpg", "img/RFA/Human/iron3.jpg"]
    }, {
        "id": "human",
        "title": "Coal power plant",
        "text": "Readily identified by their tall cooling towers and flue gas stacks, also by their proximity to water.",
        "wiki": "Fossil-fuel_power_station",
        "imgs": ["img/RFA/Human/coalpowerplant.jpg", "img/RFA/Human/coalpowerplant2.jpg", "img/RFA/Human/coalpowerplant3.jpg"]
    }, {
        "id": "human",
        "title": "Dams",
        "text": "Big dams are easily identifiable from overhead because of the giant pool of water behind them and the tiny little stream of water coming out the front. There are a lot of large dams in the U.S. that can be readily seen from flight.",
        "wiki": "Dam",
        "imgs": ["img/RFA/Human/dam1.jpg", "img/RFA/Human/dam2.jpg", "img/RFA/Human/dam3.jpg"]
    }, {
        "id": "other",
        "title": "Impact craters",
        "text": "These giant round holes in the ground form when a rock from space flies through the atmosphere and hits Earth. They are very rare, and craters pristine enough to be seen from a plane are even more rare -- unless you're flying over Arizona, you're probably not seeing one.",
        "wiki": "Impact_crater",
        "imgs": ["img/RFA/Other/crater.jpg", "img/RFA/Other/crater2.jpg", "img/RFA/Other/crater3.jpg"]
    }, {
        "id": "other",
        "title": "Salt domes",
        "text": "A dome pushed up from below as subsurface salt rises through overlying layers. These are rare in the U.S., but are sometimes seen in the southwest (e.g., Texas).",
        "wiki": "Salt_dome",
        "imgs": ["img/RFA/Other/saltdome.jpg", "img/RFA/Other/saltdome2.jpg", "img/RFA/Other/saltdome3.jpg"]
    }, {
        "id": "other",
        "title": "Nuclear test site",
        "text": "Fields of small, circular pits, usually in Nevada. It's unlikely you'll fly over this.",
        "wiki": "Sedan_nuclear_test",
        "img2": null,
        "img3": null,
        "imgs": ["img/RFA/Other/nucleartestground.jpg"]
    }, {
        "id": "other",
        "title": "Dune buggy tracks",
        "text": "You'll probably only see these if you're flying flow over a desert/dune/coastal area that's managed by the Bureau of Land Management (which doesn't mind dune buggies). They're small - this field is only ~2,000 feet across.",
        "wiki": "Dune_buggy",
        "img2": null,
        "img3": null,
        "imgs": ["img/RFA/Other/dune_buggy_tracks.jpg"]
    }, {
        "id": "crops",
        "title": "Contour farming",
        "text": "Plowing along elevation lines. You'll see this technique most often in hilly farmland, especially over Minnesota and Wisconsin.",
        "wiki": "Contour_plowing",
        "imgs": ["img/RFA/Crops/contour_farming.jpg", "img/RFA/Crops/contourfarming2.jpg", "img/RFA/Crops/contourfarming3.jpg"]
    }, {
        "id": "crops",
        "title": "Center pivot irrigation",
        "text": "Crops are often planted in giant circles to facilitate center pivot irrigation: an irrigation technique where the water-distributing poles are fixed in the center of the field and rotated around in a circle. This type of irrigation is effective on flat land - expect to see it mostly in Kansas and Nebraska.",
        "wiki": "Center_pivot_irrigation",
        "imgs": ["img/RFA/Crops/center_pivot_1.jpg", "img/RFA/Crops/center_pivot_2.jpg", "img/RFA/Crops/center_pivot_3.jpg"]
    }, {
        "id": "crops",
        "title": "Level basin irrigation",
        "text": "Large, flat plots of land which are irrigated by channeling water directly into the basin. Rice paddies have made this method famous; however, other crops can use it too: alfalfa, citrus trees, and some cereals, for example. You can spot these from above by their weirdly-deformed rectangular shapes and various green colors. In the U.S., they're mostly concentrated around the Mississippi River Delta, especially in Arkansas.",
        "wiki": "Surface_irrigation",
        "imgs": ["img/RFA/Crops/level_basin_irrigation_1.jpg", "img/RFA/Crops/level_basin_irrigation_2.jpg", "img/RFA/Crops/level_basin_irrigation_3.jpg"]
    }, {
        "id": "crops",
        "title": "Furrow irrigation",
        "text": "Furrow irrigation uses small channels running down the sides and rows of fields to irrigate crops.",
        "wiki": "Surface_irrigation",
        "imgs": ["img/RFA/Crops/furrow_irrigation_1.jpg", "img/RFA/Crops/furrow_irrigation_2.jpg", "img/RFA/Crops/furrow_irrigation_3.jpg"]
    }, {
        "id": "crops",
        "title": "Non-farmed hills",
        "text": "The forested hills in this Midwest view were left unfarmed, while the low-lying plains were plowed.",
        "wiki": null,
        "img2": null,
        "img3": null,
        "imgs": ["img/RFA/Crops/farmingaroundhills.jpg"]
    }, {
        "id": "colors",
        "title": "White (salt)",
        "text": "White salt crusts frequently form on dry lake beds in the desert. As the water evaporates, it leaves behind 'evaporite' minerals, for example, sodium carbonate and sodium bicarbonate.",
        "wiki": "Evaporite",
        "imgs": ["img/RFA/Colors/white_dry_lake_bed.jpg", "img/RFA/Colors/white_evaporites.jpg", "img/RFA/Colors/white_evaporites2.jpg"]
    }, {
        "id": "colors",
        "title": "Lightening (grain size)",
        "text": "One of the most common reasons for a sudden light patch in an otherwise uniform terrain is a change in grain size. Ground-up rock (i.e., sand) is usually lighter than the rock it came from. So mines, alluvial fans, dunes, and other piles of freshly-ground dirt appear lighter than the surrounding rock.",
        "wiki": "Sorting_(sediment)",
        "imgs": ["img/RFA/Colors/lightduetofinegrains.jpg", "img/RFA/Colors/lightduetofinegrains2.jpg", "img/RFA/Colors/lightduetofinegrains3.jpg"]
    }, {
        "id": "colors",
        "title": "Black (basalt lava)",
        "text": "Large splotches of black, especially in the southwest, are often lava flows.",
        "wiki": "Basalt",
        "imgs": ["img/RFA/Colors/lava.jpg", "img/RFA/Colors/lava2.jpg", "img/RFA/Colors/lava3.jpg"]
    }, {
        "id": "colors",
        "title": "Banded colors (sedimentary rocks)",
        "text": "As a river or stream erodes down through a stack of sedimentary layers, it exposes deeper and deeper layers. If they layers are sufficiently different kinds of rock (e.g., shale, limestone, sandstone), they often look like stripes of color when viewed from above.",
        "wiki": "Sedimentary_rock",
        "imgs": ["img/RFA/Colors/bands.jpg", "img/RFA/Colors/bandedlayers2.jpg", "img/RFA/Colors/bandedlayers3.jpg"]
    }, {
        "id": "colors",
        "title": "Dark sands (in deserts)",
        "text": "Frequently, desert sands and rocks will appear dark due to a coating of iron, manganese, and clay called desert varnish. A rock surface that is exposed to the desert environment for more than a few years will develop this varnish. From above, you will commonly see this effect on alluvial fans: the young, fresh sands will be bright, while the older sands (which are the same composition and grain size as the younger sands) will be stained a darker color.",
        "wiki": "Desert_varnish",
        "imgs": ["img/RFA/Colors/darksand.jpg", "img/RFA/Colors/darksand2.jpg", "img/RFA/Colors/darksand3.jpg"]
    }, {
        "id": "colors",
        "title": "Bright turquoise water",
        "text": "Tailings ponds filled with mine debris can have spectacular color variations. Bright turquoise waters are often caused by very fine suspected clay particles.",
        "wiki": "Tailings",
        "imgs": ["img/RFA/Colors/tailings_blue.jpg", "img/RFA/Colors/tailings_blue2.jpg", "img/RFA/Colors/tailings_blue3.jpg"]
    }];
});