
var SingapuRateMainWindow = window;

var SingapuRateUtilities = 
{
	// SingapuRate Modules 
	SingapuRateDomainName: "singapurate.com",
	SingapuRateWSNameSpace: "http://www.singapurate.com/soap/SingapuRateService",
	SingapuRateWSLocation: "http://www.singapurate.com/check/soapService.php",
	SingapuRateWSLoginMethod: "SingapuraLogin",
	SingapuRateWSRateMethod: "SingapuraRating",
	SingapuRateWSLoginSuccess: "3",
	SingapuRateExtensionName: "XULSingapuRateChrome",
	SingapuRatePrefKeyAcctName: "acctName",	
	SingapuRatePrefKeyBirthday: "birthday",
	SingapuRatePrefKeyAuthenticate: "authenticate",
	SingapuRatePrefKeyAthentCode: "authCode",
	SingapuRatePrefKeySuperSafeMode: "superSafeMode",	
	SingapuRatePrefKeyNumCaches: "numCaches",
	SingapuRateMaxNumCaches: 200,
	SingapuRateNumCachesMoveBack: 10,
	SingapuRateDomainCheckDepth: 2,
	SingapuRateLocalBlockedHtml: "blocked.html",
	SingapuRateLocalBlockedDefaultHtml: "default.html",
	SingapuRateLocalSuspendedHtml: "suspended.html",
	SingapuRateLocalSuperSafeHtml: "superSafe.html",

	SingapuRateParamNameUrl: "wrs_url",
	SingapuRateParamNameCategoryName: "wrs_cn",
	SingapuRateParamNameCategoryId: "wrs_rc",
	SingapuRateParamNameVoteId: "wrs_vi",
	SingapuRateParamNameMinAge: "wrs_minAge",
	SingapuRateParamNameSiteBlocked: "wrs_sb",
	SingapuRateParamNameNeedToQueryAgain: "wrs_ntqa",
	
	SingapuRatePrefKeyCurDomainUrlIdx: "curDomainUrlIdx",
	
	SingapuRatePrefKeyCacheList: "cacheList",
	SingapuRatePrefKeyCLTotalNumCaches: "CLTotalNumCaches",
	SingapuRatePrefKeyCLPrefKey: "CLPrefKey",
	SingapuRatePrefKeyCLDomains: "CLDomains",
	SingapuRatePrefKeyCLIdxToDomains: "CLIdxToDomains",
	SingapuRatePrefKeyCLCategories: "CLCategories",
	SingapuRatePrefKeyCLCtgryIds: "CLCtgryIds",
	SingapuRatePrefKeyCLMinAges: "CLMinAges",
	SingapuRatePrefKeyCLEntryDates: "CLEntryDates",
	SingapuRatePrefKeyCLVoteIds: "CLVoteIds",
	SingapuRatePrefKeyCLUsrMinAges: "CLUsrMinAges",
	SingapuRatePrefKeyCLLastActionTime: "CLLastActionTime",
		
    init: function()
    {
	    //do nothing now
    },

    getUserAge: function(sBirthday)
    {
		var acctAge = 0;
		
		if(!sBirthday || sBirthday === "")
			return acctAge;
		
		var resArray = sBirthday.split("-");
		if(resArray.length == 3)
		{
			//birthday is correct
			var birthDay = parseInt(resArray[0]);
			var birthMonth = parseInt(resArray[1]);
			var birthYear = parseInt(resArray[2]);
			
			if (birthYear > 0)
			{
				var today = new Date();
		
				var diff = today.getMonth() + 1 - birthMonth;
				if (diff == 0)
				{
					diff = (today.getDate() - birthDay < 0) ? 1 : 0;
				}
				else
				{
					diff = (diff < 0) ? 1 : 0;
				}
		
				acctAge = Math.max(0, (today.getFullYear() - birthYear - diff));
				
				//suppose a person cannot have age greater than 200 years old.
				if(acctAge > 200)
					acctAge = 0;
			}
								
		}
        return acctAge;
    },
    
	hex_sha256 : function (str)
	{
		return CryptoJS.MD5(str);
	},
    
	getOnlyDomainName : function (weburl, maxDepth)
	{
		//at least one depth - means domain name
		var iLocalMaxDepth = 1;
		if(maxDepth > iLocalMaxDepth)
		{
			iLocalMaxDepth = maxDepth;
		}
		else if(maxDepth <= 0)
		{
			//took the maximum possible depth
			iLocalMaxDepth = 100;
		}
	    var sOnlyDomainName = "";
	    var splitResults = weburl.split("//");
		for(var i=0; i < splitResults.length; i++) 
		{
			if(i > 1)
				break;		//split with "//" can have at most two valid parts

			var strTemp = splitResults[i].toLowerCase();	
			if(!strTemp
					|| strTemp == "" 
					|| strTemp.indexOf("http:") == 0
					|| strTemp.indexOf("https:") == 0
					|| strTemp.indexOf("ftp:") == 0
					|| strTemp.indexOf("ftps:") == 0)
			{
				continue;
			}
			if(strTemp.indexOf("chrome://") == 0)
			{
				return "";
			}
			//now check whether the domain is allowed
			var sTempUrlParts = strTemp.split("/");						
			for(var j = 0; j < sTempUrlParts.length; j++) 
			{
				if(j >= iLocalMaxDepth)
					break;
				
				if(sTempUrlParts[j] == "")
					continue;	
					
				var sTemp = sOnlyDomainName + "/" + sTempUrlParts[j];
				if( sTemp.length > 60 )
					break;	//split with "/" and we are only interested in first 60 characters
				if(j == 0)
				{
					if( sTempUrlParts[j].indexOf("&") >= 0 
							|| sTempUrlParts[j].indexOf("?") >= 0 
							|| sTempUrlParts[j].indexOf("=") >= 0 
							|| sTempUrlParts[j].indexOf("#") >= 0 )
					{
						break;
					}
					var sTmpDomainParts = sTempUrlParts[j].split(":");
					sOnlyDomainName = sTmpDomainParts[0];  //only took the first part
				}
				else
				{
					if( sTempUrlParts[j].indexOf(".") >= 0
							|| sTempUrlParts[j].indexOf("&") >= 0 
							|| sTempUrlParts[j].indexOf("?") >= 0 
							|| sTempUrlParts[j].indexOf("=") >= 0 
							|| sTempUrlParts[j].indexOf("#") >= 0)
					{
						//for other parts of url, should not have . inside.
						break;
					}
					sOnlyDomainName = sOnlyDomainName + "/" + sTempUrlParts[j];
				}
			}
		}
		if(sOnlyDomainName == "")
			return sOnlyDomainName;
			
		var tmpDomainParts = sOnlyDomainName.split(".");
		if(tmpDomainParts.length <= 2)
		{
			if(	tmpDomainParts.length == 1				//only has one part
					|| tmpDomainParts[0] == "www")   	//only has www, wrong domain url
				return "";
			//it is not started with www., add it
			sOnlyDomainName = "www." + sOnlyDomainName;
		}	
		return sOnlyDomainName;	
	},
	
    isSingapurateDomain: function(weburl)
    {
	    if(!weburl || weburl.length == 0)
	    	return false;

	    var sOnlyDomainName = SingapuRateUtilities.getOnlyDomainName(weburl, 1);
		if(sOnlyDomainName 
				&& sOnlyDomainName == "")
		{
			return false;
		}  
		if(sOnlyDomainName 
				&& sOnlyDomainName != ""
				&& sOnlyDomainName.length >= SingapuRateUtilities.SingapuRateDomainName.length
				&& sOnlyDomainName.toLowerCase().indexOf(SingapuRateUtilities.SingapuRateDomainName) >= 0 )
		{
			//is our own singapurate urls
			return true;
		}
		
		return false;
    },
	
    alertSimpleWndMsg: function(sMessage)
    {
	    var sAlertMsg = chrome.i18n.getMessage(sMessage);
		alert(sAlertMsg);
		return true;
    },

    alertFormatedWndMsg: function(sMessage, sVariables)
    {
	    var sAlertMsg = chrome.i18n.getMessage(sMessage, sVariables);
		alert(sAlertMsg);
		return true;
    },
    	
};

var SingapuRatePrefs = 
{
    init: function()
    {
	    var strKeyAuthenticate = SingapuRateUtilities.SingapuRatePrefKeyAuthenticate;
	    var strKeyAcctName = SingapuRateUtilities.SingapuRatePrefKeyAcctName;
	    var strKeyBirthday = SingapuRateUtilities.SingapuRatePrefKeyBirthday;
	    var strKeyAuthentCode = SingapuRateUtilities.SingapuRatePrefKeyAthentCode;
	    var strKeyCacheList = SingapuRateUtilities.SingapuRatePrefKeyCacheList;
	    
	    //load preferences, it is done automatically with localStorage variable
	    //reset its website information   
	    if(localStorage[strKeyCacheList] != 'true'
	    		&& localStorage[strKeyCacheList] !== true)
	    {
		    //flag to have iniy cache list
		    localStorage[strKeyCacheList] = 'true';
		    //set total number caches
		    localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches] = "4";
		    //counter zero-based
		    //first record
		    var lCntr = "0";
		    //Pref Key
		    var strKeyCLPrefKeyWI = SingapuRateUtilities.SingapuRatePrefKeyCLPrefKey + lCntr;
		    localStorage[strKeyCLPrefKeyWI] = "*";
		    //Domains
		    var strKeyCLDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLDomains + lCntr;
		    localStorage[strKeyCLDomainsWI] = lCntr;
		    //Idx
		    var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + lCntr;
		    localStorage[strKeyCLIdxToDomainsWI] = "www.singapurate.com";
		    //Ratings
		    var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + lCntr;
		    localStorage[strKeyCLCategoriesWI] = "G";
		    //Category Ids
		    var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + lCntr;
		    localStorage[strKeyCLCtgryIdsWI] = "1";
		    //Category Ids
		    var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + lCntr;
		    localStorage[strKeyCLMinAgesWI] = "0";
		    //Entry Date
		    var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + lCntr;
		    localStorage[strKeyCLEntryDatesWI] = "20140625";
		    //Vote Ids
		    var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + lCntr;
		    localStorage[strKeyCLVoteIdsWI] = "-1";
		    //User Min Ages
		    var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + lCntr;
		    localStorage[strKeyCLUsrMinAgesWI] = "-1";
		    //Last Action Time
			var strKeyCLLastActionTimeWI = SingapuRateUtilities.SingapuRatePrefKeyCLLastActionTime + lCntr;
			localStorage[strKeyCLLastActionTimeWI] = "0";

		    //second record
		    lCntr = "1";
		    //Pref Key
		    var strKeyCLPrefKeyWI = SingapuRateUtilities.SingapuRatePrefKeyCLPrefKey + lCntr;
		    localStorage[strKeyCLPrefKeyWI] = "*";
		    //Domains
		    var strKeyCLDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLDomains + lCntr;
		    localStorage[strKeyCLDomainsWI] = lCntr;
		    //Idx
		    var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + lCntr;
		    localStorage[strKeyCLIdxToDomainsWI] = "www.singapurate.com/community";
		    //Ratings
		    var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + lCntr;
		    localStorage[strKeyCLCategoriesWI] = "G";
		    //Category Ids
		    var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + lCntr;
		    localStorage[strKeyCLCtgryIdsWI] = "1";
		    //Category Ids
		    var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + lCntr;
		    localStorage[strKeyCLMinAgesWI] = "0";
		    //Entry Date
		    var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + lCntr;
		    localStorage[strKeyCLEntryDatesWI] = "20140625";
		    //Vote Ids
		    var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + lCntr;
		    localStorage[strKeyCLVoteIdsWI] = "-1";
		    //User Min Ages
		    var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + lCntr;
		    localStorage[strKeyCLUsrMinAgesWI] = "-1";
		    //Last Action Time
			var strKeyCLLastActionTimeWI = SingapuRateUtilities.SingapuRatePrefKeyCLLastActionTime + lCntr;
			localStorage[strKeyCLLastActionTimeWI] = "0";

		    //third record
		    lCntr = "2";
		    //Pref Key
		    var strKeyCLPrefKeyWI = SingapuRateUtilities.SingapuRatePrefKeyCLPrefKey + lCntr;
		    localStorage[strKeyCLPrefKeyWI] = "*";
		    //Domains
		    var strKeyCLDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLDomains + lCntr;
		    localStorage[strKeyCLDomainsWI] = lCntr;
		    //Idx
		    var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + lCntr;
		    localStorage[strKeyCLIdxToDomainsWI] = "www.google.com";
		    //Ratings
		    var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + lCntr;
		    localStorage[strKeyCLCategoriesWI] = "G";
		    //Category Ids
		    var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + lCntr;
		    localStorage[strKeyCLCtgryIdsWI] = "1";
		    //Category Ids
		    var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + lCntr;
		    localStorage[strKeyCLMinAgesWI] = "0";
		    //Entry Date
		    var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + lCntr;
		    localStorage[strKeyCLEntryDatesWI] = "20140625";
		    //Vote Ids
		    var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + lCntr;
		    localStorage[strKeyCLVoteIdsWI] = "-1";
		    //User Min Ages
		    var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + lCntr;
		    localStorage[strKeyCLUsrMinAgesWI] = "-1";
		    //Last Action Time
			var strKeyCLLastActionTimeWI = SingapuRateUtilities.SingapuRatePrefKeyCLLastActionTime + lCntr;
			localStorage[strKeyCLLastActionTimeWI] = "0";
		    		    		    
		    //forth record
		    lCntr = "3";
		    //Pref Key
		    var strKeyCLPrefKeyWI = SingapuRateUtilities.SingapuRatePrefKeyCLPrefKey + lCntr;
		    localStorage[strKeyCLPrefKeyWI] = "*";
		    //Domains
		    var strKeyCLDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLDomains + lCntr;
		    localStorage[strKeyCLDomainsWI] = lCntr;
		    //Idx
		    var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + lCntr;
		    localStorage[strKeyCLIdxToDomainsWI] = "www.google.com.sg";
		    //Ratings
		    var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + lCntr;
		    localStorage[strKeyCLCategoriesWI] = "G";
		    //Category Ids
		    var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + lCntr;
		    localStorage[strKeyCLCtgryIdsWI] = "1";
		    //Category Ids
		    var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + lCntr;
		    localStorage[strKeyCLMinAgesWI] = "0";
		    //Entry Date
		    var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + lCntr;
		    localStorage[strKeyCLEntryDatesWI] = "20140625";
		    //Vote Ids
		    var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + lCntr;
		    localStorage[strKeyCLVoteIdsWI] = "-1";
		    //User Min Ages
		    var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + lCntr;
		    localStorage[strKeyCLUsrMinAgesWI] = "-1";
		    //Last Action Time
			var strKeyCLLastActionTimeWI = SingapuRateUtilities.SingapuRatePrefKeyCLLastActionTime + lCntr;
			localStorage[strKeyCLLastActionTimeWI] = "0";
		    
		    //error record
		    var lCntr = "-1";
		    //Pref Key
		    var strKeyCLPrefKeyWI = SingapuRateUtilities.SingapuRatePrefKeyCLPrefKey + lCntr;
		    localStorage[strKeyCLPrefKeyWI] = "*";
		    //Domains
		    var strKeyCLDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLDomains + lCntr;
		    localStorage[strKeyCLDomainsWI] = lCntr;
		    //Idx
		    var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + lCntr;
		    localStorage[strKeyCLIdxToDomainsWI] = "UNKNOW";
		    //Ratings
		    var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + lCntr;
		    localStorage[strKeyCLCategoriesWI] = "G";
		    //Category Ids
		    var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + lCntr;
		    localStorage[strKeyCLCtgryIdsWI] = "1";
		    //Category Ids
		    var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + lCntr;
		    localStorage[strKeyCLMinAgesWI] = "0";
		    //Entry Date
		    var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + lCntr;
		    localStorage[strKeyCLEntryDatesWI] = "20140625";
		    //Vote Ids
		    var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + lCntr;
		    localStorage[strKeyCLVoteIdsWI] = "-1";
		    //User Min Ages
		    var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + lCntr;
		    localStorage[strKeyCLUsrMinAgesWI] = "-1";
		    //Last Action Time
			var strKeyCLLastActionTimeWI = SingapuRateUtilities.SingapuRatePrefKeyCLLastActionTime + lCntr;
			localStorage[strKeyCLLastActionTimeWI] = "0";
		    
	    }
	    
	    SingapuRatePrefs.readPrefs();
    },
	
    isDomainInCache: function(weburl)
    {
	    if(!weburl || weburl.length == 0)
	    	return -1;
	    
		if( SingapuRateUtilities.isSingapurateDomain(weburl) === true )
		{
			//certified singapurate urls always
			return -1;
		}
	    	
	    var sOnlyDomainName = SingapuRateUtilities.getOnlyDomainName(weburl, SingapuRateUtilities.SingapuRateDomainCheckDepth);	
		if(!sOnlyDomainName
				|| sOnlyDomainName == "")
			return -1;
		
		var iUrlIdx = -1;
			
		try
		{
			var strKeyCacheList = SingapuRateUtilities.SingapuRatePrefKeyCacheList;
		    if(localStorage[strKeyCacheList] == 'true'
	    		|| localStorage[strKeyCacheList] === true)
	    	{
		    	//we have the cache list inited properly
				//loop through the array
				var l_iCacheListLength = parseInt(localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches]);
				if( l_iCacheListLength > SingapuRateUtilities.SingapuRateMaxNumCaches )
					l_iCacheListLength = SingapuRateUtilities.SingapuRateMaxNumCaches;
				var l_iStartPos = (parseInt(localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches])) % SingapuRateUtilities.SingapuRateMaxNumCaches;
				l_iStartPos += SingapuRateUtilities.SingapuRateNumCachesMoveBack; //move further slots to list end to ensure previous cache can be better matched
				if( l_iStartPos >= l_iCacheListLength )			
				{
					l_iStartPos = l_iCacheListLength - 1;
				}
				for(var pIdx = l_iStartPos; pIdx > ( l_iStartPos + 1 - SingapuRateUtilities.SingapuRateMaxNumCaches); pIdx--)
				{
					var lipIdx = pIdx;
					if( lipIdx < 0 )
						lipIdx = lipIdx + SingapuRateUtilities.SingapuRateMaxNumCaches;
						
				    //Domains
				    var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + lipIdx;
					var piKey = localStorage[strKeyCLIdxToDomainsWI];
					if( piKey != sOnlyDomainName )
						continue;
								
					iUrlIdx 		= lipIdx;
					break;
				}
		    	
	    	}
		}
		catch(e)
		{
			//caught an exception, do nothing
		}		
			
		//default not in cache
		return iUrlIdx;
    },
	
    storePrefs: function(bLogin, sAcctName, sBirthday, sPassword, sSuperSafe)
    {
	    var strKeyAuthenticate = SingapuRateUtilities.SingapuRatePrefKeyAuthenticate;
	    var strKeyAcctName = SingapuRateUtilities.SingapuRatePrefKeyAcctName;
	    var strKeyBirthday = SingapuRateUtilities.SingapuRatePrefKeyBirthday;
	    var strKeyAuthentCode = SingapuRateUtilities.SingapuRatePrefKeyAthentCode;
	    var strKeySuperSafeMode = SingapuRateUtilities.SingapuRatePrefKeySuperSafeMode;
	    
        try
        {
	
	        // Store acct name
	        // Store acct birthday
	        // Store authenticate
	        var sCombinedAuthenticate = sAcctName.trim() + sBirthday.trim() + bLogin;
	        sCombinedAuthenticate = SingapuRateUtilities.hex_sha256(sCombinedAuthenticate + 'nh4da68h4jf6s4kj8g6d4df8b4d5');

	        //store encrypted password
			var passwordEncrypted = SingapuRateUtilities.hex_sha256(sAcctName.trim() + sPassword.trim() + 'nh4da68h4jf6s4kj8g6d4df8b4d5');
	        	        
	        //save to local storage
	        localStorage[strKeyAuthenticate] = "" + bLogin;
	        localStorage[strKeyAcctName] = sAcctName;
	        localStorage[strKeyBirthday] = sBirthday;
	        localStorage[strKeyAuthentCode] = passwordEncrypted;
	        localStorage[strKeySuperSafeMode] = sSuperSafe;
	        
        }
        catch(e)
        {
        }        
        return true;
    },
	
    readPrefs: function()
    {
	    //localStorage will always be loaded automatically when chrome starts
	    var strKeyAuthenticate = SingapuRateUtilities.SingapuRatePrefKeyAuthenticate;
	    
	    if(localStorage[strKeyAuthenticate] === true
	    		|| localStorage[strKeyAuthenticate] == "true" )
	    {
		    return;
	    }
        
        return;
    },

    loadDomainCaches : function()
    {
	    this.readPrefs();
	    
	    var sAcctName = localStorage[SingapuRateUtilities.SingapuRatePrefKeyAcctName];

		var strKeyCacheList = SingapuRateUtilities.SingapuRatePrefKeyCacheList;
	    if(localStorage[strKeyCacheList] == 'true'
    		|| localStorage[strKeyCacheList] === true)
    	{
	    	//we have the cache list inited properly
			var l_iCacheListLength = parseInt(localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches]);
			if( l_iCacheListLength > SingapuRateUtilities.SingapuRateMaxNumCaches )
				l_iCacheListLength = SingapuRateUtilities.SingapuRateMaxNumCaches;
				
			//loop through the array
			for(var pIdx = 0; pIdx < l_iCacheListLength; pIdx++)
			{
			    //Domains
			    var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + pIdx;
			    var strKeyCLPrefKeyWI = SingapuRateUtilities.SingapuRatePrefKeyCLPrefKey + pIdx;
				var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + pIdx;
				var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + pIdx;
				var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + pIdx;
				var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + pIdx;
				var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + pIdx;
				var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + pIdx;
				
	            alert(localStorage[strKeyCLIdxToDomainsWI] + "\n" 
	            		   + pIdx + "\n" 
	            		   + localStorage[strKeyCLPrefKeyWI] + "\n"
	            		   + localStorage[strKeyCLCategoriesWI] + "\n"
	            		   + localStorage[strKeyCLEntryDatesWI] + "\n"
	            		   + localStorage[strKeyCLCtgryIdsWI] + "\n"
	            		   + localStorage[strKeyCLMinAgesWI] + "\n"
	            		   + localStorage[strKeyCLVoteIdsWI] + "\n"
	            		   + localStorage[strKeyCLUsrMinAgesWI] + "\n"
	            		   + localStorage[strKeyCLIdxToDomainsWI] + "\n");
				
			}
		    	
    	}
        
        return true;
    },
    
};

var SingapuRateBlockedPage 		= chrome.extension.getURL(SingapuRateUtilities.SingapuRateLocalBlockedHtml);
var SingapuRateBlkDftPage 		= chrome.extension.getURL(SingapuRateUtilities.SingapuRateLocalBlockedDefaultHtml);
var SingapuRateSuspendPage 		= chrome.extension.getURL(SingapuRateUtilities.SingapuRateLocalSuspendedHtml);
var SingapuRateSuperSafePage 	= chrome.extension.getURL(SingapuRateUtilities.SingapuRateLocalSuperSafeHtml);

var SingapuRateWebService = 
{
    init: function()
    {
	    //do nothing now
    },
	
	startParsingWS : function(soap)
	{
		body = soap.getElementsByTagName("return");
		var retString = "";
		for(var i = 0; i < body.length; i++)
		{
			retString = body[i].childNodes[0].nodeValue;
			break;
		}
		return retString;
	},	
	
	sendReq : function(aTab, url, method, header, body, funcName, domainAddress)
	{
		var xmlresult = "";
		
		var httprequest = new XMLHttpRequest();
		var parser = new DOMParser();
		
		var targetnamespace = SingapuRateUtilities.SingapuRateWSNameSpace;
		var choosedoperationname = funcName;

		var getresponse = function () {
						
			//callback gets response
			if (httprequest.readyState == 4) 
			{
				try 
				{
					var response = "";
					if (httprequest.responseXML != null)
					{
							response = httprequest.responseXML;
					}
					else
					{
						response = parser.parseFromString(httprequest.responseText,'text/xml');
					}
					
					var retString = SingapuRateWebService.startParsingWS(response);
					
					//now check whether this login credential has been properly verified or not.
					var resArray = retString.split("|");
					var domainUrl = "";
					var category = "";
					var ctgryId = -1;
					var minAge = 21;
					var usrAcct = "";
					var voteId = -1;
					var usrMinAge = 21;
					var lsPrefKey = "";
					var liNewIdxNum = -1;
					for(var idx in resArray)
					{
						var tmpStr = resArray[idx];
						var kvPair = tmpStr.split("=");
						if(kvPair.length >= 2)
						{
							if(kvPair[0] == "category")
							{
								category = (kvPair[1]).trim();
							}
							else if(kvPair[0] == "ctgryId")
							{
								ctgryId = (kvPair[1]).trim();
							}
							else if(kvPair[0] == "minAge")
							{
								minAge = (kvPair[1]).trim();
							}
							else if(kvPair[0] == "usr")
							{
								usrAcct = (kvPair[1]).trim();
							}
							else if(kvPair[0] == "voteId")
							{
								voteId = (kvPair[1]).trim();
							}
							else if(kvPair[0] == "usrMinAge")
							{
								usrMinAge = (kvPair[1]).trim();
							}
							else if(kvPair[0] == "domain")
							{
								domainUrl = (kvPair[1]).trim();
							}
						}
					}
					
					var today = new Date();
					var l_iTodayY = today.getFullYear();
					var l_iTodayM = (today.getMonth() + 1);
					var l_iTodayD = (today.getDate());
					var iIntegerToday = l_iTodayD + l_iTodayM * 100 + l_iTodayY * 10000;					
					
					if(domainUrl == "")
					{
						domainUrl = domainAddress;
					}
					
					var strKeyCacheList = SingapuRateUtilities.SingapuRatePrefKeyCacheList;
					
					//we can actually pass checking domain here
					if(domainUrl != "")
					{
						var dmnIdxInCache = SingapuRatePrefs.isDomainInCache(domainUrl);
						if( dmnIdxInCache == -1 )
						{
							//add it to cache
					    	//we have the cache list inited properly
						    if(localStorage[strKeyCacheList] != 'true'
						    		&& localStorage[strKeyCacheList] !== true)
							{
								localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches] = "0";
								localStorage[strKeyCacheList] = 'true'; 
							}				    	
							var l_iCacheListLength = parseInt(localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches]);
							if( l_iCacheListLength >= SingapuRateUtilities.SingapuRateMaxNumCaches )
							{
								//we support up to SingapuRateUtilities.SingapuRateMaxNumCaches caches of website ratings
								var liNewRoundedIdx = l_iCacheListLength % SingapuRateUtilities.SingapuRateMaxNumCaches;
								
								var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + liNewRoundedIdx;
							    var strKeyCLDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLDomains + liNewRoundedIdx;
							    var strKeyCLPrefKeyWI = SingapuRateUtilities.SingapuRatePrefKeyCLPrefKey + liNewRoundedIdx;
								var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + liNewRoundedIdx;
								var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + liNewRoundedIdx;
								var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + liNewRoundedIdx;
								var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + liNewRoundedIdx;
								var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + liNewRoundedIdx;
								var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + liNewRoundedIdx;
									
								lsPrefKey = localStorage[SingapuRateUtilities.SingapuRatePrefKeyAcctName] + "|||" + liNewRoundedIdx;
								liNewIdxNum = liNewRoundedIdx;
								localStorage[strKeyCLPrefKeyWI]	= lsPrefKey; 
								localStorage[strKeyCLDomainsWI] = "" + liNewRoundedIdx;
								localStorage[strKeyCLIdxToDomainsWI] = domainUrl;
								localStorage[strKeyCLCategoriesWI] = category;
								localStorage[strKeyCLCtgryIdsWI] = "" + ctgryId;
								localStorage[strKeyCLMinAgesWI] = "" + minAge;
								localStorage[strKeyCLEntryDatesWI] = "" + iIntegerToday;				
								localStorage[strKeyCLVoteIdsWI] = "" + voteId;
								localStorage[strKeyCLUsrMinAgesWI] = "" + usrMinAge;
							}
							else
							{
								//add new cache
								var iSize = l_iCacheListLength;
								
								var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + iSize;
							    var strKeyCLDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLDomains + iSize;
							    var strKeyCLPrefKeyWI = SingapuRateUtilities.SingapuRatePrefKeyCLPrefKey + iSize;
								var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + iSize;
								var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + iSize;
								var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + iSize;
								var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + iSize;
								var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + iSize;
								var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + iSize;

								lsPrefKey = localStorage[SingapuRateUtilities.SingapuRatePrefKeyAcctName] + "|||" + iSize;
								liNewIdxNum = iSize;
								
								localStorage[strKeyCLPrefKeyWI] = lsPrefKey;
								localStorage[strKeyCLDomainsWI] = "" + iSize;
								localStorage[strKeyCLIdxToDomainsWI] = domainUrl;
								localStorage[strKeyCLCategoriesWI] = category;
								localStorage[strKeyCLCtgryIdsWI] = "" + ctgryId;
								localStorage[strKeyCLMinAgesWI] = "" + minAge;
								localStorage[strKeyCLEntryDatesWI] = "" + iIntegerToday;				
								localStorage[strKeyCLVoteIdsWI] = "" + voteId;
								localStorage[strKeyCLUsrMinAgesWI] = "" + usrMinAge;
									
							}
							l_iCacheListLength = l_iCacheListLength + 1;
							localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches] = "" + l_iCacheListLength;
						}
						else
						{
							//just update the cache with idx already exists
							var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + dmnIdxInCache;
							var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + dmnIdxInCache;
							var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + dmnIdxInCache;
							var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + dmnIdxInCache;
							var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + dmnIdxInCache;
							var strKeyCLUsrMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLUsrMinAges + dmnIdxInCache;
							
							localStorage[strKeyCLCategoriesWI] = category;
							localStorage[strKeyCLCtgryIdsWI] = "" + ctgryId;
							localStorage[strKeyCLMinAgesWI] = "" + minAge;
							localStorage[strKeyCLEntryDatesWI] = "" + iIntegerToday;				
							localStorage[strKeyCLVoteIdsWI] = "" + voteId;
							localStorage[strKeyCLUsrMinAgesWI] = "" + usrMinAge;
						}

						//let interval function to check for site blockes													
						return;
					}
					else
					{
						//something wrong with the domain, shall not happen
					}
					
				}
				catch(e) 
				{
					//error in getting response, shall never happen, do nothing
				}
			}
		}
		
		httprequest.onreadystatechange = getresponse;
		try 
		{
			httprequest.open(method, url, true);
					
			var headers = header;
			headers = headers.split("\n");
			for (var i = 0; i < headers.length; i++) 
			{
				var eachheader = headers[i].split(": ");
				if (eachheader[1])
					httprequest.setRequestHeader(eachheader[0],eachheader[1]);
			}
					
			var soapaction = ((targetnamespace.lastIndexOf("/") != targetnamespace.length - 1) ? targetnamespace + "/" : targetnamespace) + choosedoperationname;
			httprequest.setRequestHeader("Soapaction",soapaction);

			httprequest.send(body);
		}
		catch(e)
		{
			SingapuRateUtilities.alertSimpleWndMsg("SingapuRate_errRequesting");
		}		
		
		return xmlresult;
	},	
	
	soaprequest : function(targetnamespace, method, parameters)
	{
		var soaprequestStr = 
							"<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
							"<soap:Envelope " +
							"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
							"xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
							"xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
							"<soap:Body>" +
							"<" + method + " xmlns=\"" + targetnamespace + "\">" +
							parameters +
							"</" + method + "></soap:Body></soap:Envelope>";
					
		return soaprequestStr;
	},

	doSendRequest : function(aWin, funcName, param_and_inputs) 
	{
		var targetnamespace = SingapuRateUtilities.SingapuRateWSNameSpace;
		var choosedoperationname = funcName;
		
		// as Array:  parameternames_and_inputs[name] = value
		var outString = "";
		var lDomainAddress = "";
		for(var piKey in param_and_inputs) 
		{
			var tempStr = "<" + piKey + ">" + param_and_inputs[piKey] + "</" + piKey + ">";
			outString = outString + tempStr;
			if( piKey == "domain" )
			{
				lDomainAddress = param_and_inputs[piKey];
			}
		}
				
		var soaprequestStr = SingapuRateWebService.soaprequest(targetnamespace, choosedoperationname, outString);
		
		// using SOAP Version 1.1
		//prepare to send the soap request
		var wsMethod = "POST";
		var wsHeader = "Content-Type: text/xml";
		var wsBody = soaprequestStr;
		var response = "";
		
		try
		{
			SingapuRateWebService.sendReq(aWin, SingapuRateUtilities.SingapuRateWSLocation, wsMethod, wsHeader, wsBody, funcName, lDomainAddress );
			
		}
		catch(e)
		{
			SingapuRateUtilities.alertSimpleWndMsg("SingapuRate_wsdlError");
		}
		
		return;
		
	},	
};

var SingapuRateWebsiteRatings = 
{
    init: function()
    {
	    //do nothing now
    },
	
    isBlackList: function(aTab, weburl)
    {
	    if(!weburl || weburl.length == 0)
	    	return false;

		if( SingapuRateUtilities.isSingapurateDomain(weburl) === true )
		{
			//certified singapurate urls always
			return false;
		}
	    	
	    var sOnlyDomainName = SingapuRateUtilities.getOnlyDomainName(weburl, SingapuRateUtilities.SingapuRateDomainCheckDepth);	
		if(!sOnlyDomainName
				|| sOnlyDomainName == "")
			return false;
			
		try
		{	
		    if( localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] == 'false' 
		    		|| localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] === false)
		    {
			    //donot allow access websites
			    return true;
		    }
			else
			{
				//if need to check and certified with singapurate
				var param_and_inputs = {"usr" : localStorage[SingapuRateUtilities.SingapuRatePrefKeyAcctName],
										"domain" : sOnlyDomainName };
										
				SingapuRateWebService.doSendRequest(aTab, SingapuRateUtilities.SingapuRateWSRateMethod, param_and_inputs);

				//as we donot have this domain url in cache, we allow it first. callback of the web service will block it later if not allowed
				return false;
			}
		}
		catch(e)
		{
			//an exception caught, do nothing, just block the domain
		}		
				
        return true;
    },
    
    isBlockedInCache: function(weburl)
    {
	    var strKeyMinAge 		= SingapuRateUtilities.SingapuRateParamNameMinAge;
	    var strKeyCategoryName 	= SingapuRateUtilities.SingapuRateParamNameCategoryName;
	    var strKeyVoteId 		= SingapuRateUtilities.SingapuRateParamNameVoteId;
	    var strKeyCategoryId 	= SingapuRateUtilities.SingapuRateParamNameCategoryId;
	    var strKeyBlocked 		= SingapuRateUtilities.SingapuRateParamNameSiteBlocked;
	    var strKeyQueryAgain    = SingapuRateUtilities.SingapuRateParamNameNeedToQueryAgain;
	    
		var strKeyCacheList 		= SingapuRateUtilities.SingapuRatePrefKeyCacheList;	    
		var strKeyCurDomainUrlIdx 	= SingapuRateUtilities.SingapuRatePrefKeyCurDomainUrlIdx;	    
		
	    var retResults = [];
	    retResults[strKeyBlocked] = false;
	    retResults[strKeyMinAge] = 21;
	    retResults[strKeyCategoryName] = "R21";
	    retResults[strKeyVoteId] = -1;
	    retResults[strKeyCategoryId] = -1;
	    retResults[strKeyCurDomainUrlIdx] = -1;
	    retResults[strKeyQueryAgain] = false;
	    
	    if(!weburl || weburl.length == 0)
	    	return retResults;
	    	
		if( SingapuRateUtilities.isSingapurateDomain(weburl) === true )
		{
			//certified singapurate urls always
			return retResults;
		}
	    	
	    var sOnlyDomainName = SingapuRateUtilities.getOnlyDomainName(weburl, SingapuRateUtilities.SingapuRateDomainCheckDepth);	
		if(!sOnlyDomainName
				|| sOnlyDomainName == "")
			return retResults;
		
		try
		{	
		    if( localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] == 'false' 
		    		|| localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] === false )
		    {
			    //donot allow access websites
			    return retResults;
		    }
			else
			{
				var iUrlIdx = -1;
				var fiveDaysAgo = new Date();   //actually one day ago
				fiveDaysAgo.setDate( fiveDaysAgo.getDate() - 1 );
				var l_iFiveDaysAgoY = fiveDaysAgo.getFullYear();
				var l_iFiveDaysAgoM = (fiveDaysAgo.getMonth() + 1);
				var l_iFiveDaysAgoD = (fiveDaysAgo.getDate());
				var iIntegerFiveDaysAgo = l_iFiveDaysAgoD + l_iFiveDaysAgoM * 100 + l_iFiveDaysAgoY * 10000;
				
			    if(localStorage[strKeyCacheList] != 'true'
			    		&& localStorage[strKeyCacheList] !== true)
				{
					//nothing in cache
					retResults[strKeyQueryAgain] = true;
				}
				else
				{
					//user logged in successfully
					//loop through the array
					var l_iCacheListLength = parseInt(localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches]);
					if( l_iCacheListLength > SingapuRateUtilities.SingapuRateMaxNumCaches )
						l_iCacheListLength = SingapuRateUtilities.SingapuRateMaxNumCaches;
						
					var l_iStartPos = (parseInt(localStorage[SingapuRateUtilities.SingapuRatePrefKeyCLTotalNumCaches])) % SingapuRateUtilities.SingapuRateMaxNumCaches;
					l_iStartPos += SingapuRateUtilities.SingapuRateNumCachesMoveBack; //move further slots to list end to ensure previous cache can be better matched
					if( l_iStartPos >= l_iCacheListLength )			
					{
						l_iStartPos = l_iCacheListLength - 1;
					}
					
					for(var pIdx = l_iStartPos; pIdx > ( l_iStartPos + 1 - SingapuRateUtilities.SingapuRateMaxNumCaches); pIdx--)
					{
						var lipIdx = pIdx;
						if( lipIdx < 0 )
							lipIdx = lipIdx + SingapuRateUtilities.SingapuRateMaxNumCaches;
						
						var strKeyCLIdxToDomainsWI = SingapuRateUtilities.SingapuRatePrefKeyCLIdxToDomains + lipIdx;	
						var piKey = localStorage[strKeyCLIdxToDomainsWI];
						if( piKey != sOnlyDomainName )
							continue;
								
						iUrlIdx 		= lipIdx;
						if(iUrlIdx == -1)
							break;
						
						var strKeyCLMinAgesWI = SingapuRateUtilities.SingapuRatePrefKeyCLMinAges + lipIdx;
						var strKeyCLEntryDatesWI = SingapuRateUtilities.SingapuRatePrefKeyCLEntryDates + lipIdx;
						var strKeyCLCategoriesWI = SingapuRateUtilities.SingapuRatePrefKeyCLCategories + lipIdx;
						var strKeyCLCtgryIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLCtgryIds + lipIdx;
						var strKeyCLVoteIdsWI = SingapuRateUtilities.SingapuRatePrefKeyCLVoteIds + lipIdx;
								
						var minAge 			= parseInt(localStorage[strKeyCLMinAgesWI]);
						var entryDate		= parseInt(localStorage[strKeyCLEntryDatesWI]);
						var category 		= localStorage[strKeyCLCategoriesWI];
						var ctgryId 		= parseInt(localStorage[strKeyCLCtgryIdsWI]);
						var voteId			= parseInt(localStorage[strKeyCLVoteIdsWI]);

						retResults[strKeyMinAge] 		= minAge;
						retResults[strKeyCategoryName] 	= category;
						retResults[strKeyVoteId] 		= voteId;
						retResults[strKeyCategoryId] 	= ctgryId;
					    retResults[strKeyCurDomainUrlIdx] = iUrlIdx;
												
						if( iIntegerFiveDaysAgo >= entryDate )
						{
							//expired, allow to access;
							retResults[strKeyQueryAgain] = true;
						}

						//entry still valid
						if(minAge <= SingapuRateUtilities.getUserAge(localStorage[SingapuRateUtilities.SingapuRatePrefKeyBirthday]))
						{
							//white listed 
							//allow it to continue and notify its status
							retResults[strKeyBlocked] = false;
							return retResults;
						}
						else
						{
							//not allow to access by age restriction
							retResults[strKeyBlocked] = true;
							return retResults;
						}
						break;
					}
				}
			}
		}
		catch(e)
		{
			//caught an exception, do nothing
		}
		//default is to allow if not in cache
		retResults[strKeyQueryAgain] = true;
        return retResults;
    },  
    
};

// load
window.addEventListener("load",function(){  
    SingapuRateUtilities.init();  
},false);

window.addEventListener("load",function(){  
    SingapuRatePrefs.init();  
},false);

window.addEventListener("load",function(){  
    SingapuRateWebService.init();  
},false);

window.addEventListener("load",function(){  
    SingapuRateWebsiteRatings.init();  
},false);

