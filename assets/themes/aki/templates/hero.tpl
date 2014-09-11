<div class="img" data-bg-src="themes/aki/images/aki-hero-bg.png">
    <article class="prologue">
        {{#prologue}}
        <p>{{{.}}}</p>
        {{/prologue}}
    </article>
    <footer class="rendez-vous">
        {{#details}}
        <h4 class="text-center">{{weekday}}</h4>
        <h3 class="text-center"><strong>{{date}}</strong></h3>
        {{/details}}
    </footer>
</div>
<div class="countdown clearfix hidden">
    <div class="countdown-item pull-left text-center">
        <span class="seconds">0</span>
        <span>秒</span>
    </div>
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
</div>
