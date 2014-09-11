<header>
    <h1 class="text-center">The Couple</h1>
    <div class="spliter"></div>
</header>
<div class="wall container">
    <div class="story-item">
        <h4 class="text-right name"><b>{{details.groomName}}</b></h4>
        <span class="img" data-bg-src="{{groomAvatar}}"></span><span class="text">
            {{#groomAbout}}
                <span>{{{.}}}</span><br>
            {{/groomAbout}}
        </span>
    </div>
    <div class="story-item">
        <h4 class="text-right name"><b>{{details.brideName}}</b></h4>
        <span class="img" data-bg-src="{{brideAvatar}}"></span><span class="text">
            {{#brideAbout}}
                <span>{{{.}}}</span><br>
            {{/brideAbout}}
        </span>
    </div>
</div>
