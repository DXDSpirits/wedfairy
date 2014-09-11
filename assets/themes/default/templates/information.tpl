
<div class="background img" data-bg-src="themes/default/images/default-etoiles.png"></div>
<header>
    <h1 class="text-center">{{schemaDetails.title}}</h1>
</header>
<div class="container">
    
    {{^compact}}
    <div class="row">
        <div class="col-sm-6">
            <h3 class="subtitle">{{schemaDetails.firstTitle}}</h3>
            {{#first}}
            <p>{{{.}}}</p>
            {{/first}}
        </div>
        <div class="col-sm-6">
            <h3 class="subtitle font-wide"><b>{{schemaDetails.secondTitle}} {{details.time}}</b></h3>
            {{#second}}
            <p>{{{.}}}</p>
            {{/second}}
        </div>
    </div>
    {{/compact}}
    
    {{#compact}}
    <!-- Nav tabs -->
    <ul class="nav nav-tabs">
        <li><a href="#pane-first" data-toggle="tab" class="text-center">
            {{schemaDetails.firstTitle}}</a></li>
        <li class="active"><a href="#pane-second" data-toggle="tab" class="text-center font-wide">
            <b>{{schemaDetails.secondTitle}} {{details.time}}</b></a></li>
    </ul>
    <!-- Tab panes -->
    <div class="tab-content">
        <div class="tab-pane fade" id="pane-first">
            {{#first}}
            <p>{{{.}}}</p>
            {{/first}}
        </div>
        <div class="tab-pane fade in active" id="pane-second">
            {{#second}}
            <p>{{{.}}}</p>
            {{/second}}
        </div>
    </div>
    {{/compact}}
    
</div>
