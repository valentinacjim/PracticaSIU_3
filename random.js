var time 
time = setTimeout(function() {
    console.log("Hello World!")
    }
, 1000);

var time2 = setTimeout(function() {
    console.log("Hello World!")
    }
, 1000);
clearTimeout(time);

console.log(time);
console.log(time2.);