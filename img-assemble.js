window.IMAGE_DATA=window.IMAGE_DATA||{};
(function(){
  var d=IMAGE_DATA,c=window._IC||{};
  ["beginnerIdle","beginnerGood","beginnerBad","proIdle","proIdlePlus","proBad","milestone10","milestone20","milestone30","endingPerfect"].forEach(function(k){
    if(c[k+"a"]&&c[k+"b"]) d[k]="data:image/jpeg;base64,"+c[k+"a"]+c[k+"b"];
  });
})();
