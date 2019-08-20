
d3.json("assets/data.json")
.then(function(data) {
  var parseTime = d3.timeParse("%m/%d/%y %I:%M");
  var t = d3.transition().duration(750)
    .ease(d3.easeLinear);
  let dataType = 'weekly';

  data.hourly.forEach(d=> {
    d.date = parseTime(d.Date);
  })
  data.weekly.forEach(d=> {
    d.date = parseTime(d.Date);
  })
  data.daily.forEach(d=> {
    d.date = parseTime(d.Date);
  })

  console.log(data);

  let distMin = d3.min(data[dataType],d=>d.Distance);
  let distMax = d3.max(data[dataType],d=>d.Distance);
  let tripsMin = d3.min(data[dataType],d=>d.Count);
  let tripsMax = d3.max(data[dataType],d=>d.Count);
  let timeMin = d3.min(data[dataType],d=>d.date);
  let timeMax = d3.max(data[dataType],d=>d.date);

  const start_input = document.getElementById('start-date');
  const end_input   = document.getElementById('end-date');
  start_input.addEventListener('change',handleStartInputChange);
  end_input.addEventListener('change',handleEndInputChange);
  var sliderRange = d3
    .sliderBottom()
    .min(timeMin)
    .max(timeMax)
    .tickFormat(d3.timeFormat("%m/%d/%y"))
    .default([d3.min(data[dataType],d=>d.date), d3.max(data[dataType],d=>d.date)])
    .fill('#008BBF')
    .on('onchange', val => {
      handleSliderChange(val);
    });

  init();
  window.addEventListener('resize',resize);

  function init() {
    render();
    resize();
    input();
    slider();
    d3.selectAll('button').on('click',handleClick);
    // sliderRange.value([new Date('August 15, 2016'),new Date('August 16, 2016')]);
  }

  function render() {
    const distSvg = d3.select('#distance').append('svg').attr('id','distance-svg');
    const distG =   distSvg.append('g').attr('id','distance-g');
    const distXAxis = distG.append('g').attr('class','x-axis');
    const distYAxis = distG.append('g').attr('class','y-axis');
    const distLine = distG.append('path').attr('id','distance-line').attr('class','line').datum(data[dataType]);
    const distHoverG = distG.append('g').attr('id','dist-hover-g').attr('class','hover-g');
    distHoverG.append('circle').attr('class','hover-circle').attr('id','dist-hover-circle');


    const tripsSvg = d3.select('#trips').append('svg').attr('id','trips-svg');
    const tripsG =    tripsSvg.append('g').attr('id','trips-g');
    const tripsXAxis = tripsG.append('g').attr('class','x-axis');
    const tripsYAxis = tripsG.append('g').attr('class','y-axis');
    const tripsLine = tripsG.append('path').attr('id','trips-line').attr('class','line').datum(data[dataType]);
    const tripsHoverG = tripsG.append('g').attr('id','trips-hover-g').attr('class','hover-g');
    tripsHoverG.append('circle').attr('class','hover-circle').attr('id','trips-hover-circle');

    renderHoverRects(data[dataType]);

  }

  function renderHoverRects(data) {
    // console.log(data);
    d3.select('g#dist-hover-g').selectAll('rect').data(data).enter().append('rect').attr('class','dist-hover-rect hover-rect');
    d3.select('g#trips-hover-g').selectAll('rect').data(data).enter().append('rect').attr('class','trips-hover-rect hover-rect');
  }

  function removeHoverRects() {
    d3.selectAll('rect.hover-rect').remove();
  }

  function resize() {
    // console.log(timeMin,timeMax);

    // let bcr = d3.select("#container").node().getBoundingClientRect();
    let distancebcr = d3.select('#distance').node().getBoundingClientRect();
    let baseheight;
    if (screen.width > 800) {
      baseHeight = 650;
      sliderRange.width(250).ticks(2);
    } else {
      baseHeight = screen.height * 0.3;
      sliderRange.width(screen.width * 0.29).ticks(0);
      d3.select('div#slider').select('svg').attr('width',screen.width*0.5)
    }
    let margin = {top:20,left:0,right:80,bottom:20};
    let height = baseHeight - margin.top - margin.bottom;
    let width = distancebcr.width - margin.left - margin.right;
    // console.log(width,distancebcr.width)

    d3.select("#distance-svg").attr("width",width+margin.left+margin.right) // update svg height and width
       .attr("height",height+margin.top+margin.bottom);
    d3.select("#distance-g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#trips-svg").attr("width",width+margin.left+margin.right) // update svg height and width
       .attr("height",height+margin.top+margin.bottom);
    d3.select("#trips-g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let distYScale = d3.scaleLinear().domain([distMin,distMax]).range([height,0]);
    let tripsYScale = d3.scaleLinear().domain([tripsMin,tripsMax]).range([height,0]);
    let xScale = d3.scaleLinear().domain([timeMin,timeMax]).range([0,width]);

    // console.log(xScale(timeMin),xScale(timeMax));
    let tripsLine = d3.line().x(d=>xScale(d.date)).y(d=>tripsYScale(d.Count)).curve(d3.curveStep);
    let distLine = d3.line().x(d=>xScale(d.date)).y(d=>distYScale(d.Distance)).curve(d3.curveStep);

    let paths = d3.select('#distance').select('svg').selectAll('path');

    let xAxis = d3.axisBottom(xScale)
                  .ticks(2)
                  .tickFormat(d3.timeFormat("%m/%d/%y"));

    let distAxis = d3.axisRight(distYScale).tickFormat(d3.format(".2s")).tickSize(-width);
    let tripAxis = d3.axisRight(tripsYScale).tickSize(-width);

    d3.select('path#distance-line').transition(750).attr('d',distLine);
    d3.select('path#trips-line').transition(750).attr('d',tripsLine);
    d3.select('#trips-svg').select('g.x-axis').attr('transform','translate(0,'+height+')').call(xAxis).select(".domain").remove();
    d3.select('#distance-svg').select('g.x-axis').attr('transform','translate(0,'+height+')').call(xAxis).select(".domain").remove();
    d3.select('#trips-svg').select('g.y-axis').attr('transform','translate('+width+',0)').call(tripAxis).select(".domain").remove();
    d3.select('#distance-svg').select('g.y-axis').attr('transform','translate('+width+',0)').call(distAxis).select(".domain").remove();

    d3.selectAll('circle.hover-circle').attr('r',6);

    d3.selectAll('rect.trips-hover-rect')
      .attr('x',(d,i)=>(width/d3.select('path#trips-line').datum().length)*i)
      .attr('y',0)
      .attr('width',width/d3.select('path#trips-line').datum().length)
      .attr('height',height)
      .on('mouseenter', function() {
            d3.select("#tooltip").style('display', 'inline');
            d3.selectAll(".hover-circle").style('display', 'inline');
          })
          .on('mouseleave', function() {
            d3.select("#tooltip").style('display', 'none');
            d3.selectAll(".hover-circle").style('display', 'none');
          })
      .on('mousemove',handleHover)
      .on('touchmove',handleHover);

    d3.selectAll('rect.dist-hover-rect')
      .attr('x',(d,i)=>(width/d3.select('path#distance-line').datum().length)*i)
      .attr('y',0)
      .attr('width',width/d3.select('path#distance-line').datum().length)
      .attr('height',height)
      .on('mouseenter', function() {
            d3.select("#tooltip").style('display', 'inline');
            d3.selectAll(".hover-circle").style('display', 'inline');
          })
          .on('mouseleave', function() {
            d3.select("#tooltip").style('display', 'none');
            d3.selectAll(".hover-circle").style('display', 'none');
          })
      .on('mousemove',handleHover);

    function handleHover() {
      let xPos = d3.select(this).attr('x');
      let tooltip = d3.select('#tooltip');
      let tooltipHTML = '';

      // console.log(new Date(xScale.invert(xPos)));
      let tripsData = d3.select('path#trips-line').datum();
      // console.log(tripsData);
      for (let i=0;i<tripsData.length;i++) {
        if (tripsData[i].date >= new Date(xScale.invert(xPos))) {
          d3.select('circle#trips-hover-circle')
            .attr('cx',xScale(tripsData[i].date))
            .attr('cy',tripsYScale(tripsData[i].Count))

          d3.select('circle#dist-hover-circle')
            .attr('cx',xScale(tripsData[i].date))
            .attr('cy',distYScale(tripsData[i].Distance))


          tooltipHTML += `<h1>`+tripsData[i].Date+`</h1>`
          tooltipHTML += `<table><tr><th>Trips</th><th>Distance (mi.)</th></tr>`
          tooltipHTML += `<tr><td>`+d3.format(",")(tripsData[i].Count)+`</td><td>`+d3.format(".2s")(tripsData[i].Distance)+`</td></tr></table>`
          tooltip.html(tooltipHTML);
          // console.log(tripsData[i]);
          break;
        }
      }

      let bcr = d3.select("#container").node().getBoundingClientRect();
      let halfWay = (bcr.right - bcr.left) * (0.5);
      let halfWayVert = (bcr.bottom - bcr.top) * (0.5);
      let tooltipX = 0;
      let tooltipY = 0;
      if (d3.event.layerX/(bcr.right - bcr.left) > 0.40 && d3.event.layerX/(bcr.right - bcr.left) < 0.65) {
        let ttcbr = tooltip.node().getBoundingClientRect();
        let ttWidth = ttcbr.width;
        tooltipX += d3.event.layerX-(ttWidth/2)
      } else if (d3.event.layerX > halfWay) {
        let ttcbr = tooltip.node().getBoundingClientRect();
        let ttWidth = ttcbr.width;
        tooltipX += d3.event.layerX+14-ttWidth
      } else {
        tooltipX += d3.event.layerX+14
      }
      if (d3.event.layerY > halfWayVert) {
        let ttcbr = tooltip.node().getBoundingClientRect();
        let ttHeight = ttcbr.height;
        tooltipY += d3.event.layerY-24-ttHeight
      } else {
        tooltipY += d3.event.layerY+24
      }
      // tooltip - move to mouse position
      tooltip.style("left",(tooltipX)+"px")
             .style("top",(tooltipY)+"px")
    }

  }



  function handleClick() {
    d3.selectAll("button.granularity").classed("active",false);
    d3.select(this).classed("active",true);
    let thisDataType = d3.select(this).attr('id');
    dataType = thisDataType;
    let maxMins = getMaxMins(timeMin,timeMax);
    let newData = maxMins[4];
    distMin  = maxMins[0];
    distMax  = maxMins[1];
    tripsMin = maxMins[2];
    tripsMax = maxMins[3];
    d3.select('path#distance-line').datum(newData);
    d3.select('path#trips-line').datum(newData);
    removeHoverRects();
    renderHoverRects(newData);
    resize();
  }

  function getMaxMins(timeMin,timeMax) {
    let maxMinData = []
    data[dataType].forEach(row => {
      row.date <= timeMax && row.date >= timeMin ? maxMinData.push(row) : maxMinData.push();
    });
    let distMin  = d3.min(maxMinData,d=>d.Distance);
    let distMax  = d3.max(maxMinData,d=>d.Distance);
    let tripsMin = d3.min(maxMinData,d=>d.Count);
    let tripsMax = d3.max(maxMinData,d=>d.Count);
    return [distMin,distMax,tripsMin,tripsMax,maxMinData];
  }

  function clearSlider() {
    var gRange = d3.select('div#date-slider').html('')
  }

  function slider() {
    var gRange = d3
    .select('div#slider')
    .append('svg')
    .attr('id','#slider-svg')
    .attr('width', 300)
    .attr('height', 75)
    .append('g')
    .attr('transform', 'translate(30,30)');

    gRange.call(sliderRange);
  }

  function input() {
    var start_day = ("0" + new Date(sliderRange.value()[0]).getDate()).slice(-2);
    var start_month = ("0" + (new Date(sliderRange.value()[0]).getMonth() + 1)).slice(-2);
    var end_day = ("0" + new Date(sliderRange.value()[1]).getDate()).slice(-2);
    var end_month = ("0" + (new Date(sliderRange.value()[1]).getMonth() + 1)).slice(-2);
    start_input.value = new Date(sliderRange.value()[0]).getFullYear() + '-' + start_month + '-' + start_day;
    end_input.value = new Date(sliderRange.value()[1]).getFullYear() + '-' + end_month + '-' + end_day;
  }

  function handleSliderChange(val) {
    timeMin = new Date(val[0]);
    timeMax = new Date(val[1]);
    let maxMins = getMaxMins(timeMin,timeMax);
    let newData = maxMins[4];
    distMin  = maxMins[0];
    distMax  = maxMins[1];
    tripsMin = maxMins[2];
    tripsMax = maxMins[3];
    d3.select('path#distance-line').datum(newData);
    d3.select('path#trips-line').datum(newData);
    input();
    removeHoverRects();
    renderHoverRects(newData);
    resize();
  }

  function handleStartInputChange() {
    timeMin = new Date(this.value);
    let maxMins = getMaxMins(timeMin,timeMax);
    let newData = maxMins[4];
    distMin  = maxMins[0];
    distMax  = maxMins[1];
    tripsMin = maxMins[2];
    tripsMax = maxMins[3];
    d3.select('path#distance-line').datum(newData);
    d3.select('path#trips-line').datum(newData);
    resize();
  }

  function handleEndInputChange() {
    timeMax = new Date(this.value);
    let maxMins = getMaxMins(timeMin,timeMax);
    let newData = maxMins[4];
    distMin  = maxMins[0];
    distMax  = maxMins[1];
    tripsMin = maxMins[2];
    tripsMax = maxMins[3];
    d3.select('path#distance-line').datum(newData);
    d3.select('path#trips-line').datum(newData);
    resize();
  }



})
.catch(function(error) {
  console.log(error);
});
