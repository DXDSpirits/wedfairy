
{{^path}}
<header>
    <h1 class="text-center">Le Voyage</h1>
</header>
<article class="container">
    {{#timeline}}
    <div class="story-item type{{index}}">
        {{^even}}
        <span class="text text-center">{{{text}}}</span><span class="img" data-bg-src="{{image}}"></span>
        {{/even}}
        {{#even}}
        <span class="img" data-bg-src="{{image}}"></span><span class="text text-center">{{{text}}}</span>
        {{/even}}
    </div>
    {{/timeline}}
    <a href="#view-bigday" class="btn-next"><img class="img-responsive" data-src="themes/default/images/default-btn-bleu.png"></a>
</article>
{{/path}}
{{#path}}
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
{{/path}}
