
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
			"Array",
			"CanvasGradient",
			"CanvasRenderingContext2D",
			"Date",
			"Math",
			"Number",
			"Object",
			"String",
			"XMLHttpRequest",
		];

		return classNamesWithMethodsToConserve;
	}

	Minifier.keywordsDefault = function()
	{
		var keywords =
		[
			"alert",
			"apply",
			"appendChild",
			"bind",
			"body",
			"break",
			"call",
			"catch ",
			"clear",
			"clearInterval",
			"clientX",
			"clientY",
			"constructor",
			"create",
			"createElement",
			"do",
			"document",
			"else ",
			"delete ",
			"do",
			"false",
			"Float32Array",
			"for",
			"function ",
			"getBoundingClientRect",
			"getContext",
			"getElementById",
			"getGamepads",
			"getItem",
			"head",
			"height",
			"html",
			"id",
			"if",
			" in ",
			"innerHTML",
			"inputName",
			"isNaN",
			"javascript",
			"JSON",
			"key",
			"left",
			"localStorage",
			"location",
			"marginLeft",
			"marginTop",
			"NaN",
			"name",
			"navigator",
			"new ",
			"null",
			"onkeydown",
			"onkeyup",
			"onload",
			"onmousedown",
			"onmousemove",
			"onmouseup",
			"parse",
			"position",
			"preventDefault",
			"proto",
			"prototype",
			"removeChild",
			"return ",
			"script ",
			"setInterval",
			"setItem",
			"search",
			"src",
			"stringify",
			"style",
			"target",
			"text",
			"this",
			"throw ",
			"top",
			"true",
			"try",
			"type",
			"values",
			"var ",
			"while",
			"width",
			"window",
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
			this.identifierToMinifiedLookup[className] = className;

			var classInstance = window[className];
			if (classInstance.prototype != null)
			{
				classInstance = classInstance.prototype;
			}
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
