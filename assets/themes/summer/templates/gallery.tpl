<div class="background img" data-bg-src="themes/summer/images/gallery-bg.jpg"></div>
<header>
    <h2 class="text-center">{{schemaDetails.title}}</h2>
</header>
<div class="gallery">
    <div class="gallery-inner">
        {{#photos}}
        <img data-src="{{.}}">
        {{/photos}}
    </div>
</div>
