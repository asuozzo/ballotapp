## Vermont 2016 Ballot Generator
Here's the code for the [*Seven Days* 2016 Ballot Generator](http://www.sevendaysvt.com/vermont/whos-on-your-vermont-2016-ballot/Content?oid=3719883), which asks voters to enter an address and returns a list of who's on the ballot at that address for the 2016 general election. This includes candidates for president, U.S. Congress, statewide races and Vermont House and Senate races. It does not include county-wide races (i.e. High Bailiff), races for local positions or town/city ballot items.

The app uses the Google Maps Javascript API and the Google Places API to display a map, show address suggestions and geocode the entered address. It uses the Turf Javascript library to locate that address within a House and Senate district, then Mustache to load the returned list of candidates on the page.

## Data sources
Candidate information: [Vermont Secretary of State](https://www.sec.state.vt.us/elections/candidates.aspx)
Vermont House & Senate Districts, 2012: [Vermont Center for Geographic Information](http://vcgi.vermont.gov/warehouse)
