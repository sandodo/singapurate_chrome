
/**
 * SingapuRate namespace.
 */

var XULSingapuRateChrome = 
{
    init: function()
    {
	    SingapuRateUtilities.init(); 
	    SingapuRatePrefs.init();  
	    SingapuRateWebService.init();
	    SingapuRateWebsiteRatings.init(); 
    },
    
    checkLocation: function(aTab, location)
    {
        if(SingapuRateWebsiteRatings.isBlackList(aTab, location))
        {
            return true;
        }
        
        return false;
		
    },
	
    SingapuRateMain: function(aTab)
    {
	    try
	    {
            //get the url from urlbar
            var sUrlAddress = aTab.url;
            if(sUrlAddress == "")
            	return;

			if(sUrlAddress.indexOf("chrome-extension:") == 0
					|| sUrlAddress.indexOf("chrome:") == 0
					|| sUrlAddress.indexOf("about:") == 0 )
			{
				//this is a local url internal to firefox.
				if(sUrlAddress.indexOf(SingapuRateUtilities.SingapuRateLocalBlockedHtml) != -1)
				{
					//now update the variables in the blocked html
					var resArray = sUrlAddress.split("?");
					if(resArray.length != 2)
					{
						//something wrong, use default block
				        chrome.tabs.update(aTab.id, {
                       		url: SingapuRateBlkDftPage
                   		});
						
						return;
					}
					var paramItems = resArray[1].split("&");
					var minAge = 21;
					var category = "R21";
					var voteId = -1;
					var ctgryId = -1;
					var urlPath = "#";
					for(var i = 0; i < paramItems.length; i++)
					{
						var paramKeyValue = paramItems[i].split("=");
						if(paramKeyValue.length != 2)
						{
							continue;
						}
						if(paramKeyValue[0] == SingapuRateUtilities.SingapuRateParamNameUrl)
						{
							urlPath = paramKeyValue[1];
						}
						else if(paramKeyValue[0] == SingapuRateUtilities.SingapuRateParamNameCategoryName)
						{
							category = paramKeyValue[1];
						}
						else if(paramKeyValue[0] == SingapuRateUtilities.SingapuRateParamNameCategoryId)
						{
							ctgryId = paramKeyValue[1];
						}
						else if(paramKeyValue[0] == SingapuRateUtilities.SingapuRateParamNameVoteId)
						{
							voteId = paramKeyValue[1];
						}
						else if(paramKeyValue[0] == SingapuRateUtilities.SingapuRateParamNameMinAge)
						{
							minAge = paramKeyValue[1];
						}
					}
					document.getElementById("srWebsiteDomain").textContent = urlPath;
					document.getElementById("srWebsiteRating").textContent = category;
		
					var sVoteOrViewSite = "";
					var sVoteOpinionUrl = "";
					var sWebsiteRatingDescr = "";
					    
					if(category == "G")
					{
						sWebsiteRatingDescr = "SingapuRate.RatingGMsg";
					}
					else if(category == "PG")
					{
						sWebsiteRatingDescr = "SingapuRate.RatingPGMsg";
					}
				    else if(category == "PG13")
				    {
					    sWebsiteRatingDescr = "SingapuRate.RatingPG13Msg";
				    }
				    else if(category == "NC16")
				    {
					    sWebsiteRatingDescr = "SingapuRate.RatingNC16Msg";
				    }
				    else if(category == "M18")
				    {
					    sWebsiteRatingDescr = "SingapuRate.RatingM18Msg";
				    }
				    else if(category == "R21")
				    {
					    sWebsiteRatingDescr = "SingapuRate.RatingR21Msg";
				    }
				    else if(category == "BL")
				    {
					    sWebsiteRatingDescr = "SingapuRate.RatingBLMsg";
				    }
		
				    //check by vote id				    
					if(voteId > 0)
					{
						sVoteOpinionUrl = "http://" + SingapuRateUtilities.SingapuRateDomainName + "/viewdetails.php?p=" + voteId + "#p" + voteId;
		    			sVoteOrViewSite = "SingapuRate.checkYourVoteText";
					}
					else
					{
						sVoteOpinionUrl = "http://" + SingapuRateUtilities.SingapuRateDomainName + "/posting.php?" + SingapuRateUtilities.SingapuRateParamNameUrl + "=" + urlPath;
						if(ctgryId > 0)
							sVoteOpinionUrl = sVoteOpinionUrl + "&" + SingapuRateUtilities.SingapuRateParamNameCategoryId + "=" + ctgryId;
			    		sVoteOrViewSite = "SingapuRate.voteYourOpinionText";
					}
					document.getElementById("srVoteOpinionLink").setAttribute("href", sVoteOpinionUrl);
					document.getElementById("srVoteOrViewSite").textContent = sVoteOrViewSite;
					document.getElementById("srWebsiteRatingDescr").textContent = sWebsiteRatingDescr;
							
				}
				//this is a local url internal to firefox.
				else if(sUrlAddress.indexOf(SingapuRateUtilities.SingapuRateLocalSuspendedHtml) != -1)
				{
					//now update the variables in the blocked html
					var resArray = sUrlAddress.split( SingapuRateUtilities.SingapuRateParamNameUrl + "=");
					if(resArray.length != 2)
					{
						//something wrong, use default block
				        chrome.tabs.update(aTab.id, {
                       		url: SingapuRateBlkDftPage
                   		});
						return;
					}
					var urlPath = resArray[1];
						
					if( urlPath.indexOf("http:") == -1
						&& urlPath.indexOf("https:") == -1
						&& urlPath.indexOf("ftp:") == -1
						&& urlPath.indexOf("ftps:") == -1)
					{
						urlPath = "http://" + urlPath;
					}
							
					document.getElementById("srWebsiteDomain").textContent = urlPath;
					document.getElementById("srVoteOpinionLink").setAttribute("href", urlPath);
						
				}
					
				return;
			}
					
			if( SingapuRateUtilities.isSingapurateDomain(sUrlAddress) === true )
			{
				//certified singapurate urls always
				return;
			}
					            
	    	var sOnlyDomainName = SingapuRateUtilities.getOnlyDomainName(sUrlAddress, SingapuRateUtilities.SingapuRateDomainCheckDepth);
            if(sOnlyDomainName == "")
            	return;
	            	
			var minAge = 21;
			var category = "R21";
			var voteId = -1;
			var ctgryId = -1;
			var retResults = SingapuRateWebsiteRatings.isBlockedInCache(sOnlyDomainName);
			if(retResults[SingapuRateUtilities.SingapuRateParamNameSiteBlocked] === false)
			{
				//allow the site
				if( retResults[SingapuRateUtilities.SingapuRateParamNameCategoryId] > 0 )
				{
					//found the cache
					category 		= retResults[SingapuRateUtilities.SingapuRateParamNameCategoryName];
					ctgryId 		= retResults[SingapuRateUtilities.SingapuRateParamNameCategoryId];
					voteId			= retResults[SingapuRateUtilities.SingapuRateParamNameVoteId];
					minAge			= retResults[SingapuRateUtilities.SingapuRateParamNameMinAge];
				}
				else
				{
					//allowed because not in cache, now send web service request
					XULSingapuRateChrome.checkLocation(aTab, sOnlyDomainName);
				}
				return;
			}
			else
			{
				//block the site
				if( retResults[SingapuRateUtilities.SingapuRateParamNameCategoryId] > 0 )
				{
					//found the cache
					category 		= retResults[SingapuRateUtilities.SingapuRateParamNameCategoryName];
					ctgryId 		= retResults[SingapuRateUtilities.SingapuRateParamNameCategoryId];
					voteId			= retResults[SingapuRateUtilities.SingapuRateParamNameVoteId];
					minAge			= retResults[SingapuRateUtilities.SingapuRateParamNameMinAge];
						
					//display another page?
					var blockURL = SingapuRateBlockedPage + "?" + SingapuRateUtilities.SingapuRateParamNameUrl + "=" + sOnlyDomainName 
										+ "&" + SingapuRateUtilities.SingapuRateParamNameCategoryName + "=" + category 
										+ "&" + SingapuRateUtilities.SingapuRateParamNameCategoryId + "=" + ctgryId
										+ "&" + SingapuRateUtilities.SingapuRateParamNameVoteId + "=" + voteId
										+ "&" + SingapuRateUtilities.SingapuRateParamNameMinAge + "=" + minAge;
			        chrome.tabs.update(aTab.id, {
                      		url: blockURL
               		});
						
					return;
				}
				else
				{
					//blocked but without any information, happens if user is not logged in
			        chrome.tabs.update(aTab.id, {
                   		url: SingapuRateBlkDftPage
               		});
               		return;
				}
			}
        }
        catch(e)
        {
	        //caught an exception
        }
		return;
    },
    
};




// Setting up the content listener

window.addEventListener("load",function(){
  XULSingapuRateChrome.init();  
},false);


window.setInterval(function() {
  chrome.tabs.getSelected(null,function(tab){
	XULSingapuRateChrome.SingapuRateMain(tab);  
  });
},1000);
