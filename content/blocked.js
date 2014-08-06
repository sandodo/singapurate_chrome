
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

  	var minAge = 21;
  	var category = "R21";
  	var voteId = -1;
	var ctgryId = -1;
	var urlPath = "#";
	urlPath = getQueryVariable(SingapuRateUtilities.SingapuRateParamNameUrl); 
	category = getQueryVariable(SingapuRateUtilities.SingapuRateParamNameCategoryName); 
	ctgryId = getQueryVariable(SingapuRateUtilities.SingapuRateParamNameCategoryId); 
	voteId = getQueryVariable(SingapuRateUtilities.SingapuRateParamNameVoteId); 
	minAge = getQueryVariable(SingapuRateUtilities.SingapuRateParamNameMinAge); 
			
	document.getElementById("srWebsiteDomain").textContent = urlPath;
	document.getElementById("srWebsiteRating").textContent = category;
		
	var sVoteOrViewSite = "";
	var sVoteOpinionUrl = "";
	var sWebsiteRatingDescr = "";
					    
	if(category == "G")
	{
		sWebsiteRatingDescr = chrome.i18n.getMessage("SingapuRate_RatingGMsg");
	}
	else if(category == "PG")
	{
		sWebsiteRatingDescr = chrome.i18n.getMessage("SingapuRate_RatingPGMsg");
	}
	else if(category == "PG13")
	{
	    sWebsiteRatingDescr = chrome.i18n.getMessage("SingapuRate_RatingPG13Msg");
	}
	else if(category == "NC16")
	{
		sWebsiteRatingDescr = chrome.i18n.getMessage("SingapuRate_RatingNC16Msg");
	}
	else if(category == "M18")
	{
		sWebsiteRatingDescr = chrome.i18n.getMessage("SingapuRate_RatingM18Msg");
	}
	else if(category == "R21")
	{
		sWebsiteRatingDescr = chrome.i18n.getMessage("SingapuRate_RatingR21Msg");
	}
	else if(category == "BL")
	{
		sWebsiteRatingDescr = chrome.i18n.getMessage("SingapuRate_RatingBLMsg");
	}
		
	//check by vote id				    
	if(voteId > 0)
	{
		sVoteOpinionUrl = "http://" + SingapuRateUtilities.SingapuRateDomainName + "/viewdetails.php?p=" + voteId + "#p" + voteId;
		sVoteOrViewSite = chrome.i18n.getMessage("SingapuRate_checkYourVoteText");
	}
	else
	{
		sVoteOpinionUrl = "http://" + SingapuRateUtilities.SingapuRateDomainName + "/posting.php?" + SingapuRateUtilities.SingapuRateParamNameUrl + "=" + urlPath;
		if(ctgryId > 0)
			sVoteOpinionUrl = sVoteOpinionUrl + "&" + SingapuRateUtilities.SingapuRateParamNameCategoryId + "=" + ctgryId;
		sVoteOrViewSite = chrome.i18n.getMessage("SingapuRate_voteYourOpinionText");
	}
	document.getElementById("srVoteOpinionLink").setAttribute("href", sVoteOpinionUrl);
	document.getElementById("srVoteOrViewSite").textContent = sVoteOrViewSite;
	document.getElementById("srWebsiteRatingDescr").textContent = sWebsiteRatingDescr;
					    

});
