var NLP2 = (function(){

  return {
    getKeywords: function(str, callback) {
      $.get("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20contentanalysis.analyze%20where%20text='"+ encodeURIComponent(str.replace(/-/g, ' ').replace(/[…\.,-\/#!$%\^&\*;:{}=\-_`~()\d']/g, '')) +"'&format=json").done(function(result) {
        var keywords;

        if (result.query.results && 
          result.query.results.entities && 
          result.query.results.entities.entity) {

          keywords = "";
          if (result.query.results.entities.entity.length) {
            result.query.results.entities.entity.forEach(function(val, idx){
              if (val.text && val.text.content) {
                if (idx > 0) keywords = keywords + " ";
                keywords = keywords + val.text.content;
              }              
            });
          } else {
            if (result.query.results.entities.entity.text && result.query.results.entities.entity.text.content) {
                keywords = result.query.results.entities.entity.text.content;
              }
          }
          
        }

        callback(keywords);
      });
    }
  }

}());