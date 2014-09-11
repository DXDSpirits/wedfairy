
<header>
    <p class="text-center"><i class="fa fa-camera-retro fa-3x"></i></p>
    <h1 class="text-center">Gallery</h1>
</header>
<h3 class="gallery-title text-left">{{schemaDetails.title}}</h3>
<div class="gallery clearfix">
    {{#photos}}
    <div class="img pull-left" data-bg-src="{{.}}"></div>
    {{/photos}}
</div>
