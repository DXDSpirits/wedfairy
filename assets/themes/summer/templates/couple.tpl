
<div class="container">
    <h4 class="name text-right">{{details.groomName}}</h4>
    <div class="sticker clearfix img" data-bg-src="themes/summer/images/summer-couple-avatar-bg.png">
        <div class="img pull-left" data-bg-src="{{groomAvatar}}"></div>
        <div class="text pull-right">
            {{#groomAbout}}
                <p>{{{.}}}</p>
            {{/groomAbout}}
        </div>
    </div>
    <h4 class="name text-left">{{details.brideName}}</h4>
    <div class="sticker clearfix img" data-bg-src="themes/summer/images/summer-couple-avatar-bg-flip.png">
        <div class="img pull-right" data-bg-src="{{brideAvatar}}"></div>
        <div class="text pull-left">
            {{#brideAbout}}
                <p>{{{.}}}</p>
            {{/brideAbout}}
        </div>
    </div>
</div>
