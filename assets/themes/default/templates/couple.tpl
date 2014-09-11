
<header>
    <h1 class="text-center">The Couple</h1>
</header>
<div class="container">
    {{^coupleAvatar}}
        <div class="row avatars">
            <div class="col-xs-6 avatar img" data-bg-src="{{groomAvatar}}"></div>
            <div class="col-xs-6 avatar img" data-bg-src="{{brideAvatar}}"></div>
        </div>
    {{/coupleAvatar}}
    {{#coupleAvatar}}
        <div class="row avatars">
            <div class="col-xs-12 avatar img" data-bg-src="{{coupleAvatar}}"></div>
        </div>
    {{/coupleAvatar}}
    <div class="row text-center">
        <div class="col-xs-6">
            <h4><strong>{{details.groomName}}</strong></h4>
            {{#groomAbout}}
                <p>{{{.}}}</p>
            {{/groomAbout}}
        </div>
        <div class="col-xs-6">
            <h4><strong>{{details.brideName}}</strong></h4>
            {{#brideAbout}}
                <p>{{{.}}}</p>
            {{/brideAbout}}
        </div>
    </div>
</div>
