
// classes

function Minifier(keywords)
{
	this.keywords = keywords;

	var identifiersMinifiedAsString = 
		"a;b;c;d;e;f;g;h;i;j;k;l;m;n;o;p;q;r;s;t;u;v;w;x;y;z;"
		+ "A;B;C;D;E;F;G;H;I;J;K;L;M;N;O;P;Q;R;S;T;U;V;W;X;Y;Z";

	this.identifiersMinified = 
		identifiersMinifiedAsString.split(";");
}

{
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

		var identifierLookup = [];

		for (var k = 0; k < this.keywords.length; k++)
		{
			var keyword = this.keywords[k];
			identifierLookup[keyword] = keyword + " ";	
		}

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
				tokenMinified = identifierLookup[tokenToMinify];

				if (tokenMinified == null)
				{
					var numberOfIdentifiersSoFar = 
						identifierLookup.length;

					tokenMinified = 
						this.identifiersMinified[numberOfIdentifiersSoFar];
	
					identifierLookup[tokenToMinify] = tokenMinified;
	 				identifierLookup.push(tokenToMinify);
				}
			}

			codeMinifiedAsTokens.push(tokenMinified);
		}

		var codeMinified = codeMinifiedAsTokens.join(""); // todo

		return codeMinified;
	}
}
