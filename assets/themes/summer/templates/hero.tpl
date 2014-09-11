
<div class="background img" data-bg-src="themes/summer/images/summer-hero-bg.jpg"></div>
<div class="container">
    <div class="top">
        <h3 class="text-center name">{{details.groomName}} &amp; {{details.brideName}}</h3>
    </div>
    <div class="bottom">
        {{#details}}
        <h3 class="text-left"><strong>{{date}}</strong></h3>
        <h4 class="text-left">{{weekday}}</h4>
        {{/details}}
        <div class="text-left">
            {{#prologue}}
            <h4>{{{.}}}</h4>
            {{/prologue}}
        </div>
    </div>
</div>
