import * as d3 from 'd3';

let width = 1000;
let height = 600;
let padding = 60;

let svg = d3.select("#barchart").append("svg")
							.attr("width", width)
							.attr("height", height+100);


svg.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", width)
	.attr("height", height+100)
	.attr("fill", "white");

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", drawBarChart);

function drawBarChart(dataJSON){
	let data = dataJSON.data;
	let dateParse = d3.timeParse("%Y-%m-%d");
	let dateFormat = d3.timeFormat("%Y - %B");
	let startDate = dateParse(data[0][0]);
	let endDate = dateParse(data[data.length-1][0]);
	let fillColor = "rgba(0,0,0,1)";
	let strokeColor = "rgba(255,0,0,1)";
	

	let xScale = d3.scaleTime()
					.domain([startDate,endDate])
					.nice()
					.range([padding+15,width-padding]);

	let yScale = d3.scaleLinear()
					.domain([0,d3.max(data, d=>d[1])])
					.nice()
					.range([height-padding,padding]);

	let xAxis = d3.axisBottom()
					.scale(xScale)					
					.ticks(d3.timeYear.every(5));

	let yAxis = d3.axisLeft()
					.scale(yScale);

	let bars = svg.selectAll("rect")
					.data(data);

	bars.enter()
		.append("rect")
		.attr("class", "bars")
		.attr("x", d=>xScale(dateParse(d[0])))
		.attr("y", d=>yScale(d[1]))
		.attr("width",width/data.length )
		.attr("height", d=>height - yScale(d[1]) - padding )
		.attr("fill",fillColor)
		.attr("stroke",strokeColor)
		.on('mouseover', function(d,i){
			let xPos = +d3.select(this).attr("x") + 15;
			let yPos = i<123 ? 512 : d3.select(this).attr("y") + "px";

			d3.select("#tooltip")
				.classed("hidden", false);

				if(i>250){
				xPos -= d3.select("#tooltip").node().getBoundingClientRect().width + 15;
			}

			d3.select("#tooltip")
				.style("top", yPos)
				.style("left", xPos  + "px");

			d3.select("#amount")
				.text(`${d3.format("$.2f")(d[1])} Billions`);

			d3.select("#date")
				.text(dateFormat(dateParse(d[0])));				
		})
		.on('mouseout', function(){
			d3.select("#tooltip")
				.classed("hidden",true);
		});

	svg.append("g")
		.attr("transform", `translate(0,${height-padding})`)
		.attr("class","axis")
		.call(xAxis);

	svg.append("g")
		.attr("transform", `translate(${padding + 15})`)
		.attr("class","axis")
		.call(yAxis);

	d3.select("#description")
		.text(dataJSON.description)
		.style("font-size", "0.8em")		
		.style("top", `${height-20}px`)
		.style("left", "100px")
		.style("width", `${width - width/4}px`)
		.style("text-align", "center");
		
	svg.append("text")
		.text("Gross Domestic Product, USA")		
		.attr("transform", "translate(100,260) rotate(270)");

	svg.append("text")
		.text("Gross Domestic Product")		
		.attr("font-size", "3.2em")
		.attr("transform", function(){
			let titleWidth = d3.select(this).node().getBBox().width;			
			let x = width/2 - titleWidth/2;
			return `translate(${x},50)`;
		});
}