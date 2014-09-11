
<div class="background img" data-bg-src="themes/default/images/default-dotted.png"></div>
<div class="container">
    <!--<div class="row">
        <div class="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            {{#logo}}
            <img class="xd-and-uki" data-src="{{logo}}" />
            {{/logo}}
            {{^logo}}
            <div class="xd-and-uki text-center">
                <h1>{{details.brideName}}</h1>
                <h1>&amp;</h1>
                <h1>{{details.groomName}}</h1>
            </div>
            {{/logo}}
        </div>
    </div>-->
    {{#logo}}
    <div class="row">
        <div class="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <img class="xd-and-uki" data-src="{{logo}}" />
        </div>
    </div>
    {{/logo}}
    {{^logo}}
    <div class="countdown clearfix hidden">
        <div class="countdown-item pull-left text-center">
            <p class="days">0</p>
            <p>天</p>
        </div>
        <div class="countdown-item pull-left text-center">
            <p class="hours">0</p>
            <p>小时</p>
        </div>
        <div class="countdown-item pull-left text-center">
            <p class="minutes">0</p>
            <p>分钟</p>
        </div>
        <div class="countdown-item pull-left text-center">
            <p class="seconds">0</p>
            <p>秒</p>
        </div>
    </div>
    {{/logo}}
    <div class="row">
        <div class="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <div class="announce-text text-center">
                {{#prologue}}
                <h4>{{{.}}}</h4>
                {{/prologue}}
            </div>
        </div>
        <div class="col-sm-3 col-md-4">
            <div class="bulle img" data-bg-src="themes/default/images/default-bulle-bleue.png">
                <h3 class="text-center">Rendez-vous</h3>
                {{#details}}
                <h3 class="text-center"><strong>{{date}}</strong></h3>
                <h4 class="text-center">{{weekday}}</h4>
                {{/details}}
            </div>
        </div>
    </div>
</div>
<div class="illus">
    <img class="img-responsive" data-src="themes/default/images/default-caricatures.png" />
</div>
