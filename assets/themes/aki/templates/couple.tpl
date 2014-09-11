<header>
    <h1 class="text-center">The Couple</h1>
    <div class="spliter"></div>
</header>
<div class="wall container">
    <div class="story-item">
        <h4 class="text-right name">{{details.groomName}}</h4>
        <span class="img" data-bg-src="{{groomAvatar}}"></span><span class="text">
            {{#groomAbout}}
                <span>{{{.}}}</span><br>
            {{/groomAbout}}
        </span>
    </div>
    <div class="story-item">
        <h4 class="text-left name">{{details.brideName}}</h4>
        <span class="text">
            {{#brideAbout}}
                <span>{{{.}}}</span><br>
            {{/brideAbout}}
        </span><span class="img" data-bg-src="{{brideAvatar}}"></span>
    </div>
</div>
