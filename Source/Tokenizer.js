
function Tokenizer()
{
	// do nothing
}
{
	Tokenizer.prototype.tokenizeString = function(stringToTokenize)
	{
		var tokensSoFar = [];

		var tokenInProgress = "";

		var isWithinQuotes;

		for (var i = 0; i < stringToTokenize.length; i++)
		{
			var char = stringToTokenize[i];
			
			if (isWithinQuotes == true)
			{
				tokenInProgress += char;

				if (char == "\"")
				{
					isWithinQuotes = false;
					tokensSoFar.push(tokenInProgress);
					tokenInProgress = "";
				}
				else if (char == "\\")
				{
					i++;
					var charNext = stringToTokenize[i];
					tokenInProgress += charNext;
				}
			}
			else if (char.isWhitespace())
			{
				if (tokenInProgress.length > 1)
				{
					tokensSoFar.push(tokenInProgress);
					tokenInProgress = "";
				}
			}
			else if (char.isLetter() || char.isNumber())
			{
				tokenInProgress += char;	
			}
			else if (char == "\"")
			{
				isWithinQuotes = true;
				tokenInProgress += char;
			}
			else
			{
				tokensSoFar.push(tokenInProgress);
				tokensSoFar.push(char);
				tokenInProgress = "";
			}
		}		

		return tokensSoFar;
	}
}
