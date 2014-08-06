
function getQueryVariable(variable) 
{
	var query = window.location.search.substring(1);
  	var vars = query.split("&");
  	for (var i=0;i<vars.length;i++) {
    	var pair = vars[i].split("=");
    	if (pair[0] == variable) {
      		return pair[1];
    	}
  	} 
  	return "";
}	

document.addEventListener('DOMContentLoaded', function () {

	var urlPath = getQueryVariable(SingapuRateUtilities.SingapuRateParamNameUrl); 
						
	if( urlPath.indexOf("http:") == -1
		&& urlPath.indexOf("https:") == -1
		&& urlPath.indexOf("ftp:") == -1
		&& urlPath.indexOf("ftps:") == -1)
	{
		urlPath = "http://" + urlPath;
	}
							
	document.getElementById("srWebsiteDomain").textContent = urlPath;
	document.getElementById("srVoteOpinionLink").setAttribute("href", urlPath);

});
