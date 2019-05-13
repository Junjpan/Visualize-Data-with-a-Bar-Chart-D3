var dataSet;
req = new XMLHttpRequest(); // you aslo can use d3.json method to receive data.
req.open(
"GET",
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
true);

req.send();
req.onload = () => {
  var json = JSON.parse(req.responseText);
  dataSet = json.data;
  const length = json.data.length;
  //console.log(dataSet);
  const width = 800;
  const height = 400;


  const svg = d3.select("body").append("svg").
  attr("width", width + 70) //  transform svg(0,70)later which make it possible to put YAxis fit in the left side of SVG
  .attr("height", height + 100); //give a extra room for the xAxis
  svg.append('text').
  attr("x", 520).
  attr("y", 480).
  attr("id", "info").
  text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

  const group = svg.append("g").
  attr("transform", "translate(70,0)"); //so that we can have enough space to show yAxis
  const tooltip = d3.select("body").append("div").
  attr("class", "tooltip");


  var minDate = dataSet[0][0].substr(0, 4);
  minDate = new Date(minDate);
  var maxDate = dataSet[length - 1][0].substr(0, 4);
  maxDate = new Date(maxDate);

  var xScale = d3.time.scale() //aslo can use scaleTime for lower version
  .domain([minDate, maxDate]).
  range([0, width]); //the reason put between 10 and width-30 is that make sure it is not on the edge of rect
  var yScale = d3.scale.linear().
  domain([0, d3.max(dataSet, d => {
    return d[1];
  })]).
  range([height, 0]);
  //console.log(xScale(new Date("1950-04-01")),yScale(150));
  var xAxis = d3.svg.axis().
  ticks(length / 20).
  scale(xScale).
  orient("bottom");
  var yAxis = d3.svg.axis().
  scale(yScale).
  orient("left");



  function mouseOverHandle(d) {
    d3.select(this).
    style("opacity", 0.3);
    tooltip.transition();
    tooltip.style("left", d3.event.pageX + 10 + "px") //have to put tooltip before attr again, otherwise .html will not work.
    .style("top", d3.event.pageY + "px") // don't forget use px in the style,otherwise it will not work
    .html("<p>Date is:" + d[0] + "</p><p> Billios:" + d[1] + "</p>");

  }

  function mouseOutHandle(d) {
    d3.select(this).
    style("opacity", 1);
  }

  group.selectAll("rect").
  data(dataSet).
  enter().
  append("rect").
  attr("x", d => xScale(new Date(d[0]))).
  attr("y", d => yScale(d[1])).
  attr("width", width / length).
  attr("height", d => {return height - yScale(d[1]);}).
  attr("fill", "#00bfff").
  on("mouseover", mouseOverHandle).
  on("mouseout", mouseOutHandle);


  group.append("g").
  attr("transform", "translate(0," + height + ")").
  call(xAxis).
  selectAll("text").
  style("text-anchor", "end").
  attr("dx", "-0.25em").
  attr("dy", "1em") //adjust how close to the axis
  .attr("transform", "rotate(-60)");

  svg.append("g").
  attr("transform", "translate(70,0)").
  call(yAxis).
  selectAll("text").
  attr("dy", "0.7em");


  group.append("text").
  attr("x", -200).
  attr("y", 20).
  attr("transform", 'rotate(-90)').
  text("Gross Domestic Product").
  attr("fill", "white");

  ;
  console.log(svg);
  //axis is store inside the path DOM elemeent
};