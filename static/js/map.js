$("#result").click(function()
        {
            var multiselectInput = $("#multiselect option:selected").attr("href");
            var mltechniquesInput = $("#ML_techniques option:selected").attr("href");
            var countryInput = $("#country option:selected").attr("href");
            // console.log("Multi Select Input: " + JSON.stringify(multiselectInput));
            // console.log("ML Techniques Input: " + JSON.stringify(mltechniquesInput));

            $(".result_table").remove();
            $(".result_graph").remove();
            $(".default_instruction").remove();

            $.ajax({
                type: "POST",
                url: "/explore",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({"GTD_attributes": multiselectInput, "ML_techniques": mltechniquesInput, "country": countryInput}),
                success: function(data) {
                    // console.log(data);
                    var div_Analytics = "#Analytics";
                    var div_Vis = "#Vis";
                    Analytics(div_Analytics,data);
                    Vis(div_Vis,data)
                    },
                complete: function(xhr, textStatus) {
                    console.log("AJAX Request complete -> ", xhr, " -> ", textStatus);
                    }
            });
});

// write codes for the Analytics and Visualization panes inside the below functions

function Analytics(reference, data){
    // console.log(data.a);
    // var width = $(reference).width();
    // var margin = {top:10, right:10, bottom: 40, left:40};
    // var height = 270 - margin.top - margin.bottom;
    // var svg = d3.select("#Analytics")
    //             .append("svg")
    //             .attr("width", width);
    // console.log("Data is loaded in Analytics()");
    // console.log(width);
    // console.log(height);

    // var data_cols = data.col;
    var fake_data  = [data.key];
    // fake_data = [data.key];
    // dummy values
    var fake_data_split = fake_data[0];
     fake_data_split = fake_data_split.match(/\w+([.*a-z0-9\-0-9+])*(\[.*?\])?/g);

    console.log(fake_data_split)

    fake_data_split =   fake_data_split.slice(0,fake_data_split.length-2);
    const matrica = []

    for (i=0;i< (fake_data_split.length);i+=2){

        matrica.push([fake_data_split[i], fake_data_split[i+1]]);

    }
    console.log(matrica)

    var table = d3.select("#Analytics")
                .append('table')
                .selectAll('tr')
                .data(matrica);

    //table.setAttribute('class', 'result_table');

    table.enter().append('tr')
        .selectAll('td')
        .data(d => d)
        .enter()
        .append('td')
        .text(d => d);


    table.exit()
         .remove();

    jQuery("tr").addClass("result_table");

    var cells = table.selectAll('td')
                    .data(function (d) {return d;})
                    .text(function (d) {return d;});

    cells.enter()
            .append("td")
            .text(function(d) { return d; });

    cells.exit().remove();

var width = $(reference).width();
    var margin = {top:10, right:10, bottom: 10, left:10};
    var height = 370 - margin.top - margin.bottom;
    var svg2 = d3.select("#Analytics")
                .append("svg")
                .attr("width", 300)
                .attr("height", 20)
                .attr("x", 200)
                .attr("y", 100)
                .attr("class", "result_table");

    var words = 'These are the coefficients for the variable you selected'

    svg2.append('text')
        .style('text-anchor', 'middle')
        .text(words)
        .attr("transform", function(d) { return "translate(135,10)";});
        }

function Vis(reference, data){

   var width = $(reference).width();
    var margin = {top:20, right:20, bottom: 40, left:20};
    var height = 300 - margin.top;
    var svg = d3.select("#Vis")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "result_graph")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // console.log("Data is loaded in Vis()");
    // console.log(width);
    // console.log(height);

    var fake_data  = [data.key];
    var fake_data_split = fake_data[0];
    fake_data_split = fake_data_split.match(/\w+([.*a-z0-9\-0-9+])*(\[.*?\])?/g);
    //fake_data_split = fake_data_split.split(/[\s,\n]+/);

    //console.log("fake_data_split in Vis:", fake_data_split);
    fake_data_split.splice(-2, 2);
    //console.log("fake_data_split in Vis after splice:", fake_data_split);

    var fake_data_split_json = [];

    for (var i = 0; i < (0.5*fake_data_split.length); i++) {
        fake_data_split_json.push({label:fake_data_split[2*i], value:fake_data_split[2*i+1]});
    }

    fake_data_split_json.forEach(function(d){
        d.value = +d.value;
    })

    //console.log("fake_data_split_json in Vis after splice for name:", fake_data_split_json);

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width-10], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var color = d3.scale.category20c();

        x.domain(fake_data_split_json.map(function(d) { return d.label; }));
        y.domain([0, d3.max(fake_data_split_json, function(d) { return d.value; })]);
        //y.domain([0, d3.max(fake_data_split_value, function(d) { return d; })]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        svg.selectAll(".bar")
        .data(fake_data_split_json)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.label); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand())
        .attr("fill", function(d, i) {
                //console.log(color(i))
                return color(i);
        });

        svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 3))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Regression Coefficients");
}


// d3.csv('../../globalterrorismdb_0617dist.csv', function (error, incidents) {


//   // function to create dynamic axis label
//   function updateAxis() {
//     var width = document.getElementById('axis-label').offsetWidth;
//     //console.log(width)

//     var svg = d3.select("#axis-label").append("svg")
//         .attr("width", width)
//         .attr("height",20)
//         .attr("id", "axis")
//         .append("g")
//         .attr("transform", "translate(" + 20 + "," + 0 + ")");

//     var x = d3.scale.linear()
//         .domain([1970, 2016])
//         .range([0, width-40]);

//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom")
//         .ticks(5)
//         .tickFormat(d3.format("d"))
//         .tickValues([1970,1975,1980,1985,1990,1995,2000,2005,2010,2016]);

//     svg.append("g")
//       .attr("class", "x axis")
//       .call(xAxis,);
//   }

//     // Create slider spanning the range from 0 to 10
//     var slider = createD3RangeSlider(1970, 2016, "#slider-container");
//     updateAxis();
//     var range_begin = 1970;
//     var range_end = 2016;

//     //console.log(range_begin, range_end)

//     function reformat(array) {
//         var data = [];
//         //console.log(array[1].latitude)
//         array.map(function (d, i) {
//             //console.log(d.longitude,i)
//             //console.log(+d.iyear)
//             //console.log("running")
//             if (+d.iyear >= range_begin && +d.iyear <= range_end){
//             data.push({
//                 id: i,
//                 type: "Feature",
//                 geometry: {
//                     coordinates: [+d.longitude, +d.latitude],
//                     type: "Point"
//                 }

//             })};
//         //console.log(data)
//         });
//         return data;
//     }
//     var geoData = { type: "FeatureCollection", features: reformat(incidents) };



//     var qtree = d3.geom.quadtree(geoData.features.map(function (data, i) {
//         return {
//             x: data.geometry.coordinates[0],
//             y: data.geometry.coordinates[1],
//             all: data
//         };}));


//     // Find the nodes within the specified rectangle.
//     function search(quadtree, x0, y0, x3, y3) {
//         var pts = [];
//         var subPixel = false;
//         var subPts = [];
//         var scale = getZoomScale();
//         console.log(" scale: " + scale);
//         var counter = 0;
//         quadtree.visit(function (node, x1, y1, x2, y2) {
//             var p = node.point;
//             var pwidth = node.width * scale;
//             var pheight = node.height * scale;

//             // -- if this is too small rectangle only count the branch and set opacity
//             if ((pwidth * pheight) <= 1) {
//                 // start collecting sub Pixel points
//                 subPixel = true;
//             }
//                 // -- jumped to super node large than 1 pixel
//             else {
//                 // end collecting sub Pixel points
//                 if (subPixel && subPts && subPts.length > 0) {

//                     subPts[0].group = subPts.length;
//                     pts.push(subPts[0]); // add only one todo calculate intensity
//                     counter += subPts.length - 1;
//                     subPts = [];
//                 }
//                 subPixel = false;
//             }

//             if ((p) && (p.x >= x0) && (p.x < x3) && (p.y >= y0) && (p.y < y3)) {

//                 if (subPixel) {
//                     subPts.push(p.all);
//                 }
//                 else {
//                     if (p.all.group) {
//                         delete (p.all.group);
//                     }
//                     pts.push(p.all);
//                 }

//             }
//             // if quad rect is outside of the search rect do nto search in sub nodes (returns true)
//             return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
//         });
//         console.log(" Number of removed  points: " + counter);
//         return pts;

//     }


//     function updateNodes(quadtree) {
//         var nodes = [];
//         quadtree.depth = 0; // root

//         quadtree.visit(function (node, x1, y1, x2, y2) {
//             var nodeRect = {
//                 left: MercatorXofLongitude(x1),
//                 right: MercatorXofLongitude(x2),
//                 bottom: MercatorYofLatitude(y1),
//                 top: MercatorYofLatitude(y2),
//             }
//             node.width = (nodeRect.right - nodeRect.left);
//             node.height = (nodeRect.top - nodeRect.bottom);

//             if (node.depth == 0) {
//                 console.log(" width: " + node.width + "height: " + node.height);
//             }
//             nodes.push(node);
//             for (var i = 0; i < 4; i++) {
//                 if (node.nodes[i]) node.nodes[i].depth = node.depth + 1;
//             }
//         });
//         return nodes;
//     }

//     //-------------------------------------------------------------------------------------
//     MercatorXofLongitude = function (lon) {
//         return lon * 20037508.34 / 180;
//     }

//     MercatorYofLatitude = function (lat) {
//         return (Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)) * 20037508.34 / 180;
//     }
//     var cscale = d3.scale.linear().domain([1, 3]).range(["#ff0000", "#ff6a00", "#ffd800", "#b6ff00", "#00ffff", "#0094ff"]);//"#00FF00","#FFA500"
//     var leafletMap = L.map('map').setView([26.8206, 30.8025], 3);

//     L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png").addTo(leafletMap);


//     var svg = d3.select(leafletMap.getPanes().overlayPane).append("svg");
//     var g = svg.append("g").attr("class", "leaflet-zoom-hide");


//     // Use Leaflet to implement a D3 geometric transformation.
//     function projectPoint(x, y) {
//         var point = leafletMap.latLngToLayerPoint(new L.LatLng(y, x));
//         this.stream.point(point.x, point.y);
//     }

//     var transform = d3.geo.transform({ point: projectPoint });
//     var path = d3.geo.path().projection(transform);


//     updateNodes(qtree);

//     leafletMap.on('moveend', mapmove);

//     mapmove();




//     function getZoomScale() {
//         var mapWidth = leafletMap.getSize().x;
//         var bounds = leafletMap.getBounds();
//         var planarWidth = MercatorXofLongitude(bounds.getEast()) - MercatorXofLongitude(bounds.getWest());
//         var zoomScale = mapWidth / planarWidth;
//         return zoomScale;

//     }

//     function redrawSubset(subset) {
//         path.pointRadius(3);// * scale);

//         var bounds = path.bounds({ type: "FeatureCollection", features: subset });
//         var topLeft = bounds[0];
//         var bottomRight = bounds[1];


//         svg.attr("width", bottomRight[0] - topLeft[0])
//           .attr("height", bottomRight[1] - topLeft[1])
//           .style("left", topLeft[0] + "px")
//           .style("top", topLeft[1] + "px");


//         g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

//         var start = new Date();


//         var points = g.selectAll("path")
//                       .data(subset, function (d) {
//                           return d.id;
//                       });
//         points.enter().append("path");
//         points.exit().remove();
//         points.attr("d", path);

//         points.style("fill-opacity", function (d) {
//             if (d.group) {
//                 return (d.group * 0.1) + 0.2;
//             }
//         });


//         console.log("updated at  " + new Date().setTime(new Date().getTime() - start.getTime()) + " ms ");

//     }
//     function mapmove(e) {
//         var mapBounds = leafletMap.getBounds();
//         var subset = search(qtree, mapBounds.getWest(), mapBounds.getSouth(), mapBounds.getEast(), mapBounds.getNorth());
//         console.log("subset: " + subset.length);

//         redrawSubset(subset);

//     }

//     // Listener gets added
//     slider.onChange(function(newRange){
//         //console.log(newRange, newRange.begin, newRange.end);
//         d3.select("#range-label").html("You selected year range: " + newRange.begin + " &mdash; " + newRange.end);
//         range_begin = newRange.begin;
//         range_end = newRange.end;

//         geoData = { type: "FeatureCollection", features: reformat(incidents) };
//         qtree = d3.geom.quadtree(geoData.features.map(function (data, i) {
//         return {
//             x: data.geometry.coordinates[0],
//             y: data.geometry.coordinates[1],
//             all: data
//         };}));

//         updateNodes(qtree);

//         mapBounds = leafletMap.getBounds();
//         subset = search(qtree, mapBounds.getWest(), mapBounds.getSouth(), mapBounds.getEast(), mapBounds.getNorth());

//         mapmove();
//         //console.log(range_begin, range_end)
//     });
//     slider.range(1970,2016);

//     // window listener to adjust the axis size
//     window.addEventListener("resize", function () {
//         d3.select("#axis").remove()
//         updateAxis();
//     });

// });
