
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
			"apply",
			"arc",
			"asin",
			"atan2",
			"appendChild",
			"Array",
			"beginPath",
			"bind",
			"body",
			"break",
			"call",
			"catch ",
			"ceil",
			"clear",
			"clearInterval",
			"clearRect",
			"clientX",
			"clientY",
			"closePath",
			"concat",
			"constructor",
			"cos",
			"create",
			"createElement",
			"createRadialGradient",
			"Date",
			"do",
			"document",
			"drawImage",
			"else ",
			"day",
			"delete ",
			"do",
			"endsWith",
			"false",
			"fill",
			"fillRect",
			"fillStyle",
			"fillText",
			"filter",
			"Float32Array",
			"floor",
			"font",
			"for",
			"forEach",
			"function ",
			"getBoundingClientRect",
			"head",
			"height",
			"hours",
			"html",
			"id",
			"if",
			" in ",
			"indexOf ",
			"innerHTML",
			"isNaN",
			"javascript",
			"join",
			"JSON",
			"left",
			"length",
			"lineTo",
			"localStorage",
			"location",
			"getContext",
			"getDate",
			"getElementById",
			"getGamepads",
			"getHours",
			"getItem",
			"getFullYear",
			"getMonth",
			"getMinutes",
			"getSeconds",
			"map",
			"Math",
			"marginLeft",
			"marginTop",
			"measureText",
			"minutes",
			"month",
			"moveTo",
			"NaN",
			"name",
			"navigator",
			"new ",
			"null",
			"Number",
			"Object",
			"onkeydown",
			"onkeyup",
			"onload",
			"onmousedown",
			"onmousemove",
			"onmouseup",
			"onreadystatechange",
			"open",
			"parse",
			"PI",
			"position",
			"proto",
			"prototype",
			"push",
			"random",
			"restore",
			"return ",
			"rotate",
			"round",
			"save",
			"scale",
			"script ",
			"seconds",
			"send",
			"setInterval",
			"setItem",
			"sin",
			"slice",
			"search",
			"sort",
			"splice ",
			"split",
			"sqrt",
			"src",
			"startsWith",
			"String",
			"stringify",
			"stroke",
			"strokeRect",
			"strokeStyle",
			"strokeText",
			"style",
			"substr",
			"substring",
			"target",
			"text",
			"this",
			"throw ",
			"toLowerCase",
			"toString",
			"toUpperCase",
			"top",
			"translate",
			"true",
			"try",
			"type",
			"values",
			"var ",
			"while",
			"width",
			"window",
			"XMLHttpRequest",
			"year",
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
