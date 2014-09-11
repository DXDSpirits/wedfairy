
<div class="bg-peoples img" data-bg-src="themes/printemps/images/printemps-peoples.png"></div>
<div class="bg-couple img" data-bg-src="themes/printemps/images/printemps-couple.png"></div>
<div class="container">
    <div class="salut text-center img" data-bg-src="themes/printemps/images/printemps-spliter.png">
        <span>{{details.brideName}} &amp; {{details.groomName}}</span>
    </div>
    <div class="prologue">
        {{#prologue}}
        <p>{{{.}}}</p>
        {{/prologue}}
    </div>
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
</div>
