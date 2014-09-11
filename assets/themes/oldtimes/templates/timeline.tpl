
<header>
    <h1 class="text-center"><strong>Le Voyage</strong></h1>
</header>
<div class="container">
    {{#timeline}}
    <div class="story-item {{#even}}indent{{/even}}">
        <span class="img" data-bg-src="{{image}}"></span><span class="text text-left">{{{text}}}</span>
    </div>
    {{/timeline}}
    <a href="#view-bigday" class="btn-next">
        <img class="img-responsive" data-src="themes/oldtimes/images/oldtimes-btn-next.png">
    </a>
</div>
