
<div class="background img" data-bg-src="themes/summer/images/summer-timeline-bg.png"></div>
<header>
    <h1 class="text-center">Le Voyage</h1>
</header>
<article class="container">
    {{#timeline}}
    <div class="story-item type{{index}}">
        <span class="img" data-bg-src="{{image}}"></span><span class="text">{{{text}}}</span>
    </div>
    {{/timeline}}
</article>
