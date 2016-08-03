# jQuery-passwordMeter
Password meter display built on "zxcvbn"

## Pre-requisites
- jQuery
- zxcvbn
- * Bootstrap (only if "popover" is used)

## Usage
$().passwordMeter(options);

## Options
Passed as an object `{}` with the following properties:

| Name | Type | Values | Default | Description |
| --- | --- | --- | --- | --- |
| type | string `""` | "horizontal" or "vertical" | "horizontal" | Meter display type |
| colors | array `[]` | strings with class names | ['red', 'orange', 'yellow', 'light-green', 'green'] | Class names for different scores (length: 5) |
| help | object `{}` |  | `{ type: 'div', model: $.noop, placement: 'right' }` | Holds help properties |
| help.type | string `""` | "div" or "popover" **(other values will display no help)** | "div" | Type of help to display |
| help.model | `function(score){}` | Parameter score: score received from zxcvbn, from 0 to 5 (0 is empty password, 1 to 5 is zxcvbn's 0 to 4) | $.noop | Function that returns a custom help model |
| help.placement | string `""` | "top", "right", "bottom" or "left" | "right" | Popover placement (only used for help.type = "popover") |

## Example

This example shows how to call passwordMeter on inputs with the "password-meter" class.<br>
The function passed on help.model will return 5 stars, filled according to the score.<br>
The star icons are from FontAwesome and the `<b>` classes from Materialize.

```javascript
$('input.password-meter').passwordMeter({
  help: {
    model: function (score) {
              var result = '<b class="yellow-text text-darken-2">';
  
              for (var i = 1; i < 6; i++) {
                  result += '<i class="fa fa-star' + (score < i ? '-o' : '') + '"></i>';
              }
  
              return result + '</b>';
          }
  }
});
```
