
<div class="background img" data-bg-src="themes/summer/images/summer-information-bg.jpg"></div>
<header>
    <h1 class="text-center">{{schemaDetails.title}}</h1>
</header>
<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <h3 class="subtitle"><i class="fa fa-paper-plane"></i> {{schemaDetails.firstTitle}}</h3>
            {{#first}}
            <p>{{{.}}}</p>
            {{/first}}
        </div>
        <div class="col-sm-6">
            <h3 class="subtitle font-wide">
                <i class="fa fa-quote-left"></i>
                <b>{{schemaDetails.secondTitle}} {{details.time}}</b>
            </h3>
            {{#second}}
            <p>{{{.}}}</p>
            {{/second}}
        </div>
    </div>
</div>
