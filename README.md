# jquery.toggleEvent

A jQuery plugin for toggling events like .toggle() did pre 1.9.

## Installation

Include script *after* the jQuery library:

```html
<script src="/path/to/jquery.toggle-event.js"></script>
```

## Usage

You may have as many handlers as you want and they will be called in order

```javascript
$( "#target" ).toggleEvent(
	'click',
	function() {
		alert( "First handler for .toggle() called." );
	},
	function() {
		alert( "Second handler for .toggle() called." );
	}
);
```

## Inspiration

(https://github.com/fkling/jQuery-Function-Toggle-Plugin)

## Authors

[David Lundgren](https://github.com/dlundgren)