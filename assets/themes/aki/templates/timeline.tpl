
<div class="ceil img" data-bg-src="themes/aki/images/aki-timeline-ceil.png"></div>
<div class="timeline-wrapper">
    <div class="timeline">
        <div class="line"></div>
        <div class="post">
            <div class="post-title">Le Voyage</div>
        </div>
        {{#timeline}}
            <div class="post">
                {{#text}}
                <div class="post-box">{{{text}}}</div>
                {{/text}}
                {{#title}}
                <div class="post-title">{{{title}}}</div>
                {{/title}}
            </div>
            {{#image}}
            <div class="post">
                <img class="post-image" data-src="{{image}}">
            </div>
            {{/image}}
        {{/timeline}}
    </div>
</div>
