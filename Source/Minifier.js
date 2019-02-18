
// classes

function Minifier(disableMinification, preserveWhitespace, keywords)
{
	this.disableMinification = disableMinification; // For debugging.
	this.preserveWhitespace = preserveWhitespace;
	this.keywords = keywords;

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
			"beginPath",
			"body",
			"catch ",
			"closePath",
			"ceil",
			"concat",
			"constructor",
			"cos",
			"do",
			"document",
			"else ",
			"delete ",
			"do",
			"false",
			"fill",
			"fillStyle",
			"filter",
			"Float32Array",
			"floor",
			"for",
			"forEach",
			"function ",
			"html",
			"indexOf ",
			"if",
			" in ",
			"javascript",
			"join",
			"length",
			"getContext",
			"getElementById",
			"map",
			"Math",
			"name",
			"new ",
			"null",
			"PI",
			"prototype",
			"push",
			"restore",
			"return ",
			"rotate",
			"round",
			"save",
			"scale",
			"script ",
			"sin",
			"slice",
			"sort",
			"splice ",
			"split",
			"sqrt",
			"strokeStyle",
			"substr",
			"text",
			"this",
			"throw ",
			"try",
			"toString",
			"true",
			"type",
			"values",
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
				var identifierMinified;

				var identifierMinifiedIsKeyword = true;
				while (identifierMinifiedIsKeyword)
				{
					identifierMinified = "";
					var identifierMinifiedAsNumber =
						this.identifierToMinifiedLookupCount + 1;

					while (identifierMinifiedAsNumber > 0)
					{
						var charNextAsNumber =
							identifierMinifiedAsNumber % numberOfCharsAvailable;
						identifierMinifiedAsNumber -= charNextAsNumber;
						identifierMinifiedAsNumber /= numberOfCharsAvailable;

						var charNext = this.identifierChars[charNextAsNumber];
						identifierMinified += charNext;
					}

					identifierMinifiedIsKeyword =
						(this.keywordsTrimmed.indexOf(identifierMinified) >= 0);

					this.identifierToMinifiedLookupCount++;
				}

				identifierLookup[identifierToMinify] = identifierMinified;
			}
		}

		return identifierMinified;
	}

	Minifier.prototype.minifyCode = function(codeToMinify)
	{
		this.identifierToMinifiedLookupCount = 0;
		this.identifierToMinifiedLookup = {};
		this.keywordsTrimmed = [];

		for (var k = 0; k < this.keywords.length; k++)
		{
			var keyword = this.keywords[k];
			var keywordTrimmed = keyword.trim();
			this.keywordsTrimmed.push(keywordTrimmed);
			this.identifierToMinifiedLookup[keywordTrimmed] = keyword;
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

			if (tokenToMinify.isIdentifier() == false)
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
