# team-performance-widget

A widget to display the performance indicators of teams

## Configuration example:

__`client-widgets.js`__

```json
{
    "order": 1,
    "widgetId": "Seed widget",
    "args": {
        "title": "Football - Team Performance Indicator",
        "numberMatchesPerTeam": 6,
        "listLimit": 3
    }
},
...

```

Please visit http://widgets.kambi.com/tool/ for more info

### The widget accepts the following parameter/s:

 - title [String]

 The title to show on the header of the widgets

 - numberMatchesPerTeam [Number]

 Maximum number of matches to show per team

 - listLimit [Number]

 Number of teams to show per page


# Other tools

For setting up sass maps, follow this tutorial https://www.hackmonkey.com/2014/sep/configuring-css-source-maps-compass

To use Scss Lint, run "gem install scss_lint"

# Changelog

changelog can be found [here](CHANGELOG.md)
