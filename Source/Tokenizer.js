
function Tokenizer(preserveWhitespace)
{
	this.preserveWhitespace = preserveWhitespace;
}
{
	Tokenizer.prototype.tokenizeString = function(stringToTokenize)
	{
		var tokensSoFar = [];

		var tokenInProgress = "";

		var isWithinQuotes = false;
		var isWithinNumber = false;

		for (var i = 0; i < stringToTokenize.length; i++)
		{
			var char = stringToTokenize[i];

			if (isWithinQuotes)
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
			else if (isWithinNumber)
			{
				if (char.isNumber())
				{
					tokenInProgress += char;
				}
				else
				{
					isWithinNumber = false;
					tokensSoFar.push(tokenInProgress);
					tokensSoFar.push(char);
					tokenInProgress = "";
				}
			}
			else if (char.isWhitespace())
			{
				if (tokenInProgress.length > 1)
				{
					tokensSoFar.push(tokenInProgress);
					tokenInProgress = "";
				}

				if (this.preserveWhitespace)
				{
					tokensSoFar.push(char);
				}
			}
			else if (char.isLetter())
			{
				tokenInProgress += char;
			}
			else if (char.isDigit())
			{
				if (tokenInProgress == "")
				{
					isWithinNumber = true;
				}

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
