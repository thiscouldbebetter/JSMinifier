
function StringExtensions()
{
	// extension class
}

{
	String.prototype.isLetter = function()
	{
		var charCode = this.charCodeAt(0);
		var returnValue = 
		(
			(
				charCode >= "A".charCodeAt(0) 
				&& charCode <= "Z".charCodeAt(0) 
			)
			||
			(
				charCode >= "a".charCodeAt(0) 
				&& charCode <= "z".charCodeAt(0) 
			)

		);

		return returnValue;
	}

	String.prototype.isIdentifier = function()
	{
		var returnValue = 
		( 
			this.length >= 1
			&& isNaN( parseFloat(this) ) 
			&& this[0].isLetter()
		);

		return returnValue;
	}

	String.prototype.isNumber = function()
	{
		var returnValue = 
		(
			isNaN(parseFloat(this)) == false
			|| this == "."
		)

		return returnValue;
	}

	String.prototype.isWhitespace = function()
	{
		var returnValue = true;

		for (var i = 0; i < this.length; i++)
		{
			var char = this[i];
			if 
			(
				char != " "
				&& char != "\t"
				&& char != "\r"
				&& char != "\n"
			)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}
}
