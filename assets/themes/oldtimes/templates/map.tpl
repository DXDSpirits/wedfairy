
<header></header>
<div class="container">
    <div class="row">
        <div class="col-sm-4 address-wrapper">
            <header>
                <h3><i class="fa fa-road"></i> 地点</h3>
            </header>
            <address>
                <h4>{{#location}}{{{.}}}<br>{{/location}}</h4>
                <h5>{{#address}}{{{.}}}<br>{{/address}}</h5>
            </address>
        </div>
        <div class="col-sm-8">
            <div class="img" id="map-canvas"></div>
        </div>
    </div>
</div>
