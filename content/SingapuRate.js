
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
			var strKeyCurDomainUrlIdx 	= SingapuRateUtilities.SingapuRatePrefKeyCurDomainUrlIdx;	    
            localStorage[strKeyCurDomainUrlIdx] = -1;
			
            var sUrlAddress = aTab.url;
            if(sUrlAddress == "")
            	return;

            var sUrlAddressLowerCase = sUrlAddress.toLowerCase();	
			if(sUrlAddressLowerCase.indexOf("chrome://extensions") == 0)
			{
				//let us check whether we should apply super safe mode
				if( localStorage[ SingapuRateUtilities.SingapuRatePrefKeySuperSafeMode ] == "yes" )
				{
		        	chrome.tabs.update(aTab.id, {
                    	url: SingapuRateSuperSafePage
                   	});
				}
				chrome.browserAction.setIcon({path: "skin/icon19.png"}, function() {});
				return;
			}            	
			else if(sUrlAddressLowerCase.indexOf("chrome-extension:") == 0
					|| sUrlAddressLowerCase.indexOf("chrome:") == 0
					|| sUrlAddressLowerCase.indexOf("about:") == 0
					|| sUrlAddressLowerCase.indexOf("view-source:") == 0 )
			{
				chrome.browserAction.setIcon({path: "skin/icon19.png"}, function() {});
				return;
			}
					
			if( SingapuRateUtilities.isSingapurateDomain(sUrlAddress) === true )
			{
				//certified singapurate urls always
				chrome.browserAction.setIcon({path: "skin/icon19.png"}, function() {});
				return;
			}
					            
	    	var sOnlyDomainName = SingapuRateUtilities.getOnlyDomainName(sUrlAddress, SingapuRateUtilities.SingapuRateDomainCheckDepth);
            if(sOnlyDomainName == "")
            {
				chrome.browserAction.setIcon({path: "skin/icon19.png"}, function() {});
            	return;
        	}
            	    	
			var minAge = 21;
			var category = "R21";
			var voteId = -1;
			var ctgryId = -1;
			var retResults = SingapuRateWebsiteRatings.isBlockedInCache(sOnlyDomainName);
			localStorage[strKeyCurDomainUrlIdx] = retResults[strKeyCurDomainUrlIdx];
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
					
					//set page action
					chrome.browserAction.setIcon({path: "skin/Rating_" + category + ".png"}, function() {});
				}
				else
				{
					//allowed because not in cache, now send web service request
					chrome.browserAction.setIcon({path: "skin/icon19.png"}, function() {});
				}
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
				}
				else
				{
					//blocked but without any information, happens if user is not logged in
			        chrome.tabs.update(aTab.id, {
                   		url: SingapuRateBlkDftPage
               		});
				}
			}
			if(retResults[SingapuRateUtilities.SingapuRateParamNameNeedToQueryAgain] === true)
			{
				var strKeyCLLastActionTimeWI = SingapuRateUtilities.SingapuRatePrefKeyCLLastActionTime + retResults[strKeyCurDomainUrlIdx];
				//need to query sopa service to update the website information
				if( localStorage[strKeyCLLastActionTimeWI] > (Date.now() / 1000 - 600) )
				{
					//As it is still less than 10 minutes interval, donot query soap service for now.
				}
				else
				{
					localStorage[strKeyCLLastActionTimeWI] = Date.now() / 1000;
					XULSingapuRateChrome.checkLocation(aTab, sOnlyDomainName);
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
},500);
