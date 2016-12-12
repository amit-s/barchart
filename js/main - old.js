import * as d3 from 'd3';


let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
xhr.send(null);

xhr.onload = function(){
	if(xhr.status === 200){
		let dataJSON = JSON.parse(xhr.responseText);		
		drawBarChart(dataJSON);
	}
}


function drawBarChart(dataJSON){
	let dataGDP = dataJSON.data;
	let width = 1000;
	let height = 500;
	let padding = 30;

	let xScale = d3.scaleBand()
					.domain(d3.range(dataGDP.length))
					.range([0,width]);					

	let yScale = d3.scaleLinear()
					.domain([0, d3.max(dataGDP, (d)=>d[1])])
					.range([height,0]);

	let xAxis = d3.axisBottom()
				  .scale(xScale);
				  


	let yAxis = d3.axisLeft()
				  .scale(yScale);				  

	let svg = d3.select("body").append("svg").attr("width",width).attr("height",height);	
	let bars = svg.selectAll("rect").data(dataGDP);

	bars.enter()
		.append("rect")
		.attr("x", (d,i)=>xScale(i))
		.attr("y", (d)=>yScale(d[1]))		
		.attr("width", xScale.bandwidth())
		.attr("height", (d,i)=>height - yScale(d[1]))		
		.attr("fill", "rgba(70,130,180,1)")
		.attr("stroke","rgba(70,130,180,1)")
		.on("mouseover", function(d,i){
			let xPos = parseFloat(d3.select(this).attr("x")) + 15;			
			let yPos = i<125 ? 455 : parseFloat(d3.select(this).attr("y")) + 20;

			if(i>238){
				xPos -= d3.select("#tooltip").node().getBoundingClientRect().width + 10;
			}			

			d3.select("#tooltip")
			  .style("left", xPos + "px")
			  .style("top", yPos + "px")
			  .classed("hidden", false);
			  

			d3.select("#amount")
			  .text(()=>{
			  	return `${d3.format("$.2f")(d[1])} Billion`;
			  });

			d3.select("#date")
			  .text(()=>{
			  	let parseTime = d3.timeParse("%Y-%m-%d");
			  	let dateObj = parseTime(d[0]);
			  	let formatDate = d3.timeFormat("%Y - %B");
			  	return formatDate(dateObj);
			  });
		});

	svg.append("g")		
		.attr("transform", `translate(0,${height-padding})`)
		.call(xAxis);
}

