
// classes

function Minifier(disableMinification, preserveWhitespace, keywords)
{
	this.disableMinification = disableMinification; // For debugging.
	this.preserveWhitespace = preserveWhitespace;
	this.keywords = keywords;

	this.identifierToMinifiedLookup = [];

	this.identifierChars =
		"abcdefghijklmnopqrstuvwxyz"
		+ "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
}

{
	Minifier.keywordsDefault = function()
	{
		var keywords =
		[
			"alert",
			"appendChild",
			"constructor",
			"document",
			"else ",
			"delete ",
			"false",
			"for",
			"function ",
			"indexOf ",
			"if",
			"join",
			"length",
			"getElementById",
			"name",
			"new ",
			"null",
			"prototype",
			"push",
			"return ",
			"slice",
			"splice ",
			"split",
			"this",
			"true",
			"var ",
			"while",
		];

		return keywords;
	}

	Minifier.prototype.identifierMinify = function(identifierToMinify)
	{
		var identifierLookup = this.identifierToMinifiedLookup;

		var identifierMinified = identifierLookup[identifierToMinify];

		if (identifierMinified == null)
		{
			if (this.disableMinification)
			{
				identifierMinified = identifierToMinify;
			}
			else
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
		}

		return identifierMinified;
	}

	Minifier.prototype.minifyCode = function(codeToMinify)
	{
		this.identifierToMinifiedLookup = [];

		// Can't add these as properties of the lookup array.
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

		var newline = "\n";
		var codeAsLines = codeToMinify.split(newline);
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

		var codeMinusComments = codeAsLinesMinusComments.join(newline);

		var tokenizer = new Tokenizer(this.preserveWhitespace);

		var codeAsTokens = 
			tokenizer.tokenizeString(codeMinusComments);

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
