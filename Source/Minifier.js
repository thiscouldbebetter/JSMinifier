
// classes

function Minifier(disableMinification, preserveWhitespace, keywordsToConserve, classNamesWithMethodsToConserve)
{
	this.disableMinification = disableMinification; // For debugging.
	this.preserveWhitespace = preserveWhitespace;
	this.keywordsToConserve = keywordsToConserve;
	this.classNamesWithMethodsToConserve = classNamesWithMethodsToConserve;

	this.identifierChars =
		"abcdefghijklmnopqrstuvwxyz"
		+ "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
}

{
	Minifier.classNamesWithMethodsToConserveDefault = function()
	{
		var classNamesWithMethodsToConserve =
		[
			"Math",
		];

		/*
			"Math",
			"abs",
			"asin",
			"atan2",
			"ceil",
			"cos",
			"floor",
			"PI",
			"pow",
			"random",
			"round",
			"sin",
			"sqrt",
		*/

		return classNamesWithMethodsToConserve;
	}

	Minifier.keywordsDefault = function()
	{
		var keywords =
		[
			"alert",
			"apply",
			"arc",
			"appendChild",
			"Array",
			"beginPath",
			"bind",
			"body",
			"break",
			"call",
			"catch ",
			"charCodeAt",
			"clear",
			"clearInterval",
			"clearRect",
			"clientX",
			"clientY",
			"closePath",
			"concat",
			"constructor",
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
			"font",
			"for",
			"forEach",
			"fromCharCode",
			"function ",
			"getBoundingClientRect",
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
			"head",
			"height",
			"hours",
			"html",
			"id",
			"if",
			" in ",
			"indexOf ",
			"innerHTML",
			"inputName",
			"isNaN",
			"javascript",
			"join",
			"JSON",
			"key",
			"left",
			"length",
			"lineTo",
			"localStorage",
			"location",
			"map",
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
			"position",
			"preventDefault",
			"proto",
			"prototype",
			"push",
			"removeChild",
			"responseText",
			"restore",
			"return ",
			"rotate",
			"save",
			"scale",
			"script ",
			"seconds",
			"send",
			"setInterval",
			"setItem",
			"slice",
			"search",
			"sort",
			"splice ",
			"split",
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

				var identifierMinifiedIsStringToConserve = true;
				while (identifierMinifiedIsStringToConserve)
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

					identifierMinifiedIsStringToConserve =
						(this.stringsToConserve.indexOf(identifierMinified) >= 0);

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
		this.stringsToConserve = [];

		for (var k = 0; k < this.keywordsToConserve.length; k++)
		{
			var keyword = this.keywordsToConserve[k];
			var keywordTrimmed = keyword.trim();
			this.stringsToConserve.push(keywordTrimmed);
			this.identifierToMinifiedLookup[keywordTrimmed] = keyword;
		}

		for (var c = 0; c < this.classNamesWithMethodsToConserve.length; c++)
		{
			var className = this.classNamesWithMethodsToConserve[c];
			this.stringsToConserve.push(className);

			var classInstance = window[className];
			var propertyNames = Object.getOwnPropertyNames(classInstance);

			for (var p = 0; p < propertyNames.length; p++)
			{
				var propertyName = propertyNames[p];
				this.stringsToConserve.push(propertyName);
				this.identifierToMinifiedLookup[propertyName] = propertyName;
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
