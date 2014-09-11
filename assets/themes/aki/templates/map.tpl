
<div class="background img" data-bg-src="themes/aki/images/aki-map-bg.jpg"></div>
<div class="container">
    <div class="row">
        <div class="col-sm-4">
            <div class="address-wrapper img" data-bg-src="themes/aki/images/aki-map-address-bg.jpg">
                <address class="text-center">
                    <h4>{{#location}}{{{.}}}<br>{{/location}}</h4>
                    <h5>{{#address}}{{{.}}}<br>{{/address}}</h5>
                </address>
            </div>
        </div>
        <div class="col-sm-8">
            <div class="img" id="map-canvas"></div>
        </div>
    </div>
</div>
