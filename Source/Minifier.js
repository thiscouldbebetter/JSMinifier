
// classes

function Minifier(keywords)
{
	this.keywords = keywords;

	this.identifierToMinifiedLookup = [];

	this.identifierChars =
		"abcdefghijklmnopqrstuvwxyz"
		+ "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
}

{
	Minifier.prototype.identifierMinify = function(identifierToMinify)
	{
		var identifierLookup = this.identifierToMinifiedLookup;

		var identifierMinified = identifierLookup[identifierToMinify];

		if (identifierMinified == null)
		{
			var numberOfCharsAvailable = this.identifierChars.length;
			var identifierMinifiedAsNumber = identifierLookup.length + 1;
			var identifierMinified = "";
			
			while (identifierMinifiedAsNumber > 0)
			{
				var charNextAsNumber =
					identifierMinifiedAsNumber % numberOfCharsAvailable;
				identifierMinifiedAsNumber -= charNextAsNumber;
				identifierMinifiedAsNumber /= numberOfCharsAvailable;
									
				var charNext = this.identifierChars[charNextAsNumber];
				identifierMinified += charNext;
			}
			
			identifierLookup.push(identifierMinified);
			identifierLookup[identifierToMinify] = identifierMinified;
		}
		
		return identifierMinified;
	}

	Minifier.prototype.minifyCode = function(codeToMinify)
	{
		var codeAsLines = codeToMinify.split("\n");
		var codeAsLinesMinusComments = [];

		for (var i = 0; i < codeAsLines.length; i++)
		{
			var codeLine = codeAsLines[i];
			var indexOfDoubleSlash = codeLine.indexOf("//");

			var codeLineMinusComments;

			if (indexOfDoubleSlash == -1)
			{
				codeLineMinusComments = codeLine;
			}
			else
			{
				codeLineMinusComments = 
					codeLine.substr(0, indexOfDoubleSlash);
			}

			codeAsLinesMinusComments.push
			(
				codeLineMinusComments
			);
		}

		var codeMinusComments = codeAsLinesMinusComments.join("\n");

		var tokenizer = new Tokenizer();

		var codeAsTokens = 
			tokenizer.tokenizeString(codeMinusComments);

		this.identifierToMinifiedLookup = [];

		var arrayMethodNames = [ "indexOf", "length", "push", "slice", "splice" ];

		for (var k = 0; k < this.keywords.length; k++)
		{
			var keyword = this.keywords[k];
			if (arrayMethodNames.indexOf(keyword) == -1)
			{
				var keywordTrimmed = keyword.trim();
				this.identifierToMinifiedLookup[keywordTrimmed] = keyword;
			}
		}

		var codeMinifiedAsTokens = [];

		for (var t = 0; t < codeAsTokens.length; t++)
		{
			var tokenToMinify = codeAsTokens[t];

			var tokenMinified;

			if (arrayMethodNames.indexOf(tokenToMinify) >= 0)
			{
				tokenMinified = tokenToMinify;
			}
			else if (tokenToMinify.isIdentifier() == false)
			{
				tokenMinified = tokenToMinify;
			}
			else
			{
				tokenMinified = this.identifierMinify(tokenToMinify);
			}

			codeMinifiedAsTokens.push(tokenMinified);
		}

		var codeMinified = codeMinifiedAsTokens.join(""); // todo

		return codeMinified;
	}
}
