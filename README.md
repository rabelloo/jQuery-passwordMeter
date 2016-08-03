# jQuery-passwordMeter
Password meter display built on "zxcvbn"

# Pre-requisites
- jQuery
- zxcvbn
- * Bootstrap (only if "popover" is used)

# Usage
$().passwordMeter(options);

# Options
Passed as an object {}

- type: string ""  // meter display type
  - values = "horizontal" or "vertical"
  - default = "horizontal"
- colors: array []  // class names array for different scores (length: 5)
  - values = strings with class names
  - default = ['red', 'orange', 'yellow', 'light-green', 'green']
- help: object {}  // object that holds other properties
  - help.type: string ""  // if and what type of help to display
    - values = "div" or "popover"  // other values will not display help
    - default = "div"
  - help.model: function (score) {}  // function that returns a custom help model
    - param score = score received from zxcvbn, from 0 to 5 (0 is empty password, 1 to 5 is zxcvbn's 0 to 4)
    - default = $.noop
  - help.placement: string ""  // popover placement (only used for help.type = "popover")
    - values = "top", "right", "bottom" or "left"
    - default = "right"
