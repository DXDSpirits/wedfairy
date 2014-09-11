
<header>
    <h1 class="text-center"><strong>The Couple</strong></h1>
</header>
<div class="container">
    <div class="row">
        <div class="col-sm-6 groom">
            <p class="name">{{{details.groomName}}}</p>
            <div class="avatar img" data-bg-src="{{groomAvatar}}">
                <div class="background img" data-bg-src="themes/ladypink/images/ladypink-diamond-light.png"></div>
            </div>
            {{#groomAbout}}
                <p class="text-center">{{{.}}}</p>
            {{/groomAbout}}
        </div>
        <div class="col-sm-6 bride">
            <p class="name">{{{details.brideName}}}</p>
            <div class="avatar img" data-bg-src="{{brideAvatar}}">
                <div class="background img" data-bg-src="themes/ladypink/images/ladypink-diamond-light.png"></div>
            </div>
            {{#brideAbout}}
                <p class="text-center">{{{.}}}</p>
            {{/brideAbout}}
        </div>
    </div>
</div>
