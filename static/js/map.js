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

