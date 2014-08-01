// popup.js

var SingapuRateOptionsHandler = {

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  //load the preference and display to html
  document.getElementById("c_username").value = localStorage[SingapuRateUtilities.SingapuRatePrefKeyAcctName];
  document.getElementById("c_birthday").value = localStorage[SingapuRateUtilities.SingapuRatePrefKeyBirthday];

  //we will need to disable modification of username if already registered
  if( localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] === true 
    || localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] == "true"  )
  {
    document.getElementById("c_username").setAttribute("disabled","disabled");
    document.getElementById("label_username").textContent = "Welcome back " 
    													+ localStorage[SingapuRateUtilities.SingapuRatePrefKeyAcctName] 
    													+ ": You are now " 
    													+ SingapuRateUtilities.getUserAge(localStorage[SingapuRateUtilities.SingapuRatePrefKeyBirthday])
    													+ " year(s) old.";
    if(localStorage[ SingapuRateUtilities.SingapuRatePrefKeySuperSafeMode ] == "yes" )    													
    {
      document.getElementById("c_supersafe").setAttribute("checked","checked");
      document.getElementById("c_supersafe").value = "yes";
    }
    else
    {
	  document.getElementById('c_username').removeAttribute("checked");	
      document.getElementById("c_supersafe").value = "no";
    }
  }
  else
  {
    document.getElementById('c_username').removeAttribute("disabled");	  
    document.getElementById('b_deregister').setAttribute("disabled","disabled");	  
    document.getElementById("c_supersafe").setAttribute("checked","checked");
    document.getElementById("c_supersafe").value = "yes";
  }
});

window.onload = function() {
  document.getElementById("b_save").onclick = function() {
    var username = document.getElementById("c_username").value.trim();
	var password = document.getElementById("c_password").value.trim();
	var birthday = document.getElementById("c_birthday").value.trim();
	var supersafe = document.getElementById("c_supersafe").value.trim();
	var bLogin = false;
	
	if( username.length < 4 || password.length < 4 )
	{
	  //it is a wrong username or password
	  alert("wrong username or password.");
	  return;
	}
	else
	{
		var resArray = birthday.split("-");
		if(resArray.length != 3)
		{
		  //it is a wrong birthday format
		  alert("wrong birthday format.");
		  return;
		}
		else
		{
			if( localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] === true 
					|| localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] == "true"  )
			{
		        var passwordCombineStr = username.trim() + password.trim() + 'nh4da68h4jf6s4kj8g6d4df8b4d5';
				var passwordEncrypted = SingapuRateUtilities.hex_sha256(passwordCombineStr);
				if( passwordEncrypted == localStorage[SingapuRateUtilities.SingapuRatePrefKeyAthentCode] )
				{
					//authenticate the user with password, proceed to update profile
				}
				else
				{
					//failed to authenticate
					alert("wrong password to authenticate the profile update.");
					return;
				}
			}
			
			bLogin = true;
		}
	}
	
	if(birthday != localStorage[SingapuRateUtilities.SingapuRatePrefKeyBirthday]
			|| supersafe != localStorage[SingapuRateUtilities.SingapuRatePrefKeySuperSafeMode]
			|| localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] === false 
			|| localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] == "false" )
	{
		//store username
		//store birthday
		//store password
		//store super safe mode
		SingapuRatePrefs.storePrefs(bLogin, username, birthday, password, supersafe);
		
		alert("Profile updates, you are now years old.");
	}
			
    if(bLogin === true)
		window.close();
		
    return;
  };
  
  document.getElementById("b_deregister").onclick = function() {
    var username = document.getElementById("c_username").value.trim();
	var password = document.getElementById("c_password").value.trim();
	var birthday = document.getElementById("c_birthday").value.trim();
	
	if( username.length < 4 || password.length < 4 )
	{
	  //it is a wrong username or password
	  alert("wrong username or password.");
	  return;
	}
	else
	{
		if( localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] === true 
				|| localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] == "true"  )
		{
	        var passwordCombineStr = username.trim() + password.trim() + 'nh4da68h4jf6s4kj8g6d4df8b4d5';
			var passwordEncrypted = SingapuRateUtilities.hex_sha256(passwordCombineStr);
			if( passwordEncrypted == localStorage[SingapuRateUtilities.SingapuRatePrefKeyAthentCode] )
			{
				//authenticate the user with password, proceed to deregister the profile
			}
			else
			{
				//failed to authenticate
				alert("wrong password to authenticate the deregister.");
				return;
			}
		}
		else
		{
			alert("account has not been registered yet");
			return;
		}
	}
	
	if(localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] === true 
			|| localStorage[SingapuRateUtilities.SingapuRatePrefKeyAuthenticate] == "true" )
	{
		//store username
		//store birthday
		//store encrypted password
		SingapuRatePrefs.storePrefs(false, username, birthday, "", "no");
		
		alert("Profile updates, account " + username + " has been deregistered");
	}
			
	window.close();
		
    return;	  
  };
  
  document.getElementById("b_close").onclick = function() {
    window.close();
  };

  document.getElementById("c_supersafe").onclick = function() {
	var supersafe = document.getElementById("c_supersafe").value.trim();  
    if( supersafe == "yes" )
    {
	  document.getElementById("c_supersafe").value = "no";
    }
    else
    {
      document.getElementById("c_supersafe").value = "yes"; 
    }
  };
    
}



