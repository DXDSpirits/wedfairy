
<div class="container">
    <div class="row">
        <div class="col-sm-5">
            <div class="address-line img" data-bg-src="themes/printemps/images/printemps-map-avatars.png"></div>
            <div class="spliter"></div>
            <div class="address-line">
                {{#details}}
                <h3 class="text-center mark">{{date}}</h3>
                <h4 class="text-center">{{weekday}}</h4>
                {{/details}}
            </div>
            <div class="spliter"></div>
            <div class="address-line ring text-center">
                <h4 class="mark">{{#location}}{{{.}}}<br>{{/location}}</h4>
                <h5>{{#address}}{{{.}}}<br>{{/address}}</h5>
            </div>
            <div class="spliter"></div>
        </div>
        <div class="col-sm-7">
            <div class="img" id="map-canvas"></div>
        </div>
    </div>
</div>
